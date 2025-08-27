import React, { useState, useEffect } from 'react';

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