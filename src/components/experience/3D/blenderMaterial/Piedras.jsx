/* eslint-disable react/no-unknown-property */
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { meshBounds, useGLTF, Instances, Instance } from "@react-three/drei";
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
    maxDistance: 5,
  });

  return (
    <group {...props} dispose={null}>
      <Instances
        geometry={nodes.Cube057.geometry}
        material={materials["Piedra Volcanica LOW"]}
      >
        <Instance position={[-6.765, 0.555, 3.204]} rotation={[0, 0.726, 0]} />
        <Instance
          position={[-8.234, 0.433, 0.849]}
          rotation={[0.005, 0.638, 1.575]}
        />
        <Instance
          ref={gardenRef}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          position={[-6.256, 0.519, -0.091]}
          rotation={[0.008, -0.369, 1.569]}
        >
          <TextComponent
            position={[0, 1, 0]}
            cardName={CARD_NAMES.Piedras}
            isNearby={isNearby}
          />
        </Instance>
      </Instances>
    </group>
  );
}

useGLTF.preload("/piedras_jardin/TheOFFice_Piedras_Shader_v01.glb");
