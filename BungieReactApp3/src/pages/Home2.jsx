import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Home2DisplayCard from './Home2DisplayCard';

const API_BASE = 'https://localhost:7226/api/SuperHeroes';

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
                <Col key={hero.id} xs={12} md={6}>
                  <Home2DisplayCard hero={hero} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}