/* eslint-disable react/no-unknown-property */
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { useGLTF, Image } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { useEffect, useMemo } from "react";
import { MeshBasicMaterial, TextureLoader } from "three";

export function PlanoImgCuadro02(props) {
  // Cargar el modelo GLTF del plano
  const { nodes, materials } = useGLTF(
    "/big_assets_baked/TheOFFice_Cuadro02_v02.glb"
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
    if (materials["Cuadro Img 02"].map) {
      material.map = materials["Cuadro Img 02"].map;
    }

    return material;
  }, [materials]);

  // Usamos `Image` de `@react-three/drei` para colocar la imagen sobre el plano
  return (
    <group {...props} dispose={null}>
      <mesh
        ref={cuadroRef}
        geometry={nodes.CuadroImg003.geometry}
        material={basicMaterial}
        position={[4.299, 2.261, 1.602]}
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

useGLTF.preload("/big_assets_baked/TheOFFice_PlanoImgCuadro_v02.glb");
