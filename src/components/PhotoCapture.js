import React, { useState } from 'react';

const PhotoCapture = ({ onPhotoCapture }) => {
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [photoDescription, setPhotoDescription] = useState('');
  
  // Simulate photo capture
  const handleCapturePhoto = () => {
    // In a real implementation, this would use the device camera
    // For now, we'll just simulate with a placeholder image
    
    // Create a placeholder image (colored square)
    const colors = ['#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#F44336'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newPhoto = {
      id: Date.now(),
      dataUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='${randomColor.replace('#', '%23')}' /%3E%3Ctext x='150' y='100' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3EPhoto ${photos.length + 1}%3C/text%3E%3C/svg%3E`,
      description: photoDescription || `Road condition photo ${photos.length + 1}`,
      timestamp: new Date().toISOString()
    };
    
    const updatedPhotos = [...photos, newPhoto];
    setPhotos(updatedPhotos);
    
    // Reset description
    setPhotoDescription('');
    
    // Close camera
    setShowCamera(false);
    
    // Call parent callback
    if (onPhotoCapture) {
      onPhotoCapture(updatedPhotos);
    }
  };
  
  const handleDeletePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    
    // Call parent callback
    if (onPhotoCapture) {
      onPhotoCapture(updatedPhotos);
    }
  };
  
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ fontSize: '1.1rem', color: '#1976D2', marginBottom: '10px' }}>
        Site Photos
      </h3>
      
      {photos.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px',
            marginBottom: '15px'
          }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ 
                position: 'relative',
                width: '150px',
                marginBottom: '15px'
              }}>
                <img 
                  src={photo.dataUrl} 
                  alt={photo.description}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
                <div style={{
                  fontSize: '0.8rem',
                  marginTop: '5px',
                  color: '#666'
                }}>
                  {photo.description}
                </div>
                <button 
                  onClick={() => handleDeletePhoto(photo.id)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#F44336',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {showCamera ? (
        <div style={{
          marginBottom: '15px',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '15px',
            borderRadius: '4px'
          }}>
            Camera Preview (Placeholder)
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Photo Description
            </label>
            <input 
              type="text"
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              placeholder="Enter a description for this photo"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setShowCamera(false)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            
            <button 
              onClick={handleCapturePhoto}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976D2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Capture Photo
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setShowCamera(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '12px',
            backgroundColor: '#f5f5f5',
            border: '1px dashed #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#666',
            marginBottom: '10px'
          }}
        >
          <span style={{ marginRight: '10px', fontSize: '18px' }}>+</span>
          Take a Photo
        </button>
      )}
      
      <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0 0 0' }}>
        Photos: {photos.length} (Add photos of road conditions, drainage issues, etc.)
      </p>
    </div>
  );
};

export default PhotoCapture;