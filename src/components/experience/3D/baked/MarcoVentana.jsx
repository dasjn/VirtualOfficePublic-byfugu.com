/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

MarcoVentana.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function MarcoVentana({ material, ...props }) {
  const { nodes } = useGLTF(
    "/big_assets_baked/TheOFFice_MarcoVentana_Baked_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Marco_Cristal001.geometry}
        material={material}
        position={[0.209, 6.971, -1.986]}
      />
    </group>
  );
}
