'use client';

import React, { useRef, useState, useEffect } from 'react';

import io from 'socket.io-client';

const socket = io();

const Camera = () => {
  const videoRef = useRef<any>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const sendVideoData = (data: string) => {
    socket.emit("videoData", data);
  };

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
      <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
    </div>
  );
};

export default Camera;
