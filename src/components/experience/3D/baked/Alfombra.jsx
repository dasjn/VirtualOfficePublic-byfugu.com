/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

Alfombra.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function Alfombra({ material, ...props }) {
  const { nodes } = useGLTF(
    "/big_assets_baked/TheOFFice_Alfombra_Baked_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Fugu_Office_Alfombra002.geometry}
        material={material}
        position={[0.854, 0.001, -5.061]}
      />
    </group>
  );
}

useGLTF.preload("/big_assets_baked/TheOFFice_Alfombra_Baked_v01.glb");
