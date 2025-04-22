/* eslint-disable react/no-unknown-property */
import React, { useRef } from "react";
import { useGLTF, meshBounds } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";

import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import TextComponent, { CARD_NAMES } from "../../TextComponent";

export function GardenSpine(props) {
  const { nodes, materials } = useGLTF("/FUGU_Jardin_Espina_v01.glb");
  const dummy = useRef(new THREE.Object3D());

  const {
    objectRef: spineRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({ maxDistance: 4 });

  useFrame((state, dt) => {
    const { x, z } = state.camera.position;

    if (spineRef.current) {
      dummy.current.position.copy(spineRef.current.position);
      dummy.current.lookAt(x, -10, z); // keep -10 if that's what works
      easing.dampQ(
        spineRef.current.quaternion,
        dummy.current.quaternion,
        0.5,
        dt
      );
    }
  });

  return (
    <group {...props}>
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
