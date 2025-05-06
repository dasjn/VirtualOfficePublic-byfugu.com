/* eslint-disable react/no-unknown-property */
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { getAssetPath } from "@/data/assets";
import { useKTX2Asset } from "@/hooks/useKTX2Asset";

export function Suelo(props) {
  const texture = useKTX2Asset("SUELO_BAKE");

  // Cargar el modelo normalmente
  const { nodes } = useGLTF(getAssetPath("SUELO_BAKED"));

  const textureMaterial = useMemo(() => {
    if (!texture) {
      // Si la textura no está disponible, usar el material original como fallback
      return nodes.Suelo003.material;
    }
    // Crear un material con la textura GainMap
    return new THREE.MeshBasicMaterial({ map: texture });
  }, [nodes, texture]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Suelo003.geometry}
        material={textureMaterial}
        position={[0.236, 4.124, 0.607]}
      />
    </group>
  );
}
