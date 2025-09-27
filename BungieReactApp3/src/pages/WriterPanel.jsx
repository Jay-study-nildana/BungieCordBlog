import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Admin2() {

  useEffect(() => {

  }, []);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Card.Title as="h2" className="mb-3">Writer Panel</Card.Title>
              <Card.Text>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/super-heroes" className="btn btn-primary">
                    Go to Super Heroes (Product)
                  </Link>
                  <Link to="/writer-panel-stock" className="btn btn-success">
                    Go to Product Stock
                  </Link>
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}