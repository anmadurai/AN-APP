import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import { Play, TrendingUp, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Home = () => {
  const [recentVideos, setRecentVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/videos/recent`);
        setRecentVideos(res.data.videos);
      } catch (err) {
        console.error('Failed to fetch recent videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
        padding: '6rem 0',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container">
          <div style={{
            maxWidth: '650px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: '4rem', color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: 1.1 }}
            >
              Discover Spiritual <br /><span style={{ color: 'var(--primary)' }}>Transformation</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '2.5rem' }}
            >
              Welcome to ALL MADURAI HOLINESS CHURCH. Watch our latest sermons and join our community of faith and devotion.
            </motion.p>
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              <Link to="/sermons" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                <Play size={20} fill="white" /> Start Watching
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                Join Community
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RECENT SERMONS */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem'
        }}>
          <div>
            <span style={{ 
              color: 'var(--primary)', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              fontSize: '0.75rem'
            }}>Latest Teaching</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem' }}>Recent Sermons</h2>
          </div>
          <Link to="/sermons" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            View All →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading sermons...</div>
        ) : (
          <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
             {recentVideos.length > 0 ? (
               recentVideos.map((vid) => (
                 <VideoCard key={vid.id} video={vid} onPlay={setSelectedVideo} />
               ))
             ) : (
               <div style={{ color: 'var(--text-muted)' }}>No sermons added yet.</div>
             )}
          </div>
        )}
      </section>

      {/* VIDEO MODAL */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
};

export default Home;
