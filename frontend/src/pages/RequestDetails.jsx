import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import {
  ArrowLeftIcon,
  LocationIcon,
  CalendarIcon,
  AlertCircleIcon,
  CheckIcon,
  HandshakeIcon,
  TrashIcon
} from '../components/common/Icons';
import LoadingState from '../components/common/LoadingState';
import Modal from '../components/common/Modal';
import { getInitials } from '../data/users';
import './RequestDetails.css';

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getRequest, offerHelp, removeRequest, loading: reqLoading } = useRequests();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [requester, setRequester] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [helping, setHelping] = useState(false);
  const [helpSuccess, setHelpSuccess] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const item = getRequest(id);
    setRequest(item);

    if (item && item.user_id) {
      setLoadingUser(true);
      userService.getUser(item.user_id).then((u) => {
        setRequester(u);
        setLoadingUser(false);
      });
    } else {
      setLoadingUser(false);
    }
  }, [id, getRequest]);

  if (reqLoading) {
    return <LoadingState message="Loading request details..." />;
  }

  if (!request) {
    return (
      <div className="container details-not-found fade-in">
        <h2 className="title-md">Request Not Found</h2>
        <p>This campus request might have been fulfilled or removed.</p>
        <Link to="/requests" className="btn btn-primary btn-sm">
          <ArrowLeftIcon size={16} />
          <span>Back to Request Board</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === request.user_id;
  const isUrgent = Boolean(request.urgency);
  const isFulfilled = request.status === 'fulfilled';
  const hasOffered = (request.helpers || []).includes(user?.id);

  const handleCanHelp = async () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Please log in with your college account to offer help on this request.',
        },
      });
      return;
    }
    try {
      setHelping(true);
      const updated = await offerHelp(request.id, user.id);
      setRequest(updated);
      setHelpSuccess(true);
    } catch {
      alert('Could not record help offer.');
    } finally {
      setHelping(false);
    }
  };

  const handleDelete = async () => {
    try {
      await removeRequest(request.id);
      setDeleteModalOpen(false);
      navigate('/requests');
    } catch {
      alert('Could not delete request.');
    }
  };

  const formattedDate = new Date(request.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container request-details-page fade-in">
      <div className="details-top-nav">
        <button type="button" onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeftIcon size={16} />
          <span>Back to requests</span>
        </button>

        {isOwner && (
          <div className="owner-action-bar">
            <span className="owner-pill">Your Request</span>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setDeleteModalOpen(true)}
            >
              <TrashIcon size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      <div className="request-details-card">
        {/* Urgent Banner if urgent */}
        {isUrgent && (
          <div className="request-urgent-banner">
            <AlertCircleIcon size={18} />
            <div>
              <strong>High Urgency Campus Need</strong>
              <p>The student requires this item urgently for an exam, viva, or submission today.</p>
            </div>
          </div>
        )}

        <div className="request-body-wrap">
          <div className="request-main-col">
            <div className="request-badge-row">
              <span className="badge badge-category">{request.category}</span>
              <span className={`badge ${isFulfilled ? 'badge-fulfilled' : 'badge-sale'}`}>
                {isFulfilled ? 'Fulfilled / Closed' : 'Open / Active'}
              </span>
              {request.budget > 0 && (
                <span className="badge badge-rent">
                  Offering: ₹{request.budget}
                </span>
              )}
            </div>

            <h1 className="request-view-title">{request.title}</h1>

            <div className="request-info-specs">
              <div className="spec-item">
                <LocationIcon size={15} />
                <span><strong>Campus Location:</strong> {request.location}</span>
              </div>
              <div className="spec-item">
                <CalendarIcon size={15} />
                <span><strong>Requested on:</strong> {formattedDate}</span>
              </div>
              {request.needed_by && (
                <div className="spec-item">
                  <CalendarIcon size={15} />
                  <span><strong>Needed By:</strong> {request.needed_by}</span>
                </div>
              )}
            </div>

            <div className="request-desc-section">
              <h3 className="section-subheading">Requirement Details</h3>
              <p className="request-desc-text">{request.description}</p>
            </div>

            {/* Helper response status */}
            {hasOffered || helpSuccess ? (
              <div className="help-offered-banner fade-in">
                <CheckIcon size={20} />
                <div>
                  <strong>Help Offered!</strong>
                  <p>The student has been notified with your contact details for campus handover.</p>
                </div>
              </div>
            ) : !isOwner && !isFulfilled && (
              <div className="help-action-box">
                <button
                  type="button"
                  className={`btn btn-lg ${isUrgent ? 'btn-urgent' : 'btn-primary'}`}
                  onClick={handleCanHelp}
                  disabled={helping}
                >
                  <HandshakeIcon size={18} />
                  <span>{helping ? 'Submitting...' : user ? 'I Can Help With This' : 'Log In to Help'}</span>
                </button>
                <p className="help-action-note">
                  {user
                    ? 'Clicking connects you with the student for quick peer handover.'
                    : 'Log in with your DSEU student account to offer assistance.'}
                </p>
              </div>
            )}
          </div>

          {/* Requester Column */}
          <div className="request-side-col">
            <div className="requester-card">
              <h3 className="section-subheading">Requested By</h3>
              {loadingUser ? (
                <p>Loading requester...</p>
              ) : requester ? (
                <div className="requester-info">
                  <div className="requester-avatar">
                    {getInitials(requester.name)}
                  </div>
                  <h4 className="requester-name">
                    <Link to={`/profile/${requester.id}`}>{requester.name}</Link>
                  </h4>
                  <p className="requester-dept">
                    {requester.department} • {requester.year}
                  </p>
                  <p className="requester-college">{requester.college}</p>

                  <div className="requester-contact-info">
                    <p><strong>Email:</strong> {requester.email}</p>
                    {requester.phone && <p><strong>Phone:</strong> {requester.phone}</p>}
                  </div>
                </div>
              ) : (
                <p>Campus student</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Request"
      >
        <p className="modal-info-text">
          Are you sure you want to remove this request from the campus board?
        </p>
        <div className="modal-footer-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete Request
          </button>
        </div>
      </Modal>
    </div>
  );
}
