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

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  const worldPositionObject = useMemo(() => new THREE.Vector3(), []);
  const worldPositionCamera = useMemo(() => new THREE.Vector3(), []);

  const { camera } = useThree();
  const { setCursorHover } = useExperience();

  const { deviceType } = useExperience();

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

  useFrame(() => {
    if (!objectRef.current) return;

    objectRef.current.getWorldPosition(worldPositionObject);
    camera.getWorldPosition(worldPositionCamera);

    const currentDistance = worldPositionCamera.distanceTo(worldPositionObject);
    setDistance(currentDistance);

    let intersects = [];

    if (deviceType?.isTouchDevice) {
      camera.getWorldDirection(direction);
      raycaster.set(camera.position, direction);
      intersects = raycaster.intersectObject(objectRef.current, true);
    }

    const nearbyStatus =
      currentDistance < maxDistance &&
      (deviceType?.isTouchDevice ? intersects.length > 0 : isMouseOver);
    setIsNearby(nearbyStatus);

    if (deviceType?.isTouchDevice) {
      if (intersects.length > 0 && !isMouseOver) {
        setIsMouseOver(true);
        onInteractionStart?.();
      } else if (intersects.length === 0 && isMouseOver) {
        setIsMouseOver(false);
        onInteractionEnd?.();
      }
    }
  });

  const handlePointerOver = useCallback(() => {
    if (!deviceType?.isTouchDevice) {
      setIsMouseOver(true);
      onInteractionStart?.();
    }
  }, [deviceType?.isTouchDevice, onInteractionStart]);

  const handlePointerOut = useCallback(() => {
    if (!deviceType?.isTouchDevice) {
      setIsMouseOver(false);
      onInteractionEnd?.();
    }
  }, [deviceType?.isTouchDevice, onInteractionEnd]);

  return {
    objectRef,
    isMouseOver,
    isNearby,
    distance,
    handlePointerOver,
    handlePointerOut,
  };
}

usePointerInteraction.propTypes = {
  maxDistance: PropTypes.number,
  onInteractionStart: PropTypes.func,
  onInteractionEnd: PropTypes.func,
};
