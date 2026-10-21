import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, LocationIcon } from './Icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <div className="brand-logo-icon">
                <SearchIcon size={16} />
              </div>
              <span className="brand-title">CampusFind</span>
            </Link>
            <p className="footer-description">
              Campus-only student marketplace for Delhi Skill and Entrepreneurship University. Buy, sell, rent, and share
              course resources, cycles, electronics, and hostel supplies safely inside college.
            </p>
            <div className="campus-hub-badge">
              <LocationIcon size={14} />
              <span>Delhi Skill and Entrepreneurship University (DSEU), Rohini</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Marketplace</h4>
            <ul className="footer-links">
              <li><Link to="/browse">All Resources</Link></li>
              <li><Link to="/rent">Rent Gear & Cycles</Link></li>
              <li><Link to="/requests">Student Request Board</Link></li>
              <li><Link to="/urgent">Urgent Demands</Link></li>
            </ul>
          </div>

          {/* Student Actions */}
          <div className="footer-col">
            <h4 className="footer-heading">Student Account</h4>
            <ul className="footer-links">
              <li><Link to="/create-resource">Post a Listing</Link></li>
              <li><Link to="/requests/create">Post a Demand</Link></li>
              <li><Link to="/profile">My Activity & Profile</Link></li>
              <li><Link to="/messages">Campus Messages</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Academic Categories</h4>
            <ul className="footer-links">
              <li><Link to="/browse?category=Books">Textbooks & Reference Notes</Link></li>
              <li><Link to="/browse?category=Cycles">Campus Cycles</Link></li>
              <li><Link to="/browse?category=Electronics">Calculators & Lab Hardware</Link></li>
              <li><Link to="/browse?category=Stationery">Lab Record Books & Covers</Link></li>
              <li><Link to="/browse?category=Hostel Items">Hostel Essentials</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CampusFind. Exclusively for Delhi Skill and Entrepreneurship University (DSEU) students.</p>
          <div className="footer-bottom-links">
            <span>FastAPI Backend Ready</span>
            <span>•</span>
            <span>Zero Commission</span>
            <span>•</span>
            <span>Direct Peer Handover</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
