import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from './Icons';
import './EmptyState.css';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText,
  actionLink,
  onAction,
  icon,
}) {
  return (
    <div className="empty-state-card fade-in">
      <div className="empty-icon-wrap">
        {icon || <SearchIcon size={32} />}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm empty-btn">
          {actionText}
        </Link>
      )}
      {actionText && onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary btn-sm empty-btn">
          {actionText}
        </button>
      )}
    </div>
  );
}
