/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useGainMapTexture } from "@/hooks/useGainMapTexture";
import { usePreloadModel } from "@/hooks/usePreloadHooks";

// Constantes para rutas de modelos
const MODEL_PATHS = {
  SETUP: "/muebles_y_signs/TheOFFice_SetUpMesa_Bake_v06.glb",
  OFFICE: "/muebles_y_signs/TheOFFice_OfficeMesa_Bake_v06.glb",
  SIGN_MR: "/muebles_y_signs/TheOFFice_SignMeetingRoom_Bake_v06.glb",
  SIGN_WC: "/muebles_y_signs/TheOFFice_SignWC_Bake_v06.glb",
};

// ID del GainMap
const GAINMAP_ID = "muebles_y_signs_texture";

export default function MueblesYSigns(props) {
  // Precargar todos los modelos
  usePreloadModel(MODEL_PATHS.SETUP);
  usePreloadModel(MODEL_PATHS.OFFICE);
  usePreloadModel(MODEL_PATHS.SIGN_MR);
  usePreloadModel(MODEL_PATHS.SIGN_WC);

  // Cargar los modelos
  const { nodes: nodesSetup } = useGLTF(MODEL_PATHS.SETUP);
  const { nodes: nodesOffice } = useGLTF(MODEL_PATHS.OFFICE);
  const { nodes: nodesMR } = useGLTF(MODEL_PATHS.SIGN_MR);
  const { nodes: nodesWC } = useGLTF(MODEL_PATHS.SIGN_WC);

  // Cargar textura GainMap
  const texture = useGainMapTexture(GAINMAP_ID);

  // Material con GainMap o fallback
  const textureMaterial = useMemo(() => {
    if (!texture) {
      return nodesSetup.Mesa_SetUp002.material;
    }
    return new THREE.MeshBasicMaterial({
      map: texture,
    });
  }, [texture, nodesSetup]);

  return (
    <group>
      {/* Mesa de setup con sillas */}
      <group {...props} dispose={null}>
        {/* Mesa */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodesSetup.Mesa_SetUp002.geometry}
          material={textureMaterial}
          position={[-2.918, 0.484, -4.449]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesSetup.Silla_01.geometry}
          material={textureMaterial}
          position={[-2.449, 0.554, -5.099]}
          rotation={[0, -0.682, Math.PI / 2]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesSetup.Silla_02.geometry}
          material={textureMaterial}
          position={[-2.802, 0.554, -6.526]}
          rotation={[0, -1.566, 1.571]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesSetup.Silla_03.geometry}
          material={textureMaterial}
          position={[-2.802, 0.554, -8.381]}
          rotation={[0, -1.566, 1.571]}
        />
      </group>

      {/* Mesa de oficina con butacas */}
      <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodesOffice.Tablero_Mesa001.geometry}
          material={textureMaterial}
          position={[0.006, 0.252, -0.157]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesOffice.Butaca_2.geometry}
          material={textureMaterial}
          position={[-1.02, 0.01, -0.304]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesOffice.Butaca_3.geometry}
          material={textureMaterial}
          position={[-0.288, 0.01, 0.84]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesOffice.Butaca_1.geometry}
          material={textureMaterial}
          position={[0.944, 0.01, -0.63]}
        />
      </group>

      {/* Cartel de sala de reuniones */}
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodesMR.Cube069.geometry}
          material={textureMaterial}
          position={[-3.867, 2.168, -1.696]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </group>

      {/* Cartel de WC */}
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodesWC.Cube068.geometry}
          material={textureMaterial}
          position={[2.315, 2.168, 4.71]}
        />
      </group>
    </group>
  );
}
