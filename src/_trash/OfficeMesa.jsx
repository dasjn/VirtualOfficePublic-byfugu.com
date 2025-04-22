/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export function OfficeMesa(props) {
  const { nodes, materials } = useGLTF(
    "/mesa_office/TheOFFice_OfficeMesa_Shader_v02.glb"
  );

  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders="cuboid">
        <group position={[0.006, 0.252, -0.157]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder062.geometry}
            material={materials["Elementos Office LOW 2"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder062_1.geometry}
            material={materials["Mesas 01"]}
          />
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Butaca_2.geometry}
          material={materials["Elementos Office LOW 2"]}
          position={[-1.02, 0.01, -0.304]}
        />
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Butaca_3.geometry}
          material={materials["Elementos Office LOW 2"]}
          position={[-0.288, 0.01, 0.84]}
          scale={0.181}
        />
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Butaca_1.geometry}
          material={materials["Elementos Office LOW 2"]}
          position={[0.944, 0.01, -0.63]}
          scale={0.181}
        />
      </RigidBody>
    </group>
  );
}
