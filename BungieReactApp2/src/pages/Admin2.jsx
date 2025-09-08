import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SUMMARY_API = 'https://localhost:7226/api/SuperHeroUniverse/admin-summary';

export default function Admin2() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(SUMMARY_API);
        if (!res.ok) throw new Error('Failed to fetch summary');
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError('Error loading admin summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Admin2 Page</Card.Title>
              <Card.Text>
                This is a placeholder for the Admin2 page. Add your admin features and controls here.
              </Card.Text>
              <Card.Text>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/super-heroes" className="btn btn-primary">
                    Go to Super Heroes
                  </Link>
                  <Link to="/super-powers" className="btn btn-secondary">
                    Go to Super Powers
                  </Link>
                  <Link to="/sidekick" className="btn btn-info">
                    Go to SideKick
                  </Link>
                  <Link to="/comic-appearance" className="btn btn-warning">
                    Go to Comic Appearance
                  </Link>
                  <Link to="/sidekick-comic-appearance" className="btn btn-success">
                    Go to SideKick Comic Appearance
                  </Link>
                  <Link to="/product-stock" className="btn btn-success">
                    Go to Product Stock
                  </Link>
                  <Link to="/all-orders" className="btn btn-dark">
                    Go To All Orders
                  </Link>
                  <Link to="/user-extra-info" className="btn btn-outline-info">
                    Go to User Extra Info
                  </Link>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h4" className="mb-3">Admin Summary</Card.Title>
              {loading ? (
                <div className="text-center"><Spinner animation="border" /></div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : summary ? (
                <Table bordered>
                  <tbody>
                    <tr>
                      <th>Super Hero Count</th>
                      <td>{summary.superHeroCount}</td>
                    </tr>
                    <tr>
                      <th>Super Power Count</th>
                      <td>{summary.superPowerCount}</td>
                    </tr>
                    <tr>
                      <th>Sidekick Count</th>
                      <td>{summary.sidekickCount}</td>
                    </tr>
                    <tr>
                      <th>Comic Appearance Count</th>
                      <td>{summary.comicAppearanceCount}</td>
                    </tr>
                    <tr>
                      <th>Sidekick Comic Appearance Count</th>
                      <td>{summary.sidekickComicAppearanceCount}</td>
                    </tr>
                    <tr>
                      <th>User Count</th>
                      <td>{summary.userCount}</td>
                    </tr>
                    <tr>
                      <th>Role Count</th>
                      <td>{summary.roleCount}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : null}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}