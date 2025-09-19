import React from 'react';
import { format } from 'date-fns';

const ItemsTable = ({ items, loading, activeTab, onCollect, onDelete, onQR }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox display-4 text-muted mb-3"></i>
        <h5 className="text-muted">No items found</h5>
        <p className="text-muted">There are no {activeTab} items at the moment.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'bg-warning', text: 'Active' },
      collected: { class: 'bg-success', text: 'Collected' },
      archived: { class: 'bg-secondary', text: 'Archived' }
    };
    
    const badge = badges[status] || badges.active;
    
    return (
      <span className={`badge ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categories = {
      electronics: { class: 'bg-info', icon: 'bi-laptop' },
      clothing: { class: 'bg-warning', icon: 'bi-shirt' },
      accessories: { class: 'bg-danger', icon: 'bi-watch' },
      books: { class: 'bg-success', icon: 'bi-book' },
      bags: { class: 'bg-dark', icon: 'bi-bag' },
      other: { class: 'bg-secondary', icon: 'bi-question-circle' }
    };
    
    const cat = categories[category] || categories.other;
    
    return (
      <span className={`badge ${cat.class}`}>
        <i className={`bi ${cat.icon} me-1`}></i>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const buildImageUrl = (rawPath) => {
    const raw = rawPath || '';
    const lower = raw.toLowerCase();
    const idx = lower.lastIndexOf('uploads');
    const rel = (idx !== -1 ? raw.slice(idx) : raw).replace(/\\\\/g, '/');
    return `http://localhost:5000/${rel}`;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th>Description</th>
            <th>Category</th>
            <th>Found Location</th>
            <th>Collection Location</th>
            <th>Status</th>
            <th>Date Added</th>
            {activeTab === 'collected' && <th>Collected By</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={buildImageUrl(item.imagePath)}
                    alt={item.description}
                    className="rounded"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="bg-light rounded d-none align-items-center justify-content-center"
                    style={{ width: '50px', height: '50px' }}
                  >
                    <i className="bi bi-image text-muted"></i>
                  </div>
                </div>
              </td>
              <td>
                <div>
                  <div className="fw-medium text-truncate" style={{ maxWidth: '200px' }}>
                    {item.description}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-1">
                      {item.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark me-1 small">
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="badge bg-light text-muted small">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td>{getCategoryBadge(item.category)}</td>
              <td>
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {item.foundLocation}
                </small>
              </td>
              <td>
                <small className="text-muted">
                  <i className="bi bi-geo-alt-fill me-1"></i>
                  {item.collectionLocation}
                </small>
              </td>
              <td>{getStatusBadge(item.status)}</td>
              <td>
                <small className="text-muted">
                  {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                </small>
              </td>
              {activeTab === 'collected' && (
                <td>
                  <small className="text-muted">
                    {item.collectedBy || 'N/A'}
                  </small>
                </td>
              )}
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => onQR(item)}
                    title="Generate QR Code"
                  >
                    <i className="bi bi-qr-code"></i>
                  </button>
                  {item.status === 'active' && (
                    <button
                      className="btn btn-outline-success"
                      onClick={() => onCollect(item)}
                      title="Mark as collected"
                    >
                      <i className="bi bi-check-circle"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => onDelete(item._id)}
                    title="Delete item"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsTable;
