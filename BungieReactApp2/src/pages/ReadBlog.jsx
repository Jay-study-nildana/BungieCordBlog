import React, { useEffect, useState } from 'react';

export default function ReadBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('https://localhost:7226/api/BlogPosts', {
          headers: { accept: '*/*' },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Read Blog</h2>
      {loading && <div>Loading blogs...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && blogs.length === 0 && (
        <div className="alert alert-info">No blog posts found.</div>
      )}
      {!loading && !error && blogs.length > 0 && (
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-md-8 offset-md-2 mb-4" key={blog.id}>
              <div className="card shadow-sm">
                {blog.featuredImageUrl && blog.featuredImageUrl.startsWith('http') && (
                  <img
                    src={blog.featuredImageUrl}
                    alt={blog.title}
                    className="card-img-top"
                    style={{ maxHeight: 300, objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h3 className="card-title">{blog.title}</h3>
                  <p className="text-muted mb-1">
                    <small>
                      By {blog.author} | {new Date(blog.publishedDate).toLocaleString()}
                    </small>
                  </p>
                  <p className="card-text">{blog.shortDescription}</p>
                  <div className="mb-2">
                    {blog.categories && blog.categories.length > 0 && (
                      <span className="badge bg-info text-dark me-2">
                        {blog.categories.map((cat) => cat.name).join(', ')}
                      </span>
                    )}
                  </div>
                  <div>
                    <strong>Content:</strong>
                    <div className="mt-2" style={{ whiteSpace: 'pre-line' }}>
                      {blog.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}