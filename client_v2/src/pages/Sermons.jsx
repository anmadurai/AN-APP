import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Sermons = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/videos`);
        setVideos(res.data.videos);
      } catch (err) {
        console.error('Failed to fetch sermons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div style={{ paddingBottom: '4rem', minHeight: '80vh' }}>
      <header style={{
        backgroundColor: '#f1f5f9',
        padding: '4rem 0',
        marginBottom: '3rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ 
            color: 'var(--primary)', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            fontSize: '0.75rem'
          }}>All Teaching</span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>Full Sermon Gallery</h1>
          <p style={{ color: 'var(--secondary)', maxWidth: '600px', margin: '1rem auto' }}>
            Browse through our entire collection of spiritual messages and find guidance and inspiration.
          </p>
        </div>
      </header>

      <div className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading sermons...</div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
             {videos.length > 0 ? (
               videos.map((vid) => (
                 <VideoCard key={vid.id} video={vid} onPlay={setSelectedVideo} />
               ))
             ) : (
               <div style={{ color: 'var(--text-muted)' }}>No sermons added yet.</div>
             )}
          </div>
        )}
      </div>

      {/* VIDEO MODAL */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
};

export default Sermons;
