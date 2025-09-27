import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/ProductUserInfo';

export default function ProductUserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    notes: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  // Fetch all product user info
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Error loading product user info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal for edit
  const openEditModal = (user) => {
    setEditForm({
      id: user.id,
      notes: user.notes,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Update product user info
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        notes: editForm.notes,
        isActive: Boolean(editForm.isActive),
      };
      const res = await fetch(`${API_BASE}/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
      setNotification({ show: true, message: 'Product user info updated!', variant: 'success' });
      setShowModal(false);
      fetchUsers();
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError('Error updating product user info');
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
              <Card.Title as="h2" className="mb-3">Product User Table</Card.Title>
              <Card.Text>
                Manage product user info below. You can view and edit notes and active status.
              </Card.Text>
            </Card.Body>
          </Card>
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Product ID</th>
                  <th>User ID</th>
                  <th>Added Date</th>
                  <th>Active</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.productId}</td>
                    <td>{user.userId}</td>
                    <td>{user.addedDate?.replace('T', ' ').slice(0, 19)}</td>
                    <td>{user.isActive ? 'Yes' : 'No'}</td>
                    <td>{user.notes}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {/* Modal for Edit */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Product User Info</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    name="notes"
                    value={editForm.notes}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    name="isActive"
                    label="Active"
                    checked={editForm.isActive}
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
        </Col>
      </Row>
    </Container>
  );
}