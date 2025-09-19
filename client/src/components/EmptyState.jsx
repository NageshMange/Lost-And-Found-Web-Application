import React from 'react';

const EmptyState = ({ icon = 'bi-inbox', title = 'No items found', message = 'There are no items to display at the moment.' }) => {
  return (
    <div className="empty-state">
      <i className={`bi ${icon}`}></i>
      <h4>{title}</h4>
      <p className="text-muted">{message}</p>
    </div>
  );
};

export default EmptyState;








