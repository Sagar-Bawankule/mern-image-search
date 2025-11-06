import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaLock, FaGlobe, FaImages, FaTimes, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false,
    tags: ''
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/collections', { withCredentials: true });
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await axios.post('/api/collections', {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        tags
      }, { withCredentials: true });
      
      setCollections([response.data, ...collections]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', isPublic: false, tags: '' });
      toast.success('Collection created successfully!');
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  const handleUpdateCollection = async (e) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const response = await axios.put(`/api/collections/${editingCollection._id}`, {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        tags
      }, { withCredentials: true });
      
      setCollections(collections.map(col => 
        col._id === editingCollection._id ? response.data : col
      ));
      setShowEditModal(false);
      setEditingCollection(null);
      setFormData({ name: '', description: '', isPublic: false, tags: '' });
      toast.success('Collection updated successfully!');
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    
    try {
      await axios.delete(`/api/collections/${collectionId}`, { withCredentials: true });
      setCollections(collections.filter(col => col._id !== collectionId));
      toast.success('Collection deleted successfully!');
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const openEditModal = (collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      isPublic: collection.isPublic,
      tags: collection.tags.join(', ')
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingCollection(null);
    setFormData({ name: '', description: '', isPublic: false, tags: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              My Collections
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Create Collection
          </button>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="text-center py-20">
            <FaImages className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No Collections Yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first collection to organize your favorite images!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection._id}
                className="card group hover:shadow-xl transition-all duration-300 animate-fade-in"
              >
                {/* Collection Preview */}
                <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-t-lg overflow-hidden">
                  {collection.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1 h-full">
                      {collection.images.slice(0, 4).map((img, idx) => (
                        <img
                          key={idx}
                          src={img.urls?.small || img.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ))}
                      {collection.images.length < 4 && (
                        Array.from({ length: 4 - collection.images.length }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="bg-gray-200 dark:bg-gray-700"></div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FaImages className="text-6xl text-white/50" />
                    </div>
                  )}
                  
                  {/* Privacy Badge */}
                  <div className="absolute top-2 right-2">
                    {collection.isPublic ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <FaGlobe /> Public
                      </span>
                    ) : (
                      <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <FaLock /> Private
                      </span>
                    )}
                  </div>
                </div>

                {/* Collection Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {collection.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {collection.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <FaImages /> {collection.images.length} images
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(collection)}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(collection._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 animate-scale-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Create Collection
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateCollection}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="My Awesome Collection"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Describe your collection..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input-field"
                    placeholder="nature, landscape, travel"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Make this collection public
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 animate-scale-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Edit Collection
                </h2>
                <button
                  onClick={closeModals}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateCollection}>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Make this collection public
                    </span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
