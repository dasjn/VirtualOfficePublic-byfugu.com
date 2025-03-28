/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

MarcoCuadro01.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function MarcoCuadro01({ material, ...props }) {
  const { nodes } = useGLTF(
    "/big_assets_baked/TheOFFice_MarcoCuadro01_Baked_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.MarcoCuadro004.geometry}
        material={material}
        position={[4.324, 2.261, -6.071]}
      />
    </group>
  );
}

useGLTF.preload("/big_assets_baked/TheOFFice_MarcoCuadro01_Baked_v01.glb");
