/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

BotonPuerta.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function BotonPuerta({ material, ...props }) {
  const { nodes } = useGLTF(
    "/small_assets_baked/TheOFFice_BotonPuerta_Baked_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cube044.geometry}
        material={material}
        position={[-0.618, 0.95, 4.716]}
      />
      <mesh
        geometry={nodes.Cylinder069.geometry}
        material={material}
        position={[-0.617, 0.952, 4.709]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
      />
    </group>
  );
}
