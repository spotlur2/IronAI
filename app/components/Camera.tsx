'use client';

import React, { useEffect, useRef, useState } from 'react';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    const getCamera = async () => {
      try {
        // Request access to the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // If the video element exists, set the camera stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        setHasCamera(true);
        setCameraError(null); // Clear error on success
      } catch (error) {
        console.error('Error accessing camera: ', error);
        setCameraError('Unable to access the camera. Please check your permissions or try again.');
        setHasCamera(false);
      }
    };

    getCamera();

    // Clean up the media stream when the component is unmounted
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera">
      {cameraError && <p>{cameraError}</p>}
      {hasCamera ? (
        <video ref={videoRef} autoPlay playsInline width="100%" height="auto" />
      ) : (
        <p>Waiting for camera feed...</p>
      )}
    </div>
  );
};

export default Camera;
