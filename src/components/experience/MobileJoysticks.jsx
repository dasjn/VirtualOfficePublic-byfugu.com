import React, { useEffect, useMemo, useRef } from "react";
import nipplejs from "nipplejs";
import { useExperience } from "@/hooks/useExperience";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Constants
const MOVE_SPEED = 100; // Match desktop speed
const CAMERA_SENSITIVITY = 0.7;
const MAX_DELTA_TIME = 1 / 30; // Maximum allowed deltaTime
const MAX_VELOCITY = 100; // Maximum allowed velocity magnitude

export default function MobileJoysticks() {
  const { cursorHover } = useExperience();
  // Esto se renderizará en el DOM normal, no dentro del canvas de Three.js
  return (
    <div
      id="mobile-controls"
      className="absolute inset-0 z-[9000] pointer-events-none"
    >
      <div className="absolute top-[2%] right-[2%] flex flex-col gap-4">
        <img
          className={`z-[9999] pointer-events-none`}
          src={"/svg/TheOnffice.svg"}
          alt="Logo"
        />
      </div>
      {/* Joystick izquierdo - Movimiento */}
      <div
        id="left-joystick"
        className="absolute left-[15%] bottom-[20%] w-36 h-36 rounded-full pointer-events-auto"
        style={{ touchAction: "none" }}
      />

      {/* Joystick derecho - Cámara */}
      <div
        id="right-joystick"
        className="absolute right-[15%] bottom-[20%] w-36 h-36 rounded-full pointer-events-auto"
        style={{ touchAction: "none" }}
      />

      {/* Botón de interacción/acción */}
      <div
        className={`z-[9999] absolute bottom-[50%] left-[50%] transform -translate-x-1/2  rounded-full border border-white bg-white bg-opacity-40 pointer-events-none 
          ${cursorHover ? "w-6 h-6" : "w-4 h-4"} 
          transition-[width,height] duration-300 ease-in-out`}
      />
    </div>
  );
}

