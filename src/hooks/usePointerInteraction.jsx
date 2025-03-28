import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import PropTypes from "prop-types";
import { useExperience } from "./useExperience";

export function usePointerInteraction({
  maxDistance = 3,
  onInteractionStart,
  onInteractionEnd,
} = {}) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isNearby, setIsNearby] = useState(false);
  const [distance, setDistance] = useState(10);
  const objectRef = useRef(null);

  // Memoized vector instances to reduce garbage collection
  const worldPositionObject = useMemo(() => new THREE.Vector3(), []);
  const worldPositionCamera = useMemo(() => new THREE.Vector3(), []);

  const { camera } = useThree();
  const { setCursorHover } = useExperience();

  // Actualizar el cursor basado en isNearby
  useEffect(() => {
    if (setCursorHover) {
      setCursorHover(isNearby);
    }

    return () => {
      if (setCursorHover) {
        setCursorHover(false);
      }
    };
  }, [isNearby, setCursorHover]);

  // Optimized pointer event handlers
  const handlePointerOver = useCallback(() => {
    setIsMouseOver(true);
    if (onInteractionStart) {
      onInteractionStart();
    }
  }, [onInteractionStart]);

  const handlePointerOut = useCallback(() => {
    setIsMouseOver(false);
    if (onInteractionEnd) {
      onInteractionEnd();
    }
  }, [onInteractionEnd]);

  // Frame-based distance and interaction logic
  useFrame(() => {
    if (objectRef.current) {
      objectRef.current.getWorldPosition(worldPositionObject);
      camera.getWorldPosition(worldPositionCamera);

      const currentDistance =
        worldPositionCamera.distanceTo(worldPositionObject);
      setDistance(currentDistance);

      // Check if object is nearby
      const nearbyStatus = currentDistance < maxDistance && isMouseOver;
      setIsNearby(nearbyStatus);
    }
  });

  return {
    objectRef,
    isMouseOver,
    isNearby,
    distance,
    handlePointerOver,
    handlePointerOut,
  };
}

// PropTypes for the hook configuration
usePointerInteraction.propTypes = {
  maxDistance: PropTypes.number,
  onInteractionStart: PropTypes.func,
  onInteractionEnd: PropTypes.func,
};
