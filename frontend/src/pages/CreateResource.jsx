import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon } from '../components/common/Icons';
import { CATEGORIES, CONDITIONS, RESOURCE_TYPES, LOCATIONS } from '../data/resources';
import './ListingForm.css';

// Default image map by category
const DEFAULT_CATEGORY_IMAGES = {
  Books: '/listing-images/dsa-book.jpg',
  Electronics: '/listing-images/calculator.jpg',
  Cycles: '/listing-images/mountain-cycle.jpg',
  Stationery: '/listing-images/drawing-kit.jpg',
  Sports: '/listing-images/badminton-racket.jpg',
  'Hostel Items': '/listing-images/electric-kettle.jpg',
};

export default function CreateResource() {
  const navigate = useNavigate();
  const { addResource } = useResources();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Books',
    type: 'For Sale',
    price: '',
    condition: 'Good',
    location: 'CSE Department',
    image: DEFAULT_CATEGORY_IMAGES['Books'],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setFormData((prev) => ({
      ...prev,
      category: newCat,
      image: DEFAULT_CATEGORY_IMAGES[newCat] || prev.image,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length < 4) {
      errs.title = 'Title must be at least 4 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Please provide a detailed description';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Description should be at least 10 characters';
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
      setSubmitting(true);
      const newListing = await addResource({
        user_id: user ? user.id : 1,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        price: Number(formData.price),
        condition: formData.condition,
        location: formData.location,
        image: formData.image.trim(),
      });

      // Immediate navigation to the created listing!
      navigate(`/resources/${newListing.id}`);
    } catch (err) {
      alert('Error creating listing: ' + err.message);
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
          <h1 className="title-md">Post a New Campus Listing</h1>
          <p className="form-desc">
            Share or sell an item with students across Delhi Skill and Entrepreneurship University.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Item Title <span className="required-star">*</span>
            </label>
            <input
              id="title"
              type="text"
              className="form-input"
              placeholder="e.g. Casio fx-991ES Plus Scientific Calculator"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          {/* Type & Category Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="type">
                Listing Type <span className="required-star">*</span>
              </label>
              <select
                id="type"
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
              <label className="form-label" htmlFor="category">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="category"
                className="form-select"
                value={formData.category}
                onChange={handleCategoryChange}
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
              <label className="form-label" htmlFor="price">
                Price in INR (₹) <span className="required-star">*</span> {formData.type === 'For Rent' && '(per day)'}
              </label>
              <input
                id="price"
                type="number"
                className="form-input"
                placeholder={formData.type === 'For Rent' ? 'e.g. 50' : 'e.g. 450'}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                min="1"
              />
              {errors.price && <p className="form-error">{errors.price}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="condition">
                Condition <span className="required-star">*</span>
              </label>
              <select
                id="condition"
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
            <label className="form-label" htmlFor="location">
              Campus Handover Location <span className="required-star">*</span>
            </label>
            <select
              id="location"
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
            <label className="form-label" htmlFor="description">
              Detailed Description <span className="required-star">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              className="form-textarea"
              placeholder="Describe the condition, semester used, reason for selling, what's included..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          {/* Image Path / URL & Preview */}
          <div className="form-group">
            <label className="form-label" htmlFor="image">
              Image Path or URL <span className="required-star">*</span>
            </label>
            <input
              id="image"
              type="text"
              className="form-input"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/listing-images/... or image URL"
            />
            <span className="form-help-text">
              Auto-filled from public/listing-images. You can also drop any picture in public/listing-images and use its filename here.
            </span>
            {errors.image && <p className="form-error">{errors.image}</p>}

            {formData.image && (
              <div className="image-preview-strip">
                <img
                  src={formData.image}
                  alt="Listing preview"
                  className="image-preview-thumb"
                  onError={(e) => {
                    e.target.src = '/listing-images/dsa-book.jpg';
                  }}
                />
                <span className="image-preview-label">Image Preview</span>
              </div>
            )}
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
              disabled={submitting}
            >
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
