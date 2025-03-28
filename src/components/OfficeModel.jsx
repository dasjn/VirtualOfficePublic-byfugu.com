import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function OfficeModel(props) {
  const { nodes, materials } = useGLTF("/TheOFFiceFUGU_Environment_v2.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Suelo.geometry}
        material={materials["Suelo Baked 3"]}
        position={[0.236, 4.114, 0.607]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Vigas.geometry}
        material={materials["Pared Ult Baked v02"]}
        position={[0.209, 6.971, -1.986]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Luz_02.geometry}
        material={materials["MEGALIGHT Baked"]}
        position={[0.236, 4.096, 0.607]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Luz_03.geometry}
        material={materials["MEGALIGHT Baked"]}
        position={[-1.632, 4.09, -6.774]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Luz_01.geometry}
        material={materials["MEGALIGHT Baked"]}
        position={[2.141, 4.09, -6.774]}
      />
    </group>
  );
}

useGLTF.preload("/TheOFFiceFUGU_Environment_v2.glb");
