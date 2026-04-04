import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Add this import

export default function AppNavbar() {
  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-white">
          <img
            src="/vite.svg"
            alt="Logo"
            width="32"
            height="32"
            className="me-2"
          />
          React 18.x Journey
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
            <Nav.Link as={Link} to="/weather" className="text-white">Weather Forecast</Nav.Link>
            <Nav.Link as={Link} to="/bird" className="text-white">Bird</Nav.Link>
            <Nav.Link as={Link} to="/zoo" className="text-white">Zoo</Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-white">About</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-white">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}