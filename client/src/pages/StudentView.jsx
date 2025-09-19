import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';
import FilterSection from '../components/FilterSection';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const StudentView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'active',
    category: '',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchItems = async (page = 1) => {
    try {
      setLoading(true);
      // Build params without empty values to satisfy backend validators
      const paramsObj = {
        page: page.toString(),
        limit: '12',
        status: filters.status || 'active'
      };
      if (filters.category) paramsObj.category = filters.category;
      if (filters.search) paramsObj.search = filters.search;
      if (filters.dateFrom) paramsObj.dateFrom = filters.dateFrom;
      if (filters.dateTo) paramsObj.dateTo = filters.dateTo;

      const queryString = new URLSearchParams(paramsObj).toString();
      const response = await axios.get(`/api/items?${queryString}`);
      setItems(response.data.items);
      setPagination({
        currentPage: parseInt(response.data.currentPage),
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page) => {
    fetchItems(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusCounts = () => {
    return {
      active: items.filter(item => item.status === 'active').length,
      collected: items.filter(item => item.status === 'collected').length,
      archived: items.filter(item => item.status === 'archived').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h2 mb-1">
                <i className="bi bi-eye me-2"></i>
                Lost & Found Items
              </h1>
              <p className="text-muted mb-0">
                Browse through lost items and find your belongings
              </p>
            </div>
            <div className="text-end">
              <div className="small text-muted">
                Showing {items.length} of {pagination.total} items
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        statusCounts={statusCounts}
      />

      {/* Items Grid */}
      {loading ? (
        <LoadingSpinner />
      ) : items.length > 0 ? (
        <>
          <div className="row g-4 mb-4">
            {items.map((item) => (
              <div key={item._id} className="col-md-6 col-lg-4">
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav aria-label="Items pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                {[...Array(pagination.totalPages)].map((_, index) => {
                  const page = index + 1;
                  const isActive = page === pagination.currentPage;
                  const isNearCurrent = Math.abs(page - pagination.currentPage) <= 2;
                  const isFirstOrLast = page === 1 || page === pagination.totalPages;
                  
                  if (!isNearCurrent && !isFirstOrLast) {
                    if (page === 2 || page === pagination.totalPages - 1) {
                      return (
                        <li key={page} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  }
                  
                  return (
                    <li key={page} className={`page-item ${isActive ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      ) : (
        <EmptyState
          icon="bi-search"
          title="No items found"
          message="No lost items match your current filters. Try adjusting your search criteria."
        />
      )}
    </div>
  );
};

export default StudentView;

