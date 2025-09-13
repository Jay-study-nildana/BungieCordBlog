import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const response = await fetch('https://localhost:7226/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      setResult(data);
      login(data.token, data.email, data.roles); // update context and localStorage
      navigate('/user-profile');
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login Page</h2>
      {!result && (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      )}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {result && (
        <div className="alert alert-success mt-3">
          <strong>Email:</strong> {result.email} <br />
          <strong>Token:</strong>
          <div style={{ wordBreak: 'break-all', fontSize: '0.9em', background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
            {result.token}
          </div>
          <strong>Roles:</strong>
          <ul>
            {result.roles && result.roles.map((role, idx) => (
              <li key={idx}>{role}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}