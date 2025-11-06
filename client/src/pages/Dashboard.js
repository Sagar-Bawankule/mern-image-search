import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaHeart, FaDownload, FaImages, FaChartLine, FaClock, FaTrophy } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/dashboard', { withCredentials: true });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  const { stats, recentSearches, topSearches } = dashboardData;

  const statCards = [
    {
      icon: FaSearch,
      label: 'Total Searches',
      value: stats.totalSearches || 0,
      color: 'bg-blue-500',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      icon: FaHeart,
      label: 'Favorites',
      value: stats.favoriteCount || 0,
      color: 'bg-red-500',
      gradient: 'from-red-400 to-red-600'
    },
    {
      icon: FaDownload,
      label: 'Downloads',
      value: stats.totalDownloads || 0,
      color: 'bg-green-500',
      gradient: 'from-green-400 to-green-600'
    },
    {
      icon: FaImages,
      label: 'Collections',
      value: stats.collectionsCount || 0,
      color: 'bg-purple-500',
      gradient: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your activity overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="card hover:shadow-xl transition-all duration-300 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
              <div className="relative">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <stat.icon className="text-white text-xl" />
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                  {stat.label}
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity and Top Searches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Searches */}
          <div className="card animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <FaClock className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Recent Searches
              </h2>
            </div>

            {recentSearches.length === 0 ? (
              <div className="text-center py-8">
                <FaSearch className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No recent searches</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSearches.slice(0, 8).map((search, index) => (
                  <div
                    key={search._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white truncate">
                        {search.query}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {search.resultsCount || 0} results
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(search.searchedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Searches */}
          <div className="card animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <FaTrophy className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Top Searches
              </h2>
            </div>

            {topSearches.length === 0 ? (
              <div className="text-center py-8">
                <FaChartLine className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No search data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-white truncate">
                        {search._id}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {search.count} {search.count === 1 ? 'search' : 'searches'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 card animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Activity Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <FaSearch className="mx-auto text-4xl text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stats.totalSearches || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Searches Performed
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
              <FaHeart className="mx-auto text-4xl text-red-600 dark:text-red-400 mb-3" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stats.favoriteCount || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Images Favorited
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <FaDownload className="mx-auto text-4xl text-green-600 dark:text-green-400 mb-3" />
              <p className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                {stats.totalDownloads || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Images Downloaded
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
