/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";

CuerdaMesa.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function CuerdaMesa({ material, ...props }) {
  const { nodes } = useGLTF(
    "/small_assets_baked/TheOFFice_CuerdaMesaSetUp_Baked_v02.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cylinder064.geometry}
        material={material}
        position={[-3.868, 1.149, -3.53]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={0.009}
      />
      <mesh
        geometry={nodes.Cylinder066.geometry}
        material={material}
        position={[-3.868, 1.149, -3.53]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={0.009}
      />
      <mesh
        geometry={nodes.Cylinder068.geometry}
        material={material}
        position={[-3.105, 0.726, -3.53]}
        rotation={[0, 0, -Math.PI]}
        scale={0.009}
      />
      <mesh
        geometry={nodes.Cylinder070.geometry}
        material={material}
        position={[-3.868, 1.149, -9.888]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={0.009}
      />
      <mesh
        geometry={nodes.Cylinder071.geometry}
        material={material}
        position={[-3.868, 1.149, -9.888]}
        rotation={[0, 0, -Math.PI / 2]}
      />
      <mesh
        geometry={nodes.Cylinder072.geometry}
        material={material}
        position={[-3.105, 0.726, -9.888]}
        rotation={[0, 0, -Math.PI]}
        scale={0.009}
      />
    </group>
  );
}

useGLTF.preload("/small_assets_baked/TheOFFice_CuerdaMesaSetUp_Baked_v02.glb");
