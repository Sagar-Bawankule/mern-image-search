import React from 'react';
import './ImageGrid.css';

const ImageGrid = ({ images, selectedImages, onImageSelect }) => {
  if (!images || images.length === 0) {
    return (
      <div className="no-results">
        <p>No images found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="image-grid">
      {images.map((image) => (
        <div
          key={image.id}
          className={`image-card ${selectedImages.has(image.id) ? 'selected' : ''}`}
          onClick={() => onImageSelect(image.id)}
        >
          <img src={image.thumb} alt={image.description || 'Unsplash image'} />
          <div className="image-overlay">
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={selectedImages.has(image.id)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {image.photographer && (
              <div className="photographer-info">
                <span>Photo by {image.photographer}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
