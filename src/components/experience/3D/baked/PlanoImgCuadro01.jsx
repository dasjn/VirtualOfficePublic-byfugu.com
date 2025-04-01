/* eslint-disable react/no-unknown-property */
import { useGLTF, Image, Html } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";

export function PlanoImgCuadro01(props) {
  // Cargar el modelo GLTF del plano
  const { nodes } = useGLTF(
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

  // Usamos `Image` de `@react-three/drei` para colocar la imagen sobre el plano
  return (
    <group {...props} dispose={null}>
      <mesh
        ref={cuadroRef}
        geometry={nodes.CuadroImg002.geometry} // El plano donde pondremos la imagen
        material={nodes.CuadroImg002.material} // Mantén el material original del modelo
        position={[4.322, 2.261, -6.071]} // Ajusta la posición del plano
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Colocamos la imagen usando el componente `Image` */}
        <Image
          position={[-0.05, 0, 0]} // Ajustamos la posición para que la imagen esté sobre el plano
          rotation={[0, -Math.PI / 2, 0]}
          scale={1.5} // Escalamos la imagen para que encaje en el plano
          url="/images/Fugu_RRSS_RN_v01.jpg" // Ruta de la imagen
          raycast={() => null} // Desactivamos el raycast si no es necesario
        />
        <TextComponent
          position={[-1, 0, 0]}
          cardName={CARD_NAMES.Cuadro1}
          isNearby={isNearby}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/big_assets_baked/TheOFFice_PlanoImgCuadro_v01.glb");
