import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useExperience } from "@/hooks/useExperience";
import { useCallback, useMemo } from "react";
import { initialPosition } from "@/data/constants";

const SPEED = 4;

const Player = () => {
  const [, getKeys] = useKeyboardControls();
  const {
    rigidBodyRef,
    isPointerLocked,
    cameraMovement,
    isUserOnPC,
    canMovePlayer,
    animationCooldown,
  } = useExperience();
  const { camera } = useThree();

  // Optimización: Memoize vectors para prevenir recreación en cada render
  const vectors = useMemo(
    () => ({
      velocity: new THREE.Vector3(),
      forwardDirectionVector: new THREE.Vector3(),
      sidewaysDirectionVector: new THREE.Vector3(),
      combinedVector: new THREE.Vector3(),
      currentPosition: new THREE.Vector3(),
    }),
    []
  );

  // Optimización: Memoize la función de cálculo de movimiento
  const calculateMovement = useCallback(
    (keys) => {
      const {
        forwardKeyPressed,
        rightKeyPressed,
        backwardKeyPressed,
        leftKeyPressed,
      } = keys;

      // Optimización: Retornar temprano si no hay teclas presionadas
      if (
        !forwardKeyPressed &&
        !rightKeyPressed &&
        !backwardKeyPressed &&
        !leftKeyPressed
      ) {
        return null;
      }

      // Calcular dirección del movimiento
      vectors.forwardDirectionVector.set(
        0,
        0,
        -forwardKeyPressed + backwardKeyPressed
      );
      vectors.sidewaysDirectionVector.set(
        rightKeyPressed - leftKeyPressed,
        0,
        0
      );

      // Combinar los vectores y normalizar
      vectors.combinedVector
        .copy(vectors.forwardDirectionVector)
        .add(vectors.sidewaysDirectionVector);

      // Optimización: Solo normalizar si el vector tiene longitud
      if (vectors.combinedVector.length() > 0) {
        vectors.combinedVector.normalize();
        vectors.combinedVector.multiplyScalar(SPEED);
        vectors.combinedVector.applyQuaternion(camera.quaternion);
      }

      return {
        x: vectors.combinedVector.x,
        y: 0,
        z: vectors.combinedVector.z,
      };
    },
    [camera.quaternion, vectors]
  );

  // Optimización: Frame update con comprobaciones tempranas
  useFrame(() => {
    if (!rigidBodyRef.current) return;

    // Optimización: Salir temprano si hay restricciones de movimiento
    if (cameraMovement.isMoving || animationCooldown || isUserOnPC) {
      return;
    }

    const currentVel = rigidBodyRef.current.linvel();

    // Solo procesar movimiento cuando se permite
    if (isPointerLocked && canMovePlayer) {
      const keys = getKeys();
      const movement = calculateMovement(keys);

      if (movement) {
        rigidBodyRef.current.wakeUp();

        // Establecer velocidad pero mantener Y a 0
        rigidBodyRef.current.setLinvel({
          x: movement.x,
          y: currentVel.y,
          z: movement.z,
        });
      } else {
        // Cuando no hay movimiento, detener al jugador
        rigidBodyRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 });
      }
    } else {
      // Si no está en control, detener
      rigidBodyRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 });
    }

    // Actualizar cámara solo cuando no está en animación
    if (!cameraMovement.isMoving && !animationCooldown) {
      const translation = rigidBodyRef.current.translation();
      vectors.currentPosition.set(translation.x, translation.y, translation.z);
      camera.position.copy(vectors.currentPosition);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={80}
      friction={0}
      restitution={0}
      position={initialPosition}
      enabledRotations={[false, false, false]}
      linearDamping={0.95} // Add damping for smoother movements
    >
      <CapsuleCollider args={[1.5, 0.25]} />
    </RigidBody>
  );
};

export default Player;
