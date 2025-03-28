/* eslint-disable react/no-unknown-property */
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Suelo(props) {
  const { nodes, materials } = useGLTF("/suelo/TheOFFice_Suelo_Baked_v02.glb");

  const sueloBakedTexture = useTexture("/suelo/Bake_Suelo_v01.jpg");
  sueloBakedTexture.flipY = false;

  const sueloBakedTextureMaterial = new THREE.MeshStandardMaterial({
    map: sueloBakedTexture,
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Suelo003.geometry}
        material={sueloBakedTextureMaterial}
        position={[0.236, 4.114, 0.607]}
      />
    </group>
  );
}

useGLTF.preload("/suelo/TheOFFice_Suelo_Baked_v02.glb");
