import React, { useEffect, useMemo, useRef } from "react";
import nipplejs from "nipplejs";
import { useExperience } from "@/hooks/useExperience";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function MobileJoysticks() {
  // Esto se renderizará en el DOM normal, no dentro del canvas de Three.js
  return (
    <div
      id="mobile-controls"
      className="absolute inset-0 z-[9000] pointer-events-none"
    >
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

      {/* Botón de escape táctil (siempre visible) */}
      <div className="absolute top-4 right-4 z-[9999]">
        <button
          className="w-14 h-14 rounded-full bg-white bg-opacity-30 border border-white flex items-center justify-center pointer-events-auto"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Escape" })
            );
          }}
        >
          <span className="text-2xl font-bold">×</span>
        </button>
      </div>

      {/* Botón de interacción/acción */}
      <div className="absolute bottom-[25%] left-[50%] transform -translate-x-1/2 z-[9999]">
        <button
          className="w-16 h-16 rounded-full bg-white bg-opacity-30 border border-white flex items-center justify-center pointer-events-auto"
          onClick={() => {
            document.dispatchEvent(
              new KeyboardEvent("keydown", { key: "Space" })
            );
          }}
        >
          <span className="text-xl">👆</span>
        </button>
      </div>
    </div>
  );
}

// Este componente debe ser usado dentro del canvas de Three.js
export function MobileJoysticksLogic() {
  const leftManagerRef = useRef(null);
  const rightManagerRef = useRef(null);
  const leftVectorRef = useRef({ x: 0, y: 0 });
  const rightVectorRef = useRef({ x: 0, y: 0 });

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

  // Sensibilidad del movimiento de cámara (ajustar según sea necesario)
  const CAMERA_SENSITIVITY = 0.7;

  // Crear los joysticks cuando el componente se monta
  useEffect(() => {
    if (!deviceType?.isTouchDevice || !isPointerLocked) return;

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

  // Aplicar el movimiento del joystick a cada frame
  useFrame(() => {
    if (
      !deviceType?.isTouchDevice ||
      !rigidBodyRef.current ||
      cameraMovement.isMoving ||
      animationCooldown ||
      !canMovePlayer ||
      !isPointerLocked
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

      // Establecer la velocidad (ajustada a una velocidad razonable)
      rigidBodyRef.current.setLinvel({
        x: movementVector.x * 70,
        y: currentVel.y,
        z: movementVector.z * 70,
      });
    } else {
      // Detener el movimiento cuando no hay input
      rigidBodyRef.current.setLinvel({
        x: 0,
        y: currentVel.y,
        z: 0,
      });
    }

    // PARTE 2: Manejo de la rotación de cámara con joystick derecho
    if (rightVectorRef.current.x !== 0 || rightVectorRef.current.y !== 0) {
      // Actualizar rotación X (mirar arriba/abajo)
      euler.x -= rightVectorRef.current.y;

      // Limitar rotación X para evitar dar la vuelta completa
      euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

      // Actualizar rotación Y (mirar izquierda/derecha)
      euler.y -= rightVectorRef.current.x;

      // Aplicar rotaciones a la cámara usando quaternion
      camera.quaternion.setFromEuler(euler);
    }
  });

  // Este componente no renderiza nada visible
  return null;
}
