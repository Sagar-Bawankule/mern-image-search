import React from 'react';
import './SearchHistory.css';

const SearchHistory = ({ history, onSearchClick }) => {
  if (!history || history.length === 0) {
    return (
      <div className="search-history">
        <h3>Search History</h3>
        <p className="empty-history">No search history yet</p>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="search-history">
      <h3>Search History</h3>
      <div className="history-list">
        {history.map((item, index) => (
          <div
            key={index}
            className="history-item"
            onClick={() => onSearchClick(item.term)}
          >
            <div className="history-term">
              <span className="term-icon">🔍</span>
              <span className="term-text">{item.term}</span>
            </div>
            <span className="history-time">{formatDate(item.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
