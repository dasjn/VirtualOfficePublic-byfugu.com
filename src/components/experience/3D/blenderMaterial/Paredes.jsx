/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { meshBounds, useGLTF } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import * as THREE from "three";
import { useGainMapTexture } from "@/hooks/usePreloadGainMap";

// Constante para los recursos
export const PAREDES_GAINMAP = {
  name: "paredes_texture",
  urls: [
    "/paredes/Paredes_Bake_8K_v01.webp",
    "/paredes/Paredes_Bake_8K_v01-gainmap.webp",
    "/paredes/Paredes_Bake_8K_v01.json",
  ],
};

export function Paredes(props) {
  const { nodes, materials } = useGLTF("/paredes/TheOFFice_Paredes_v08.glb");

  // Obtener la textura del sistema de precarga
  const texture = useGainMapTexture(PAREDES_GAINMAP.name);

  // Material a usar
  const textureMaterial = useMemo(() => {
    if (!texture) {
      return materials["Paredes LOW"];
    }
    return new THREE.MeshBasicMaterial({ map: texture });
  }, [texture, materials]);

  const {
    objectRef: refMeetingRoom,
    isNearby: isNearbyMeetingRoom,
    handlePointerOver: handlePointerOverMeetingRoom,
    handlePointerOut: handlePointerOutMeetingRoom,
  } = usePointerInteraction({ maxDistance: 4 });

  const {
    objectRef: refExit,
    isNearby: isNearbyExit,
    handlePointerOver: handlePointerOverExit,
    handlePointerOut: handlePointerOutExit,
  } = usePointerInteraction({ maxDistance: 4 });

  const {
    objectRef: refWC,
    isNearby: isNearbyWC,
    handlePointerOver: handlePointerOverWC,
    handlePointerOut: handlePointerOutWC,
  } = usePointerInteraction({ maxDistance: 4 });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Puertas.geometry}
        material={textureMaterial}
        position={[0.209, 6.971, -2.067]}
      />
      <mesh
        ref={refMeetingRoom}
        castShadow
        receiveShadow
        geometry={nodes.Puerta_Reunion.geometry}
        material={textureMaterial}
        position={[-3.891, 1.314, -2.518]}
        onPointerOver={handlePointerOverMeetingRoom}
        onPointerOut={handlePointerOutMeetingRoom}
        raycast={meshBounds}
      >
        <TextComponent
          position={[0, 0.5, 0]}
          cardName={CARD_NAMES.MeetingRoom}
          isNearby={isNearbyMeetingRoom}
        />
      </mesh>
      <mesh
        ref={refExit}
        castShadow
        receiveShadow
        geometry={nodes.Puerta_Exit.geometry}
        material={textureMaterial}
        position={[-1.427, 1.315, 4.734]}
        onPointerOver={handlePointerOverExit}
        onPointerOut={handlePointerOutExit}
        raycast={meshBounds}
      >
        <TextComponent
          position={[0, 0.5, 0]}
          cardName={CARD_NAMES.Exit}
          isNearby={isNearbyExit}
        />
      </mesh>
      <mesh
        ref={refWC}
        castShadow
        receiveShadow
        geometry={nodes.Puerta_Baño.geometry}
        material={textureMaterial}
        position={[3.124, 1.315, 4.737]}
        onPointerOver={handlePointerOverWC}
        onPointerOut={handlePointerOutWC}
        raycast={meshBounds}
      >
        <TextComponent
          position={[0, 0.5, 0]}
          cardName={CARD_NAMES.WC}
          isNearby={isNearbyWC}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/paredes/TheOFFice_Paredes_v08.glb");
