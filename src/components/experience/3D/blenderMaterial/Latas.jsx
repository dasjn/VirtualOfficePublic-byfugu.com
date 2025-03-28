/* eslint-disable react/no-unknown-property */
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import { meshBounds, useGLTF, Instances, Instance } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";

export function Latas(props) {
  const { nodes, materials } = useGLTF("/latas/TheOFFice_Lata_Shader_v01.glb");

  const {
    objectRef: latasRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 4,
  });

  return (
    <group
      ref={latasRef}
      {...props}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      raycast={meshBounds}
    >
      <Instances geometry={nodes.Lata.geometry} material={materials.Lata}>
        <Instance position={[-0.036, 0.974, -0.353]} scale={0.015} />
        <Instance
          position={[0.112, 0.974, -0.434]}
          rotation={[0, 1.403, 0]}
          scale={0.015}
        />
        <Instance
          position={[0.117, 0.974, -0.32]}
          rotation={[Math.PI, -1.152, Math.PI]}
          scale={0.015}
        />
        <Instance
          position={[-0.268, 0.974, -0.48]}
          rotation={[0, 0.185, 0]}
          scale={0.015}
        />
      </Instances>
      <TextComponent
        position={[0, 1, 0]}
        cardName={CARD_NAMES.Latas}
        isNearby={isNearby}
      />
    </group>
  );
}

useGLTF.preload("/latas/TheOFFice_Lata_Shader_v01.glb");
