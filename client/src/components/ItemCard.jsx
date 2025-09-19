import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ItemCard = ({ item, index }) => {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100); // Stagger animation by 100ms per item
    return () => clearTimeout(timer);
  }, [index]);

  const getStatusBadge = (status) => {
    const badges = {
      active: { class: 'bg-success', text: 'Available', icon: 'bi-check-circle' },
      collected: { class: 'bg-primary', text: 'Collected', icon: 'bi-check2-circle' },
      archived: { class: 'bg-secondary', text: 'Archived', icon: 'bi-archive' }
    };
    
    const badge = badges[status] || badges.active;
    
    return (
      <span className={`badge ${badge.class} status-badge`}>
        <i className={`bi ${badge.icon} me-1`}></i>
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
      <span className={`badge ${cat.class} category-badge`}>
        <i className={`bi ${cat.icon} me-1`}></i>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Reset image error state if the image path changes (e.g., after an upload fix)
  useEffect(() => {
    setImageError(false);
  }, [item?.imagePath]);

  const buildImageUrl = () => {
    const raw = item.imagePath || '';
    const lower = raw.toLowerCase();
    const idx = lower.lastIndexOf('uploads');
    const rel = (idx !== -1 ? raw.slice(idx) : raw).replace(/\\\\/g, '/');
    return `http://localhost:5000/${rel}`;
  };

  return (
    <div className={`card item-card h-100 ${isVisible ? 'item-card-animation' : ''}`}>
      <div className="position-relative">
        {!imageError ? (
          <img
            src={buildImageUrl()}
            alt={item.description}
            className="card-img-top item-image"
            onError={handleImageError}
          />
        ) : (
          <div className="card-img-top item-image bg-light d-flex align-items-center justify-content-center">
            <i className="bi bi-image text-muted display-4"></i>
          </div>
        )}
        
        {getStatusBadge(item.status)}
        {getCategoryBadge(item.category)}
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate" title={item.description}>
          {item.description}
        </h5>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="bi bi-geo-alt me-1"></i>
            <strong>Found:</strong> {item.foundLocation}
          </small>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="bi bi-geo-alt-fill me-1"></i>
            <strong>Collect from:</strong> {item.collectionLocation}
          </small>
        </div>
        
        {item.tags && item.tags.length > 0 && (
          <div className="mb-2">
            <div className="d-flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge bg-light text-dark border">
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="badge bg-light text-muted border">
                  +{item.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <i className="bi bi-calendar me-1"></i>
              {format(new Date(item.createdAt), 'MMM dd, yyyy')}
            </small>
            
            {item.status === 'collected' && item.collectedAt && (
              <small className="text-success">
                <i className="bi bi-check-circle me-1"></i>
                Collected {format(new Date(item.collectedAt), 'MMM dd')}
              </small>
            )}
          </div>
          
          {item.uploadedBy && (
            <small className="text-muted d-block mt-1">
              <i className="bi bi-person me-1"></i>
              By {item.uploadedBy.username}
            </small>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCard;


