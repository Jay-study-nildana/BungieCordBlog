import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/SuperPowers';
const HEROES_API_BASE = 'https://localhost:7226/api/SuperHeroes';

export default function SuperPowers() {
  const [powers, setPowers] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroesLoading, setHeroesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [form, setForm] = useState({
    powerName: '',
    description: '',
    superHeroId: '',
  });
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  // Fetch all powers
  const fetchPowers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPowers(data);
    } catch (err) {
      setError('Error loading powers');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all heroes for dropdown
  const fetchHeroes = async () => {
    setHeroesLoading(true);
    try {
      const res = await fetch(HEROES_API_BASE);
      if (!res.ok) throw new Error('Failed to fetch heroes');
      const data = await res.json();
      setHeroes(data);
    } catch {
      setHeroes([]);
    } finally {
      setHeroesLoading(false);
    }
  };

  useEffect(() => {
    fetchPowers();
    fetchHeroes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for create or edit
  const openModal = (mode, power = null) => {
    setModalMode(mode);
    setSelectedId(power ? power.id : null);
    setForm(
      power
        ? {
            powerName: power.powerName,
            description: power.description,
            superHeroId: power.superHeroId,
          }
        : {
            powerName: '',
            description: '',
            superHeroId: '',
          }
    );
    setShowModal(true);
  };

  // Create or update power
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        powerName: form.powerName,
        description: form.description,
        superHeroId: form.superHeroId,
      };
      let res;
      if (modalMode === 'create') {
        res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/${selectedId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error('Failed to save');
      setShowModal(false);
      fetchPowers();
      setNotification({ show: true, message: 'Power saved successfully!', variant: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError('Error saving power');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete power
  const handleDelete = async (id) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchPowers();
      setNotification({ show: true, message: 'Power deleted successfully!', variant: 'danger' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'danger' }), 3000);
    } catch (err) {
      setError('Error deleting power');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          {/* Floating notification */}
          {notification.show && (
            <div
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                zIndex: 1050,
                minWidth: 300,
                maxWidth: '80vw'
              }}
            >
              <Alert
                variant={notification.variant}
                onClose={() => setNotification({ show: false, message: '', variant: notification.variant })}
                dismissible
              >
                {notification.message}
              </Alert>
            </div>
          )}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Super Powers</Card.Title>
              <Card.Text>
                Manage super powers below. You can create, edit, and delete powers.
              </Card.Text>
              <Button variant="primary" onClick={() => openModal('create')}>
                Add Super Power
              </Button>
            </Card.Body>
          </Card>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Power Name</th>
                  <th>Description</th>
                  <th>Super Hero</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {powers.map((power) => {
                  const hero = heroes.find(h => h.id === power.superHeroId);
                  return (
                    <tr key={power.id}>
                      <td>{power.powerName}</td>
                      <td>{power.description}</td>
                      <td>{hero ? `${hero.name} (${hero.alias})` : power.superHeroId}</td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => openModal('edit', power)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(power.id)}
                          disabled={submitting}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'create' ? 'Add Super Power' : 'Edit Super Power'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Power Name</Form.Label>
              <Form.Control
                name="powerName"
                value={form.powerName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Super Hero</Form.Label>
              {heroesLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form.Select
                  name="superHeroId"
                  value={form.superHeroId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a Super Hero</option>
                  {heroes.map(hero => (
                    <option key={hero.id} value={hero.id}>
                      {hero.name} ({hero.alias})
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>
            {error && <div className="alert alert-danger">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}