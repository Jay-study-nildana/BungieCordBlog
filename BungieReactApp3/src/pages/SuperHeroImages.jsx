import React, { useState } from 'react';
import { Spinner, Alert, Button, Modal } from 'react-bootstrap';

export default function SuperHeroImages({ loading, error, images }) {
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (loading) return <Spinner animation="border" size="sm" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!images || images.length === 0) return <div>No images found.</div>;

  const handlePrev = () => setCurrent(current === 0 ? images.length - 1 : current - 1);
  const handleNext = () => setCurrent(current === images.length - 1 ? 0 : current + 1);

  const img = images[current];

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <div
        className="d-flex align-items-center justify-content-center w-100"
        style={{
          minHeight: '400px',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <Button
          variant="light"
          size="lg"
          className="me-2"
          style={{ zIndex: 2 }}
          onClick={handlePrev}
        >
          &#8592;
        </Button>
        <img
          src={img.url.startsWith('http') ? img.url : `${window.location.origin}${img.url}`}
          alt={img.title}
          style={{
            width: '100%',
            maxWidth: '700px',
            height: '480px',
            objectFit: 'contain',
            borderRadius: '16px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
            background: '#f8f9fa',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}
          onClick={() => setShowModal(true)}
        />
        <Button
          variant="light"
          size="lg"
          className="ms-2"
          style={{ zIndex: 2 }}
          onClick={handleNext}
        >
          &#8594;
        </Button>
      </div>
      <div className="mt-3 text-center w-100">
        <strong>{img.title}</strong>
        <br />
        <small>
          Uploaded: {img.dateCreated?.replace('T', ' ').slice(0, 16)}
        </small>
        <div className="mt-2">
          <span>
            {current + 1} / {images.length}
          </span>
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-center mt-4" style={{ gap: '8px' }}>
        {images.map((thumb, idx) => (
          <img
            key={thumb.id}
            src={thumb.url.startsWith('http') ? thumb.url : `${window.location.origin}${thumb.url}`}
            alt={thumb.title}
            style={{
              width: 60,
              height: 60,
              objectFit: 'cover',
              borderRadius: 8,
              border: idx === current ? '2px solid #007bff' : '2px solid transparent',
              cursor: 'pointer',
              boxShadow: idx === current ? '0 0 8px #007bff55' : 'none',
              transition: 'border 0.2s',
            }}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="xl"
        dialogClassName="w-100"
        contentClassName="bg-dark"
        style={{ zIndex: 2000 }}
      >
        <Modal.Body className="d-flex flex-column align-items-center justify-content-center p-0">
          <div className="d-flex align-items-center justify-content-center w-100" style={{ position: 'relative', minHeight: '80vh' }}>
            <Button
              variant="light"
              size="lg"
              className="me-3"
              style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
              onClick={() => setCurrent(current === 0 ? images.length - 1 : current - 1)}
            >
              &#8592;
            </Button>
            <img
              src={img.url.startsWith('http') ? img.url : `${window.location.origin}${img.url}`}
              alt={img.title}
              style={{
                width: '100%',
                maxWidth: '90vw',
                height: '80vh',
                objectFit: 'contain',
                borderRadius: '16px',
                background: '#222',
                boxShadow: '0 2px 32px rgba(0,0,0,0.5)',
                cursor: 'pointer',
              }}
              onClick={() => setShowModal(false)}
            />
            <Button
              variant="light"
              size="lg"
              className="ms-3"
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}
              onClick={() => setCurrent(current === images.length - 1 ? 0 : current + 1)}
            >
              &#8594;
            </Button>
          </div>
          <div className="mt-3 text-center text-light w-100">
            <strong>{img.title}</strong>
            <br />
            <small>
              Uploaded: {img.dateCreated?.replace('T', ' ').slice(0, 16)}
            </small>
            <div className="mt-2">
              <span>
                {current + 1} / {images.length}
              </span>
            </div>
          </div>
          <Button
            variant="secondary"
            className="mt-3"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}