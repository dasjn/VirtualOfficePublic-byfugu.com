// src/components/ProgressTracker.jsx
import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";

/**
 * Component for tracking loading progress
 * Uses useRef to prevent state updates during render that might cause React warnings
 */
const ProgressTracker = ({ onProgress, onComplete }) => {
  const { progress } = useProgress();
  const lastProgressRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    // Only update if progress has changed
    if (progress !== lastProgressRef.current) {
      lastProgressRef.current = progress;

      // Call onProgress in useEffect, not during render
      if (onProgress) {
        onProgress(progress);
      }

      // Call onComplete only once when we reach 100%
      if (progress >= 100 && !completedRef.current) {
        completedRef.current = true;
        if (onComplete) {
          onComplete();
        }
      }
    }
  }, [progress, onProgress, onComplete]);

  // This component doesn't render anything
  return null;
};

export default ProgressTracker;
