/* eslint-disable react/no-unknown-property */
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

MarcoTV.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function MarcoTV({ material, ...props }) {
  const { nodes, materials } = useGLTF(
    "/big_assets_baked/TheOFFice_MarcoTV_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.MarcoTV.geometry}
        material={material}
        position={[0.794, 2.261, -10.047]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
    </group>
  );
}
