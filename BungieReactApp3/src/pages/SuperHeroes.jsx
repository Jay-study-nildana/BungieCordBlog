import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import SuperHeroDetails from './SuperHeroDetails';

const API_BASE = 'https://localhost:7226/api/SuperHeroes';
const POWERS_API_BASE = 'https://localhost:7226/api/SuperPowers/by-superhero';
const SIDEKICKS_API_BASE = 'https://localhost:7226/api/Sidekicks/by-superhero';
const COMIC_APPEARANCES_API_BASE = 'https://localhost:7226/api/ComicAppearances/by-superhero';

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
  const [detailsSidekicks, setDetailsSidekicks] = useState([]);
  const [detailsComics, setDetailsComics] = useState([]);
  const [detailsImages, setDetailsImages] = useState([]);

  // Image upload modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageForm, setImageForm] = useState({
    file: null,
    title: '',
  });
  const [imageSubmitting, setImageSubmitting] = useState(false);
  const [imageError, setImageError] = useState('');
  const [imageSuccess, setImageSuccess] = useState('');

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
    setDetailsSidekicks([]);
    setDetailsComics([]);
    setDetailsImages([]);
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

      // Fetch sidekicks
      const sidekicksRes = await fetch(`${SIDEKICKS_API_BASE}/${id}`);
      if (!sidekicksRes.ok) throw new Error('Failed to fetch sidekicks');
      const sidekicksData = await sidekicksRes.json();
      setDetailsSidekicks(sidekicksData);

      // Fetch comic appearances
      const comicsRes = await fetch(`${COMIC_APPEARANCES_API_BASE}/${id}`);
      if (!comicsRes.ok) throw new Error('Failed to fetch comic appearances');
      const comicsData = await comicsRes.json();
      setDetailsComics(comicsData);

      // Fetch images
      const imagesRes = await fetch(`${API_BASE}/${id}/images`);
      if (!imagesRes.ok) throw new Error('Failed to fetch images');
      const imagesData = await imagesRes.json();
      setDetailsImages(imagesData);

    } catch (err) {
      setDetailsError('Error loading details');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Image upload handlers
  const openImageModal = (heroId) => {
    setSelectedId(heroId);
    setImageForm({ file: null, title: '' });
    setImageError('');
    setImageSuccess('');
    setShowImageModal(true);
  };

  const handleImageChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setImageForm((prev) => ({
        ...prev,
        file: files[0] || null,
      }));
    } else {
      setImageForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setImageSubmitting(true);
    setImageError('');
    setImageSuccess('');
    if (!imageForm.file) {
      setImageError('Please select an image file.');
      setImageSubmitting(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', imageForm.file);
      formData.append('superhero_id', selectedId);
      formData.append('title', imageForm.title);

      const res = await fetch(`${API_BASE}/${selectedId}/upload-image-for-superhero`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      setImageSuccess('Image uploaded successfully!');
      setTimeout(() => setShowImageModal(false), 1500);
    } catch (err) {
      setImageError('Error uploading image');
    } finally {
      setImageSubmitting(false);
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
                        className="me-2"
                        onClick={() => handleViewDetails(hero.id)}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openImageModal(hero.id)}
                      >
                        Add Images
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Details Section */}
          {detailsId && (
            <SuperHeroDetails
              detailsHero={detailsHero}
              detailsLoading={detailsLoading}
              detailsError={detailsError}
              detailsPowers={detailsPowers}
              detailsSidekicks={detailsSidekicks}
              detailsComics={detailsComics}
              detailsImages={detailsImages}
              onClose={() => setDetailsId(null)}
            />
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

      {/* Modal for Image Upload */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Form onSubmit={handleImageSubmit} encType="multipart/form-data">
          <Modal.Header closeButton>
            <Modal.Title>Add Image for Super Hero</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type="file"
                name="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={imageForm.title}
                onChange={handleImageChange}
                required
              />
            </Form.Group>
            {imageError && <div className="alert alert-danger">{imageError}</div>}
            {imageSuccess && <div className="alert alert-success">{imageSuccess}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowImageModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={imageSubmitting}>
              {imageSubmitting ? 'Uploading...' : 'Upload'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}