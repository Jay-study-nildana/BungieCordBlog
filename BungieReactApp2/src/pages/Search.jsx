import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SEARCH_API = 'https://localhost:7226/api/SuperHeroUniverse/search';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const res = await fetch(`${SEARCH_API}?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('Error searching');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Search Page</Card.Title>
              <Card.Text>
                Search for superheroes, powers, sidekicks, and comic appearances.
              </Card.Text>
              <Form onSubmit={handleSearch} className="mb-3">
                <Form.Group className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                  <Button type="submit" variant="primary" className="ms-2">
                    Search
                  </Button>
                </Form.Group>
              </Form>
              {loading && <div className="text-center"><Spinner animation="border" /></div>}
              {error && <Alert variant="danger">{error}</Alert>}
              {results && (
                <>
                  <h5 className="mt-4">Super Heroes</h5>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Alias</th>
                        <th>Origin</th>
                        <th>First Appearance</th>
                        <th>Active</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.superHeroes.map(hero => (
                        <tr key={hero.id}>
                          <td>{hero.name}</td>
                          <td>{hero.alias}</td>
                          <td>{hero.origin}</td>
                          <td>{hero.firstAppearance?.replace('T', ' ').slice(0, 16)}</td>
                          <td>{hero.isActive ? 'Yes' : 'No'}</td>
                          <td>
                            <Button
                              as={Link}
                              to={`/superhero/${hero.id}`}
                              variant="outline-primary"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <h5 className="mt-4">Super Powers</h5>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Power Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.superPowers.map(power => (
                        <tr key={power.id}>
                          <td>{power.powerName}</td>
                          <td>{power.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <h5 className="mt-4">Sidekicks</h5>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.sidekicks.map(sk => (
                        <tr key={sk.id}>
                          <td>{sk.name}</td>
                          <td>{sk.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <h5 className="mt-4">Comic Appearances</h5>
                  <Table bordered size="sm">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Issue</th>
                        <th>Release Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.comicAppearances.map(comic => (
                        <tr key={comic.id}>
                          <td>{comic.comicTitle}</td>
                          <td>{comic.issueNumber}</td>
                          <td>{comic.releaseDate?.replace('T', ' ').slice(0, 16)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}