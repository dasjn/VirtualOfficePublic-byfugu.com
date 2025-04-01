/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";
import { RigidBody } from "@react-three/rapier";

LenguaVentana.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function LenguaVentana({ material, ...props }) {
  const { nodes } = useGLTF(
    "/big_assets_baked/TheOFFice_LenguaVentana_Baked_v01.glb"
  );

  // Posición de la malla
  const position = [3.1, 4.54, -0.151];

  // Dimensiones estimadas para el collider cuboide
  // Ajusta estos valores según el tamaño real de tu objeto
  const colliderSize = [0.8, 2.5, 0.2]; // [ancho, alto, profundidad]

  return (
    <group {...props} dispose={null}>
      {/* La malla visual sin física */}
      <mesh
        geometry={nodes.Lengua_Fugu005.geometry}
        material={material}
        position={position}
      />

      {/* Collider invisible como cubo */}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[3.1, 1.5, -2.1]}
        rotation={[-Math.PI / 16, 0, 0]}
      >
        <mesh>
          <boxGeometry args={colliderSize} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/big_assets_baked/TheOFFice_LenguaVentana_Baked_v01.glb");
