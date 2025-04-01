/* eslint-disable react/no-unknown-property */
import { useGainMapTexture } from "@/hooks/usePreloadGainMap";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

export const SUELO_GAINMAP = {
  name: "SUELO_texture",
  urls: [
    "/suelo/Bake_Suelo_v03.webp",
    "/suelo/Bake_Suelo_v03-gainmap.webp",
    "/suelo/Bake_Suelo_v03.json",
  ],
};

export function Suelo(props) {
  const { nodes, materials } = useGLTF("/suelo/TheOFFice_Suelo_Baked_v03.glb");
  // Obtener la textura del sistema de precarga
  const texture = useGainMapTexture(SUELO_GAINMAP.name);

  // Material a usar
  const textureMaterial = useMemo(() => {
    if (!texture) {
      return nodes.Suelo003.material;
    }
    return new THREE.MeshBasicMaterial({ map: texture });
  }, [nodes.Suelo003.material, texture]);

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

useGLTF.preload("/suelo/TheOFFice_Suelo_Baked_v03.glb");
