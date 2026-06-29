import { useState, useEffect } from 'react';

const SCRIPT_ID = 'mediapipe-pose-script';
const CAMERA_SCRIPT_ID = 'mediapipe-camera-script';

export const useMediaPipe = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if scripts are already loaded
    if (window.Pose && window.Camera) {
      setIsLoaded(true);
      return;
    }

    const loadScript = (id, src) => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });
    };

    const loadMediaPipe = async () => {
      try {
        await loadScript(SCRIPT_ID, 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
        await loadScript(CAMERA_SCRIPT_ID, 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
        // Small delay to ensure globals are attached
        setTimeout(() => {
          if (window.Pose && window.Camera) {
            setIsLoaded(true);
          } else {
            setError(new Error('MediaPipe globals not found after loading scripts.'));
          }
        }, 100);
      } catch (err) {
        setError(err);
        console.error('Error loading MediaPipe:', err);
      }
    };

    loadMediaPipe();

    // Cleanup not strictly necessary as we want these available globally once loaded
  }, []);

  return { isLoaded, error };
};
