import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Admin2() {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Admin2 Page</Card.Title>
                <Card.Text>
                    This is a placeholder for the Admin2 page. Add your admin features and controls here.
                </Card.Text>
                <Card.Text>
                    <Link to="/super-heroes" className="btn btn-primary">
                        Go to Super Heroes
                    </Link>
                    <Link to="/super-powers" className="btn btn-secondary">
                        Go to Super Powers
                    </Link>
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}