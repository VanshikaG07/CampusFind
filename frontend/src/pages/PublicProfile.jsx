import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as userService from '../services/userService';
import { useResources } from '../context/ResourceContext';
import ResourceCard from '../components/resources/ResourceCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { ArrowLeftIcon, CalendarIcon, LocationIcon } from '../components/common/Icons';
import { getInitials } from '../data/users';
import './Profile.css';

export default function PublicProfile() {
  const { id } = useParams();
  const { resources } = useResources();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    userService.getUser(id).then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading student profile..." />;
  }

  if (!user) {
    return (
      <div className="container details-not-found fade-in">
        <h2 className="title-md">Student Not Found</h2>
        <p>This student profile could not be found in the campus registry.</p>
        <Link to="/browse" className="btn btn-primary btn-sm">
          <ArrowLeftIcon size={16} />
          <span>Back to Browse</span>
        </Link>
      </div>
    );
  }

  // Active listings by this student
  const studentListings = resources.filter((r) => r.user_id === user.id);

  const memberDate = new Date(user.member_since || '2025-08-01').toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="profile-page container fade-in">
      <div className="details-top-nav">
        <Link to="/browse" className="btn-back">
          <ArrowLeftIcon size={18} />
          <span>Back to listings</span>
        </Link>
      </div>

      {/* Public Profile Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-large">
            {getInitials(user.name)}
          </div>
        </div>

        <div className="profile-details">
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-role">
            {user.department} • {user.year} • {user.college}
          </p>

          {user.bio && <p className="profile-bio">{user.bio}</p>}

          <div className="profile-meta-tags">
            <span className="meta-tag">
              <strong>College Email:</strong> {user.email}
            </span>
            <span className="meta-tag">
              <CalendarIcon size={13} />
              <span>Student since {memberDate}</span>
            </span>
          </div>
        </div>

        <div className="profile-stats-card">
          <div className="stat-box">
            <span className="stat-number">{studentListings.length}</span>
            <span className="stat-label">Active Listings</span>
          </div>
        </div>
      </div>

      {/* Public User's Listings Section */}
      <div className="profile-listings-section">
        <h2 className="title-md" style={{ marginBottom: '24px' }}>
          Listings by {user.name} ({studentListings.length})
        </h2>

        {studentListings.length === 0 ? (
          <EmptyState
            title="No active listings"
            description={`${user.name} currently has no resources listed on CampusFind.`}
            actionText="Browse Campus Marketplace"
            actionLink="/browse"
          />
        ) : (
          <div className="grid-cards">
            {studentListings.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
