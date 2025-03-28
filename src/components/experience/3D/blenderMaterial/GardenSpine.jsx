/* eslint-disable react/no-unknown-property */
import React, { useState } from "react";
import { useGLTF, meshBounds } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import TextComponent, { CARD_NAMES } from "../../TextComponent";

export function GardenSpine(props) {
  const { nodes, materials } = useGLTF("/FUGU_Jardin_Espina_v01.glb");
  const [dummy] = useState(() => new THREE.Object3D());

  const {
    objectRef: spineRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 4,
  });

  useFrame((state, dt) => {
    const { x, y, z } = state.camera.position;

    if (spineRef.current) {
      // Make the spine always face the camera
      dummy.position.copy(spineRef.current.position);
      dummy.lookAt(x, -10, z);
      easing.dampQ(spineRef.current.quaternion, dummy.quaternion, 0.5, dt);
    }
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={spineRef}
        castShadow
        receiveShadow
        geometry={nodes.Espina_Low.geometry}
        material={materials["Metal Rough Bake"]}
        position={[-6.569, 1.681, 1.461]}
        rotation={[1.539, 0.251, -1.422]}
        scale={1.386}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        raycast={meshBounds}
      >
        {/* Usar CARD_NAMES para autocompletado */}
        <TextComponent
          position={[1, 0, 0]}
          cardName={CARD_NAMES.GardenSpine}
          isNearby={isNearby}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/FUGU_Jardin_Espina_v01.glb");
