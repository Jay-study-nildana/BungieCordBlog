import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function AppNavbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

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
          Bungie Cord
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-white">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/bungie-cord" className="text-white">
              Bungie Cord
            </Nav.Link>
            <Nav.Link as={Link} to="/admin2" className="text-white">
              Admin2
            </Nav.Link>        
            <Nav.Link as={Link} to="/home2" className="text-white">
              Home2
            </Nav.Link>    
            {!isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/registration" className="text-white">
                  Registration
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="text-white">
                  Login
                </Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/user-profile" className="text-white">
                  User Profile
                </Nav.Link>
                <Nav.Link as={Link} to="/order-basket" className="text-white">
                  Order Basket
                </Nav.Link>
                <Nav.Link
                  as="button"
                  className="text-white btn btn-link p-0 ms-3"
                  onClick={handleLogout}
                >
                  Log Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}