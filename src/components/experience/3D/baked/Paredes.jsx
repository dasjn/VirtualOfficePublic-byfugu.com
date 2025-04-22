/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { meshBounds, useGLTF, useTexture } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import * as THREE from "three";
import { getAssetPath } from "@/data/assets";

export function Paredes(props) {
  // Cargar el modelo y la textura
  const { nodes, materials } = useGLTF(getAssetPath("PAREDES"));

  const texture = useTexture(getAssetPath("PAREDES_BAKE"));

  const textureMaterial = useMemo(() => {
    if (!texture) {
      // Fallback al material original si la textura no está disponible
      return materials["Paredes LOW"];
    }
    // Crear un material con la textura GainMap
    return new THREE.MeshBasicMaterial({ map: texture, color: 0xbbbbbb });
  }, [texture, materials]);

  // Hooks para interacción
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
