/* eslint-disable react/no-unknown-property */
import { meshBounds, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import PropTypes from "prop-types";
import { useExperience } from "@/hooks/useExperience";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import TextComponent, { CARD_NAMES } from "../../TextComponent";

GoogleHome.propTypes = {
  material: PropTypes.instanceOf(THREE.Material),
};

export function GoogleHome({ material, ...props }) {
  const { nodes } = useGLTF(
    "/small_assets_baked/TheOFFice_GoogleHome_Baked_v02.glb"
  );

  const { availableAudios, selectedAudio, setSelectedAudio } = useExperience();

  const {
    objectRef: googleHomeRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 3,
  });

  const handleAudioChange = () => {
    if (availableAudios.length > 0) {
      const currentIndex = availableAudios.findIndex(
        (audio) => audio.name === selectedAudio?.name
      );

      // Obtener el siguiente índice, volviendo al primero si es el último
      const nextIndex =
        currentIndex >= 0 && currentIndex < availableAudios.length - 1
          ? currentIndex + 1
          : 0;

      setSelectedAudio(availableAudios[nextIndex]);
    }
  };

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={googleHomeRef}
        geometry={nodes.Google_Bottom004.geometry}
        material={material}
        position={[-0.333, 0.904, 0.13]}
        rotation={[-Math.PI, 0.561, -Math.PI]}
        onClick={handleAudioChange}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        raycast={meshBounds}
      />
      <TextComponent
        position={[0, 1, 0]}
        cardName={CARD_NAMES.GoogleHome}
        isNearby={isNearby}
      />
    </group>
  );
}
