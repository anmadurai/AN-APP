import React, { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, FastForward, Maximize, Minimize } from 'lucide-react';

const VideoModal = ({ video, onClose }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (!video) return;

    // Load YT API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    let player;
    const initPlayer = () => {
      player = new window.YT.Player('yt-player', {
        videoId: video.youtube_video_id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          showinfo: 0,
          autohide: 1
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (player && player.destroy) player.destroy();
    };
  }, [video]);

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const seek = (seconds, e) => {
    if (e) e.stopPropagation();
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + seconds, true);
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!video) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(16px)'
      }}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: isFullscreen ? '100%' : '1100px',
          background: 'black',
          position: 'relative',
          borderRadius: isFullscreen ? 0 : '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)',
          aspectRatio: '16/9'
        }}
        onClick={(e) => {
            e.stopPropagation();
            setShowControls(true);
        }}
        onMouseMove={() => {
            setShowControls(true);
            clearTimeout(window.controlTimeout);
            window.controlTimeout = setTimeout(() => setShowControls(false), 4000);
        }}
      >
        {/* PLAYER HUB */}
        <div id="yt-player" style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />

        {/* CLICK OVERLAY (To block native YT interactions and handle play/pause) */}
        <div 
          onClick={togglePlay}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'transparent',
            zIndex: 5,
            cursor: 'pointer'
          }}
        />

        {/* TOP BAR (Title and Close) */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 10,
          color: 'white'
        }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>{video.title}</h3>
          <button onClick={onClose} style={{ color: 'white', opacity: 0.8, cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* LANDSCAPE CONTROLS (At the bottom) */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          padding: '2rem 1.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 10,
          color: 'white'
        }}>
          {/* Main Actions */}
          <button onClick={togglePlay} style={{ color: 'white', cursor: 'pointer' }}>
            {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" />}
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button onClick={(e) => seek(-30, e)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px', color: 'white', fontSize: '0.85rem' }}>
              <RotateCcw size={18} /> -30s
            </button>
            <button onClick={(e) => seek(30, e)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '6px', color: 'white', fontSize: '0.85rem' }}>
              <RotateCw size={18} /> +30s
            </button>
            <button onClick={(e) => seek(300, e)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--primary)', padding: '6px 16px', borderRadius: '6px', color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>
              <FastForward size={18} /> +5m
            </button>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Right Actions */}
          <button onClick={toggleFullscreen} style={{ color: 'white', opacity: 0.8, cursor: 'pointer' }}>
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
