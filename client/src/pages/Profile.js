import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaSave, FaPalette, FaEnvelope, FaCalendar, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    theme: 'light'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/profile', { withCredentials: true });
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        bio: response.data.bio || '',
        theme: response.data.preferences?.theme || 'light'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/user/profile', {
        name: formData.name,
        bio: formData.bio,
        preferences: {
          theme: formData.theme
        }
      }, { withCredentials: true });
      
      setProfile(response.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
      
      // Apply theme change
      if (formData.theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Failed to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card text-center animate-fade-in">
              {/* Profile Picture */}
              <div className="mb-4">
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-primary-400 to-pink-400 flex items-center justify-center border-4 border-primary-500">
                    <FaUser className="text-5xl text-white" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {profile.email}
              </p>

              {/* Stats */}
              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {profile.stats?.totalSearches || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Searches</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {profile.stats?.favoriteCount || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Favorites</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {profile.stats?.totalDownloads || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Downloads</p>
                  </div>
                </div>
              </div>

              {/* Member Since */}
              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <FaCalendar />
                  <span>
                    Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="card animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Account Information
                </h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile}>
                  {/* Name */}
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      <FaUser className="inline mr-2" />
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      <FaEnvelope className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="input-field"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Theme Preference */}
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      <FaPalette className="inline mr-2" />
                      Theme Preference
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                        formData.theme === 'light' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          checked={formData.theme === 'light'}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">☀️</div>
                          <p className="font-medium text-gray-800 dark:text-white">Light</p>
                        </div>
                      </label>

                      <label className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                        formData.theme === 'dark' 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          checked={formData.theme === 'dark'}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">🌙</div>
                          <p className="font-medium text-gray-800 dark:text-white">Dark</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: profile.name || '',
                          bio: profile.bio || '',
                          theme: profile.preferences?.theme || 'light'
                        });
                      }}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <FaSave /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {/* Display Mode */}
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      <FaUser className="inline mr-2" />
                      Name
                    </label>
                    <p className="text-gray-800 dark:text-white text-lg">
                      {profile.name}
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      <FaEnvelope className="inline mr-2" />
                      Email
                    </label>
                    <p className="text-gray-800 dark:text-white text-lg">
                      {profile.email}
                    </p>
                  </div>

                  {profile.bio && (
                    <div className="mb-6">
                      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                        Bio
                      </label>
                      <p className="text-gray-800 dark:text-white">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                      <FaPalette className="inline mr-2" />
                      Theme Preference
                    </label>
                    <p className="text-gray-800 dark:text-white text-lg">
                      {profile.preferences?.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
