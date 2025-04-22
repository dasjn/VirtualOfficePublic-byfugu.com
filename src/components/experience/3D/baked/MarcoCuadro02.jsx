/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

MarcoCuadro02.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};
export function MarcoCuadro02({ material, ...props }) {
  const { nodes } = useGLTF(
    "/big_assets_baked/TheOFFice_MarcoCuadro02_Baked_v01.glb"
  );

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.MarcoCuadro005.geometry}
        material={material}
        position={[4.324, 2.261, 1.602]}
      />
    </group>
  );
}
