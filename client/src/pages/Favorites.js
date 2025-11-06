import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaDownload, FaExternalLinkAlt, FaUser, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/favorites', { withCredentials: true });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (imageId) => {
    try {
      await axios.delete(`/api/favorites/${imageId}`, { withCredentials: true });
      setFavorites(favorites.filter(fav => fav.imageId !== imageId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  const handleDownload = async (image) => {
    try {
      // Track download
      await axios.post('/api/downloads', {
        imageId: image.imageId,
        imageUrl: image.urls.regular,
        photographer: image.photographer,
        quality: 'regular'
      }, { withCredentials: true });

      // Open download link
      window.open(image.urls.full, '_blank');
      toast.success('Download started!');
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Download failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <FaHeart className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            No Favorites Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Start exploring and add images to your favorites!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? 'image' : 'images'} saved
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {favorites.map((favorite) => (
            <div
              key={favorite._id}
              className="break-inside-avoid group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
            >
              {/* Image */}
              <img
                src={favorite.urls.small}
                alt={favorite.description || 'Favorite image'}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Description */}
                  {favorite.description && (
                    <p className="text-white text-sm mb-2 line-clamp-2">
                      {favorite.description}
                    </p>
                  )}

                  {/* Photographer */}
                  <div className="flex items-center text-white/90 text-sm mb-3">
                    <FaUser className="mr-2" />
                    <span>{favorite.photographer}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(favorite)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      title="Download"
                    >
                      <FaDownload />
                      Download
                    </button>
                    
                    <button
                      onClick={() => window.open(favorite.unsplashUrl, '_blank')}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-2 rounded-lg transition-colors"
                      title="View on Unsplash"
                    >
                      <FaExternalLinkAlt />
                    </button>
                    
                    <button
                      onClick={() => removeFavorite(favorite.imageId)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>

              {/* Favorite Badge */}
              <div className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg">
                <FaHeart />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
