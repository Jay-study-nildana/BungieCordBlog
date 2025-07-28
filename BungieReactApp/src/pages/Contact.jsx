import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

export default function Contact() {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Contact Vijayasimha BR</Card.Title>
              <Card.Text>
                Feel free to reach out for professional inquiries, collaborations, or training sessions.
              </Card.Text>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item>
                  <strong>Email:</strong> <a href="mailto:vijayasimhabr@gmail.com">vijayasimhabr@gmail.com</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/vijayasimhabr/" target="_blank" rel="noopener noreferrer">linkedin.com/in/vijayasimhabr</a>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Location:</strong> Bengaluru, Karnataka, India
                </ListGroup.Item>
              </ListGroup>
              <Card.Text>
                You can also connect with me on LinkedIn for updates and networking opportunities.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}