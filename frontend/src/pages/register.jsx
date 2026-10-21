import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SearchIcon, CheckIcon } from '../components/common/Icons';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const redirectTarget = location.state?.from || '/profile';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    year: '1st Year',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';

    if (!formData.email.trim()) {
      errs.email = 'College email is required';
    } else if (!formData.email.includes('@')) {
      errs.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        year: formData.year,
        phone: formData.phone,
        password: formData.password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 1400);
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="brand-logo-icon auth-logo-icon">
            <SearchIcon size={24} />
          </div>
          <h2 className="auth-brand-title">CampusFind</h2>
          <p className="auth-brand-tagline">DSEU Student Marketplace</p>
        </div>

        <div className="auth-heading-wrap">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join fellow DSEU students to buy, sell, and rent</p>
        </div>

        {errors.form && <div className="auth-error-banner fade-in">{errors.form}</div>}

        {success ? (
          <div className="auth-success-card fade-in">
            <div className="success-icon-wrap">
              <CheckIcon size={28} />
            </div>
            <h3>Account Created!</h3>
            <p>Welcome to CampusFind. Redirecting to your student dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">
                Full Name *
              </label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="e.g. Shreya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">
                College Email *
              </label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="e.g. shreya.sharma@college.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-dept">
                  Department
                </label>
                <select
                  id="reg-dept"
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics & Comm">Electronics & Comm</option>
                  <option value="Mechanical Engg">Mechanical Engg</option>
                  <option value="Information Tech">Information Tech</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engg">Electrical Engg</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-year">
                  Year
                </label>
                <select
                  id="reg-year"
                  className="form-select"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">
                Phone / WhatsApp (Optional)
              </label>
              <input
                id="reg-phone"
                type="tel"
                className="form-input"
                placeholder="e.g. 9812345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-pass">
                  Password *
                </label>
                <input
                  id="reg-pass"
                  type="password"
                  className="form-input"
                  placeholder="At least 4 chars"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-conf">
                  Confirm Password *
                </label>
                <input
                  id="reg-conf"
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Student Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="auth-footer-prompt">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-switch-link">
            Log in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
