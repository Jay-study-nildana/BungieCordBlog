import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SuperHeroGallery({ hero }) {
  const [images, setImages] = React.useState([]);
  const [imgLoading, setImgLoading] = React.useState(true);
  const [imgError, setImgError] = React.useState('');
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    const fetchImages = async () => {
      setImgLoading(true);
      setImgError('');
      try {
        const res = await fetch(`https://localhost:7226/api/SuperHeroes/${hero.id}/images`);
        if (!res.ok) throw new Error('Failed to fetch images');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        setImgError('Error loading images');
      } finally {
        setImgLoading(false);
      }
    };
    fetchImages();
  }, [hero.id]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {imgError && <div className="text-danger">{imgError}</div>}
      {imgLoading ? (
        <div className="text-center"><span>Loading...</span></div>
      ) : images.length === 0 ? (
        <div>No images found.</div>
      ) : (
        <div className="d-flex flex-column align-items-center w-100">
          <div className="d-flex w-100 justify-content-center align-items-center" style={{ maxWidth: 320 }}>
            <Button
              variant="light"
              size="sm"
              className="me-2"
              style={{ height: '40px' }}
              onClick={handlePrev}
            >
              &#8592;
            </Button>
            <img
              src={images[current].url.startsWith('http') ? images[current].url : `${window.location.origin}${images[current].url}`}
              alt={images[current].title}
              style={{
                width: '100%',
                maxWidth: 240,
                height: '480px',
                objectFit: 'cover',
                borderRadius: 12,
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)'
              }}
            />
            <Button
              variant="light"
              size="sm"
              className="ms-2"
              style={{ height: '40px' }}
              onClick={handleNext}
            >
              &#8594;
            </Button>
          </div>
          <div className="mt-2 text-center">
            <strong>{images[current].title}</strong>
            <br />
            <small>
              {images[current].dateCreated?.replace('T', ' ').slice(0, 16)}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home2DisplayCard({ hero }) {
  return (
    <Card
      className="h-100 d-flex flex-column align-items-center"
      style={{
        minHeight: 600,
        width: '100%',           // Make card take full column width
        maxWidth: '100%',        // Remove fixed maxWidth
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-start p-3">
        <Card.Title className="text-center">{hero.name}</Card.Title>
        <SuperHeroGallery hero={hero} />
        <Card.Subtitle className="mb-2 text-muted text-center">{hero.alias}</Card.Subtitle>
        <Card.Text className="text-center" style={{ fontSize: '0.95rem' }}>
          <strong>Origin:</strong> {hero.origin}<br />
          <strong>First Appearance:</strong> {hero.firstAppearance?.replace('T', ' ').slice(0, 16)}<br />
          <strong>Active:</strong> {hero.isActive ? 'Yes' : 'No'}
        </Card.Text>
        <div className="mt-3 text-center w-100">
          <Button
            as={Link}
            to={`/superhero/${hero.id}`}
            variant="outline-primary"
            size="sm"
            style={{ width: '100%' }}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}