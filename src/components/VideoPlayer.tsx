import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Subtitles, 
  Languages, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  title: string;
  onClose: () => void;
}

export default function VideoPlayer({ src, title, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [language, setLanguage] = useState('en');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Mock captions for demonstration
  const [quality, setQuality] = useState('1080p');
  const [currentCaption, setCurrentCaption] = useState('');
  const [error, setError] = useState<string | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) videoRef.current.currentTime = time;
    setProgress(parseFloat(e.target.value));
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      setError(`Video source not found or unsupported format.`);
    };

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      
      // Mock live caption logic based on time
      if (showCaptions) {
        const time = video.currentTime;
        if (time < 2) setCurrentCaption("Welcome to Quantum Computing Basics.");
        else if (time < 5) setCurrentCaption("Today we will explore the fundamental principles of qubits.");
        else if (time < 8) setCurrentCaption("Unlike classical bits, qubits can exist in superposition.");
        else setCurrentCaption("Let's dive deeper into the mathematics...");
      } else {
        setCurrentCaption('');
      }
    };

    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('error', handleError);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [showCaptions]);

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    // In a real app, this would switch the video source
    // e.g., videoRef.current.src = src.replace('1080p', newQuality);
    // For demo, we just simulate the switch
    const currentTime = videoRef.current?.currentTime || 0;
    const wasPlaying = isPlaying;
    
    // Simulate buffering
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
      if (wasPlaying) videoRef.current.play();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4"
    >
      <div className="relative w-full max-w-[90vw] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/90 to-transparent z-20 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-medium text-lg">{title}</h3>
            <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold text-cyan-400 border border-cyan-500/30">
              {quality}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {error ? (
            <div className="text-center p-8 z-30">
              <div className="text-red-500 text-xl font-bold mb-2">Playback Error</div>
              <p className="text-slate-400 mb-4">{error}</p>
              <div className="text-sm text-slate-500 bg-white/5 p-4 rounded-lg font-mono border border-white/10">
                Expected file: /public{src}
              </div>
            </div>
          ) : (
            <video 
              ref={videoRef}
              src={src}
              className="w-full h-full object-contain"
              onClick={togglePlay}
              playsInline
            />
          )}
          
          {/* Live Captions Overlay */}
          <AnimatePresence>
            {showCaptions && currentCaption && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-20 left-0 right-0 text-center pointer-events-none"
              >
                <span className="bg-black/60 text-white px-4 py-2 rounded-lg text-lg font-medium backdrop-blur-sm">
                  {currentCaption}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <div className="relative group/progress w-full mb-4 cursor-pointer">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={progress} 
                onChange={handleSeek}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:h-2 transition-all absolute z-10 opacity-0 group-hover/progress:opacity-100"
              />
              <div className="w-full h-1 bg-white/20 rounded-lg overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-100" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors transform hover:scale-110">
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </button>
                
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setVolume(val);
                      if (videoRef.current) videoRef.current.volume = val;
                      setIsMuted(val === 0);
                    }}
                    className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300 h-1.5 bg-white/20 accent-cyan-500 rounded-full"
                  />
                </div>

                <span className="text-sm text-slate-300 font-mono tracking-wider">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Quality Selector */}
                <div className="relative group/quality">
                  <button className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors px-2 py-1 rounded hover:bg-white/10">
                    <Settings className="w-5 h-5" />
                    <span className="text-xs font-bold">{quality}</span>
                  </button>
                  <div className="absolute bottom-full right-0 mb-4 w-24 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden group-hover/quality:block p-1">
                    {['4k', '1080p', '720p', '480p'].map(q => (
                      <button 
                        key={q}
                        onClick={() => handleQualityChange(q)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-between",
                          quality === q ? "text-black bg-cyan-400" : "text-slate-300 hover:bg-white/10"
                        )}
                      >
                        {q.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Selector */}
                <div className="relative group/lang">
                  <button className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors px-2 py-1 rounded hover:bg-white/10">
                    <Languages className="w-5 h-5" />
                    <span className="text-xs font-medium uppercase">{language}</span>
                  </button>
                  <div className="absolute bottom-full right-0 mb-4 w-32 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden group-hover/lang:block p-1">
                    {['en', 'es', 'fr', 'de', 'ja'].map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between",
                          language === lang ? "text-black bg-cyan-400" : "text-slate-300 hover:bg-white/10"
                        )}
                      >
                        {lang.toUpperCase()}
                        {language === lang && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Captions Toggle */}
                <button 
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={cn(
                    "p-2 rounded-lg transition-colors relative",
                    showCaptions ? "text-cyan-400 bg-cyan-500/10" : "text-white hover:bg-white/10"
                  )}
                  title="Live Captions"
                >
                  <Subtitles className="w-5 h-5" />
                  {showCaptions && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>

                <button onClick={toggleFullscreen} className="text-white hover:text-cyan-400 transition-colors">
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
