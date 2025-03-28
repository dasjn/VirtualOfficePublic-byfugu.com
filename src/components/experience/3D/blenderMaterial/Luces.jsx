/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";

export function Luces(props) {
  const { nodes, materials } = useGLTF("/luces/TheOFFice_Luces_Shader_v01.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Luz_02001.geometry}
        material={materials.Luces}
        position={[0.236, 4.096, 0.607]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Luz_03001.geometry}
        material={materials.MEGALIGHT}
        position={[-1.632, 4.09, -6.774]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Luz_01001.geometry}
        material={materials.MEGALIGHT}
        position={[2.141, 4.09, -6.774]}
      />
    </group>
  );
}

useGLTF.preload("/luces/TheOFFice_Luces_Shader_v01.glb");
