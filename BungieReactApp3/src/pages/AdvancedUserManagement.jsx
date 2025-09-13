import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/Auth/users-with-extra-info-and-roles';
const ROLES_API = 'https://localhost:7226/api/Auth/roles';
const ADD_ROLE_API = 'https://localhost:7226/api/Auth/add-role-to-user';

export default function AdvancedUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleSubmitting, setRoleSubmitting] = useState(false);
  const [roleError, setRoleError] = useState('');
  const [roleSuccess, setRoleSuccess] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(API_BASE, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError('Error loading users');
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await fetch(ROLES_API, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch roles');
        const data = await res.json();
        setRoles(data);
      } catch (err) {
        // Roles error is not fatal for page
      }
    };

    fetchUsers();
    fetchRoles();
  }, [token]);

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleShowRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole('');
    setRoleError('');
    setRoleSuccess('');
    setShowRoleModal(true);
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setSelectedUser(null);
    setSelectedRole('');
    setRoleError('');
    setRoleSuccess('');
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setRoleError('Please select a role.');
      return;
    }
    setRoleSubmitting(true);
    setRoleError('');
    setRoleSuccess('');
    try {
      const res = await fetch(ADD_ROLE_API, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedUser.email,
          role: selectedRole,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRoleError(data.message || 'Failed to add role');
      } else {
        setRoleSuccess(data.message);
        // Optionally update user roles in UI
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id
              ? { ...u, roles: [...(u.roles || []), selectedRole] }
              : u
          )
        );
      }
    } catch (err) {
      setRoleError('Error adding role');
    } finally {
      setRoleSubmitting(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">User List</Card.Title>
              <Card.Text>
                List of users with key information. Click "Show Details" to view all user info.
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
                  <th>User Name</th>
                  <th>Roles</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr>
                      <td>{user.email}</td>
                      <td>{user.userName}</td>
                      <td>{user.roles && user.roles.join(', ')}</td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handleExpand(user.id)}
                          className="me-2"
                        >
                          {expandedId === user.id ? 'Hide Details' : 'Show Details'}
                        </Button>
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleShowRoleModal(user)}
                        >
                          Add Role
                        </Button>
                      </td>
                    </tr>
                    {expandedId === user.id && (
                      <tr>
                        <td colSpan={4}>
                          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '6px' }}>
                            <strong>ID:</strong> {user.id}<br />
                            <strong>Email:</strong> {user.email}<br />
                            <strong>User Name:</strong> {user.userName}<br />
                            <strong>Roles:</strong> {user.roles && user.roles.join(', ')}<br />
                            <strong>Extra Info ID:</strong> {user.extraInfoId || 'N/A'}<br />
                            <strong>Full Name:</strong> {user.fullName || 'N/A'}<br />
                            <strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}<br />
                            <strong>Role:</strong> {user.role || 'N/A'}<br />
                            <strong>Address:</strong> {user.address || 'N/A'}<br />
                            <strong>Registered Date:</strong> {user.registeredDate || 'N/A'}<br />
                            <strong>Is Active:</strong> {user.isActive === null ? 'N/A' : user.isActive ? 'Yes' : 'No'}<br />
                            <strong>Profile Image URL:</strong> {user.profileImageUrl || 'N/A'}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      <Modal show={showRoleModal} onHide={handleCloseRoleModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Role to User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddRole}>
          <Modal.Body>
            {roleError && <Alert variant="danger">{roleError}</Alert>}
            {roleSuccess && <Alert variant="success">{roleSuccess}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>User Email</Form.Label>
              <Form.Control type="text" value={selectedUser?.email || ''} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Role</Form.Label>
              <Form.Select value={selectedRole} onChange={handleRoleChange}>
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseRoleModal}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={roleSubmitting}>
              {roleSubmitting ? 'Adding...' : 'Add Role'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}