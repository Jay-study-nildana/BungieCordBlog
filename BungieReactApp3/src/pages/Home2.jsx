import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_BASE = 'https://localhost:7226/api/SuperHeroes';

function SuperHeroGallery({ hero }) {
  const [images, setImages] = useState([]);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState('');
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      setImgLoading(true);
      setImgError('');
      try {
        const res = await fetch(`${API_BASE}/${hero.id}/images`);
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
      <h6 className="mt-3 mb-2">Images</h6>
      {imgError && <Alert variant="danger">{imgError}</Alert>}
      {imgLoading ? (
        <div className="text-center"><Spinner animation="border" size="sm" /></div>
      ) : images.length === 0 ? (
        <div>No images found.</div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <div style={{ position: 'relative', width: '100%', maxWidth: 220 }}>
            <img
              src={images[current].url.startsWith('http') ? images[current].url : `${window.location.origin}${images[current].url}`}
              alt={images[current].title}
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 8 }}
            />
            <Button
              variant="light"
              size="sm"
              style={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)', zIndex: 2 }}
              onClick={handlePrev}
            >
              &#8592;
            </Button>
            <Button
              variant="light"
              size="sm"
              style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)', zIndex: 2 }}
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

export default function Home2() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHeroes = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setHeroes(data);
      } catch (err) {
        setError('Error loading superheroes');
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, []);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Home2 Page</Card.Title>
              <Card.Text>
                This is a placeholder for the Home2 page. Below is a list of Super Heroes.
              </Card.Text>
              <div className="mt-3 text-end">
                <Button as={Link} to="/search" variant="info">
                  Go to Search
                </Button>
              </div>
            </Card.Body>
          </Card>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : (
            <Row className="g-4">
              {heroes.map(hero => (
                <Col key={hero.id} xs={12} sm={6} md={3}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{hero.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{hero.alias}</Card.Subtitle>
                      <Card.Text>
                        <strong>Origin:</strong> {hero.origin}<br />
                        <strong>First Appearance:</strong> {hero.firstAppearance?.replace('T', ' ').slice(0, 16)}<br />
                        <strong>Active:</strong> {hero.isActive ? 'Yes' : 'No'}
                      </Card.Text>
                      <SuperHeroGallery hero={hero} />
                      <div className="mt-3 text-center">
                        <Button
                          as={Link}
                          to={`/superhero/${hero.id}`}
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}