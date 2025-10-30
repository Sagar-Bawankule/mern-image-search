import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TopSearches from '../components/TopSearches';
import SearchBar from '../components/SearchBar';
import ImageGrid from '../components/ImageGrid';
import SearchHistory from '../components/SearchHistory';
import './Home.css';

const Home = () => {
  const { user, logout } = useAuth();
  const [searchResults, setSearchResults] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history', { withCredentials: true });
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) return;

    setLoading(true);
    setError('');
    setSelectedImages(new Set());

    try {
      const response = await axios.post(
        '/api/search',
        { term },
        { withCredentials: true }
      );
      setSearchResults(response.data);
      fetchHistory(); // Refresh history after new search
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to search images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageId) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(imageId)) {
        newSet.delete(imageId);
      } else {
        newSet.add(imageId);
      }
      return newSet;
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="header-content">
          <h1>🔍 Image Search</h1>
          <div className="user-info">
            {user?.avatar && <img src={user.avatar} alt={user.displayName} />}
            <span>{user?.displayName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <TopSearches />

      <main className="main-content">
        <div className="search-section">
          <SearchBar onSearch={handleSearch} loading={loading} />

          {error && <div className="error-message">{error}</div>}

          {searchResults && (
            <div className="results-header">
              <p>
                You searched for <strong>"{searchResults.term}"</strong> — {searchResults.count} results.
              </p>
              <p className="selection-counter">
                Selected: <strong>{selectedImages.size}</strong> image{selectedImages.size !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Searching images...</p>
            </div>
          )}

          {searchResults && !loading && (
            <ImageGrid
              images={searchResults.images}
              selectedImages={selectedImages}
              onImageSelect={handleImageSelect}
            />
          )}
        </div>

        <aside className="sidebar">
          <SearchHistory history={history} onSearchClick={handleSearch} />
        </aside>
      </main>
    </div>
  );
};

export default Home;
