/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three"; // Necesario para validar el material

Couch.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export default function Couch({ material, ...props }) {
  const { nodes } = useGLTF("/FUGU_Sillon_v01.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube025.geometry}
        material={material}
        position={[0.792, 0.544, -6.038]}
        rotation={[-Math.PI, 1.57, -Math.PI]}
      />
    </group>
  );
}

useGLTF.preload("/FUGU_Sillon_v01.glb");
