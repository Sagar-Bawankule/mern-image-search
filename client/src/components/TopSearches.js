import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopSearches.css';

const TopSearches = () => {
  const [topSearches, setTopSearches] = useState([]);

  useEffect(() => {
    fetchTopSearches();
  }, []);

  const fetchTopSearches = async () => {
    try {
      const response = await axios.get('/api/top-searches', { withCredentials: true });
      setTopSearches(response.data);
    } catch (error) {
      console.error('Error fetching top searches:', error);
    }
  };

  if (topSearches.length === 0) return null;

  return (
    <div className="top-searches-banner" background-color="black">
      <div className="banner-content">
        <h3>🔥 Top Searches</h3>
        <div className="search-tags">
          {topSearches.map((search, index) => (
            <span key={index} className="search-tag">
              {search.term}
              <span className="search-count">{search.count}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopSearches;
