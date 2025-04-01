/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";

export function SueloJardin(props) {
  const { nodes, materials } = useGLTF(
    "/suelo_jardin/TheOFFice_SueloJardin_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Floor_Sand001.geometry}
        material={materials["Arena Jardin"]}
        position={[0.209, 7.028, -1.986]}
      />
    </group>
  );
}

useGLTF.preload("/suelo_jardin/TheOFFice_SueloJardin_v01.glb");
