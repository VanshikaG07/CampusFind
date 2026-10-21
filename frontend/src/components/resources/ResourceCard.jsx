import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LocationIcon, ArrowRightIcon, CategoryIcons, SearchIcon } from '../common/Icons';
import './ResourceCard.css';

const CATEGORY_DEFAULT_IMAGES = {
  Books: '/listing-images/dsa-book.jpg',
  Electronics: '/listing-images/Casio fx-991ES Plus Scientific Calculator.webp',
  Cycles: '/listing-images/Hero Sprint 26T Mountain Cycle.webp',
  Stationery: '/listing-images/Staedtler Drawing Kit.jpeg',
  Sports: '/listing-images/Yonex Badminton Racket Pair.jpeg',
  'Hostel Items': '/listing-images/Electric Kettle (Prestige, 1.5L).webp',
};

export default function ResourceCard({ resource }) {
  const [imgError, setImgError] = useState(false);

  if (!resource) return null;

  const isRent = resource.type === 'For Rent';
  const priceDisplay = isRent ? `₹${resource.price}/day` : `₹${resource.price}`;
  const cardImage = (!imgError && resource.image)
    ? resource.image
    : (CATEGORY_DEFAULT_IMAGES[resource.category] || '/listing-images/dsa-book.jpg');

  return (
    <div className="card resource-card">
      <Link to={`/resources/${resource.id}`} className="resource-card-media">
        <img
          src={cardImage}
          alt={resource.title}
          className="resource-card-image"
          onError={() => {
            if (!imgError) setImgError(true);
          }}
          loading="lazy"
        />

        <div className="resource-card-badges">
          <span className={`badge ${isRent ? 'badge-rent' : 'badge-sale'}`}>
            {resource.type}
          </span>
          <span className="badge badge-condition">
            {resource.condition}
          </span>
        </div>
      </Link>

      <div className="resource-card-body">
        <div className="resource-card-meta">
          <span className="resource-category-tag">{resource.category}</span>
          <span className="resource-location">
            <LocationIcon size={13} />
            <span className="truncate">{resource.location}</span>
          </span>
        </div>

        <h3 className="resource-card-title">
          <Link to={`/resources/${resource.id}`} title={resource.title}>
            {resource.title}
          </Link>
        </h3>

        <div className="resource-card-footer">
          <div className="resource-price-block">
            <span className="price-amount">{priceDisplay}</span>
            {isRent && <span className="price-term">campus rental</span>}
          </div>

          <Link
            to={`/resources/${resource.id}`}
            className="btn btn-secondary btn-sm view-card-btn"
            aria-label={`View details of ${resource.title}`}
          >
            <span>View</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
