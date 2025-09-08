import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert, Image } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/UserExtraInfo';

export default function UserExtraInfo() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    role: '',
    address: '',
    isActive: true,
    profileImageUrl: '',
  });
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', variant: 'success' });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedId(user ? user.id : null);
    setForm(
      user
        ? {
            email: user.email || '',
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            role: user.role || '',
            address: user.address || '',
            isActive: user.isActive ?? true,
            profileImageUrl: user.profileImageUrl || '',
          }
        : {
            email: '',
            fullName: '',
            phoneNumber: '',
            role: '',
            address: '',
            isActive: true,
            profileImageUrl: '',
          }
    );
    setShowModal(true);
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        role: form.role,
        address: form.address,
        isActive: Boolean(form.isActive),
        profileImageUrl: form.profileImageUrl,
      };
      let res;
      if (modalMode === 'create') {
        // For create, include email
        payload = { ...payload, email: form.email };
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
      fetchUsers();
      setNotification({ show: true, message: 'User info saved successfully!', variant: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'success' }), 3000);
    } catch (err) {
      setError('Error saving user info');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchUsers();
      setNotification({ show: true, message: 'User info deleted successfully!', variant: 'danger' });
      setTimeout(() => setNotification({ show: false, message: '', variant: 'danger' }), 3000);
    } catch (err) {
      setError('Error deleting user info');
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
              <Card.Title as="h2" className="mb-3">User Extra Info</Card.Title>
              <Card.Text>
                Manage user extra info below. You can create, edit, and delete records.
              </Card.Text>
              <Button variant="primary" onClick={() => openModal('create')}>
                Add User Extra Info
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
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Phone Number</th>
                  <th>Role</th>
                  <th>Address</th>
                  <th>Registered Date</th>
                  <th>Active</th>
                  <th>Profile Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.role}</td>
                    <td>{user.address}</td>
                    <td>{user.registeredDate?.replace('T', ' ').slice(0, 19)}</td>
                    <td>{user.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      {user.profileImageUrl ? (
                        <Image src={user.profileImageUrl} alt="Profile" rounded width={40} height={40} />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => openModal('edit', user)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={submitting}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
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
              {modalMode === 'create' ? 'Add User Extra Info' : 'Edit User Extra Info'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalMode === 'create' && (
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                value={form.address}
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
            <Form.Group className="mb-3">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                name="profileImageUrl"
                value={form.profileImageUrl}
                onChange={handleChange}
                placeholder="Paste image URL here"
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