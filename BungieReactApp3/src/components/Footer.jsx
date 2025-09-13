import React from 'react';

export default function Footer() {
  return (
    <footer
      className="custom-footer text-center py-3"
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        zIndex: 100,
        background: '#222',
        pointerEvents: 'auto'
      }}
    >
      <div className="container">
        <span className="text-white-50">
          © {new Date().getFullYear()} Bungie Cord. All rights reserved.
        </span>
        <span className="text-white-50 mx-3">|</span>
        <a
          href="https://github.com/Jay-study-nildana"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white-50 mx-2"
        >
          GitHub
        </a>
        <span className="text-white-50 mx-1">|</span>
        <a
          href="https://stories.thechalakas.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white-50 mx-2"
        >
          Website
        </a>
        <span className="text-white-50 mx-1">|</span>
        <a
          href="https://www.instagram.com/codingtutorjay"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white-50 mx-2"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}

// To prevent content being blocked, add padding-bottom to your main container:
// Example: <Container className="mt-4 pb-5"> ... </Container>