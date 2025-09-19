import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Lost & Found Portal
              </h1>
              <p className="lead mb-4">
                A comprehensive platform for managing lost and found items in our college. 
                Students can easily browse lost items, and teachers can efficiently manage 
                the collection process.
              </p>
              <div className="d-flex gap-3">
                <Link to="/student" className="btn btn-light btn-lg">
                  <i className="bi bi-eye me-2"></i>
                  Browse Lost Items
                </Link>
                <Link to="/admin/login" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-gear me-2"></i>
                  Teacher Login
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="bi bi-search display-1 opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">Key Features</h2>
              <p className="lead text-muted">
                Everything you need to manage lost and found items efficiently
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-camera text-primary display-4 mb-3"></i>
                  <h5 className="card-title">Photo Documentation</h5>
                  <p className="card-text text-muted">
                    Upload clear photos of lost items with detailed descriptions 
                    to help students identify their belongings.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-search text-primary display-4 mb-3"></i>
                  <h5 className="card-title">Smart Search</h5>
                  <p className="card-text text-muted">
                    Advanced search and filtering by date, category, and keywords 
                    to quickly find specific items.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-graph-up text-primary display-4 mb-3"></i>
                  <h5 className="card-title">Analytics Dashboard</h5>
                  <p className="card-text text-muted">
                    Comprehensive statistics and charts showing monthly trends 
                    and collection rates.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-qr-code text-primary display-4 mb-3"></i>
                  <h5 className="card-title">QR Code System</h5>
                  <p className="card-text text-muted">
                    Generate QR codes for easy item tracking and quick access 
                    to item details.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-archive text-primary display-4 mb-3"></i>
                  <h5 className="card-title">Auto-Archive</h5>
                  <p className="card-text text-muted">
                    Automatic archiving of items older than one month to keep 
                    the active list clean and organized.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-shield-check text-primary display-4 mb-3"></i>
                  <h5 className="card-title">Secure Management</h5>
                  <p className="card-text text-muted">
                    Secure teacher authentication and role-based access control 
                    for safe item management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="lead text-muted">
                Simple and efficient process for both teachers and students
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '80px', height: '80px'}}>
                <i className="bi bi-plus-lg fs-3"></i>
              </div>
              <h5>1. Add Item</h5>
              <p className="text-muted">
                Teachers upload lost items with photos and details
              </p>
            </div>
            
            <div className="col-md-3 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '80px', height: '80px'}}>
                <i className="bi bi-eye fs-3"></i>
              </div>
              <h5>2. Browse Items</h5>
              <p className="text-muted">
                Students search and view available lost items
              </p>
            </div>
            
            <div className="col-md-3 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '80px', height: '80px'}}>
                <i className="bi bi-check-circle fs-3"></i>
              </div>
              <h5>3. Claim Item</h5>
              <p className="text-muted">
                Students collect items and teachers mark as collected
              </p>
            </div>
            
            <div className="col-md-3 text-center">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '80px', height: '80px'}}>
                <i className="bi bi-archive fs-3"></i>
              </div>
              <h5>4. Archive</h5>
              <p className="text-muted">
                Old items automatically move to archive section
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-4">Ready to Get Started?</h2>
              <p className="lead mb-4">
                Join our community and help make our college a better place by 
                efficiently managing lost and found items.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/student" className="btn btn-primary btn-lg">
                  <i className="bi bi-eye me-2"></i>
                  Start Browsing
                </Link>
                <Link to="/admin/login" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-gear me-2"></i>
                  Teacher Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;








