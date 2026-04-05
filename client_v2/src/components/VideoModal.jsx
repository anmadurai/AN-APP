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

    // Load YT API if not already loaded
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
          fs: 0
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

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const seek = (seconds) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + seconds, true);
  };

  const toggleFullscreen = () => {
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
        background: 'rgba(0,0,0,0.9)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(12px)'
      }}
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          maxWidth: isFullscreen ? '100%' : '1000px',
          background: 'black',
          position: 'relative',
          borderRadius: isFullscreen ? 0 : '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
          aspectRatio: '16/9'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={() => {
            setShowControls(true);
            clearTimeout(window.controlTimeout);
            window.controlTimeout = setTimeout(() => setShowControls(false), 3000);
        }}
      >
        {/* PLAYER HUB */}
        <div id="yt-player" style={{ width: '100%', height: '100%' }} />

        {/* CUSTOM CONTROLS OVERLAY */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.4) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: showControls ? 'auto' : 'none',
          color: 'white',
          zIndex: 10
        }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '1.1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{video.title}</div>
            <button onClick={onClose} style={{ color: 'white', opacity: 0.8 }}><X size={24} /></button>
          </div>

          {/* Center Jumps (Optional Big Icons) */}
          <div style={{ 
            position: 'absolute', 
            top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <button onClick={() => seek(-30)} style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', color: 'white' }}>
              <RotateCcw size={32} />
              <span style={{ position: 'absolute', bottom: '-1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem' }}>-30s</span>
            </button>
            <button onClick={togglePlay} style={{ background: 'var(--primary)', padding: '1.5rem', borderRadius: '50%', color: 'white', transform: 'scale(1.2)' }}>
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button onClick={() => seek(30)} style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', color: 'white' }}>
              <RotateCw size={32} />
              <span style={{ position: 'absolute', bottom: '-1.5rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem' }}>+30s</span>
            </button>
          </div>

          {/* Bottom Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <button onClick={() => seek(300)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                    <FastForward size={20} /> +5m
                </button>
             </div>

             <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={toggleFullscreen} style={{ background: 'rgba(255,255,255,0.2)', padding: '0.6rem', borderRadius: '50%' }}>
                    {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
