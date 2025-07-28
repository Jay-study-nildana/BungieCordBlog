import React from 'react';

export default function Footer() {
  return (
    <footer className="custom-footer text-center py-3 mt-5">
      <div className="container">
        <span className="text-white-50">
          © {new Date().getFullYear()} Bungie Cord. All rights reserved.
        </span>
      </div>
    </footer>
  );
}