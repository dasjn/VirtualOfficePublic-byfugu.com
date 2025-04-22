/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

PCOff.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function PCOff({ material, ...props }) {
  const { nodes } = useGLTF("small_assets_baked/TheOFFice_PcOFF_Baked_v02.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Mac_Body007.geometry}
        material={material}
        position={[-3.537, 1.182, -8.606]}
      />
      <mesh
        geometry={nodes.Screen_Body007.geometry}
        material={material}
        position={[-3.526, 1.184, -8.606]}
      />
      <mesh
        geometry={nodes.Soporte007.geometry}
        material={material}
        position={[-3.578, 0.831, -8.607]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes.Cable007.geometry}
        material={material}
        position={[-3.657, 0.888, -8.603]}
      />
      <mesh
        geometry={nodes.polySurface43007.geometry}
        material={material}
        position={[-3.262, 0.742, -8.608]}
        rotation={[Math.PI / 2, 0, -1.536]}
      />
      <mesh
        geometry={nodes.mouse007.geometry}
        material={material}
        position={[-3.264, 0.74, -8.961]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <mesh
        geometry={nodes.Cube066.geometry}
        material={material}
        position={[-3.55, 0.799, -8.921]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <mesh
        geometry={nodes.Mac_Body008.geometry}
        material={material}
        position={[-3.537, 1.182, -6.741]}
      />
      <mesh
        geometry={nodes.Screen_Body008.geometry}
        material={material}
        position={[-3.526, 1.184, -6.741]}
      />
      <mesh
        geometry={nodes.Soporte008.geometry}
        material={material}
        position={[-3.578, 0.831, -6.741]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes.Cable008.geometry}
        material={material}
        position={[-3.657, 0.888, -6.738]}
      />
      <mesh
        geometry={nodes.polySurface43008.geometry}
        material={material}
        position={[-3.262, 0.742, -6.742]}
        rotation={[Math.PI / 2, 0, -1.536]}
      />
      <mesh
        geometry={nodes.mouse008.geometry}
        material={material}
        position={[-3.264, 0.74, -7.096]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <mesh
        geometry={nodes.Cube067.geometry}
        material={material}
        position={[-3.55, 0.799, -7.056]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  );
}
