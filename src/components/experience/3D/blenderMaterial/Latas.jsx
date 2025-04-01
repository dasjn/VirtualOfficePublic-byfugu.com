/* eslint-disable react/no-unknown-property */
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { meshBounds, useGLTF, Instances, Instance } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Latas(props) {
  const { nodes, materials } = useGLTF("/latas/TheOFFice_Lata_Shader_v02.glb");
  const groupRef = useRef();

  const {
    objectRef: latasRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 4,
  });

  // Solución para el problema de frustum culling
  useEffect(() => {
    if (groupRef.current) {
      // Asegurarse de que las instancias tengan un bounding box correcto
      const computeBoundingSphere = () => {
        // Crear un objeto para calcular el bounding box
        const box = new THREE.Box3();
        const positions = [
          new THREE.Vector3(-0.036, 0.974, -0.353),
          new THREE.Vector3(0.112, 0.974, -0.434),
          new THREE.Vector3(0.117, 0.974, -0.32),
          new THREE.Vector3(-0.268, 0.974, -0.48),
        ];

        // Ampliar el tamaño del box para cada instancia
        const instanceSize = 0.1; // Ajustar según el tamaño real de las latas
        positions.forEach((pos) => {
          box.expandByPoint(
            new THREE.Vector3(
              pos.x - instanceSize,
              pos.y - instanceSize,
              pos.z - instanceSize
            )
          );
          box.expandByPoint(
            new THREE.Vector3(
              pos.x + instanceSize,
              pos.y + instanceSize,
              pos.z + instanceSize
            )
          );
        });

        // Encontrar la instancia y actualizar su bounding sphere
        groupRef.current.traverse((child) => {
          if (child.isInstancedMesh) {
            // Calcular una bounding sphere a partir del box
            const sphere = new THREE.Sphere();
            box.getBoundingSphere(sphere);

            // Hacer la bounding sphere ligeramente más grande para asegurarnos
            sphere.radius *= 1.2;

            // Actualizar la bounding sphere de la mesh
            child.boundingSphere = sphere;
            child.frustumCulled = true;
          }
        });
      };

      // Ejecutar después de que todo se haya cargado
      setTimeout(computeBoundingSphere, 100);
    }
  }, []);

  return (
    <group
      ref={(node) => {
        // Asignar ambas referencias
        groupRef.current = node;
        if (latasRef) latasRef.current = node;
      }}
      {...props}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      raycast={meshBounds}
    >
      <Instances geometry={nodes.Lata_2001.geometry} material={materials.Lata}>
        <Instance position={[-0.036, 0.974, -0.353]} scale={0.015} />
        <Instance
          position={[0.112, 0.974, -0.434]}
          rotation={[0, 1.403, 0]}
          scale={0.015}
        />
        <Instance
          position={[0.117, 0.974, -0.32]}
          rotation={[Math.PI, -1.152, Math.PI]}
          scale={0.015}
        />
        <Instance
          position={[-0.268, 0.974, -0.48]}
          rotation={[0, 0.185, 0]}
          scale={0.015}
        />
      </Instances>
      <TextComponent
        position={[0, 1, 0]}
        cardName={CARD_NAMES.Latas}
        isNearby={isNearby}
      />
    </group>
  );
}

useGLTF.preload("/latas/TheOFFice_Lata_Shader_v02.glb");
