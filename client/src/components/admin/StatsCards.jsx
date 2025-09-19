import React, { useState, useEffect } from 'react';

const StatsCards = ({ stats }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!stats) return null;

  const cards = [
    {
      title: 'Total Items',
      value: stats.totalItems,
      icon: 'bi-box',
      color: 'primary',
      description: 'All items ever added'
    },
    {
      title: 'Active Items',
      value: stats.activeItems,
      icon: 'bi-clock',
      color: 'warning',
      description: 'Currently available'
    },
    {
      title: 'Collected Items',
      value: stats.collectedItems,
      icon: 'bi-check-circle',
      color: 'success',
      description: 'Successfully returned'
    },
    {
      title: 'This Month',
      value: stats.thisMonthItems,
      icon: 'bi-calendar-month',
      color: 'info',
      description: 'Items added this month'
    },
    {
      title: 'Collection Rate',
      value: `${stats.collectionRate}%`,
      icon: 'bi-graph-up',
      color: 'secondary',
      description: 'Success rate'
    }
  ];

  return (
    <div className="row g-4 mb-4">
      {cards.map((card, index) => (
        <div key={index} className={`col-md-6 col-lg-4 col-xl ${isVisible ? 'item-card-animation' : ''}`}>
          <div className={`card stats-card bg-${card.color} text-white`}>
            <div className="card-body text-center">
              <i className={`bi ${card.icon} display-4 mb-3`}></i>
              <div className="stats-number">{card.value}</div>
              <h6 className="card-title mb-2">{card.title}</h6>
              <p className="card-text small opacity-75 mb-0">
                {card.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;








