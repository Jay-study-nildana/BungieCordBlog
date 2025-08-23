import React, { useState, useEffect } from 'react';

export default function BlogPosts() {
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    content: '',
    featuredImageUrl: '',
    urlHandle: '',
    publishedDate: '',
    author: '',
    isVisible: true,
    categories: [],
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Images for dropdown
  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState('');

  // Categories for dropdown
  const [categoriesList, setCategoriesList] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      setImagesLoading(true);
      setImagesError('');
      try {
        const response = await fetch('https://localhost:7226/api/Images', {
          headers: { accept: '*/*' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setImages(data);
      } catch (err) {
        setImagesError(err.message || 'An error occurred');
      } finally {
        setImagesLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError('');
      try {
        const response = await fetch('https://localhost:7226/api/Categories', {
          headers: { accept: '*/*' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategoriesList(data);
      } catch (err) {
        setCategoriesError(err.message || 'An error occurred');
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'categories') {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setForm((prev) => ({
        ...prev,
        categories: selectedOptions,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    setSubmitting(true);
    try {
      const response = await fetch('https://localhost:7226/api/BlogPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({
          ...form,
          categories: form.categories,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }
      const data = await response.json();
      setResult(data);
      setForm({
        title: '',
        shortDescription: '',
        content: '',
        featuredImageUrl: '',
        urlHandle: '',
        publishedDate: '',
        author: '',
        isVisible: true,
        categories: [],
      });
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>BlogPosts</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            type="text"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Short Description</label>
          <input
            name="shortDescription"
            type="text"
            className="form-control"
            value={form.shortDescription}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            className="form-control"
            value={form.content}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Featured Image URL</label>
          {imagesLoading ? (
            <div>Loading images...</div>
          ) : imagesError ? (
            <div className="alert alert-danger">{imagesError}</div>
          ) : (
            <select
              name="featuredImageUrl"
              className="form-select"
              value={form.featuredImageUrl}
              onChange={handleChange}
              required
            >
              <option value="">Select an image</option>
              {images.map((img) => (
                <option key={img.id} value={img.url}>
                  {img.title} ({img.fileName})
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">URL Handle</label>
          <input
            name="urlHandle"
            type="text"
            className="form-control"
            value={form.urlHandle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Published Date</label>
          <input
            name="publishedDate"
            type="datetime-local"
            className="form-control"
            value={form.publishedDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            name="author"
            type="text"
            className="form-control"
            value={form.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Is Visible</label>
          <input
            name="isVisible"
            type="checkbox"
            className="form-check-input ms-2"
            checked={form.isVisible}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categories</label>
          {categoriesLoading ? (
            <div>Loading categories...</div>
          ) : categoriesError ? (
            <div className="alert alert-danger">{categoriesError}</div>
          ) : (
            <select
              name="categories"
              className="form-select"
              multiple
              value={form.categories}
              onChange={handleChange}
              required
            >
              {categoriesList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
          <small className="form-text text-muted">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories.
          </small>
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Blog Post'}
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {result && (
        <div className="alert alert-success mt-3">
          <strong>Blog post created!</strong>
          <div><strong>ID:</strong> {result.id}</div>
          <div><strong>Title:</strong> {result.title}</div>
          <div><strong>Short Description:</strong> {result.shortDescription}</div>
          <div><strong>Content:</strong> {result.content}</div>
          <div><strong>Featured Image URL:</strong> {result.featuredImageUrl}</div>
          <div><strong>URL Handle:</strong> {result.urlHandle}</div>
          <div><strong>Published Date:</strong> {result.publishedDate}</div>
          <div><strong>Author:</strong> {result.author}</div>
          <div><strong>Is Visible:</strong> {result.isVisible ? 'Yes' : 'No'}</div>
          <div>
            <strong>Categories:</strong>{' '}
            {result.categories && result.categories.length > 0
              ? result.categories.map((cat) => cat.name || cat).join(', ')
              : 'None'}
          </div>
        </div>
      )}
    </div>
  );
}