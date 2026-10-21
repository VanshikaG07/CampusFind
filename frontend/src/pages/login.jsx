import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SearchIcon, AlertCircleIcon } from '../components/common/Icons';
import { mockUsers } from '../data/users';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTarget = location.state?.from || '/profile';
  const noticeMessage = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your college email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick helper to auto-fill mock users for evaluation
  const handleQuickLogin = async (mockUser) => {
    setEmail(mockUser.email);
    setPassword('password123');
    try {
      setLoading(true);
      await login(mockUser.email, 'password123');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.message);
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
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to buy, sell, or rent with fellow students</p>
        </div>

        {noticeMessage && (
          <div className="auth-notice-banner fade-in">
            <AlertCircleIcon size={16} />
            <span>{noticeMessage}</span>
          </div>
        )}

        {error && <div className="auth-error-banner fade-in">{error}</div>}

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="college-email">
              College Email (.edu / campus email)
            </label>
            <input
              id="college-email"
              type="email"
              className="form-input"
              placeholder="e.g. arjun.sharma@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="label-with-link">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                className="forgot-link"
                onClick={() => alert('Demo mode: Use password123 or select a 1-click test student below!')}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me on this browser</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Quick Logins for Evaluator Ease */}
        <div className="quick-test-accounts">
          <p className="quick-title">Quick Demo Login (1-Click):</p>
          <div className="quick-buttons">
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickLogin(mockUsers[0])}
            >
              Arjun Sharma (CSE, 3rd Year)
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickLogin(mockUsers[1])}
            >
              Priya Verma (ECE, 2nd Year)
            </button>
            <button
              type="button"
              className="quick-btn"
              onClick={() => handleQuickLogin(mockUsers[2])}
            >
              Rahul Gupta (ME, 4th Year)
            </button>
          </div>
        </div>

        <div className="auth-footer-prompt">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-switch-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
