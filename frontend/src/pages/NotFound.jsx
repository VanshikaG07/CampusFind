import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from '../components/common/Icons';

export default function NotFound() {
  return (
    <div className="container fade-in" style={{
      textAlign: 'center',
      padding: '96px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px'
      }}>
        <SearchIcon size={36} />
      </div>
      <h1 className="title-lg" style={{ color: '#064e3b' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '440px', lineHeight: '1.6' }}>
        The campus resource, request, or page you were looking for doesn't exist or has moved.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
        <Link to="/browse" className="btn btn-secondary">
          Browse Resources
        </Link>
      </div>
    </div>
  );
}
