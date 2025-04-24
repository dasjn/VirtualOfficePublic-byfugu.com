/* eslint-disable react/no-unknown-property */
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three";
import { getAssetPath } from "@/data/assets";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

BigAssetsGRP.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function BigAssetsGRP({ material, ...props }) {
  const { nodes } = useGLTF(getAssetPath("BIG_ASSETS_GRP"));
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Marco_Cristal001.geometry}
        material={material}
        position={[0.209, 6.981, -1.986]}
      />
    </group>
  );
}
