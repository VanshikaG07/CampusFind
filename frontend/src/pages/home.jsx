import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import {
  SearchIcon,
  PlusIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  CategoryIcons,
} from '../components/common/Icons';
import ResourceCard from '../components/resources/ResourceCard';
import RequestCard from '../components/requests/RequestCard';
import { CATEGORIES } from '../data/resources';
import './Home.css';

export default function Home() {
  const { resources } = useResources();
  const { requests } = useRequests();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/browse?search=${encodeURIComponent(searchQuery.trim())}` : '/browse');
  };

  const urgentRequests = requests.filter((r) => r.urgency && r.status !== 'fulfilled').slice(0, 3);
  const recentResources = resources.slice(0, 8);

  return (
    <div className="home-page fade-in">

      {/* ═══ HERO ═══ */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-pulse" />
              <span>Verified DSEU Student Marketplace</span>
            </div>

            <h1 className="hero-title">
              Buy, sell, and rent resources <span className="hero-title-accent">across campus.</span>
            </h1>

            <p className="hero-subtitle">
              The direct peer-to-peer exchange for textbooks, lab kits, cycles, and hostel essentials — exclusively for DSEU students.
            </p>

            {/* Search bar */}
            <form className="hero-search-form" onSubmit={handleSearchSubmit}>
              <div className="search-input-wrapper">
                <SearchIcon size={18} className="search-icon-svg" />
                <input
                  type="text"
                  placeholder="Search textbooks, calculators, cycles, drafters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hero-search-input"
                />
              </div>
              <button type="submit" className="btn btn-primary hero-search-btn">
                Search
              </button>
            </form>

            {/* Quick Category Tags */}
            <div className="hero-quick-tags">
              <span className="quick-tags-label">Popular:</span>
              {['Books', 'Cycles', 'Electronics', 'Stationery', 'Hostel Items'].map((tag) => (
                <Link
                  key={tag}
                  to={`/browse?category=${encodeURIComponent(tag)}`}
                  className="quick-tag-pill"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* CTA row */}
            <div className="hero-ctas">
              <Link to="/browse" className="btn btn-primary btn-lg">
                Browse Marketplace
              </Link>
              <Link to="/rent" className="btn btn-secondary btn-lg">
                Rent Gear
              </Link>
              <Link
                to={isAuthenticated ? '/requests/create' : '/login'}
                state={!isAuthenticated ? { from: '/requests/create', message: 'Please log in to post a resource request.' } : undefined}
                className="btn btn-secondary btn-lg"
              >
                <PlusIcon size={16} />
                Post a Request
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ URGENT REQUESTS ═══ */}
      {urgentRequests.length > 0 && (
        <section className="home-section urgent-section">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-tag urgent-tag">
                  <AlertCircleIcon size={13} />
                  <span>Immediate Needs</span>
                </div>
                <h2 className="title-md">Urgent Requests</h2>
              </div>
              <Link to="/urgent" className="view-all-link">
                View all
                <ArrowRightIcon size={14} />
              </Link>
            </div>
            <div className="urgent-requests-grid stagger-children">
              {urgentRequests.map((req) => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CATEGORIES ═══ */}
      <section className="home-section categories-section">
        <div className="container">
          <div className="section-header center">
            <div className="section-tag">Browse Categories</div>
            <h2 className="title-md">Explore Campus Categories</h2>
          </div>
          <div className="category-cards-grid stagger-children">
            {CATEGORIES.map((cat) => {
              const IconComponent = CategoryIcons[cat] || SearchIcon;
              const count = resources.filter((r) => r.category === cat).length;
              return (
                <Link key={cat} to={`/browse?category=${encodeURIComponent(cat)}`} className="category-card">
                  <div className="category-icon-bubble">
                    <IconComponent size={22} />
                  </div>
                  <h3 className="category-card-name">{cat}</h3>
                  <span className="category-count">{count} items</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ RECENT LISTINGS ═══ */}
      <section className="home-section recent-section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-tag">Recently Added</div>
              <h2 className="title-md">Latest Campus Listings</h2>
            </div>
            <Link to="/browse" className="view-all-link">
              All listings ({resources.length})
              <ArrowRightIcon size={14} />
            </Link>
          </div>
          <div className="grid-cards stagger-children">
            {recentResources.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="home-section how-it-works-section">
        <div className="container">
          <div className="section-header center">
            <h2 className="title-md">How CampusFind Works</h2>
            <p className="section-desc">Zero commission. Safe peer handovers inside DSEU.</p>
          </div>
          <div className="steps-grid stagger-children">
            {[
              { n: '1', title: 'List or Request', desc: 'Put up items you no longer need, or post an urgent request for study materials.' },
              { n: '2', title: 'Connect Directly', desc: 'Chat directly with fellow DSEU students to agree on price and condition.' },
              { n: '3', title: 'Meet on Campus', desc: 'Handover at the library, canteen, or hostel gate. Inspect and pay in person.' },
            ].map((s) => (
              <div key={s.n} className="step-card">
                <div className="step-number">{s.n}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
