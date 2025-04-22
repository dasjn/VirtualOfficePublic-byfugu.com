/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";

export function WCSign(props) {
  const { nodes, materials } = useGLTF(
    "/signs/TheOFFice_SignWC_Shader_v01.glb"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube068.geometry}
        material={materials.WC}
        position={[2.315, 2.168, 4.71]}
      />
    </group>
  );
}
