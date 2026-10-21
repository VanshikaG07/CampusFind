import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon } from '../components/common/Icons';
import LoadingState from '../components/common/LoadingState';
import { CATEGORIES, CONDITIONS, RESOURCE_TYPES, LOCATIONS } from '../data/resources';
import './ListingForm.css';

export default function EditResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getResource, updateResource, loading: resLoading } = useResources();
  const { user } = useAuth();

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const existing = getResource(id);
    if (existing) {
      // Check authorization in UI
      if (user && existing.user_id !== user.id) {
        alert('You can only edit your own listings.');
        navigate(`/resources/${id}`);
        return;
      }

      setFormData({
        title: existing.title,
        description: existing.description,
        category: existing.category,
        type: existing.type,
        price: existing.price,
        condition: existing.condition,
        location: existing.location,
        image: existing.image,
      });
    }
  }, [id, getResource, user, navigate]);

  if (resLoading || !formData) {
    return <LoadingState message="Loading listing data..." />;
  }

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 4) {
      errs.title = 'Title must be at least 4 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please provide a detailed description';
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errs.price = 'Please enter a valid price in Rupees (₹)';
    }

    if (!formData.location) {
      errs.location = 'Please select a campus handover location';
    }

    if (!formData.image.trim()) {
      errs.image = 'Image is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      await updateResource(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        price: Number(formData.price),
        condition: formData.condition,
        location: formData.location,
        image: formData.image.trim(),
      });

      navigate(`/resources/${id}`);
    } catch (err) {
      alert('Failed to update listing: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container form-page-container fade-in">
      <div className="form-card">
        <button type="button" onClick={() => navigate(-1)} className="btn-back form-back">
          <ArrowLeftIcon size={16} />
          <span>Cancel & Back</span>
        </button>

        <div className="form-header">
          <h1 className="title-md">Edit Listing</h1>
          <p className="form-desc">
            Update your item details, pricing, condition, or handover spot.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">
              Item Title *
            </label>
            <input
              id="edit-title"
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          {/* Type & Category Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-type">
                Listing Type *
              </label>
              <select
                id="edit-type"
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-category">
                Category *
              </label>
              <select
                id="edit-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Condition Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-price">
                Price in INR (₹) * {formData.type === 'For Rent' && '(per day)'}
              </label>
              <input
                id="edit-price"
                type="number"
                className="form-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                min="1"
              />
              {errors.price && <p className="form-error">{errors.price}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-condition">
                Condition *
              </label>
              <select
                id="edit-condition"
                className="form-select"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Campus Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-location">
              Campus Handover Location *
            </label>
            <select
              id="edit-location"
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

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-desc">
              Detailed Description *
            </label>
            <textarea
              id="edit-desc"
              rows="4"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Image Path */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-image">
              Image Path or URL *
            </label>
            <input
              id="edit-image"
              type="text"
              className="form-input"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            {errors.image && <p className="form-error">{errors.image}</p>}
          </div>

          {/* Submit Actions */}
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
              className="btn btn-primary btn-lg"
              disabled={saving}
            >
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
