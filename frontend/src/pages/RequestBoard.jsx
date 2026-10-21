import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import RequestCard from '../components/requests/RequestCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { SearchIcon, PlusIcon, AlertCircleIcon } from '../components/common/Icons';
import { CATEGORIES } from '../data/resources';
import './RequestBoard.css';

export default function RequestBoard() {
  const { requests, loading } = useRequests();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All'); // 'All', 'Urgent', 'Normal'
  const [statusFilter, setStatusFilter] = useState('open'); // 'all', 'open', 'fulfilled'

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

    if (category !== 'All') {
      result = result.filter((r) => r.category === category);
    }

    if (urgencyFilter === 'Urgent') {
      result = result.filter((r) => Boolean(r.urgency));
    } else if (urgencyFilter === 'Normal') {
      result = result.filter((r) => !r.urgency);
    }

    if (statusFilter !== 'all') {
      result = result.filter((r) => r.status === statusFilter);
    }

    return result;
  }, [requests, search, category, urgencyFilter, statusFilter]);

  const urgentCount = requests.filter((r) => r.urgency && r.status !== 'fulfilled').length;

  return (
    <div className="requests-page container fade-in">
      {/* Header */}
      <div className="requests-header">
        <div>
          <div className="requests-pill">
            <span>Student Request Board</span>
          </div>
          <h1 className="title-lg">Campus Demand & Needs</h1>
          <p className="requests-header-desc">
            Can't find what you need on the marketplace? Post a request or help out a fellow student.
          </p>
        </div>

        <div className="requests-header-actions">
          <Link to="/urgent" className="btn btn-secondary btn-sm urgent-shortcut-btn">
            <AlertCircleIcon size={16} />
            <span>Urgent Needs ({urgentCount})</span>
          </Link>
          <Link to="/requests/create" className="btn btn-primary btn-sm">
            <PlusIcon size={16} />
            <span>Post a Request</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="requests-filter-bar">
        <div className="request-search-wrap">
          <SearchIcon size={18} />
          <input
            type="text"
            placeholder="Search student requests by title, book, course, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="request-search-input"
          />
        </div>

        <div className="request-filters-row">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select filter-compact"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="form-select filter-compact"
          >
            <option value="All">All Urgency</option>
            <option value="Urgent">Urgent Only</option>
            <option value="Normal">Standard</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select filter-compact"
          >
            <option value="open">Active / Open</option>
            <option value="all">All Statuses</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <LoadingState message="Loading campus requests..." />
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          title="No requests match your filters"
          description="Try broadening your category or search terms, or post a new request yourself."
          actionText="Post a Request"
          actionLink="/requests/create"
        />
      ) : (
        <div className="requests-cards-grid">
          {filteredRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  );
}
