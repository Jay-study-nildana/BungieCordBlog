import React from 'react';

export default function Home() {
  return (
    <div className="container mt-4">
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h2 className="display-5 fw-bold text-primary">Welcome, Students!</h2>
          <p className="lead">This is your journey into <span className="text-success">React 18.x</span> with Bootstrap 5. Explore, experiment, and enjoy building modern UIs!</p>
        </div>
        <div className="col-md-4 text-center">
          <img src="/vite.svg" alt="React Logo" className="img-fluid" style={{maxWidth: '120px'}} />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Why React 18.x?</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Concurrent rendering for better performance</li>
                <li className="list-group-item">Automatic batching of updates</li>
                <li className="list-group-item">Improved Suspense for data fetching</li>
                <li className="list-group-item">Modern hooks and features</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">What You'll Learn</h5>
              <ol className="list-group list-group-numbered list-group-flush">
                <li className="list-group-item">Component-based UI development</li>
                <li className="list-group-item">State & props management</li>
                <li className="list-group-item">Routing and navigation</li>
                <li className="list-group-item">Styling with Bootstrap</li>
                <li className="list-group-item">Best practices & more!</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-info mt-4" role="alert">
        <strong>Tip:</strong> Use the navigation bar above to explore different pages and features!
        <br />
        <a href="/bungie-cord" className="btn btn-outline-primary mt-2">Explore Bungie Cord API</a>
      </div>
    </div>
  );
}