/* eslint-disable react/no-unknown-property */
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { useGLTF, Image } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";

export function PlanoImgCuadro02(props) {
  // Cargar el modelo GLTF del plano
  const { nodes, materials } = useGLTF(
    "/big_assets_baked/TheOFFice_PlanoImgCuadro_v02.glb"
  );

  const {
    objectRef: cuadroRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 4,
  });

  // Usamos `Image` de `@react-three/drei` para colocar la imagen sobre el plano
  return (
    <group {...props} dispose={null}>
      <mesh
        ref={cuadroRef}
        geometry={nodes.CuadroImg003.geometry}
        material={nodes.CuadroImg003.material}
        position={[4.322, 2.261, 1.602]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Colocamos la imagen usando el componente `Image` */}
        <Image
          position={[-0.05, 0, 0]} // Ajustamos la posición para que la imagen esté sobre el plano
          rotation={[0, -Math.PI / 2, 0]}
          url="/images/Fugu_RRSS_RN_v07.jpg" // Ruta de la imagen
          scale={1.5}
          raycast={() => null} // Desactivamos el raycast si no es necesario
        />
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
