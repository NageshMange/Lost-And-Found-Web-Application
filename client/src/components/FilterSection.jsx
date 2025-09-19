import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterSection = ({ filters, onFilterChange, statusCounts }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'active',
      category: '',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const hasActiveFilters = filters.category || filters.search || filters.dateFrom || filters.dateTo;

  return (
    <div className="filter-section">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h5 className="mb-3">
            <i className="bi bi-funnel me-2"></i>
            Filters & Search
          </h5>
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <i className={`bi bi-chevron-${showAdvanced ? 'up' : 'down'} me-1`}></i>
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
          {hasActiveFilters && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={clearFilters}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="row g-3">
        {/* Search */}
        <div className="col-md-4">
          <div className="search-box">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="active">
              Available ({statusCounts.active})
            </option>
            <option value="collected">
              Collected ({statusCounts.collected})
            </option>
            <option value="archived">
              Archived ({statusCounts.archived})
            </option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="col-md-4">
          <select
            className="form-select"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="books">Books</option>
            <option value="bags">Bags</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <>
            <div className="col-md-6">
              <label className="form-label small">From Date</label>
              <DatePicker
                selected={filters.dateFrom ? new Date(filters.dateFrom) : null}
                onChange={(date) => handleFilterChange('dateFrom', date ? date.toISOString().split('T')[0] : '')}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Select start date"
                maxDate={new Date()}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small">To Date</label>
              <DatePicker
                selected={filters.dateTo ? new Date(filters.dateTo) : null}
                onChange={(date) => handleFilterChange('dateTo', date ? date.toISOString().split('T')[0] : '')}
                dateFormat="yyyy-MM-dd"
                className="form-control"
                placeholderText="Select end date"
                maxDate={new Date()}
                minDate={filters.dateFrom ? new Date(filters.dateFrom) : null}
              />
            </div>
          </>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="row mt-3">
          <div className="col-12">
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-primary">
                <i className="bi bi-funnel me-1"></i>
                Active Filters:
              </span>
              
              {filters.category && (
                <span className="badge bg-info">
                  Category: {filters.category}
                  <button
                    className="btn-close btn-close-white ms-1"
                    style={{fontSize: '0.7em'}}
                    onClick={() => handleFilterChange('category', '')}
                  ></button>
                </span>
              )}
              
              {filters.search && (
                <span className="badge bg-info">
                  Search: "{filters.search}"
                  <button
                    className="btn-close btn-close-white ms-1"
                    style={{fontSize: '0.7em'}}
                    onClick={() => handleFilterChange('search', '')}
                  ></button>
                </span>
              )}
              
              {filters.dateFrom && (
                <span className="badge bg-info">
                  From: {filters.dateFrom}
                  <button
                    className="btn-close btn-close-white ms-1"
                    style={{fontSize: '0.7em'}}
                    onClick={() => handleFilterChange('dateFrom', '')}
                  ></button>
                </span>
              )}
              
              {filters.dateTo && (
                <span className="badge bg-info">
                  To: {filters.dateTo}
                  <button
                    className="btn-close btn-close-white ms-1"
                    style={{fontSize: '0.7em'}}
                    onClick={() => handleFilterChange('dateTo', '')}
                  ></button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;








