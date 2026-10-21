import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import { LocationIcon, CalendarIcon, AlertCircleIcon, CheckIcon, HandshakeIcon } from '../common/Icons';
import './RequestCard.css';

export default function RequestCard({ request }) {
  const { user } = useAuth();
  const { offerHelp } = useRequests();
  const [helping, setHelping] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!request) return null;

  const isUrgent = Boolean(request.urgency);
  const isFulfilled = request.status === 'fulfilled';
  const hasOffered = (request.helpers || []).includes(user?.id);

  const handleCanHelp = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Please log in with your student account to offer help on campus requests.',
        },
      });
      return;
    }
    if (hasOffered || isFulfilled || helping) return;

    try {
      setHelping(true);
      await offerHelp(request.id, user.id);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch {
      // handled
    } finally {
      setHelping(false);
    }
  };

  const formattedDate = new Date(request.created_at).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`card request-card ${isUrgent ? 'urgent-border' : ''} ${isFulfilled ? 'fulfilled-card' : ''}`}>
      <div className="request-card-header">
        <div className="request-header-left">
          {isUrgent && (
            <span className="badge badge-urgent">
              <AlertCircleIcon size={12} />
              Urgent
            </span>
          )}
          <span className="badge badge-category">{request.category}</span>
          {isFulfilled && <span className="badge badge-fulfilled">Fulfilled</span>}
        </div>
        <span className="request-date">{formattedDate}</span>
      </div>

      <h3 className="request-card-title">
        <Link to={`/requests/${request.id}`}>{request.title}</Link>
      </h3>

      <p className="request-card-desc">{request.description}</p>

      <div className="request-card-meta">
        <div className="meta-item">
          <LocationIcon size={14} />
          <span>{request.location}</span>
        </div>
        {request.needed_by && (
          <div className="meta-item">
            <CalendarIcon size={14} />
            <span>Needed by: {request.needed_by}</span>
          </div>
        )}
      </div>

      <div className="request-card-actions">
        <Link to={`/requests/${request.id}`} className="btn btn-secondary btn-sm">
          Details
        </Link>

        {isFulfilled ? (
          <span className="request-fulfilled-label">Request Closed</span>
        ) : hasOffered || successMsg ? (
          <button type="button" className="btn btn-sm btn-helped" disabled>
            <CheckIcon size={14} />
            <span>Help Offered</span>
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-sm ${isUrgent ? 'btn-urgent' : 'btn-primary'}`}
            onClick={handleCanHelp}
            disabled={helping}
          >
            <HandshakeIcon size={15} />
            <span>{helping ? 'Connecting...' : 'I Can Help'}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="help-toast fade-in">
          Thanks! We notified the student that you can help.
        </div>
      )}
    </div>
  );
}
