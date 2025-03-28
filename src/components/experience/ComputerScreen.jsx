/* eslint-disable react/no-unknown-property */
import { Html, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three"; // Necesario para validar el material
import { useExperience } from "@/hooks/useExperience";

ComputerScreen.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
  isPointerLocked: PropTypes.bool,
};

const moveDuration = 2000; // Duración de la animación en milisegundos

// Función para mover un objeto suavemente de una posición a otra
const moveToTarget = (startPosition, targetPosition, onUpdate, onComplete) => {
  let startTime = Date.now();

  const moveInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const t = Math.min(elapsedTime / moveDuration, 1); // Normalizar el tiempo entre 0 y 1

    // Interpolamos la posición entre la posición actual y la final
    const newPosition = startPosition.clone().lerp(targetPosition, t);

    // Llamamos a la función de actualización con la nueva posición
    onUpdate(newPosition);

    // Detenemos la animación cuando se alcanza la posición final
    if (t >= 1) {
      clearInterval(moveInterval);
      if (onComplete) onComplete(); // Llamamos a la función de completado si existe
    }
  }, 16); // Aproximadamente 60 FPS
};

export default function ComputerScreen({ material, ...props }) {
  const { nodes, materials } = useGLTF("/FUGU_OrdenadorWeb_v01.glb");
  const emissiveRefs = useRef({
    Computer: nodes.Mac_Body.material,
  });
  const { rigidBodyRef, isPointerLocked } = useExperience();
  const computerRef = useRef();
  const meshComputerRef = useRef();
  const { camera } = useThree();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [distance, setDistance] = useState(10);
  const [targetIntensity, setTargetIntensity] = useState(0.1); // Target intensity for lerp
  const lerpSpeed = 0.1; // Speed of the interpolation

  const screenBackgroundMaterial = new THREE.MeshBasicMaterial({
    color: "#000000",
  });

  const handlePointerOver = () => setIsMouseOver(true);
  const handlePointerOut = () => setIsMouseOver(false);

  const handleComputerClick = () => {
    if (isPointerLocked && isMouseOver && distance < 3) {
      const worldPositionComputer = new THREE.Vector3();
      meshComputerRef.current.getWorldPosition(worldPositionComputer);

      if (rigidBodyRef.current) {
        // Obtener la posición actual del rigidBody
        const currentPosition = camera.position;

        // Calculamos la nueva posición objetivo
        const targetPosition = new THREE.Vector3(
          worldPositionComputer.x + 1, // Ajuste en el eje X si es necesario
          camera.position.y, // Usamos la posición Y de la cámara para mantener la altura
          worldPositionComputer.z
        );

        // Llamamos a la función moveToTarget para mover la cámara
        moveToTarget(currentPosition, targetPosition, (newPosition) => {
          // Actualizamos la posición del rigidBody de manera suave
          rigidBodyRef.current.setTranslation(newPosition, true);
          camera.lookAt(worldPositionComputer);
        });
      }
    }
  };

  useEffect(() => {
    // Set initial emissive color
    Object.keys(emissiveRefs.current).forEach((materialName) => {
      const material = emissiveRefs.current[materialName];
      if (material) {
        material.emissive.setRGB(0.4, 0.3, 0); // Set emissive color to a specific RGB value
      }
    });
  }, []);

  useFrame(() => {
    if (computerRef.current && meshComputerRef.current) {
      const worldPositionComputer = new THREE.Vector3();
      meshComputerRef.current.getWorldPosition(worldPositionComputer);

      const worldPositionCamera = new THREE.Vector3();
      camera.getWorldPosition(worldPositionCamera);

      setDistance(worldPositionCamera.distanceTo(worldPositionComputer));

      if (distance < 3 && isMouseOver) {
        setTargetIntensity(10); // Incrementa la intensidad
      } else {
        setTargetIntensity(0.1); // Reduce la intensidad
      }
    }
    // Calculate emissive intensity with lerp
    const emissiveIntensity =
      emissiveRefs.current.Computer.emissiveIntensity || 0.1;
    const newIntensity =
      emissiveIntensity + (targetIntensity - emissiveIntensity) * lerpSpeed;

    if (emissiveRefs.current.Computer) {
      emissiveRefs.current.Computer.emissiveIntensity = newIntensity;
    }
  });

  return (
    <group
      ref={computerRef}
      {...props}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleComputerClick}
    >
      <mesh
        ref={meshComputerRef}
        castShadow
        receiveShadow
        geometry={nodes.Mac_Body.geometry}
        material={nodes.Mac_Body.material}
        material-emissiveIntensity={
          emissiveRefs.current.Computer.emissiveIntensity
        }
        position={[-3.537, 1.182, -4.864]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Screen_Body.geometry}
        material={screenBackgroundMaterial}
        position={[-3.526, 1.184, -4.864]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Soporte.geometry}
        material={material}
        position={[-3.578, 0.831, -4.865]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Screen_Panel.geometry}
        material={nodes.Screen_Panel.material}
        position={[-3.524, 1.183, -4.864]}
        rotation={[0, 0, -0.003]}
      >
        <group rotation={[0, 0, THREE.MathUtils.degToRad(8)]}>
          <Html
            zIndexRange={[0, 1]}
            transform
            wrapperClass="computerScreen"
            distanceFactor={0.19}
            rotation={[0, Math.PI / 2, 0]}
          >
            <iframe src="https://byfugu.com" />
          </Html>
        </group>
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cable.geometry}
        material={material}
        position={[-3.657, 0.888, -4.861]}
      />
    </group>
  );
}

useGLTF.preload("/FUGU_OrdenadorWeb_v01.glb");
