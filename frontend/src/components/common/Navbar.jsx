import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SearchIcon, PlusIcon, MessageSquareIcon, MenuIcon, CloseIcon } from './Icons';
import { getInitials } from '../../data/users';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <div className="brand-logo-icon">
            <SearchIcon size={18} className="logo-svg" />
          </div>
          <div className="brand-text">
            <span className="brand-title">CampusFind</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Browse
          </NavLink>
          <NavLink to="/rent" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Rent
          </NavLink>
          <NavLink to="/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Requests
          </NavLink>
          <NavLink to="/urgent" className={({ isActive }) => `nav-link nav-link-urgent ${isActive ? 'active' : ''}`}>
            <span className="urgent-indicator-dot"></span>
            Urgent
          </NavLink>
        </nav>

        {/* Right Actions - Clearly differentiated by Authentication State */}
        <div className="navbar-actions">
          {isAuthenticated && user ? (
            /* ================= LOGGED-IN STATE ================= */
            <div className="logged-in-controls">
              <Link to="/create-resource" className="btn btn-primary btn-sm create-listing-btn">
                <PlusIcon size={15} />
                <span>Create Listing</span>
              </Link>

              <Link to="/messages" className="icon-btn-messages" title="Campus Messages">
                <MessageSquareIcon size={18} />
              </Link>

              <div className="user-dropdown-container">
                <button
                  type="button"
                  className="user-profile-badge-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="User account menu"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="user-avatar-circle">
                    {getInitials(user?.name)}
                  </div>
                  <span className="user-firstname">{user?.name?.split(' ')[0]}</span>
                  <svg className="dropdown-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu fade-in">
                    <div className="dropdown-user-info">
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                      <span className="dropdown-dept-tag">
                        {user?.department} • {user?.year}
                      </span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/profile"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Profile & Activity
                    </Link>
                    <Link
                      to="/create-resource"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      + Post New Listing
                    </Link>
                    <Link
                      to="/requests/create"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      + Post a Demand
                    </Link>
                    <Link
                      to="/messages"
                      className="dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Messages
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ================= LOGGED-OUT STATE ================= */
            <div className="logged-out-controls">
              <Link to="/login" className="btn btn-secondary btn-sm nav-login-btn">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm nav-register-btn">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer fade-in">
          <nav className="mobile-nav-links">
            <NavLink to="/" end className="mobile-nav-link" onClick={closeMobile}>
              Home
            </NavLink>
            <NavLink to="/browse" className="mobile-nav-link" onClick={closeMobile}>
              Browse Resources
            </NavLink>
            <NavLink to="/rent" className="mobile-nav-link" onClick={closeMobile}>
              Rent Items
            </NavLink>
            <NavLink to="/requests" className="mobile-nav-link" onClick={closeMobile}>
              Requests Board
            </NavLink>
            <NavLink to="/urgent" className="mobile-nav-link text-urgent" onClick={closeMobile}>
              Urgent Demands
            </NavLink>

            <div className="mobile-divider"></div>

            {isAuthenticated && user ? (
              <>
                <NavLink to="/create-resource" className="mobile-nav-link highlight" onClick={closeMobile}>
                  + Create Listing
                </NavLink>
                <NavLink to="/requests/create" className="mobile-nav-link" onClick={closeMobile}>
                  + Post a Demand
                </NavLink>
                <NavLink to="/messages" className="mobile-nav-link" onClick={closeMobile}>
                  Messages
                </NavLink>
                <NavLink to="/profile" className="mobile-nav-link" onClick={closeMobile}>
                  My Profile ({user?.name})
                </NavLink>
                <button
                  type="button"
                  className="mobile-nav-link text-danger"
                  onClick={() => {
                    handleLogout();
                    closeMobile();
                  }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="mobile-auth-row">
                <Link to="/login" className="btn btn-secondary btn-sm w-full" onClick={closeMobile}>
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm w-full" onClick={closeMobile}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
