import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Table } from 'react-bootstrap';

const API_BASE = 'https://localhost:7226/api/SuperHeroes';
const POWERS_API_BASE = 'https://localhost:7226/api/SuperPowers/by-superhero';
const SIDEKICKS_API_BASE = 'https://localhost:7226/api/Sidekicks/by-superhero';

export default function SuperHeroCard({ superHeroId }) {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [powers, setPowers] = useState([]);
  const [powersLoading, setPowersLoading] = useState(true);
  const [powersError, setPowersError] = useState('');

  const [sidekicks, setSidekicks] = useState([]);
  const [sidekicksLoading, setSidekicksLoading] = useState(true);
  const [sidekicksError, setSidekicksError] = useState('');

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState('');

  useEffect(() => {
    if (!superHeroId) return;
    const fetchHero = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch superhero');
        const data = await res.json();
        setHero(data);
      } catch (err) {
        setError('Error loading superhero details');
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [superHeroId]);

  useEffect(() => {
    if (!superHeroId) return;
    const fetchPowers = async () => {
      setPowersLoading(true);
      setPowersError('');
      try {
        const res = await fetch(`${POWERS_API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch powers');
        const data = await res.json();
        setPowers(data);
      } catch (err) {
        setPowersError('Error loading super powers');
      } finally {
        setPowersLoading(false);
      }
    };
    fetchPowers();
  }, [superHeroId]);

  useEffect(() => {
    if (!superHeroId) return;
    const fetchSidekicks = async () => {
      setSidekicksLoading(true);
      setSidekicksError('');
      try {
        const res = await fetch(`${SIDEKICKS_API_BASE}/${superHeroId}`);
        if (!res.ok) throw new Error('Failed to fetch sidekicks');
        const data = await res.json();
        setSidekicks(data);
      } catch (err) {
        setSidekicksError('Error loading sidekicks');
      } finally {
        setSidekicksLoading(false);
      }
    };
    fetchSidekicks();
  }, [superHeroId]);

  useEffect(() => {
    if (!superHeroId) return;
    const fetchImages = async () => {
      setImagesLoading(true);
      setImagesError('');
      try {
        const res = await fetch(`${API_BASE}/${superHeroId}/images`);
        if (!res.ok) throw new Error('Failed to fetch images');
        const data = await res.json();
        setImages(data);
      } catch (err) {
        setImagesError('Error loading images');
      } finally {
        setImagesLoading(false);
      }
    };
    fetchImages();
  }, [superHeroId]);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          {loading ? (
            <div className="text-center"><Spinner animation="border" size="sm" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : !hero ? null : (
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>{hero.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{hero.alias}</Card.Subtitle>
                <Card.Text>
                  <strong>Origin:</strong> {hero.origin}<br />
                  <strong>First Appearance:</strong> {hero.firstAppearance?.replace('T', ' ').slice(0, 16)}<br />
                  <strong>Active:</strong> {hero.isActive ? 'Yes' : 'No'}
                </Card.Text>
                <h5 className="mt-4">Super Powers</h5>
                {powersLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : powersError ? (
                  <Alert variant="danger">{powersError}</Alert>
                ) : powers.length === 0 ? (
                  <div>No powers found.</div>
                ) : (
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Power Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {powers.map(power => (
                        <tr key={power.id}>
                          <td>{power.powerName}</td>
                          <td>{power.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <h5 className="mt-4">Sidekicks</h5>
                {sidekicksLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : sidekicksError ? (
                  <Alert variant="danger">{sidekicksError}</Alert>
                ) : sidekicks.length === 0 ? (
                  <div>No sidekicks found.</div>
                ) : (
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sidekicks.map(sk => (
                        <tr key={sk.id}>
                          <td>{sk.name}</td>
                          <td>{sk.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
                <h5 className="mt-4">Images</h5>
                {imagesLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : imagesError ? (
                  <Alert variant="danger">{imagesError}</Alert>
                ) : images.length === 0 ? (
                  <div>No images found.</div>
                ) : (
                  <Row className="g-3">
                    {images.map(img => (
                      <Col key={img.id} xs={12} sm={6} md={4}>
                        <Card className="h-100">
                          <Card.Img
                            variant="top"
                            src={img.url.startsWith('http') ? img.url : `${window.location.origin}${img.url}`}
                            alt={img.title}
                            style={{ objectFit: 'cover', height: '180px' }}
                          />
                          <Card.Body>
                            <Card.Title>{img.title}</Card.Title>
                            <Card.Text>
                              <small>
                                Uploaded: {img.dateCreated?.replace('T', ' ').slice(0, 16)}
                              </small>
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}