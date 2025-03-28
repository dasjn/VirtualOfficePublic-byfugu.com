/* eslint-disable react/no-unknown-property */
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { Html, meshBounds, useGLTF } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";

export function Piedras(props) {
  const { nodes, materials } = useGLTF(
    "/piedras_jardin/TheOFFice_Piedras_Shader_v01.glb"
  );

  const {
    objectRef: gardenRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 3.4,
  });

  return (
    <group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube057.geometry}
        material={materials["Piedra Volcanica LOW"]}
        position={[-6.765, 0.555, 3.204]}
        rotation={[0, 0.726, 0]}
      />
      <mesh
        ref={gardenRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        raycast={meshBounds}
        castShadow
        receiveShadow
        geometry={nodes.Cube058.geometry}
        material={materials["Piedra Volcanica LOW"]}
        position={[-6.256, 0.519, -0.091]}
        rotation={[0.008, -0.369, 1.569]}
      >
        {" "}
        <TextComponent
          position={[1, 0, 0]}
          cardName={CARD_NAMES.Piedras}
          isNearby={isNearby}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube059.geometry}
        material={materials["Piedra Volcanica LOW"]}
        position={[-8.234, 0.433, 0.849]}
        rotation={[0.005, 0.638, 1.575]}
      />
    </group>
  );
}

useGLTF.preload("/piedras_jardin/TheOFFice_Piedras_Shader_v01.glb");
