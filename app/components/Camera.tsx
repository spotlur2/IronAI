'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

const Camera = () => {
  const videoRef = useRef<any>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const sendVideoData = (data: string) => {
    socket.emit("videoData", data);
  };

  // Detect if the device is mobile
  useLayoutEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent)) {
      setIsMobile(true);
    }
  }, []);

  useEffect(() => {
    const enableVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Media Stream:', stream);  // Log the media stream for debugging
        setMediaStream(stream);
      } catch (error) {
        console.error('Error accessing webcam', error);
      }
    };

    enableVideoStream();
  }, []);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      console.log('Setting video stream...');  // Debug log to check if stream is being assigned
      videoRef.current.srcObject = mediaStream;
    }
  }, [videoRef, mediaStream]);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [mediaStream]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="100%"
        height="auto"
        style={{
          transform: isMobile ? 'scaleX(-1)' : 'none', // Invert the video on mobile
        }}
      />
    </div>
  );
};

export default Camera;
