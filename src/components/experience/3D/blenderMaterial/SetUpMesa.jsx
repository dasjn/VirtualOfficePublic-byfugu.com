/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function SetUpMesa(props) {
  const { nodes, materials } = useGLTF(
    "mesa_set_up/TheOFFice_SetUpMesa_Shader_v02.glb"
  );
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesa_SetUp002.geometry}
          material={materials["Elementos Office LOW 2"]}
          position={[-2.918, 0.484, -4.449]}
        />
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Silla_01.geometry}
          material={materials["Elementos Office LOW 2"]}
          position={[-2.449, 0.554, -5.099]}
          rotation={[Math.PI, 0.682, -Math.PI / 2]}
          scale={-0.265}
        />
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Silla_02.geometry}
          material={materials["Elementos Office LOW 2"]}
          position={[-2.802, 0.554, -6.526]}
          rotation={[3.142, 1.566, -1.571]}
          scale={-0.265}
        />
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Silla_03.geometry}
          material={materials["Elementos Office LOW 2"]}
          position={[-2.802, 0.554, -8.381]}
          rotation={[3.142, 1.566, -1.571]}
          scale={-0.265}
        />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("mesa_set_up/TheOFFice_SetUpMesa_Shader_v02.glb");
