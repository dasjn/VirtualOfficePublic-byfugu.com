/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

ManetasPuertas.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function ManetasPuertas({ material, ...props }) {
  const { nodes } = useGLTF(
    "small_assets_baked/TheOFFice_ManetasPuerta_Baked_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cylinder063.geometry}
        material={material}
        position={[-3.86, 1.032, -2.039]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        geometry={nodes.Cylinder065.geometry}
        material={material}
        position={[3.644, 1.032, 4.707]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
      />
      <mesh
        geometry={nodes.Cylinder067.geometry}
        material={material}
        position={[-0.904, 1.032, 4.707]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
      />
    </group>
  );
}
