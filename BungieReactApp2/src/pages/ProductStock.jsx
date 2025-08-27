import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/ProductStock';
const SUPERHERO_API = 'https://localhost:7226/api/SuperHeroes';

export default function ProductStock() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: '',
    superHeroId: '',
    unitPrice: 0,
    quantity: 0,
    sku: '',
    description: '',
    currency: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });
  const [superHeroes, setSuperHeroes] = useState([]);
  const [superHeroesLoading, setSuperHeroesLoading] = useState(false);
  const [superHeroesError, setSuperHeroesError] = useState('');

  // Fetch all product stocks
  const fetchStocks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStocks(data);
    } catch (err) {
      setError('Error loading product stock');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all super heroes
  const fetchSuperHeroes = async () => {
    setSuperHeroesLoading(true);
    setSuperHeroesError('');
    try {
      const res = await fetch(SUPERHERO_API);
      if (!res.ok) throw new Error('Failed to fetch super heroes');
      const data = await res.json();
      setSuperHeroes(data);
    } catch (err) {
      setSuperHeroesError('Error loading super heroes');
    } finally {
      setSuperHeroesLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Fetch super heroes only when modal is opened for adding
  useEffect(() => {
    if (showModal && !editMode) {
      fetchSuperHeroes();
    }
  }, [showModal, editMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Open modal for create
  const openModal = () => {
    setForm({
      id: '',
      superHeroId: '',
      unitPrice: 0,
      quantity: 0,
      sku: '',
      description: '',
      currency: '',
      isActive: true,
    });
    setEditMode(false);
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = (stock) => {
    setForm({
      id: stock.id,
      superHeroId: stock.superHeroId,
      unitPrice: stock.unitPrice,
      quantity: stock.quantity,
      sku: stock.sku,
      description: stock.description,
      currency: stock.currency,
      isActive: stock.isActive,
    });
    setEditMode(true);
    setShowModal(true);
  };

  // Create or update product stock
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        unitPrice: Number(form.unitPrice),
        quantity: Number(form.quantity),
        sku: form.sku,
        description: form.description,
        currency: form.currency,
        isActive: Boolean(form.isActive),
      };
      let res;
      if (editMode && form.id) {
        // Update
        res = await fetch(`${API_BASE}/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update');
        setNotification({ show: true, message: 'Product stock updated successfully!', variant: 'success' });
      } else {
        // Create
        res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, superHeroId: form.superHeroId }),
        });
        if (!res.ok) throw new Error('Failed to save');
        setNotification({ show: true, message: 'Product stock added successfully!', variant: 'success' });
      }
      setShowModal(false);
      fetchStocks();
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError(editMode ? 'Error updating product stock' : 'Error saving product stock');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product stock
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product stock?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        headers: { 'accept': '*/*' },
      });
      if (res.status !== 204) throw new Error('Failed to delete');
      setNotification({ show: true, message: 'Product stock deleted successfully!', variant: 'success' });
      fetchStocks();
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError('Error deleting product stock');
    } finally {
      setLoading(false);
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
              <Card.Title as="h2" className="mb-3">Product Stock</Card.Title>
              <Card.Text>
                Manage your product stock below. You can add, edit, or delete stock items.
              </Card.Text>
              <Button variant="primary" onClick={openModal}>
                Add Product Stock
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
                  <th>SKU</th>
                  <th>Description</th>
                  <th>SuperHero</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Currency</th>
                  <th>Active</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const hero = superHeroes.find(h => h.id === stock.superHeroId);
                  return (
                    <tr key={stock.id}>
                      <td>{stock.sku}</td>
                      <td>{stock.description}</td>
                      <td>{hero ? hero.name : stock.superHeroId}</td>
                      <td>{stock.unitPrice}</td>
                      <td>{stock.quantity}</td>
                      <td>{stock.currency}</td>
                      <td>{stock.isActive ? 'Yes' : 'No'}</td>
                      <td>{stock.lastUpdated?.replace('T', ' ').slice(0, 19)}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => openEditModal(stock)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(stock.id)}
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

          {/* Modal for Create/Edit */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>{editMode ? 'Edit Product Stock' : 'Add Product Stock'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {!editMode && (
                  <Form.Group className="mb-3">
                    <Form.Label>SuperHero</Form.Label>
                    {superHeroesLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : superHeroesError ? (
                      <Alert variant="danger">{superHeroesError}</Alert>
                    ) : (
                      <Form.Select
                        name="superHeroId"
                        value={form.superHeroId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a SuperHero</option>
                        {superHeroes.map(hero => (
                          <option key={hero.id} value={hero.id}>
                            {hero.name} ({hero.alias})
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </Form.Group>
                )}
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    name="sku"
                    value={form.sku}
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
                  <Form.Label>Unit Price</Form.Label>
                  <Form.Control
                    name="unitPrice"
                    type="number"
                    value={form.unitPrice}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    name="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Currency</Form.Label>
                  <Form.Control
                    name="currency"
                    value={form.currency}
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
                  {submitting ? (editMode ? 'Updating...' : 'Saving...') : (editMode ? 'Update' : 'Save')}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}