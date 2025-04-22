/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";
import { getAssetPath } from "@/data/assets";

Alfombra.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function Alfombra({ material, ...props }) {
  const { nodes } = useGLTF(getAssetPath("ALFOMBRA"));

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Fugu_Office_Alfombra002.geometry}
        material={material}
        position={[0.854, 0.011, -5.061]}
      />
    </group>
  );
}
