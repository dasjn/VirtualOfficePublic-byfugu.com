/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Sobres(props) {
  const { nodes } = useGLTF("/sobres/TheONFFICE_Sobres_v01.glb");

  const texture = useTexture("/sobres/Sobre-Bake-02.webp");
  texture.flipY = false;

  const textureMaterial = useMemo(() => {
    // Crear un material con la textura GainMap
    return new THREE.MeshBasicMaterial({
      map: texture,
      color: new THREE.Color(0x666666),
    });
  }, [texture]);

  return (
    <group {...props} dispose={null}>
      <mesh
        scale={1.5}
        castShadow
        receiveShadow
        geometry={nodes.Cube074.geometry}
        material={textureMaterial}
        position={[-3.464, 0.734, -7.682]}
      />
      <mesh
        scale={1.5}
        castShadow
        receiveShadow
        geometry={nodes.Cube075.geometry}
        material={textureMaterial}
        position={[-3.39, 0.737, -7.785]}
        rotation={[-0.015, -0.984, -0.018]}
      />
      <mesh
        scale={1.5}
        castShadow
        receiveShadow
        geometry={nodes.Cube076.geometry}
        material={textureMaterial}
        position={[-3.431, 0.735, -7.636]}
        rotation={[0, 0.166, 0]}
      />
    </group>
  );
}

useGLTF.preload("/sobres/TheONFFICE_Sobres_v01.glb");
