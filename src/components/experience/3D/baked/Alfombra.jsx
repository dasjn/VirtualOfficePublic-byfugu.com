/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";
import { usePreloadModel } from "@/hooks/usePreloadHooks";

const MODEL_PATH = "/big_assets_baked/TheOFFice_Alfombra_Baked_v01.glb";

Alfombra.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function Alfombra({ material, ...props }) {
  usePreloadModel(MODEL_PATH);
  const { nodes } = useGLTF(MODEL_PATH);

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
