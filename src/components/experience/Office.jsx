/* eslint-disable react/no-unknown-property */
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import WallColliders from "./WallColliders";
import { Suelo } from "./3D/baked/Suelo";
import { Paredes } from "./3D/baked/Paredes";
import { Luces } from "./3D/blenderMaterial/Luces";

export default function Office(props) {
  const { nodes } = useGLTF("/TheOFFiceFUGU_Environment_v4.glb");
  const texture = useTexture("/Baked_All_001.jpg");
  texture.flipY = false;

  const textureMaterial = new THREE.MeshBasicMaterial({
    map: texture,
  });
  return (
    <group {...props} dispose={null} position={[0, -2, 0]}>
      <WallColliders />
      {/* Entrance wall */}
      <RigidBody type="fixed" friction={0} restitution={0}>
        <Suelo />
      </RigidBody>
      <Paredes />
      <Luces />
    </group>
  );
}

useGLTF.preload("/TheOFFiceFUGU_Environment_v4.glb");
