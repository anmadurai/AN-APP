import React from 'react';
import { Play } from 'lucide-react';

const VideoCard = ({ video, onPlay }) => {
  return (
    <div 
      className="fade-in"
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={() => onPlay(video)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      {/* THUMBNAIL CONTAINER */}
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
        <img 
          src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/hqdefault.jpg`} 
          alt={video.title} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.9
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '3.5rem',
          height: '3.5rem',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.4)',
          transition: 'all 0.3s ease'
        }} className="play-btn">
          <Play size={24} fill="currentColor" />
        </div>
      </div>

      {/* INFO */}
      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{video.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {new Date(video.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <style>{`
        .play-btn:hover {
          background: var(--primary) !important;
          transform: translate(-50%, -50%) scale(1.1) !important;
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default VideoCard;
