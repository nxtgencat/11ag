import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Zap } from 'lucide-react';
import { Attachment } from '../../types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (attachment: Attachment) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Try accessing camera or use simulated fallback
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch(() => {
          // Camera permission denied or not available; fallback to simulated feed
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSnap = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 150);

    // If stream available, capture frame on canvas
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture({
          type: 'image',
          url: dataUrl,
          thumbnailUrl: dataUrl,
          fileName: `Snap_${Date.now()}.jpg`,
          fileSize: '1.2 MB',
        });
        onClose();
        return;
      }
    }

    // Fallback sample photo snapshot
    const sampleSnaps = [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    ];
    const snapUrl = sampleSnaps[Math.floor(Math.random() * sampleSnaps.length)];

    onCapture({
      type: 'image',
      url: snapUrl,
      thumbnailUrl: snapUrl,
      fileName: `Snapshot_${Date.now()}.jpg`,
      fileSize: '2.4 MB',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col items-center">
        {/* Flash effect overlay */}
        {flash && <div className="absolute inset-0 bg-white z-30 transition-opacity" />}

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/70 to-transparent">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 text-white">
            <Zap className="w-5 h-5 opacity-70 hover:opacity-100 cursor-pointer" />
          </div>
        </div>

        {/* Live Video / Fallback View */}
        <div className="w-full h-96 relative bg-[#182229] flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          {!stream && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 p-6 text-center">
              <Camera className="w-14 h-14 mb-2 opacity-50 stroke-1" />
              <p className="text-sm font-medium">Camera viewfinder active</p>
              <p className="text-xs text-white/50 mt-1">Tap the shutter button below to snap a picture.</p>
            </div>
          )}
        </div>

        {/* Shutter bar */}
        <div className="w-full py-6 flex items-center justify-center bg-black/90">
          <button
            onClick={handleSnap}
            className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-14 h-14 rounded-full bg-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
