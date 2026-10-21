import React, { useState, useMemo } from 'react';
import { useResources } from '../context/ResourceContext';
import ResourceCard from '../components/resources/ResourceCard';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import { SearchIcon, LocationIcon } from '../components/common/Icons';
import { CATEGORIES } from '../data/resources';
import './Rent.css';

export default function Rent() {
  const { resources, loading } = useResources();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');

  // Filter only type === 'For Rent'
  const rentListings = useMemo(() => {
    let list = resources.filter((r) => r.type === 'For Rent');

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

    if (category !== 'All') {
      list = list.filter((r) => r.category === category);
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      list = list.filter((r) => r.price <= Number(maxPrice));
    }

    return list;
  }, [resources, search, category, maxPrice]);

  return (
    <div className="rent-page fade-in">
      {/* Rent Dedicated Hero */}
      <section className="rent-hero">
        <div className="container rent-hero-container">
          <div className="rent-hero-badge">
            <span>Flexible Campus Rentals</span>
          </div>
          <h1 className="title-xl">Rent What You Need, When You Need It</h1>
          <p className="rent-hero-desc">
            Borrow cycles for commuting, scientific calculators for exams week, or lab equipment
            without buying full-price. Transparent daily rates from campus peers.
          </p>

          {/* Quick Filter Bar */}
          <div className="rent-filter-bar">
            <div className="rent-search-wrapper">
              <SearchIcon size={18} />
              <input
                type="text"
                placeholder="Search cycles, lamps, books for rent..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rent-search-input"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select rent-category-select"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Max ₹/day"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="form-input rent-price-input"
              min="0"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="rent-content container">
        <div className="rent-results-header">
          <h2 className="title-md">
            Available for Rent ({rentListings.length})
          </h2>
          <span className="rent-subtext">
            All prices listed as daily/weekly campus rates in INR (₹)
          </span>
        </div>

        {loading ? (
          <LoadingState message="Loading rental resources..." />
        ) : rentListings.length === 0 ? (
          <EmptyState
            title="No rental items match your criteria"
            description="Try changing the category or clearing search filters to see all available rental items."
            actionText="View All Rentals"
            onAction={() => {
              setSearch('');
              setCategory('All');
              setMaxPrice('');
            }}
          />
        ) : (
          <div className="grid-cards">
            {rentListings.map((res) => (
              <ResourceCard key={res.id} resource={res} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
