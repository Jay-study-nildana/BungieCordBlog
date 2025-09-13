import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ImageThings() {
  const [imageFile, setImageFile] = useState(null);
  const [imageTitle, setImageTitle] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file && !imageFileName) {
      setImageFileName(file.name);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setUploadError('');
    setUploadResult(null);

    if (!imageFile || !imageFileName.trim() || !imageTitle.trim()) {
      setUploadError('Please select a file, enter a file name, and a title.');
      return;
    }

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('fileName', imageFileName.trim());
    formData.append('title', imageTitle.trim());

    setUploading(true);
    try {
      const response = await fetch('https://localhost:7226/api/images', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData?.title ||
          errData?.errors?.fileName?.[0] ||
          errData?.errors?.title?.[0] ||
          'Image upload failed'
        );
      }
      const data = await response.json();
      setUploadResult(data);
      setImageFile(null);
      setImageFileName('');
      setImageTitle('');
    } catch (err) {
      setUploadError(err.message || 'An error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Image Things</h2>
      <p>
        Upload an image to the Bungie Service API. Fill in the details and select an image file to upload.
      </p>
      <form onSubmit={handleImageUpload} style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label className="form-label">Select Image File</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">File Name</label>
          <input
            type="text"
            className="form-control"
            value={imageFileName}
            onChange={(e) => setImageFileName(e.target.value)}
            placeholder="Enter file name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={imageTitle}
            onChange={(e) => setImageTitle(e.target.value)}
            placeholder="Enter image title"
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/see-all-images')}
          >
            See All Images
          </button>
        </div>
      </form>
      {uploadError && <div className="alert alert-danger mt-3">{uploadError}</div>}
      {uploadResult && (
        <div className="alert alert-success mt-3">
          <strong>Image uploaded successfully!</strong>
          <div><strong>Title:</strong> {uploadResult.title}</div>
          <div><strong>File Name:</strong> {uploadResult.fileName}</div>
          <div><strong>File Extension:</strong> {uploadResult.fileExtension}</div>
          <div><strong>Date Created:</strong> {uploadResult.dateCreated}</div>
          <div>
            <strong>URL:</strong>{' '}
            <a href={uploadResult.url} target="_blank" rel="noopener noreferrer">{uploadResult.url}</a>
          </div>
        </div>
      )}
    </div>
  );
}