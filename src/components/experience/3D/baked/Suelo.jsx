/* eslint-disable react/no-unknown-property */
import { useGLTF, useTexture } from "@react-three/drei";
import { usePreloadModel, usePreloadTexture } from "@/hooks/usePreloadHooks";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

// Constantes para los recursos
const MODEL_PATH = "/suelo/TheOFFice_Suelo_Baked_v03.glb";
const TEXTURE_PATH = "/suelo/Bake_Suelo_v03.webp";

export function Suelo(props) {
  // Precargar el modelo (evita duplicaciones)
  usePreloadModel(MODEL_PATH);
  usePreloadTexture(TEXTURE_PATH);

  const texture = useTexture(TEXTURE_PATH);

  // Cargar el modelo normalmente
  const { nodes } = useGLTF(MODEL_PATH);

  const textureMaterial = useMemo(() => {
    if (!texture) {
      // Si la textura no está disponible, usar el material original como fallback
      return nodes.Suelo003.material;
    }
    // Crear un material con la textura GainMap
    return new THREE.MeshBasicMaterial({ map: texture, color: 0x999999 });
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
