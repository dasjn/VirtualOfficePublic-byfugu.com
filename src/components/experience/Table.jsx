/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three"; // Necesario para validar el material

Table.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export default function Table({ material, ...props }) {
  const { nodes } = useGLTF("/FUGU_Mesa_v01.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Tablero_Mesa.geometry}
        material={nodes.Tablero_Mesa.material}
        position={[0.006, 0.252, -0.157]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Soporte_Mesa.geometry}
        material={material}
        position={[0.144, 0.09, 0.137]}
        rotation={[0, -0.102, 0]}
      />
    </group>
  );
}

useGLTF.preload("/FUGU_Mesa_v01.glb");
