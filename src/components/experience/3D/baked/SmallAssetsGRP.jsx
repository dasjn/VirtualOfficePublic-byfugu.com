/* eslint-disable react/no-unknown-property */
import React, { useCallback, useMemo, useRef, useState } from "react";
import { meshBounds, useGLTF } from "@react-three/drei";
import { getAssetPath } from "@/data/assets";
import PropTypes from "prop-types";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useExperience } from "@/hooks/useExperience";
import ComputerScreen from "../blenderMaterial/ComputerScreen";

SmallAssetsGRP.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function SmallAssetsGRP({ material, ...props }) {
  const { nodes } = useGLTF(getAssetPath("SMALL_ASSETS_GRP"));
  const { setCursorHover } = useExperience();

  // Optimización: usar useMemo para el material
  const emissiveMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000", // Color base
        emissive: new THREE.Color(0.4, 0.3, 0), // Color de la emisión
        emissiveIntensity: 0, // Intensidad de emisión inicial
      }),
    []
  );

  const {
    rigidBodyRef,
    meshComputerRef,
    isPointerLocked,
    isUserOnPC,
    setIsUserOnPC,
    unlockPointer,
    startCameraMovement,
    cameraMovement,
  } = useExperience();

  const { camera } = useThree();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [distance, setDistance] = useState(10);
  const [targetIntensity, setTargetIntensity] = useState(0.1); // Intensidad objetivo
  const lerpSpeed = 0.1; // Velocidad de interpolación

  // Optimización: vectores reutilizables
  const worldPositionComputer = useMemo(() => new THREE.Vector3(), []);
  const worldPositionCamera = useMemo(() => new THREE.Vector3(), []);

  // Actualización cada frame con mejor rendimiento
  useFrame(() => {
    if (meshComputerRef.current) {
      meshComputerRef.current.getWorldPosition(worldPositionComputer);
      camera.getWorldPosition(worldPositionCamera);

      const currentDistance = worldPositionCamera.distanceTo(
        worldPositionComputer
      );
      setDistance(currentDistance);

      // Si el ratón está cerca y sobre el objeto, aumentamos la intensidad
      if (currentDistance < 3 && isMouseOver && !isUserOnPC) {
        setTargetIntensity(3);
      } else {
        setTargetIntensity(0);
      }
    }

    // Interpolamos la intensidad de emisión para un cambio suave
    const emissiveIntensity = emissiveMaterial.emissiveIntensity;
    emissiveMaterial.emissiveIntensity = THREE.MathUtils.lerp(
      emissiveIntensity,
      targetIntensity,
      lerpSpeed
    );
  });

  const handlePointerOver = useCallback(() => {
    setIsMouseOver(true);
    setCursorHover(true);
  }, [setCursorHover]);
  const handlePointerOut = useCallback(() => {
    setIsMouseOver(false);
    setCursorHover(false);
  }, [setCursorHover]);

  // Optimización: useCallback para evitar recreación en cada render
  const handleComputerClick = useCallback(() => {
    if (
      isPointerLocked &&
      isMouseOver &&
      distance < 3 &&
      !cameraMovement.isMoving
    ) {
      // 1. Primero desbloqueamos el puntero
      unlockPointer();

      // 2. Esperamos un momento para asegurar que el puntero está desbloqueado
      setTimeout(() => {
        meshComputerRef.current.getWorldPosition(worldPositionComputer);

        if (rigidBodyRef.current) {
          // Obtenemos la posición actual del rigidbody
          const currentPosition = rigidBodyRef.current.translation();

          // Convertimos el valor devuelto a THREE.Vector3
          const startPosition = new THREE.Vector3(
            currentPosition.x,
            currentPosition.y,
            currentPosition.z
          );

          // Calculamos la posición objetivo
          const targetPosition = new THREE.Vector3(
            worldPositionComputer.x + 0.8,
            startPosition.y - 0.4,
            worldPositionComputer.z
          );

          // 3. Después iniciamos el movimiento de la cámara
          startCameraMovement(
            startPosition,
            targetPosition,
            worldPositionComputer,
            1500,
            () => {
              // 4. Al completar la animación sólo marcamos que estamos en PC y cambiamos tipo de cuerpo
              unlockPointer();
              setIsUserOnPC(true);
              rigidBodyRef.current.setBodyType(1);
            }
          );
        }
      }, 100); // Un pequeño retraso para asegurarnos de que el puntero se ha desbloqueado
    }
  }, [
    isPointerLocked,
    isMouseOver,
    distance,
    cameraMovement.isMoving,
    unlockPointer,
    meshComputerRef,
    worldPositionComputer,
    rigidBodyRef,
    startCameraMovement,
    setIsUserOnPC,
  ]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Screen_Body006.geometry}
        material={material}
        position={[-3.526, 1.184, -4.864]}
        visible={distance > 3 && !isMouseOver}
      />
      <mesh
        ref={meshComputerRef}
        castShadow
        receiveShadow
        geometry={nodes.Screen_Body006.geometry}
        material={emissiveMaterial}
        position={[-3.526, 1.184, -4.864]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleComputerClick}
        raycast={meshBounds}
      />
      <ComputerScreen />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube065.geometry}
        material={material}
        position={[-3.55, 0.799, -5.179]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}
