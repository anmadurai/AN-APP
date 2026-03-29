const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// HELPER: EXTRACT YOUTUBE ID & THUMBNAIL
const extractYoutubeId = (url) => {
    let videoId = '';
    if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
    } else {
        videoId = url; // assume it's already an ID
    }
    return videoId;
};

const getThumbnailUrl = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// LIST ALL VIDEOS (PUBLIC)
router.get('/', async (req, res) => {
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json({ videos });
});

// GET LATEST 4 VIDEOS (FOR HOME PAGE)
router.get('/recent', async (req, res) => {
  const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ videos });
});

// ADD VIDEO (ADMIN ONLY)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { title, youtube_url } = req.body;

  if (!title || !youtube_url) {
    return res.status(400).json({ message: 'Title and YouTube URL are required.' });
  }

  try {
    const youtube_video_id = extractYoutubeId(youtube_url);
    const thumbnail_url = getThumbnailUrl(youtube_video_id);

    const { data: video, error } = await supabase
      .from('videos')
      .insert({ title, youtube_video_id, thumbnail_url })
      .select('*')
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Video added successfully', video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// EDIT VIDEO (ADMIN ONLY)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { title, youtube_url } = req.body;

  if (!title || !youtube_url) {
    return res.status(400).json({ message: 'Title and YouTube URL are required.' });
  }

  try {
    const youtube_video_id = extractYoutubeId(youtube_url);
    const thumbnail_url = getThumbnailUrl(youtube_video_id);

    const { data: video, error } = await supabase
      .from('videos')
      .update({ title, youtube_video_id, thumbnail_url })
      .eq('id', req.params.id)
      .select('*')
      .single();

    if (error) throw error;
    res.json({ message: 'Video updated successfully', video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE VIDEO (ADMIN ONLY)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', req.params.id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: 'Video deleted successfully' });
});

module.exports = router;
