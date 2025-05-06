/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef } from "react";
import { meshBounds, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { getAssetPath } from "@/data/assets";
import { useKTX2Asset } from "@/hooks/useKTX2Asset";

export default function Sobres(props) {
  const { nodes } = useGLTF(getAssetPath("SOBRES"));

  const texture = useKTX2Asset("SOBRES_BAKE");

  const textureMaterial = useMemo(() => {
    // Crear un material con la textura GainMap
    return new THREE.MeshBasicMaterial({
      map: texture,
    });
  }, [texture]);

  const {
    objectRef: sobresRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 4,
  });

  return (
    <group>
      <mesh
        ref={sobresRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        raycast={meshBounds}
        castShadow
        receiveShadow
        geometry={nodes.Cube074.geometry}
        material={textureMaterial}
        position={[-3.464, 0.734, -7.682]}
        scale={1.173}
      >
        <TextComponent
          position={[0, 0.2, 0]}
          cardName={CARD_NAMES.Sobres}
          isNearby={isNearby}
        />
      </mesh>
    </group>
  );
}
