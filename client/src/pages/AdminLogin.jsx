import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isRegistering 
        ? await register(formData.username, formData.password)
        : await login(formData.username, formData.password);

      if (result.success) {
        toast.success(isRegistering ? 'Registration successful!' : 'Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="bi bi-shield-lock text-primary display-4"></i>
                <h3 className="mt-3 mb-1">
                  {isRegistering ? 'Register Teacher' : 'Teacher Login'}
                </h3>
                <p className="text-muted">
                  {isRegistering 
                    ? 'Create a new teacher account' 
                    : 'Access the admin dashboard'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    minLength="6"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {isRegistering ? 'Registering...' : 'Logging in...'}
                    </>
                  ) : (
                    <>
                      <i className={`bi ${isRegistering ? 'bi-person-plus' : 'bi-box-arrow-in-right'} me-2`}></i>
                      {isRegistering ? 'Register' : 'Login'}
                    </>
                  )}
                </button>
              </form>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none"
                  onClick={() => setIsRegistering(!isRegistering)}
                  disabled={loading}
                >
                  {isRegistering 
                    ? 'Already have an account? Login' 
                    : "Don't have an account? Register"
                  }
                </button>
              </div>

              <div className="text-center mt-4">
                <Link to="/" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Demo Credentials removed for production */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;




