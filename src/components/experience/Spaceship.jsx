import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export function Model(props) {
  const { nodes, materials } = useGLTF("/model.gltf");
  const emissiveRefs = useRef({
    Window: materials.Window,
  });
  const shipRef = useRef();
  const { camera } = useThree();

  const [isMouseOver, setIsMouseOver] = useState(false);
  const [targetIntensity, setTargetIntensity] = useState(0.1); // Target intensity for lerp
  const lerpSpeed = 0.1; // Speed of the interpolation

  const handlePointerOver = () => setIsMouseOver(true);
  const handlePointerOut = () => setIsMouseOver(false);

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
    if (shipRef.current) {
      const distance = camera.position.distanceTo(shipRef.current.position);
      if (distance < 4 && isMouseOver) {
        setTargetIntensity(10); // Brighten intensity when close
      } else {
        setTargetIntensity(0.1);
      }
    }
    // Calculate emissive intensity with lerp
    const emissiveIntensity =
      emissiveRefs.current.Window.emissiveIntensity || 0.1;
    const newIntensity =
      emissiveIntensity + (targetIntensity - emissiveIntensity) * lerpSpeed;

    if (emissiveRefs.current.Window) {
      emissiveRefs.current.Window.emissiveIntensity = newIntensity;
    }
  });

  return (
    <group
      ref={shipRef}
      {...props}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut} // Add pointer out event
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005.geometry}
        material={materials.Mat0}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005_1.geometry}
        material={materials.Mat1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005_2.geometry}
        material={materials.Mat2}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005_3.geometry}
        material={materials.Window_Frame}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005_4.geometry}
        material={materials.Mat4}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005_5.geometry}
        material={materials.Mat3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube005_6.geometry}
        material={materials.Window}
        material-emissiveIntensity={
          emissiveRefs.current.Window.emissiveIntensity
        } // Use state variable for emissive intensity
      />
    </group>
  );
}

useGLTF.preload("/model.gltf");
