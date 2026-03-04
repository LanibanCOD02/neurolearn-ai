import React, { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
  className?: string;
  fallback?: string;
}

export default function VideoThumbnail({ src, className, fallback }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const video = document.createElement('video');
    const canvas = document.createElement('canvas');

    let timeout: number | undefined;

    const cleanup = () => {
      try {
        video.pause();
        video.removeAttribute('src');
        video.load?.();
      } catch (e) {}
      if (timeout) window.clearTimeout(timeout);
    };

    const capture = () => {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL('image/jpeg', 0.8);
        if (mountedRef.current) setDataUrl(url);
      } catch (err) {
        // ignore
      } finally {
        cleanup();
      }
    };

    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.preload = 'metadata';
    video.src = src;

    const onLoaded = () => {
      // try to seek to 1s (if shorter, fallback to 0)
      const seekTime = Math.min(1, Math.max(0, (video.duration || 0) / 2));
      const onSeeked = () => {
        capture();
        video.removeEventListener('seeked', onSeeked);
      };
      video.addEventListener('seeked', onSeeked);
      try {
        video.currentTime = seekTime;
      } catch (e) {
        // Some browsers may throw if metadata not ready — fallback by waiting briefly
        timeout = window.setTimeout(() => {
          try {
            capture();
          } catch {}
        }, 800);
      }
    };

    const onError = () => {
      cleanup();
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('error', onError);

    // In case loadedmetadata never fires, set a timeout to attempt capture
    timeout = window.setTimeout(() => {
      if (!dataUrl && mountedRef.current) {
        try {
          capture();
        } catch {}
      }
    }, 2000);

    return () => {
      mountedRef.current = false;
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('error', onError);
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  if (dataUrl) return <img src={dataUrl} className={className} alt="video cover" />;
  if (fallback) return <img src={fallback} className={className} alt="video cover" />;
  return <div className={className} />;
}
