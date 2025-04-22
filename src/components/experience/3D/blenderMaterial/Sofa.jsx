/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function Sofa(props) {
  const { nodes, materials } = useGLTF("/sofa/TheOFFice_Sofa_Shader_v03.glb");
  materials["Sofa 2"].roughness = 0.5;
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube063.geometry}
        material={materials["Sofa 2"]}
        position={[0.792, 0.544, -6.038]}
        rotation={[-Math.PI, 1.57, -Math.PI]}
      />
    </RigidBody>
  );
}
