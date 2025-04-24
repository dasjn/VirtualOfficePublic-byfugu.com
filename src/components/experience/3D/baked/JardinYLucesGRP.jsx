/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { meshBounds, useGLTF } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import * as THREE from "three";
import { getAssetPath } from "@/data/assets";
import { useKTX2Asset } from "@/hooks/useKTX2Asset";

export default function JardinYLucesGRP(props) {
  // Cargar modelos
  const { nodes } = useGLTF(getAssetPath("JARDIN_LUCES_GRP"));

  // Usar nuestro hook personalizado para cargar la textura KTX2
  const texture = useKTX2Asset("JARDIN_LUCES_GRP_KTX2");

  const {
    objectRef: piedraRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 5,
  });

  // Materiales con textura compartida o fallback
  const textureMaterial = useMemo(() => {
    // Asegúrate de manejar el caso cuando la textura aún no está cargada
    if (!texture) {
      // Fallback material
      return new THREE.MeshBasicMaterial({ color: 0xcccccc });
    }

    return new THREE.MeshBasicMaterial({ map: texture });
  }, [texture]);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Luz_02001.geometry}
        material={textureMaterial}
        position={[0.236, 4.096, 0.607]}
      />

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube070.geometry}
        material={textureMaterial}
        position={[-6.765, 0.549, 3.204]}
        rotation={[0, 0.726, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube071.geometry}
        material={textureMaterial}
        position={[-8.192, 0.534, 0.863]}
        rotation={[-1.585, 0.037, -0.941]}
      />
      <mesh
        ref={piedraRef}
        castShadow
        receiveShadow
        geometry={nodes.Cube073.geometry}
        material={textureMaterial}
        position={[-6.236, 0.537, -0.088]}
        rotation={[0.109, 1.179, -1.665]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        raycast={meshBounds}
      >
        <TextComponent
          position={[0, 1, 0]}
          cardName={CARD_NAMES.Piedras}
          isNearby={isNearby}
        />
      </mesh>
    </group>
  );
}

// Precargar el modelo
useGLTF.preload(getAssetPath("JARDIN_LUCES_GRP"));
