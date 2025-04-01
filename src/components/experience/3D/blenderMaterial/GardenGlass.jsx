/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import PropTypes from "prop-types";
import * as THREE from "three";

GardenGlass.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export default function GardenGlass({ ...props }) {
  const { nodes } = useGLTF("/cristal_jardin/TheOFFice_CristalJardin_v01.glb");

  // Material para efecto de cristal con valores óptimos
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#ffffff"),
    transparent: true,
    opacity: 1,
    roughness: 0,
    transmission: 0.9,
    thickness: 0.2,
    reflectivity: 1.0,
    ior: 1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.5,
    envMapIntensity: 0.5,
    side: THREE.DoubleSide,
  });

  // const glassMaterial = new THREE.MeshBasicMaterial({
  //   side: THREE.DoubleSide,
  //   opacity: 0.3,
  //   transparent: true,
  // });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cristal001.geometry}
        material={glassMaterial}
        position={[-3.963, 1.401, 1.495]}
      />
    </group>
  );
}

useGLTF.preload("/cristal_jardin/TheOFFice_CristalJardin_v01.glb");
