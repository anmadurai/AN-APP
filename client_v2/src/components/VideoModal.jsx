import React from 'react';
import { X } from 'lucide-react';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '800px',
          background: 'black',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            padding: '0.4rem',
            color: 'white',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* IFRAME CONTAINER */}
        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1&rel=0&modestbranding=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </div>

        {/* VIDEO INFO (OPTIONAL) */}
        <div style={{ padding: '1.5rem', background: 'var(--surface)' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{video.title}</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Added on {new Date(video.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
