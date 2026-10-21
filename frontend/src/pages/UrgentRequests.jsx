import React from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import RequestCard from '../components/requests/RequestCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { AlertCircleIcon, PlusIcon } from '../components/common/Icons';
import './UrgentRequests.css';

export default function UrgentRequests() {
  const { requests, loading } = useRequests();

  // Filter only urgent requests
  const urgentRequests = requests.filter((r) => Boolean(r.urgency));
  const openUrgentCount = urgentRequests.filter((r) => r.status !== 'fulfilled').length;

  return (
    <div className="urgent-page container fade-in">
      {/* Urgent Header Banner */}
      <div className="urgent-header-banner">
        <div className="urgent-badge-pill">
          <AlertCircleIcon size={14} />
          <span>Priority Board</span>
        </div>
        <h1 className="title-lg urgent-main-heading">
          Urgent Campus Demands
        </h1>
        <p className="urgent-header-subtext">
          Critical study tools, calculator replacements, record covers, and lab coats required
          by students right away for today's labs, vivas, and exam submissions.
        </p>

        <div className="urgent-action-row">
          <Link to="/requests/create" className="btn btn-urgent btn-sm">
            <PlusIcon size={16} />
            <span>Post an Urgent Request</span>
          </Link>
          <span className="urgent-live-count">
            <strong>{openUrgentCount}</strong> active urgent {openUrgentCount === 1 ? 'demand' : 'demands'} right now
          </span>
        </div>
      </div>

      {/* Grid of Urgent Requests */}
      <div className="urgent-content-section">
        {loading ? (
          <LoadingState message="Loading urgent campus requests..." />
        ) : urgentRequests.length === 0 ? (
          <EmptyState
            title="No urgent requests at the moment"
            description="All urgent student demands have been fulfilled or resolved. Check back soon or post what you need!"
            actionText="Post a Request"
            actionLink="/requests/create"
          />
        ) : (
          <div className="urgent-cards-grid">
            {urgentRequests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
