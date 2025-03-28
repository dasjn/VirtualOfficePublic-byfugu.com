/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three"; // Necesario para validar el material

GardenGlass.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export default function GardenGlass({ material, ...props }) {
  const { nodes } = useGLTF("/FUGU_CristaleraJardin_v01.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Marco_Cristal.geometry}
        material={material}
        position={[0.209, 6.971, -1.986]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cristal.geometry}
        material={material}
        position={[0.24, 6.971, -1.986]}
      />
    </group>
  );
}
