import React, { useState, useEffect } from 'react';

export default function Categories() {
  const [name, setName] = useState('');
  const [urlHandle, setUrlHandle] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editUrlHandle, setEditUrlHandle] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const token = localStorage.getItem('authToken');
  const roles = JSON.parse(localStorage.getItem('authRoles') || '[]');
  const isWriter = roles.includes('Writer');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!name.trim() || !urlHandle.trim()) {
      setError('Both fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('https://localhost:7226/api/Categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ name: name.trim(), urlHandle: urlHandle.trim() }),
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      const data = await response.json();
      setResult(data);
      setName('');
      setUrlHandle('');
      fetchCategories();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await fetch('https://localhost:7226/api/Categories', {
        headers: { accept: '*/*' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setFetchError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditUrlHandle(cat.urlHandle);
    setEditError('');
    setEditSuccess('');
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditName('');
    setEditUrlHandle('');
    setEditError('');
    setEditSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    if (!editName.trim() || !editUrlHandle.trim()) {
      setEditError('Both fields are required.');
      return;
    }
    setEditSubmitting(true);
    try {
      const response = await fetch(`https://localhost:7226/api/Categories/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName.trim(), urlHandle: editUrlHandle.trim() }),
      });
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      const data = await response.json();
      setEditSuccess('Category updated!');
      setEditId(null);
      setEditName('');
      setEditUrlHandle('');
      fetchCategories();
    } catch (err) {
      setEditError(err.message || 'An error occurred');
    } finally {
      setEditSubmitting(false);
      setTimeout(() => setEditSuccess(''), 2000);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Categories</h2>
      <p>This is a placeholder page for Categories. Future updates will allow you to view and manage image categories here.</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">URL Handle</label>
          <input
            type="text"
            className="form-control"
            value={urlHandle}
            onChange={(e) => setUrlHandle(e.target.value)}
            placeholder="Enter URL handle"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Category'}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {result && (
        <div className="alert alert-success mt-3">
          <strong>Category created!</strong>
          <div><strong>ID:</strong> {result.id}</div>
          <div><strong>Name:</strong> {result.name}</div>
          <div><strong>URL Handle:</strong> {result.urlHandle}</div>
        </div>
      )}

      <hr className="my-4" />
      <h4>All Categories</h4>
      {loading && <div>Loading categories...</div>}
      {fetchError && <div className="alert alert-danger">{fetchError}</div>}
      {!loading && !fetchError && categories.length === 0 && (
        <div className="alert alert-info">No categories found.</div>
      )}
      {!loading && !fetchError && categories.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>URL Handle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.id}</td>
                  <td>
                    {editId === cat.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={editSubmitting}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>
                  <td>
                    {editId === cat.id ? (
                      <input
                        type="text"
                        className="form-control"
                        value={editUrlHandle}
                        onChange={(e) => setEditUrlHandle(e.target.value)}
                        disabled={editSubmitting}
                      />
                    ) : (
                      cat.urlHandle
                    )}
                  </td>
                  <td>
                    {editId === cat.id ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={handleEditSubmit}
                          disabled={editSubmitting}
                        >
                          {editSubmitting ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleEditCancel}
                          disabled={editSubmitting}
                        >
                          Cancel
                        </button>
                        {editError && (
                          <div className="text-danger mt-1">{editError}</div>
                        )}
                        {editSuccess && (
                          <div className="text-success mt-1">{editSuccess}</div>
                        )}
                      </>
                    ) : (
                      isWriter && (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditClick(cat)}
                        >
                          Edit
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}