// Este componente debe ser usado dentro del canvas de Three.js
export function MobileJoysticksLogic() {
  const leftManagerRef = useRef(null);
  const rightManagerRef = useRef(null);
  const leftVectorRef = useRef({ x: 0, y: 0 });
  const rightVectorRef = useRef({ x: 0, y: 0 });

  // Track visibility and timing
  const visibilityRef = useRef({
    wasHidden: false,
    lastActiveTime: performance.now(),
  });

  // Use useMemo to create the Euler object only once
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const PI_2 = Math.PI / 2;

  const {
    deviceType,
    rigidBodyRef,
    canMovePlayer,
    cameraMovement,
    animationCooldown,
    isPointerLocked,
  } = useExperience();
  const { camera } = useThree();

  // Vector reutilizable para cálculos
  const movementVector = useMemo(() => new THREE.Vector3(), []);

  // Add visibility change detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityRef.current.wasHidden = true;
      } else {
        // When returning from hidden state, prepare for next frame
        if (visibilityRef.current.wasHidden) {
          visibilityRef.current.lastActiveTime = performance.now();
          visibilityRef.current.wasHidden = false;

          // Force zero velocity when returning to prevent jumps
          if (rigidBodyRef.current) {
            const currentVel = rigidBodyRef.current.linvel();
            rigidBodyRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 });
          }

          // Reset joystick vectors
          leftVectorRef.current = { x: 0, y: 0 };
          rightVectorRef.current = { x: 0, y: 0 };
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [rigidBodyRef]);

  // Crear los joysticks cuando el componente se monta
  useEffect(() => {
    if (!deviceType?.isTouchDevice) return;

    // Obtener referencias a los elementos DOM
    const leftJoystickElement = document.getElementById("left-joystick");
    const rightJoystickElement = document.getElementById("right-joystick");

    if (!leftJoystickElement || !rightJoystickElement) return;

    // Configuración para el joystick izquierdo (movimiento)
    const leftOptions = {
      zone: leftJoystickElement,
      mode: "static",
      position: { left: "20%", bottom: "20%" },
      color: "white",
      size: 120,
      dynamicPage: true,
      lockX: false,
      lockY: false,
      catchDistance: 150,
      restOpacity: 0.6,
    };

    // Configuración para el joystick derecho (cámara)
    const rightOptions = {
      zone: rightJoystickElement,
      mode: "static",
      position: { right: "20%", bottom: "20%" },
      color: "white",
      size: 120,
      dynamicPage: true,
      lockX: false,
      lockY: false,
      catchDistance: 150,
      restOpacity: 0.6,
    };

    // Crear instancias de nipplejs
    leftManagerRef.current = nipplejs.create(leftOptions);
    rightManagerRef.current = nipplejs.create(rightOptions);

    // Manejar eventos del joystick izquierdo (movimiento)
    leftManagerRef.current.on("move", (evt, data) => {
      if (data.force > 0.1) {
        // Normalizar los valores del vector al rango [-1, 1]
        const normalizedX =
          Math.cos(data.angle.radian) * Math.min(1, data.force / 50);
        const normalizedY =
          -Math.sin(data.angle.radian) * Math.min(1, data.force / 50);

        leftVectorRef.current = {
          x: normalizedX,
          y: normalizedY,
        };
      }
    });

    leftManagerRef.current.on("end", () => {
      // Resetear vector al soltar
      leftVectorRef.current = { x: 0, y: 0 };
    });

    // Manejar eventos del joystick derecho (cámara)
    rightManagerRef.current.on("move", (evt, data) => {
      if (data.force > 0.1) {
        // Normalizar los valores para la rotación de la cámara (simulando movimiento del ratón)
        const normalizedX =
          Math.cos(data.angle.radian) * Math.min(1, data.force / 50);
        const normalizedY =
          -Math.sin(data.angle.radian) * Math.min(1, data.force / 50);

        // Almacenar los valores normalizados (simulando movimiento del ratón)
        rightVectorRef.current = {
          x: normalizedX * CAMERA_SENSITIVITY,
          y: normalizedY * CAMERA_SENSITIVITY,
        };
      }
    });

    rightManagerRef.current.on("end", () => {
      // Resetear vector al soltar
      rightVectorRef.current = { x: 0, y: 0 };
    });

    // Inicializar rotación de cámara
    euler.setFromQuaternion(camera.quaternion);

    // Limpiar al desmontar
    return () => {
      if (leftManagerRef.current) {
        leftManagerRef.current.destroy();
      }
      if (rightManagerRef.current) {
        rightManagerRef.current.destroy();
      }
    };
  }, [
    deviceType?.isTouchDevice,
    camera,
    isPointerLocked,
    CAMERA_SENSITIVITY,
    euler,
  ]);

  // Aplicar el movimiento del joystick a cada frame con delta time compensation
  useFrame((state, deltaTime) => {
    // Update activity tracking
    visibilityRef.current.lastActiveTime = performance.now();

    // Safety: Clamp deltaTime to prevent huge movements
    const safeDeltaTime = Math.min(deltaTime, MAX_DELTA_TIME);

    // Check if we should use a fixed delta when returning from background
    const timeSinceActive =
      performance.now() - visibilityRef.current.lastActiveTime;
    const useFixedDelta = timeSinceActive < 100; // Within 100ms of becoming active
    const effectiveDelta = useFixedDelta ? 1 / 60 : safeDeltaTime;

    if (
      !deviceType?.isTouchDevice ||
      !rigidBodyRef.current ||
      cameraMovement.isMoving ||
      animationCooldown ||
      !canMovePlayer
    ) {
      return;
    }

    // PARTE 1: Manejo del movimiento con joystick izquierdo
    // Obtener velocidad actual
    const currentVel = rigidBodyRef.current.linvel();

    // Si el joystick izquierdo está activo
    if (leftVectorRef.current.x !== 0 || leftVectorRef.current.y !== 0) {
      rigidBodyRef.current.wakeUp();

      // Crear vector de dirección según la orientación de la cámara
      movementVector.set(leftVectorRef.current.x, 0, leftVectorRef.current.y);

      // Aplicar orientación de la cámara al movimiento
      movementVector.applyQuaternion(camera.quaternion);

      // Calculate frame-rate independent movement
      const frameAdjustedSpeed = MOVE_SPEED * effectiveDelta * 60; // Normalizado a 60fps
      movementVector.multiplyScalar(frameAdjustedSpeed);

      // Safety: Clamp velocity magnitude
      const speed = movementVector.length();
      if (speed > MAX_VELOCITY) {
        movementVector.multiplyScalar(MAX_VELOCITY / speed);
      }

      // Establecer la velocidad
      rigidBodyRef.current.setLinvel({
        x: movementVector.x,
        y: currentVel.y,
        z: movementVector.z,
      });
    } else if (currentVel.x !== 0 || currentVel.z !== 0) {
      // Detener el movimiento cuando no hay input (solo si es necesario)
      rigidBodyRef.current.setLinvel({
        x: 0,
        y: currentVel.y,
        z: 0,
      });
    }

    // PARTE 2: Manejo de la rotación de cámara con joystick derecho
    if (rightVectorRef.current.x !== 0 || rightVectorRef.current.y !== 0) {
      // Ajustar sensibilidad basada en delta time para movimientos consistentes
      const rotationSpeed = 1.0 * effectiveDelta * 60; // Normalizado a 60fps

      // Actualizar rotación X (mirar arriba/abajo)
      euler.x -= rightVectorRef.current.y * rotationSpeed;

      // Limitar rotación X para evitar dar la vuelta completa
      euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

      // Actualizar rotación Y (mirar izquierda/derecha)
      euler.y -= rightVectorRef.current.x * rotationSpeed;

      // Aplicar rotaciones a la cámara usando quaternion
      camera.quaternion.setFromEuler(euler);
    }

    // Check for emergency velocity correction
    const playerSpeed = Math.sqrt(
      currentVel.x * currentVel.x + currentVel.z * currentVel.z
    );

    if (playerSpeed > MAX_VELOCITY * 1.5) {
      // Emergency velocity correction - player is moving too fast
      rigidBodyRef.current.setLinvel({
        x: 0,
        y: currentVel.y,
        z: 0,
      });
    }
  });

  // Este componente no renderiza nada visible
  return null;
}
