/* eslint-disable react/no-unknown-property */
import { useGLTF, Image, Html } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { useMemo } from "react";
import { MeshBasicMaterial } from "three";

export function PlanoImgCuadro01(props) {
  // Cargar el modelo GLTF del plano
  const { nodes, materials } = useGLTF(
    "/big_assets_baked/TheOFFice_PlanoImgCuadro_v01.glb"
  );

  const {
    objectRef: cuadroRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 4,
  });

  // Crear un material básico que use la misma textura
  const basicMaterial = useMemo(() => {
    // Crear un nuevo material básico
    const material = new MeshBasicMaterial({ color: 0xcccccc });

    // Si el material original tiene un mapa de textura, copiarlo al nuevo material
    if (materials["Cuadro Img 01"].map) {
      material.map = materials["Cuadro Img 01"].map;
    }

    return material;
  }, [materials]);

  // Usamos `Image` de `@react-three/drei` para colocar la imagen sobre el plano
  return (
    <group {...props} dispose={null}>
      <mesh
        ref={cuadroRef}
        geometry={nodes.CuadroImg002.geometry}
        material={basicMaterial}
        position={[4.322, 2.261, -6.071]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <TextComponent
          position={[-1, 0, 0]}
          cardName={CARD_NAMES.Cuadro2}
          isNearby={isNearby}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/big_assets_baked/TheOFFice_PlanoImgCuadro_v01.glb");
