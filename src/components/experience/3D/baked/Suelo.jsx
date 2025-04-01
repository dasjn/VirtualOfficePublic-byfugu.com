/* eslint-disable react/no-unknown-property */
import { useGainMapTexture } from "@/hooks/useGainMapTexture";
import { useGLTF } from "@react-three/drei";
import { usePreloadModel } from "@/hooks/usePreloadHooks";
import { useMemo } from "react";
import * as THREE from "three";

// Constantes para los recursos
const MODEL_PATH = "/suelo/TheOFFice_Suelo_Baked_v03.glb";
const GAINMAP_ID = "suelo_texture";

export function Suelo(props) {
  // Precargar el modelo (evita duplicaciones)
  usePreloadModel(MODEL_PATH);

  // Cargar el modelo normalmente
  const { nodes, materials } = useGLTF(MODEL_PATH);

  // Obtener la textura GainMap (ya precargada centralmente)
  const texture = useGainMapTexture(GAINMAP_ID);

  // Material a usar (con la textura GainMap si está disponible)
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
        position={[0.236, 4.114, 0.607]}
      />
    </group>
  );
}
