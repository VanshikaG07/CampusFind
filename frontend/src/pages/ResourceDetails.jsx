import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import {
  ArrowLeftIcon,
  LocationIcon,
  CalendarIcon,
  MessageSquareIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  CategoryIcons,
  SearchIcon
} from '../components/common/Icons';
import Modal from '../components/common/Modal';
import LoadingState from '../components/common/LoadingState';
import { getInitials } from '../data/users';
import './ResourceDetails.css';

export default function ResourceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getResource, removeResource, loading: resLoading } = useResources();
  const { user, isAuthenticated } = useAuth();

  const [resource, setResource] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactMessage, setContactMessage] = useState(
    'Hi, I am interested in your listing on CampusFind. Can we meet on campus?'
  );

  useEffect(() => {
    const item = getResource(id);
    setResource(item);

    if (item && item.user_id) {
      setLoadingSeller(true);
      userService.getUser(item.user_id).then((u) => {
        setSeller(u);
        setLoadingSeller(false);
      });
    } else {
      setLoadingSeller(false);
    }
  }, [id, getResource]);

  if (resLoading) {
    return <LoadingState message="Loading resource details..." />;
  }

  if (!resource) {
    return (
      <div className="container details-not-found fade-in">
        <h2 className="title-md">Listing Not Found</h2>
        <p>The campus listing you are looking for may have been removed or sold.</p>
        <Link to="/browse" className="btn btn-primary btn-sm">
          <ArrowLeftIcon size={16} />
          <span>Back to Browse</span>
        </Link>
      </div>
    );
  }

  const isOwner = user && user.id === resource.user_id;
  const isRent = resource.type === 'For Rent';
  const priceDisplay = isRent ? `₹${resource.price}/day` : `₹${resource.price}`;
  const IconComponent = CategoryIcons[resource.category] || SearchIcon;

  const handleDelete = async () => {
    try {
      await removeResource(resource.id);
      setDeleteModalOpen(false);
      navigate('/profile');
    } catch {
      alert('Could not delete listing. Please try again.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactModalOpen(false);
    }, 2000);
  };

  const formattedDate = new Date(resource.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="resource-details-page container fade-in">
      {/* Back Link */}
      <div className="details-top-nav">
        <button type="button" onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeftIcon size={16} />
          <span>Back to listings</span>
        </button>

        {isOwner && (
          <div className="owner-action-bar">
            <span className="owner-pill">You own this listing</span>
            <Link to={`/resources/${resource.id}/edit`} className="btn btn-secondary btn-sm">
              <EditIcon size={14} />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="btn btn-danger btn-sm"
            >
              <TrashIcon size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="details-grid">
        {/* Left Column: Image with Fallback */}
        <div className="details-media-col">
          <div className="details-image-card">
            <img
              src={(!imgError && resource.image) ? resource.image : (
                resource.category === 'Books' ? '/listing-images/dsa-book.jpg' :
                resource.category === 'Electronics' ? '/listing-images/Casio fx-991ES Plus Scientific Calculator.webp' :
                resource.category === 'Cycles' ? '/listing-images/Hero Sprint 26T Mountain Cycle.webp' :
                resource.category === 'Stationery' ? '/listing-images/Staedtler Drawing Kit.jpeg' :
                resource.category === 'Sports' ? '/listing-images/Yonex Badminton Racket Pair.jpeg' :
                '/listing-images/Electric Kettle (Prestige, 1.5L).webp'
              )}
              alt={resource.title}
              className="details-main-img"
              onError={() => {
                if (!imgError) setImgError(true);
              }}
            />

            <div className="details-media-badges">
              <span className={`badge ${isRent ? 'badge-rent' : 'badge-sale'}`}>
                {resource.type}
              </span>
              <span className="badge badge-condition">
                Condition: {resource.condition}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="details-info-col">
          <div className="details-meta-row">
            <span className="badge badge-category">{resource.category}</span>
            <span className="listing-status-tag">
              Status: <strong>{resource.status}</strong>
            </span>
          </div>

          <h1 className="details-title">{resource.title}</h1>

          <div className="details-price-row">
            <span className="details-price">{priceDisplay}</span>
            {isRent && <span className="details-price-note">Campus rental rate</span>}
          </div>

          <div className="details-spec-list">
            <div className="spec-item">
              <LocationIcon size={15} />
              <span><strong>Pickup Location:</strong> {resource.location}</span>
            </div>
            <div className="spec-item">
              <CalendarIcon size={15} />
              <span><strong>Listed on:</strong> {formattedDate}</span>
            </div>
          </div>

          <div className="details-section">
            <h3 className="section-subheading">Description</h3>
            <p className="details-description-text">{resource.description}</p>
          </div>

          {/* Seller Profile Card */}
          <div className="seller-card">
            <h3 className="section-subheading">Student Seller</h3>
            {loadingSeller ? (
              <p className="seller-loading">Loading student seller details...</p>
            ) : seller ? (
              <div className="seller-info-content">
                <div className="seller-avatar">
                  {getInitials(seller.name)}
                </div>
                <div className="seller-meta">
                  <Link to={`/profile/${seller.id}`} className="seller-name">
                    {seller.name}
                  </Link>
                  <p className="seller-dept">
                    {seller.department} • {seller.year}
                  </p>
                  <p className="seller-college">{seller.college}</p>
                </div>
              </div>
            ) : (
              <p className="seller-unknown">College student seller</p>
            )}
          </div>

          {/* Primary Action Button - Differentiated by Auth State */}
          <div className="details-actions">
            {isOwner ? (
              <Link to={`/resources/${resource.id}/edit`} className="btn btn-primary btn-lg w-full">
                <EditIcon size={18} />
                <span>Edit Your Listing</span>
              </Link>
            ) : isAuthenticated && user ? (
              <button
                type="button"
                className="btn btn-primary btn-lg w-full"
                onClick={() => setContactModalOpen(true)}
              >
                <MessageSquareIcon size={18} />
                <span>{isRent ? 'Request to Rent' : 'Contact Student Seller'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                state={{
                  from: location.pathname,
                  message: 'Please log in with your college account to message the seller or request rent.',
                }}
                className="btn btn-primary btn-lg w-full"
              >
                <MessageSquareIcon size={18} />
                <span>{isRent ? 'Log In to Rent' : 'Log In to Contact Seller'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={isRent ? `Rent: ${resource.title}` : `Contact: ${seller?.name || 'Seller'}`}
      >
        {contactSuccess ? (
          <div className="modal-success-state fade-in">
            <div className="success-icon-wrap">
              <CheckIcon size={24} />
            </div>
            <h4>Message Sent!</h4>
            <p>
              Your contact request and college email have been shared with {seller?.name}.
              You can connect directly on campus for handover.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="contact-form">
            <p className="modal-info-text">
              Direct peer handover on campus. Meet at <strong>{resource.location}</strong> to inspect
              the item and complete payment.
            </p>

            <div className="form-group">
              <label className="form-label">Your Message</label>
              <textarea
                rows="4"
                className="form-textarea"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
              />
            </div>

            <div className="seller-contact-preview">
              <p><strong>Seller Email:</strong> {seller?.email}</p>
              {seller?.phone && <p><strong>Phone / WhatsApp:</strong> {seller.phone}</p>}
            </div>

            <div className="modal-footer-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setContactModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Listing"
      >
        <p className="modal-info-text">
          Are you sure you want to delete <strong>"{resource.title}"</strong>? This will permanently
          remove it from the campus marketplace.
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
            Yes, Delete Listing
          </button>
        </div>
      </Modal>
    </div>
  );
}
