import React, { useEffect, useState } from 'react';

export default function SeeAllImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError('');
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
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="container mt-5">
      <h2>All Uploaded Images</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && images.length === 0 && (
        <div className="alert alert-info">No images found.</div>
      )}
      {!loading && !error && images.length > 0 && (
        <div className="row">
          {images.map((img) => (
            <div className="col-md-4 mb-4" key={img.id}>
              <div className="card h-100">
                <img
                  src={img.url}
                  alt={img.title}
                  className="card-img-top"
                  style={{ maxHeight: 200, objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{img.title}</h5>
                  <p className="card-text">
                    <strong>File Name:</strong> {img.fileName}
                    <br />
                    <strong>Extension:</strong> {img.fileExtension}
                    <br />
                    <strong>Date Created:</strong> {new Date(img.dateCreated).toLocaleString()}
                  </p>
                  <a href={img.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                    View Full Image
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}