import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, AlertCircleIcon } from '../components/common/Icons';
import { CATEGORIES, LOCATIONS } from '../data/resources';
import './ListingForm.css';

export default function CreateRequest() {
  const navigate = useNavigate();
  const { addRequest } = useRequests();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Books',
    location: 'CSE Department',
    urgency: false,
    needed_by: '',
    budget: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      errs.title = 'Title should be at least 5 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please describe what you need';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Please provide more details (at least 10 chars)';
    }

    if (!formData.location) {
      errs.location = 'Please select your campus location';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const newReq = await addRequest({
        user_id: user ? user.id : 1,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        location: formData.location,
        urgency: formData.urgency,
        needed_by: formData.needed_by || '',
        budget: formData.budget ? Number(formData.budget) : 0,
      });

      // Immediate navigation to request details
      navigate(`/requests/${newReq.id}`);
    } catch (err) {
      alert('Error creating request: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container form-page-container fade-in">
      <div className="form-card">
        <button type="button" onClick={() => navigate(-1)} className="btn-back form-back">
          <ArrowLeftIcon size={16} />
          <span>Back</span>
        </button>

        <div className="form-header">
          <h1 className="title-md">Post a Campus Request</h1>
          <p className="form-desc">
            Ask fellow students for course books, calculators, lab coats, or equipment you need.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="req-title">
              What do you need? <span className="required-star">*</span>
            </label>
            <input
              id="req-title"
              type="text"
              className="form-input"
              placeholder="e.g. Need Casio fx-991ES Calculator for Tomorrow's Exam"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          {/* Category & Campus Location */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="req-category">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="req-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="req-location">
                Your Preferred Handover Location <span className="required-star">*</span>
              </label>
              <select
                id="req-location"
                className="form-select"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && <p className="form-error">{errors.location}</p>}
            </div>
          </div>

          {/* Needed By Date & Budget Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="req-date">
                Needed By (Optional)
              </label>
              <input
                id="req-date"
                type="date"
                className="form-input"
                value={formData.needed_by}
                onChange={(e) => setFormData({ ...formData, needed_by: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="req-budget">
                Budget in ₹ (Optional, 0 if borrow)
              </label>
              <input
                id="req-budget"
                type="number"
                className="form-input"
                placeholder="e.g. 200 (or leave blank)"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                min="0"
              />
            </div>
          </div>

          {/* Urgency Checkbox Box */}
          <div className={`form-urgency-box ${formData.urgency ? 'active' : ''}`}>
            <label className="urgency-toggle-label">
              <input
                type="checkbox"
                checked={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.checked })}
              />
              <div>
                <strong className={`urgency-title-text ${formData.urgency ? 'active' : ''}`}>
                  <AlertCircleIcon size={16} />
                  Mark as Urgent Request
                </strong>
                <span className="urgency-desc-text">
                  Check if needed within 24 hours for a viva, practical submission, or university exam.
                </span>
              </div>
            </label>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="req-desc">
              Description & Details <span className="required-star">*</span>
            </label>
            <textarea
              id="req-desc"
              rows="4"
              className="form-textarea"
              placeholder="Why you need it, which department/year, when you can return it, contact note..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Submit Row */}
          <div className="form-submit-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-lg ${formData.urgency ? 'btn-urgent' : 'btn-primary'}`}
              disabled={submitting}
            >
              {submitting ? 'Posting...' : formData.urgency ? 'Post Urgent Request' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
