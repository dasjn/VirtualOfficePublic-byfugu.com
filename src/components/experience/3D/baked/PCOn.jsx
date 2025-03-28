/* eslint-disable react/no-unknown-property */
import { Html, meshBounds, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useExperience } from "@/hooks/useExperience";
import { motion, AnimatePresence } from "framer-motion";

// Estilos CSS para la pantalla y las animaciones
const screenStyles = {
  container: {
    overflow: "hidden",
    position: "relative",
    background: "#000",
  },
  iframe: {
    border: "none",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

// Componente para el contenido de la pantalla con animaciones
const ScreenContent = ({ isUserOnPC }) => {
  return (
    <div style={screenStyles.container}>
      <AnimatePresence mode="wait">
        {isUserOnPC ? (
          <motion.div
            key="iframe"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: "auto", height: "auto" }}
          >
            <iframe src="https://byfugu.com" style={screenStyles.iframe} />
          </motion.div>
        ) : (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ width: "100%", height: "100%" }}
          >
            <img
              src="/images/Desktop_Macbook_v3.webp"
              style={screenStyles.image}
              alt="Desktop"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

PCOn.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function PCOn({ material: bakedMaterial, ...props }) {
  const { nodes } = useGLTF("/small_assets_baked/TheOFFice_PcOn_Baked_v02.glb");

  // Optimización: usar useMemo para el material
  const testMaterialRef = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#000000", // Color base
        emissive: new THREE.Color(0.4, 0.3, 0), // Color de la emisión
        emissiveIntensity: 0.1, // Intensidad de emisión inicial
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

  const computerRef = useRef();
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
    if (computerRef.current && meshComputerRef.current) {
      meshComputerRef.current.getWorldPosition(worldPositionComputer);
      camera.getWorldPosition(worldPositionCamera);

      const currentDistance = worldPositionCamera.distanceTo(
        worldPositionComputer
      );
      setDistance(currentDistance);

      // Si el ratón está cerca y sobre el objeto, aumentamos la intensidad
      if (currentDistance < 3 && isMouseOver && !isUserOnPC) {
        setTargetIntensity(10);
      } else {
        setTargetIntensity(0.1);
      }
    }

    // Interpolamos la intensidad de emisión para un cambio suave
    const emissiveIntensity = testMaterialRef.emissiveIntensity;
    testMaterialRef.emissiveIntensity = THREE.MathUtils.lerp(
      emissiveIntensity,
      targetIntensity,
      lerpSpeed
    );
  });

  const handlePointerOver = useCallback(() => setIsMouseOver(true), []);
  const handlePointerOut = useCallback(() => setIsMouseOver(false), []);

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
    <group ref={computerRef} {...props} dispose={null}>
      <mesh
        geometry={nodes.Mac_Body006.geometry}
        material={bakedMaterial}
        position={[-3.537, 1.182, -4.864]}
      />
      <mesh
        geometry={nodes.Screen_Body006.geometry}
        material={bakedMaterial} // Usamos bakedMaterial (no tiene emisión)
        position={[-3.526, 1.184, -4.864]}
        visible={distance > 3 && !isMouseOver}
      />
      <mesh
        ref={meshComputerRef}
        geometry={nodes.Screen_Body006.geometry}
        material={testMaterialRef} // Usamos testMaterial con emisión
        position={[-3.526, 1.184, -4.864]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleComputerClick}
        raycast={meshBounds} // Añadimos la funcionalidad de bounds para las interacciones
      />

      {/* Resto de los componentes del PC */}
      <mesh
        geometry={nodes.Soporte006.geometry}
        material={bakedMaterial}
        position={[-3.578, 0.831, -4.865]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes.Screen_Panel002.geometry}
        material={bakedMaterial}
        position={[-3.524, 1.183, -4.864]}
        rotation={[0, 0, -0.003]}
      >
        <group rotation={[0, 0, THREE.MathUtils.degToRad(8)]}>
          <Html
            position={[0.001, 0, 0]}
            zIndexRange={[100, 1000]}
            transform
            wrapperClass="computerScreen"
            distanceFactor={0.19}
            rotation={[0, Math.PI / 2, 0]}
            occlude={isUserOnPC ? false : "blending"}
          >
            <ScreenContent isUserOnPC={isUserOnPC} />
          </Html>
        </group>
      </mesh>
      <mesh
        geometry={nodes.Cable006.geometry}
        material={bakedMaterial}
        position={[-3.657, 0.888, -4.861]}
      />
      <mesh
        geometry={nodes.polySurface43006.geometry}
        material={bakedMaterial}
        position={[-3.262, 0.742, -4.866]}
        rotation={[Math.PI / 2, 0, -1.536]}
      />
      <mesh
        geometry={nodes.mouse006.geometry}
        material={bakedMaterial}
        position={[-3.264, 0.74, -5.219]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <mesh
        geometry={nodes.Cube065.geometry}
        material={bakedMaterial}
        position={[-3.55, 0.799, -5.179]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}

useGLTF.preload("/small_assets_baked/TheOFFice_PcOn_Baked_v02.glb");
