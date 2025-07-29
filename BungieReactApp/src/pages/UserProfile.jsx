import React from 'react';

export default function UserProfile() {
  const email = localStorage.getItem('authEmail');
  const token = localStorage.getItem('authToken');
  const roles = JSON.parse(localStorage.getItem('authRoles') || '[]');

  if (!token) {
    return (
      <div className="container mt-5">
        <h2>User Profile</h2>
        <div className="alert alert-warning">You are not logged in.</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="mb-3">
        <strong>Email:</strong> {email}
      </div>
      <div className="mb-3">
        <strong>Token:</strong>
        <div style={{ wordBreak: 'break-all', fontSize: '0.9em', background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
          {token}
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
    </div>
  );
}