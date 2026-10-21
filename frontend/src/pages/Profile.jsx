import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useResources } from '../context/ResourceContext';
import { useRequests } from '../context/RequestContext';
import ResourceCard from '../components/resources/ResourceCard';
import RequestCard from '../components/requests/RequestCard';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import {
  UserIcon,
  CalendarIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  LocationIcon,
  CheckIcon
} from '../components/common/Icons';
import { getInitials } from '../data/users';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const { resources, removeResource } = useResources();
  const { requests, removeRequest } = useRequests();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'requests'
  const [deleteItem, setDeleteItem] = useState(null); // { type: 'resource' | 'request', id, title }
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || '',
    bio: user?.bio || '',
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="container profile-not-logged fade-in">
        <h2 className="title-md">Sign In to View Profile</h2>
        <p>Please log in with your college account to view your campus activity and manage listings.</p>
        <Link to="/login" className="btn btn-primary">
          Log In
        </Link>
      </div>
    );
  }

  // User's own listings and requests
  const myListings = resources.filter((r) => r.user_id === user.id);
  const myRequests = requests.filter((r) => r.user_id === user.id);

  const confirmDelete = async () => {
    if (!deleteItem) return;
    if (deleteItem.type === 'resource') {
      await removeResource(deleteItem.id);
    } else {
      await removeRequest(deleteItem.id);
    }
    setDeleteItem(null);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile(profileForm);
    setEditProfileOpen(false);
  };

  const memberDate = new Date(user.member_since || '2025-08-01').toLocaleDateString('en-IN', {
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="profile-page container fade-in">
      {/* Profile Overview Card */}
      <div className="profile-hero-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar-large">
            {getInitials(user.name)}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-name-row">
            <h1 className="profile-name">{user.name}</h1>
            <button
              type="button"
              className="btn btn-secondary btn-sm edit-profile-btn"
              onClick={() => {
                setProfileForm({
                  name: user.name,
                  phone: user.phone || '',
                  department: user.department || '',
                  year: user.year || '',
                  bio: user.bio || '',
                });
                setEditProfileOpen(true);
              }}
            >
              <EditIcon size={14} />
              <span>Edit Profile</span>
            </button>
          </div>

          <p className="profile-role">
            {user.department} • {user.year} • {user.college || 'Delhi Skill and Entrepreneurship University'}
          </p>

          {user.bio && <p className="profile-bio">{user.bio}</p>}

          <div className="profile-meta-tags">
            <span className="meta-tag">
              <strong>College Email:</strong> {user.email}
            </span>
            {user.phone && (
              <span className="meta-tag">
                <strong>Phone / WhatsApp:</strong> {user.phone}
              </span>
            )}
            <span className="meta-tag">
              <CalendarIcon size={13} />
              <span>Joined {memberDate}</span>
            </span>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="profile-stats-card">
          <div className="stat-box">
            <span className="stat-number">{myListings.length}</span>
            <span className="stat-label">Active Listings</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-number">{myRequests.length}</span>
            <span className="stat-label">Campus Requests</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="profile-tabs-bar">
        <div className="profile-tabs">
          <button
            type="button"
            className={`profile-tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings ({myListings.length})
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            My Requests ({myRequests.length})
          </button>
        </div>

        <div className="tab-action-btns">
          {activeTab === 'listings' ? (
            <Link to="/create-resource" className="btn btn-primary btn-sm">
              <PlusIcon size={16} />
              <span>New Listing</span>
            </Link>
          ) : (
            <Link to="/requests/create" className="btn btn-primary btn-sm">
              <PlusIcon size={16} />
              <span>New Request</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tab Content: Listings */}
      {activeTab === 'listings' && (
        <div className="profile-tab-content">
          {myListings.length === 0 ? (
            <EmptyState
              title="You haven't listed any items yet"
              description="Sell your old books, scientific calculator, cycle, or hostel items to junior students on campus."
              actionText="Post Your First Listing"
              actionLink="/create-resource"
            />
          ) : (
            <div className="my-items-grid">
              {myListings.map((res) => (
                <div key={res.id} className="my-listing-wrapper card">
                  <ResourceCard resource={res} />
                  <div className="my-item-actions">
                    <Link
                      to={`/resources/${res.id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      <EditIcon size={14} />
                      <span>Edit</span>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        setDeleteItem({
                          type: 'resource',
                          id: res.id,
                          title: res.title,
                        })
                      }
                    >
                      <TrashIcon size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Requests */}
      {activeTab === 'requests' && (
        <div className="profile-tab-content">
          {myRequests.length === 0 ? (
            <EmptyState
              title="You have no active requests"
              description="Looking for a specific subject book, practical cover, or lab equipment? Post a campus request."
              actionText="Post a Request"
              actionLink="/requests/create"
            />
          ) : (
            <div className="my-items-grid">
              {myRequests.map((req) => (
                <div key={req.id} className="my-request-wrapper card">
                  <RequestCard request={req} />
                  <div className="my-item-actions">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        setDeleteItem({
                          type: 'request',
                          id: req.id,
                          title: req.title,
                        })
                      }
                    >
                      <TrashIcon size={14} />
                      <span>Delete Request</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        title={`Delete ${deleteItem?.type === 'resource' ? 'Listing' : 'Request'}`}
      >
        <p className="modal-info-text">
          Are you sure you want to delete <strong>"{deleteItem?.title}"</strong>? This will permanently
          remove it from CampusFind.
        </p>
        <div className="modal-footer-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteItem(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={confirmDelete}
          >
            Confirm Delete
          </button>
        </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select
                className="form-select"
                value={profileForm.year}
                onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone / WhatsApp</label>
            <input
              type="tel"
              className="form-input"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            />
          </div>

          <div className="modal-footer-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditProfileOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
