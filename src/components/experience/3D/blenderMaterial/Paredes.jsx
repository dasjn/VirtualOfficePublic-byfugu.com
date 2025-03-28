/* eslint-disable react/no-unknown-property */
import { meshBounds, useGLTF } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";

export function Paredes(props) {
  const { nodes, materials } = useGLTF("/paredes/TheOFFice_Paredes_v03.glb");

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
        material={materials["Paredes LOW"]}
        position={[0.209, 6.971, -2.067]}
      />
      <mesh
        ref={refMeetingRoom}
        castShadow
        receiveShadow
        geometry={nodes.Puerta_Reunion.geometry}
        material={materials["Paredes LOW"]}
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
        material={materials["Paredes LOW"]}
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
        material={materials["Paredes LOW"]}
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

useGLTF.preload("/paredes/TheOFFice_Paredes_v03.glb");
