// App\src\components\Navbar.jsx
import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
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
        <Navbar.Brand href="/" className="fw-bold text-white">
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
            <Nav.Link href="/" className="text-white">
              Home
            </Nav.Link>
            <Nav.Link href="/about" className="text-white">
              About
            </Nav.Link>
            <Nav.Link href="/contact" className="text-white">
              Contact
            </Nav.Link>
            <Nav.Link href="/bungie-cord" className="text-white">
              Bungie Cord
            </Nav.Link>
            {!isLoggedIn && (
              <>
                <Nav.Link href="/registration" className="text-white">
                  Registration
                </Nav.Link>
                <Nav.Link href="/login" className="text-white">
                  Login
                </Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Nav.Link href="/user-profile" className="text-white">
                  User Profile
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
