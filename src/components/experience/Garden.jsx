/* eslint-disable react/no-unknown-property */
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function Garden(props) {
  const { nodes } = useGLTF("/FUGU_Jardin_v01.glb");

  const texture = useTexture("/Baked_Jardin_v01.jpg");
  texture.flipY = false;

  const textureMaterial = new THREE.MeshBasicMaterial({
    map: texture,
  });
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube021.geometry}
        material={textureMaterial}
        position={[-6.765, 0.584, 3.204]}
        rotation={[0, 0.726, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube020.geometry}
        material={textureMaterial}
        position={[-6.256, 0.585, -0.091]}
        rotation={[0.008, -0.369, 1.569]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube022.geometry}
        material={textureMaterial}
        position={[-8.234, 0.457, 0.849]}
        rotation={[0.005, 0.638, 1.575]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor_Sand.geometry}
        material={textureMaterial}
        position={[0.209, 7.028, -1.986]}
      />
    </group>
  );
}

useGLTF.preload("/FUGU_Jardin_v01.glb");
