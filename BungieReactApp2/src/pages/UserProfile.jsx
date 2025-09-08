import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Spinner, Alert, Image } from 'react-bootstrap';

export default function UserProfile() {
  const email = localStorage.getItem('authEmail');
  const token = localStorage.getItem('authToken');
  const roles = JSON.parse(localStorage.getItem('authRoles') || '[]');
  const [copied, setCopied] = useState(false);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [showOrders, setShowOrders] = useState(false);

  // Extra User Info state
  const [showExtraInfo, setShowExtraInfo] = useState(false);
  const [extraInfo, setExtraInfo] = useState(null);
  const [extraInfoLoading, setExtraInfoLoading] = useState(false);
  const [extraInfoError, setExtraInfoError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phoneNumber: '',
    role: '',
    address: '',
    isActive: true,
    profileImageUrl: '',
  });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editNotification, setEditNotification] = useState('');

  const handleCopy = async () => {
    if (token) {
      try {
        await navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Optionally handle error
      }
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('https://localhost:7226/api/Auth/token-details', {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch token details');
        return await res.json();
      })
      .then(data => {
        setTokenDetails(data);
        setFetchError(null);
      })
      .catch(err => {
        setFetchError('Could not fetch token details.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Fetch orders by email
  const fetchOrders = async () => {
    if (!email) return;
    setOrdersLoading(true);
    setOrdersError('');
    try {
      const res = await fetch(`https://localhost:7226/api/Payment/orders/by-email?email=${encodeURIComponent(email)}`, {
        headers: { 'accept': '*/*' }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setOrdersError('Could not fetch orders.');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Toggle orders display
  const handleToggleOrders = () => {
    if (!showOrders) {
      fetchOrders();
    }
    setShowOrders(prev => !prev);
  };

  // Fetch extra user info by email
  const fetchExtraInfo = async () => {
    if (!email) return;
    setExtraInfoLoading(true);
    setExtraInfoError('');
    try {
      const res = await fetch(`https://localhost:7226/api/UserExtraInfo/by-email/${encodeURIComponent(email)}`, {
        headers: { 'accept': '*/*' }
      });
      if (!res.ok) throw new Error('Failed to fetch extra info');
      const data = await res.json();
      setExtraInfo(data);
    } catch (err) {
      setExtraInfoError('Could not fetch extra user info.');
      setExtraInfo(null);
    } finally {
      setExtraInfoLoading(false);
    }
  };

  // Toggle extra info display
  const handleToggleExtraInfo = () => {
    if (!showExtraInfo) {
      fetchExtraInfo();
    }
    setShowExtraInfo(prev => !prev);
  };

  // Open edit modal
  const handleOpenEditModal = () => {
    if (!extraInfo) return;
    setEditForm({
      fullName: extraInfo.fullName || '',
      phoneNumber: extraInfo.phoneNumber || '',
      role: extraInfo.role || '',
      address: extraInfo.address || '',
      isActive: !!extraInfo.isActive,
      profileImageUrl: extraInfo.profileImageUrl || '',
    });
    setEditError('');
    setShowEditModal(true);
  };

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!extraInfo?.id) return;
    setEditSubmitting(true);
    setEditError('');
    try {
      const res = await fetch(`https://localhost:7226/api/UserExtraInfo/${extraInfo.id}`, {
        method: 'PUT',
        headers: { 'accept': '*/*', 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update extra info');
      const data = await res.json();
      setExtraInfo(data);
      setShowEditModal(false);
      setEditNotification('Extra user info updated successfully!');
      setTimeout(() => setEditNotification(''), 3000);
    } catch (err) {
      setEditError('Could not update extra user info.');
    } finally {
      setEditSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <h2>User Profile</h2>
        <div className="alert alert-warning">You are not logged in.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5 position-relative">
      <h2>User Profile</h2>
      <div className="mb-3">
        <strong>Email:</strong> {email}
      </div>
      <div className="mb-3">
        <strong>Token:</strong>
        <div
          style={{
            wordBreak: 'break-all',
            fontSize: '0.9em',
            background: '#f8f9fa',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ flex: 1 }}>{token}</span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleCopy}
            style={{ whiteSpace: 'nowrap' }}
          >
            Copy
          </button>
        </div>
      </div>
      <div className="mb-3">
        <strong>Roles:</strong>
        <ul>
          {roles.map((role, idx) => (
            <li key={idx}>{role}</li>
          ))}
        </ul>
      </div>
      <hr />
      <h4>Token Details</h4>
      {loading && <div className="text-muted">Loading token details...</div>}
      {fetchError && <div className="alert alert-danger">{fetchError}</div>}
      {tokenDetails && (
        <div className="mb-3">
          <div><strong>Email:</strong> {tokenDetails.email}</div>
          <div><strong>Issuer:</strong> {tokenDetails.issuer}</div>
          <div><strong>Audience:</strong> {Array.isArray(tokenDetails.audience) ? tokenDetails.audience.join(', ') : tokenDetails.audience}</div>
          <div><strong>Expiry:</strong> {tokenDetails.expiry}</div>
          <div><strong>Roles:</strong>
            <ul>
              {tokenDetails.roles.map((role, idx) => (
                <li key={idx}>{role}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong>Claims:</strong>
            <ul>
              {tokenDetails.claims &&
                Object.entries(tokenDetails.claims).map(([key, value]) => (
                  <li key={key}>
                    <span style={{ fontWeight: 500 }}>{key}:</span> {Array.isArray(value) ? value.join(', ') : value}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button
          className="btn btn-info"
          onClick={handleToggleOrders}
          disabled={ordersLoading}
        >
          {showOrders ? 'Hide Orders' : 'Show Orders'}
        </button>
      </div>

      {/* Extra User Info Button */}
      <div className="mb-4">
        <Button
          variant="outline-primary"
          onClick={handleToggleExtraInfo}
          disabled={extraInfoLoading}
        >
          {showExtraInfo ? 'Hide Extra User Info' : 'Show Extra User Info'}
        </Button>
      </div>

      {/* Extra User Info Section */}
      {showExtraInfo && (
        <div className="mb-4">
          <h4>Extra User Info</h4>
          {extraInfoLoading && <div className="text-muted">Loading extra user info...</div>}
          {extraInfoError && <div className="alert alert-danger">{extraInfoError}</div>}
          {extraInfo && (
            <div className="card p-3 mb-3">
              <div className="row">
                <div className="col-md-2">
                  {extraInfo.profileImageUrl ? (
                    <Image src={extraInfo.profileImageUrl} rounded width={80} height={80} alt="Profile" />
                  ) : (
                    <div className="bg-light text-muted text-center" style={{ width: 80, height: 80, lineHeight: '80px' }}>
                      No Image
                    </div>
                  )}
                </div>
                <div className="col-md-10">
                  <div><strong>Email:</strong> {extraInfo.email}</div>
                  <div><strong>Full Name:</strong> {extraInfo.fullName}</div>
                  <div><strong>Phone Number:</strong> {extraInfo.phoneNumber}</div>
                  <div><strong>Role:</strong> {extraInfo.role}</div>
                  <div><strong>Address:</strong> {extraInfo.address}</div>
                  <div><strong>Registered Date:</strong> {extraInfo.registeredDate?.replace('T', ' ').slice(0, 19)}</div>
                  <div><strong>Active:</strong> {extraInfo.isActive ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <div className="mt-3">
                <Button variant="outline-secondary" size="sm" onClick={handleOpenEditModal}>
                  Edit Extra Info
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Extra User Info</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={editForm.fullName}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phoneNumber"
                value={editForm.phoneNumber}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                name="role"
                value={editForm.role}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                value={editForm.address}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                name="isActive"
                label="Active"
                checked={editForm.isActive}
                onChange={handleEditFormChange}
                type="checkbox"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Image URL</Form.Label>
              <Form.Control
                name="profileImageUrl"
                value={editForm.profileImageUrl}
                onChange={handleEditFormChange}
                placeholder="Paste image URL here"
              />
            </Form.Group>
            {editError && <Alert variant="danger">{editError}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editSubmitting}>
              {editSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Notification */}
      {editNotification && (
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
            variant="success"
            onClose={() => setEditNotification('')}
            dismissible
          >
            {editNotification}
          </Alert>
        </div>
      )}

      {showOrders && (
        <div className="mb-4">
          <h4>Your Orders</h4>
          {ordersLoading && <div className="text-muted">Loading orders...</div>}
          {ordersError && <div className="alert alert-danger">{ordersError}</div>}
          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="alert alert-warning">No orders found.</div>
          )}
          {!ordersLoading && !ordersError && orders.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Payment ID</th>
                    <th>Status</th>
                    <th>Status String</th>
                    <th>Created Date</th>
                    <th>Updated Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.paymentId}</td>
                      <td>{order.status}</td>
                      <td>{order.statusString}</td>
                      <td>{order.createdDate?.replace('T', ' ').slice(0, 19)}</td>
                      <td>{order.updatedDate?.replace('T', ' ').slice(0, 19)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {copied && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1050,
            minWidth: '200px',
            maxWidth: '90vw'
          }}
        >
          <div className="alert alert-success py-2 px-3 mb-0 text-center shadow" style={{ fontSize: '1em' }}>
            Token copied!
          </div>
        </div>
      )}
    </div>
  );
}