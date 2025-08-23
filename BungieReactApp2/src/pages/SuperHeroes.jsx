import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/SuperHeroes';
const POWERS_API_BASE = 'https://localhost:7226/api/SuperPowers/by-superhero';

export default function SuperHeroes() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [form, setForm] = useState({
    name: '',
    alias: '',
    age: 0,
    origin: '',
    firstAppearance: '',
    isActive: true,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  // Details state
  const [detailsId, setDetailsId] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [detailsHero, setDetailsHero] = useState(null);
  const [detailsPowers, setDetailsPowers] = useState([]);

  // Fetch all heroes
  const fetchHeroes = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setHeroes(data);
    } catch (err) {
      setError('Error loading heroes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Open modal for create or edit
  const openModal = (mode, hero = null) => {
    setModalMode(mode);
    setSelectedId(hero ? hero.id : null);
    setForm(
      hero
        ? {
            name: hero.name,
            alias: hero.alias,
            age: hero.age,
            origin: hero.origin,
            firstAppearance: hero.firstAppearance?.slice(0, 16) || '',
            isActive: hero.isActive,
          }
        : {
            name: '',
            alias: '',
            age: 0,
            origin: '',
            firstAppearance: '',
            isActive: true,
          }
    );
    setShowModal(true);
  };

  // Create or update hero
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        firstAppearance: form.firstAppearance,
        isActive: Boolean(form.isActive),
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
      fetchHeroes();
      setNotification({ show: true, message: 'Hero saved successfully!', variant: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError('Error saving hero');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete hero
  const handleDelete = async (id) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchHeroes();
      setNotification({ show: true, message: 'Hero deleted successfully!', variant: 'danger' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'danger' }), 3000);
    } catch (err) {
      setError('Error deleting hero');
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch details for a hero
  const handleViewDetails = async (id) => {
    setDetailsId(id);
    setDetailsLoading(true);
    setDetailsError('');
    setDetailsHero(null);
    setDetailsPowers([]);
    try {
      // Fetch hero details
      const heroRes = await fetch(`${API_BASE}/${id}`);
      if (!heroRes.ok) throw new Error('Failed to fetch hero details');
      const heroData = await heroRes.json();
      setDetailsHero(heroData);

      // Fetch powers
      const powersRes = await fetch(`${POWERS_API_BASE}/${id}`);
      if (!powersRes.ok) throw new Error('Failed to fetch powers');
      const powersData = await powersRes.json();
      setDetailsPowers(powersData);
    } catch (err) {
      setDetailsError('Error loading details');
    } finally {
      setDetailsLoading(false);
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
              <Card.Title as="h2" className="mb-3">Super Heroes</Card.Title>
              <Card.Text>
                Manage your super heroes below. You can create, edit, and delete heroes.
              </Card.Text>
              <Button variant="primary" onClick={() => openModal('create')}>
                Add Super Hero
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
                  <th>Name</th>
                  <th>Alias</th>
                  <th>Age</th>
                  <th>Origin</th>
                  <th>First Appearance</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {heroes.map((hero) => (
                  <tr key={hero.id}>
                    <td>{hero.name}</td>
                    <td>{hero.alias}</td>
                    <td>{hero.age}</td>
                    <td>{hero.origin}</td>
                    <td>{hero.firstAppearance?.replace('T', ' ').slice(0, 16)}</td>
                    <td>{hero.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => openModal('edit', hero)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDelete(hero.id)}
                        disabled={submitting}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleViewDetails(hero.id)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Details Section */}
          {detailsId && (
            <Card className="mt-4 shadow-sm">
              <Card.Body>
                <Card.Title as="h4">Super Hero Details</Card.Title>
                {detailsLoading ? (
                  <div className="text-center"><Spinner animation="border" /></div>
                ) : detailsError ? (
                  <Alert variant="danger">{detailsError}</Alert>
                ) : detailsHero ? (
                  <>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>{detailsHero.name}</td>
                        </tr>
                        <tr>
                          <th>Alias</th>
                          <td>{detailsHero.alias}</td>
                        </tr>
                        <tr>
                          <th>Age</th>
                          <td>{detailsHero.age}</td>
                        </tr>
                        <tr>
                          <th>Origin</th>
                          <td>{detailsHero.origin}</td>
                        </tr>
                        <tr>
                          <th>First Appearance</th>
                          <td>{detailsHero.firstAppearance?.replace('T', ' ').slice(0, 16)}</td>
                        </tr>
                        <tr>
                          <th>Active</th>
                          <td>{detailsHero.isActive ? 'Yes' : 'No'}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <h5 className="mt-4">Super Powers</h5>
                    {detailsPowers.length === 0 ? (
                      <div>No powers found.</div>
                    ) : (
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>Power Name</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailsPowers.map((power) => (
                            <tr key={power.id}>
                              <td>{power.powerName}</td>
                              <td>{power.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </>
                ) : null}
                <Button
                  variant="secondary"
                  className="mt-3"
                  onClick={() => setDetailsId(null)}
                >
                  Close Details
                </Button>
              </Card.Body>
            </Card>
          )}

        </Col>
      </Row>

      {/* Modal for Create/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {modalMode === 'create' ? 'Add Super Hero' : 'Edit Super Hero'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alias</Form.Label>
              <Form.Control
                name="alias"
                value={form.alias}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                min={0}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Origin</Form.Label>
              <Form.Control
                name="origin"
                value={form.origin}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>First Appearance</Form.Label>
              <Form.Control
                name="firstAppearance"
                type="datetime-local"
                value={form.firstAppearance}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                name="isActive"
                label="Active"
                checked={form.isActive}
                onChange={handleChange}
                type="checkbox"
              />
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