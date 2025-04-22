/* eslint-disable react/no-unknown-property */
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { meshBounds, useGLTF, Instances, Instance } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Piedras(props) {
  const { nodes, materials } = useGLTF(
    "/piedras_jardin/TheOFFice_Piedras_Shader_v02.glb"
  );

  const groupRef = useRef();

  const {
    objectRef: gardenRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 5,
  });

  // Solución para el problema de frustum culling
  useEffect(() => {
    if (groupRef.current) {
      // Asegurarse de que las instancias tengan un bounding box correcto
      const computeBoundingSphere = () => {
        // Crear un objeto para calcular el bounding box
        const box = new THREE.Box3();
        const positions = [
          new THREE.Vector3(-6.765, 0.555, 3.204),
          new THREE.Vector3(-8.192, 0.534, 0.863),
          new THREE.Vector3(-6.236, 0.537, -0.088),
        ];

        // Ampliar el tamaño del box para cada instancia
        const instanceSize = 0.5; // Ajustar según el tamaño real de las piedras
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
            sphere.radius *= 1.5; // Incrementado para piedras que pueden ser más grandes

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
    <group ref={groupRef} {...props} dispose={null}>
      <Instances
        geometry={nodes.Cube070.geometry}
        material={materials["Piedra Volcanica LOW"]}
      >
        <Instance position={[-6.765, 0.555, 3.204]} rotation={[0, 0.726, 0]} />
        <Instance
          position={[-8.192, 0.534, 0.863]}
          rotation={[-1.585, 0.037, -0.941]}
        />
        <Instance
          ref={gardenRef}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          position={[-6.236, 0.537, -0.088]}
          rotation={[0.109, 1.179, -1.665]}
        >
          <TextComponent
            position={[0, 1, 0]}
            cardName={CARD_NAMES.Piedras}
            isNearby={isNearby}
          />
        </Instance>
      </Instances>
    </group>
  );
}
