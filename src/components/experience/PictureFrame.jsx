/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three"; // Necesario para validar el material

PictureFrame.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export default function PictureFrame({ material, ...props }) {
  const { nodes } = useGLTF("/FUGU_Cuadro1_v01.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.MarcoCuadro.geometry}
        material={material}
        position={[4.324, 2.261, -2.279]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.CuadroImg.geometry}
        material={nodes.CuadroImg.material}
        position={[4.322, 2.261, -2.279]}
      />
    </group>
  );
}

useGLTF.preload("/FUGU_Cuadro1_v01.glb");
