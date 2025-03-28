/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three"; // Necesario para validar el material

SetupTable.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export default function SetupTable({ material, ...props }) {
  const { nodes } = useGLTF("/FUGU_MesaSetup_v01.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Mesa_SetUp.geometry}
        material={material}
        position={[-2.918, 0.484, -4.449]}
      />
    </group>
  );
}

useGLTF.preload("/FUGU_MesaSetup_v01.glb");
