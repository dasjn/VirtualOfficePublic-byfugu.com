/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { meshBounds, useGLTF } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import * as THREE from "three";
import { useGainMapTexture } from "@/hooks/useGainMapTexture";
import { usePreloadModel } from "@/hooks/usePreloadHooks";

// Definir la ruta del modelo como constante
const MODEL_PATH = "/paredes/TheOFFice_Paredes_v09.glb";
// Definir el ID del GainMap (debe coincidir con el ID en gainmaps-config.js)
const GAINMAP_ID = "paredes_texture";

export function Paredes(props) {
  // Precargar el modelo una sola vez (evita duplicaciones)
  usePreloadModel(MODEL_PATH);

  // Cargar el modelo y la textura
  const { nodes, materials } = useGLTF(MODEL_PATH);
  // Obtener la textura GainMap (sistema centralizado de GainMaps)
  const texture = useGainMapTexture(GAINMAP_ID);

  // Material a usar (con la textura GainMap si está disponible)
  const textureMaterial = useMemo(() => {
    if (!texture) {
      // Fallback al material original si la textura no está disponible
      return materials["Paredes LOW"];
    }
    // Crear un material con la textura GainMap
    return new THREE.MeshBasicMaterial({ map: texture });
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
