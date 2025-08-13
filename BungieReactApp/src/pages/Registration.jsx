import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7226/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setNotification({ type: 'success', message: 'Registration successful! Redirecting to login...' });
        setTimeout(() => {
          setNotification(null);
          navigate('/login');
        }, 2000);
      } else {
        const errorData = await response.json();
        setNotification({ type: 'danger', message: 'Registration failed: ' + JSON.stringify(errorData) });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (error) {
      setNotification({ type: 'danger', message: 'Registration failed: ' + error.message });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div className="container mt-5 position-relative">
      <h2>Registration Page</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group mt-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Register
        </button>
      </form>
      {notification && (
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
          <div className={`alert alert-${notification.type} py-2 px-3 mb-0 text-center shadow`} style={{ fontSize: '1em' }}>
            {notification.message}
          </div>
        </div>
      )}
    </div>
  );
}