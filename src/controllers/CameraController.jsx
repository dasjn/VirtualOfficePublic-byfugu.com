import { useExperience } from "@/hooks/useExperience";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo } from "react";

export const CameraController = () => {
  const { cameraMovement, updateCameraPosition, rigidBodyRef } =
    useExperience();
  const { camera } = useThree();

  // Optimización: Vectores reutilizables
  const vectors = useMemo(
    () => ({
      position: new THREE.Vector3(),
      rigidBodyPosition: new THREE.Vector3(),
    }),
    []
  );

  // Optimización: Función de easing memoizada
  const easeOutCubic = useMemo(() => (x) => 1 - Math.pow(1 - x, 3), []);

  useFrame(() => {
    // Actualizar posición de la cámara durante movimiento
    if (cameraMovement.isMoving) {
      // Dejar que updateCameraPosition maneje el movimiento del rigidBody
      updateCameraPosition();

      // Actualizar directamente la posición de la cámara
      if (cameraMovement.targetPosition && cameraMovement.startPosition) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - cameraMovement.startTime;
        const progress = Math.min(elapsedTime / cameraMovement.duration, 1);
        const easedProgress = easeOutCubic(progress);

        // Calcular nueva posición con vector reutilizable
        vectors.position.lerpVectors(
          cameraMovement.startPosition,
          cameraMovement.targetPosition,
          easedProgress
        );

        // Actualizar posición de la cámara
        camera.position.copy(vectors.position);
      }

      // Actualizar rotación para mirar al objetivo
      if (cameraMovement.targetLookAt) {
        camera.lookAt(cameraMovement.targetLookAt);
      }
    } else if (rigidBodyRef.current) {
      // Cuando no está en animación, seguir suavemente la posición del rigidBody
      const translation = rigidBodyRef.current.translation();
      vectors.rigidBodyPosition.set(
        translation.x,
        translation.y,
        translation.z
      );

      // Interpolar suavemente la posición de la cámara
      camera.position.lerp(vectors.rigidBodyPosition, 0.1);
    }
  });

  return null;
};
