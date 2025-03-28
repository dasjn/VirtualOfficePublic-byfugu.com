/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";

export function MeetingRoomSign(props) {
  const { nodes, materials } = useGLTF(
    "/signs/TheOFFice_SignMeetingRoom_Shader_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube069.geometry}
        material={materials["Meeting Room"]}
        position={[-3.867, 2.168, -1.696]}
        rotation={[0, -Math.PI / 2, 0]}
      />
    </group>
  );
}

useGLTF.preload("/signs/TheOFFice_SignMeetingRoom_Shader_v01.glb");
