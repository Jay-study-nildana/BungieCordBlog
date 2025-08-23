import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/ComicAppearances';
const HEROES_API_BASE = 'https://localhost:7226/api/SuperHeroes';

export default function ComicAppearance() {
  const [appearances, setAppearances] = useState([]);
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroesLoading, setHeroesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [form, setForm] = useState({
    comicTitle: '',
    issueNumber: 0,
    releaseDate: '',
    superHeroId: '',
  });
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  // Fetch all comic appearances
  const fetchAppearances = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAppearances(data);
    } catch (err) {
      setError('Error loading comic appearances');
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
    fetchAppearances();
    fetchHeroes();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'issueNumber' ? Number(value) : value,
    }));
  };

  // Open modal for create or edit
  const openModal = (mode, appearance = null) => {
    setModalMode(mode);
    setSelectedId(appearance ? appearance.id : null);
    setForm(
      appearance
        ? {
            comicTitle: appearance.comicTitle,
            issueNumber: appearance.issueNumber,
            releaseDate: appearance.releaseDate?.slice(0, 16) || '',
            superHeroId: appearance.superHeroId,
          }
        : {
            comicTitle: '',
            issueNumber: 0,
            releaseDate: '',
            superHeroId: '',
          }
    );
    setShowModal(true);
  };

  // Create or update comic appearance
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        comicTitle: form.comicTitle,
        issueNumber: Number(form.issueNumber),
        releaseDate: form.releaseDate,
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
      fetchAppearances();
      setNotification({ show: true, message: 'Comic appearance saved successfully!', variant: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError('Error saving comic appearance');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comic appearance
  const handleDelete = async (id) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchAppearances();
      setNotification({ show: true, message: 'Comic appearance deleted successfully!', variant: 'danger' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'danger' }), 3000);
    } catch (err) {
      setError('Error deleting comic appearance');
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
              <Card.Title as="h2" className="mb-3">Comic Appearance</Card.Title>
              <Card.Text>
                Manage comic appearances below. You can create, edit, and delete comic appearances.
              </Card.Text>
              <Button variant="primary" onClick={() => openModal('create')}>
                Add Comic Appearance
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
                  <th>Comic Title</th>
                  <th>Issue Number</th>
                  <th>Release Date</th>
                  <th>Super Hero</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appearances.map((appearance) => {
                  const hero = heroes.find(h => h.id === appearance.superHeroId);
                  return (
                    <tr key={appearance.id}>
                      <td>{appearance.comicTitle}</td>
                      <td>{appearance.issueNumber}</td>
                      <td>{appearance.releaseDate?.replace('T', ' ').slice(0, 16)}</td>
                      <td>{hero ? `${hero.name} (${hero.alias})` : appearance.superHeroId}</td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => openModal('edit', appearance)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(appearance.id)}
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
              {modalMode === 'create' ? 'Add Comic Appearance' : 'Edit Comic Appearance'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Comic Title</Form.Label>
              <Form.Control
                name="comicTitle"
                value={form.comicTitle}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Issue Number</Form.Label>
              <Form.Control
                name="issueNumber"
                type="number"
                value={form.issueNumber}
                onChange={handleChange}
                min={0}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                name="releaseDate"
                type="datetime-local"
                value={form.releaseDate}
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