/* eslint-disable react/no-unknown-property */
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function GlobosCielo(props) {
  const { nodes, materials } = useGLTF(
    "/globos_cielo/TheOFFice_GlobosCielo_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.GlobosCielo_v01.geometry}
        material={materials.GlobosCielo_v01}
        position={[-19.182, 17.265, -7.877]}
        rotation={[Math.PI / 2, 0, -1.246]}
        scale={2.833}
      />
    </group>
  );
}
