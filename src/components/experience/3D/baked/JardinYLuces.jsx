/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from "react";
import { Instance, Instances, useGLTF, useTexture } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import * as THREE from "three";
import { getAssetPath } from "@/data/assets";

export default function JardinYluces(props) {
  // Cargar modelos y textura
  const { nodes: nodesSuelo } = useGLTF(getAssetPath("JARDIN_SUELO_BAKED"));
  const { nodes: nodesLuces } = useGLTF(getAssetPath("JARDIN_LUCES_BAKED"));
  const { nodes: nodesPiedras } = useGLTF(getAssetPath("JARDIN_PIEDRAS_BAKED"));
  const texture = useTexture(getAssetPath("JARDIN_LUCES_BAKE"));

  const piedrasRef = useRef();

  const {
    objectRef: piedraRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 5,
  });

  // Configurar bounding sphere para frustum culling
  useEffect(() => {
    if (!piedrasRef.current) return;

    // Crear un objeto para calcular el bounding box
    const box = new THREE.Box3();
    const positions = [
      new THREE.Vector3(-6.765, 0.555, 3.204),
      new THREE.Vector3(-8.192, 0.534, 0.863),
      new THREE.Vector3(-6.236, 0.537, -0.088),
    ];

    // Expandir el box para cada instancia
    const instanceSize = 0.5;
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

    // Actualizar bounding sphere en instancias
    piedrasRef.current.traverse((child) => {
      if (child.isInstancedMesh) {
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);
        sphere.radius *= 1.5;
        child.boundingSphere = sphere;
        child.frustumCulled = true;
      }
    });
  }, [piedrasRef]);

  // Materiales con textura compartida
  const materials = useMemo(() => {
    if (!texture)
      return {
        garden: nodesSuelo.Floor_Sand001.material,
        lights: nodesSuelo.Floor_Sand001.material,
      };

    return {
      garden: new THREE.MeshBasicMaterial({ map: texture, color: 0x666666 }),
      lights: new THREE.MeshBasicMaterial({ map: texture, color: 0xdddddd }),
    };
  }, [texture, nodesSuelo]);

  return (
    <group {...props} dispose={null}>
      {/* Suelo */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodesSuelo.Floor_Sand001.geometry}
        material={materials.garden}
        position={[0.209, 7.028, -1.986]}
      />

      {/* Luces */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodesLuces.Luz_02001.geometry}
        material={materials.lights}
        position={[0.236, 4.096, 0.607]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodesLuces.Luz_03001.geometry}
        material={materials.lights}
        position={[-1.632, 4.09, -6.774]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodesLuces.Luz_01001.geometry}
        material={materials.lights}
        position={[2.141, 4.09, -6.774]}
      />

      {/* Piedras */}
      <group ref={piedrasRef}>
        <Instances
          geometry={nodesPiedras.Cube070.geometry}
          material={materials.garden}
        >
          <Instance
            position={[-6.765, 0.555, 3.204]}
            rotation={[0, 0.726, 0]}
          />
          <Instance
            position={[-8.192, 0.534, 0.863]}
            rotation={[-1.585, 0.037, -0.941]}
          />
          <Instance
            ref={piedraRef}
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
    </group>
  );
}
