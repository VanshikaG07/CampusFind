import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useResources } from '../context/ResourceContext';
import ResourceCard from '../components/resources/ResourceCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { SearchIcon, FilterIcon, CloseIcon } from '../components/common/Icons';
import { CATEGORIES, CONDITIONS, RESOURCE_TYPES, LOCATIONS } from '../data/resources';
import './Browse.css';

export default function Browse() {
  const { resources, loading } = useResources();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial params
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialType = searchParams.get('type') || 'All';

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState(initialType);
  const [condition, setCondition] = useState('All');
  const [location, setLocation] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [priceMax, setPriceMax] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync when search params change
  React.useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search') || '');
    if (searchParams.get('category') !== null) setCategory(searchParams.get('category') || 'All');
    if (searchParams.get('type') !== null) setType(searchParams.get('type') || 'All');
  }, [searchParams]);

  const clearAllFilters = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setCondition('All');
    setLocation('All');
    setSortBy('newest');
    setPriceMax('');
    setSearchParams({});
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'All' ||
    type !== 'All' ||
    condition !== 'All' ||
    location !== 'All' ||
    priceMax !== '' ||
    sortBy !== 'newest';

  // Filtered and sorted resources
  const filteredResources = useMemo(() => {
    let result = [...resources];

    // Search query
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

    // Category
    if (category !== 'All') {
      result = result.filter((r) => r.category === category);
    }

    // Type
    if (type !== 'All') {
      result = result.filter((r) => r.type === type);
    }

    // Condition
    if (condition !== 'All') {
      result = result.filter((r) => r.condition === condition);
    }

    // Location
    if (location !== 'All') {
      result = result.filter((r) => r.location === location);
    }

    // Max Price
    if (priceMax && !isNaN(Number(priceMax))) {
      result = result.filter((r) => r.price <= Number(priceMax));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // newest
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }, [resources, search, category, type, condition, location, priceMax, sortBy]);

  return (
    <div className="browse-page container fade-in">
      {/* Header */}
      <div className="browse-header">
        <div>
          <h1 className="title-lg">Browse Campus Resources</h1>
          <p className="browse-header-desc">
            Find course books, lab items, cycles, and electronics from fellow students.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm mobile-filter-btn"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        >
          <FilterIcon size={16} />
          <span>Filters {hasActiveFilters && '•'}</span>
        </button>
      </div>

      {/* Main Browse Layout */}
      <div className="browse-layout">
        {/* Sidebar Filters */}
        <aside className={`browse-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h3 className="sidebar-title">
              <FilterIcon size={18} />
              <span>Filters</span>
            </h3>
            {hasActiveFilters && (
              <button type="button" onClick={clearAllFilters} className="clear-btn">
                Clear all
              </button>
            )}
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setMobileFilterOpen(false)}
            >
              <CloseIcon size={20} />
            </button>
          </div>

          {/* Search Field */}
          <div className="filter-group">
            <label className="filter-label">Keyword Search</label>
            <div className="sidebar-search-box">
              <SearchIcon size={16} />
              <input
                type="text"
                placeholder="Title, author, keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="sidebar-search-input"
              />
            </div>
          </div>

          {/* Listing Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Listing Type</label>
            <div className="filter-pills">
              <button
                type="button"
                className={`filter-pill ${type === 'All' ? 'active' : ''}`}
                onClick={() => setType('All')}
              >
                All
              </button>
              {RESOURCE_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`filter-pill ${type === t ? 'active' : ''}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select filter-select"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="filter-group">
            <label className="filter-label">Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="form-select filter-select"
            >
              <option value="All">Any Condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          {/* Campus Location Filter */}
          <div className="filter-group">
            <label className="filter-label">Campus Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-select filter-select"
            >
              <option value="All">All Campus Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Max Price Filter */}
          <div className="filter-group">
            <label className="filter-label">Max Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              className="form-input filter-input"
              min="0"
            />
          </div>

          {/* Apply on Mobile */}
          <button
            type="button"
            className="btn btn-primary w-full mobile-apply-btn"
            onClick={() => setMobileFilterOpen(false)}
          >
            Show {filteredResources.length} Results
          </button>
        </aside>

        {/* Content Area */}
        <main className="browse-main">
          {/* Top Bar: Count & Sort */}
          <div className="browse-toolbar">
            <span className="results-count">
              Showing <strong>{filteredResources.length}</strong> {filteredResources.length === 1 ? 'item' : 'items'}
              {category !== 'All' && ` in ${category}`}
              {type !== 'All' && ` (${type})`}
            </span>

            <div className="sort-wrapper">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select sort-select"
              >
                <option value="newest">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Grid / States */}
          {loading ? (
            <LoadingState message="Loading campus listings..." />
          ) : filteredResources.length === 0 ? (
            <EmptyState
              title="No resources match your search"
              description="Try adjusting or clearing your filters to see more student items available on campus."
              actionText="Reset All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <div className="grid-cards browse-grid">
              {filteredResources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
