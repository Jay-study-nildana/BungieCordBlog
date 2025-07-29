import React from 'react';
import { Container, Row, Col, Card, ListGroup, Image } from 'react-bootstrap';

export default function About() {
  return (
    <Container className="mt-4">
      <Row className="justify-content-center mb-4">
        <Col md={3} className="text-center mb-3">
          <Image
            src="https://avatars.githubusercontent.com/u/14297315?v=4"
            alt="Vijayasimha BR"
            roundedCircle
            fluid
            style={{ maxWidth: '150px' }}
          />
        </Col>
        <Col md={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">About Vijayasimha BR</Card.Title>
              <Card.Text>
                <strong>Vijayasimha BR</strong> is a seasoned technology leader, architect, and educator with extensive experience in software engineering, cloud computing, and modern web development. He is passionate about empowering teams and individuals to build scalable, maintainable, and innovative solutions using the latest technologies.
              </Card.Text>
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item>
                  <strong>Expertise:</strong> Cloud Architecture, React, .NET, Azure, DevOps, Microservices
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Roles:</strong> Principal Architect, Technical Trainer, Mentor
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Education:</strong> B.E. in Computer Science
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/vijayasimhabr/" target="_blank" rel="noopener noreferrer">Vijayasimha BR</a>
                </ListGroup.Item>
              </ListGroup>
              <Card.Text>
                Vijayasimha is known for his engaging teaching style and commitment to continuous learning. He has delivered numerous workshops and training sessions on modern web and cloud technologies, helping professionals and students alike to excel in their careers.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}