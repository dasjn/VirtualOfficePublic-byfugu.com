/* eslint-disable react/no-unknown-property */
import { meshBounds, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import TextComponent, { CARD_NAMES } from "../../TextComponent";

Tarjetas.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function Tarjetas({ material, ...props }) {
  const { nodes } = useGLTF(
    "/small_assets_baked/TheOFFice_Tarjetas_Baked_v02.glb"
  );

  const {
    objectRef: tarjetasRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 4,
  });

  return (
    <group
      ref={tarjetasRef}
      {...props}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      raycast={meshBounds}
    >
      <mesh
        geometry={nodes.Plane010.geometry}
        material={material}
        position={[0.444, 0.907, 0.075]}
        rotation={[0, -0.295, Math.PI]}
        raycast={meshBounds}
      />
      <mesh
        geometry={nodes.Plane011.geometry}
        material={material}
        position={[0.279, 0.907, 0.086]}
        rotation={[0, 1.05, -Math.PI]}
        raycast={meshBounds}
      />
      <mesh
        geometry={nodes.Plane012.geometry}
        material={material}
        position={[0.361, 0.907, -0.09]}
        rotation={[0, 0.517, -Math.PI]}
        raycast={meshBounds}
      />
      <TextComponent
        position={[0, 1, 0]}
        cardName={CARD_NAMES.Tarjetas}
        isNearby={isNearby}
      />
    </group>
  );
}

useGLTF.preload("/small_assets_baked/TheOFFice_Tarjetas_Baked_v02.glb");
