/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo } from "react";
import { Instance, Instances, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { usePreloadModel, usePreloadTexture } from "@/hooks/usePreloadHooks";
import { RigidBody } from "@react-three/rapier";

// Constantes para rutas de modelos
const MODEL_PATHS = {
  SETUP: "/muebles_y_signs/TheOFFice_SetUpMesa_Bake_v06.glb",
  OFFICE: "/muebles_y_signs/TheOFFice_OfficeMesa_Bake_v06.glb",
  SIGN_MR: "/muebles_y_signs/TheOFFice_SignMeetingRoom_Bake_v06.glb",
  SIGN_WC: "/muebles_y_signs/TheOFFice_SignWC_Bake_v06.glb",
};

const TEXTURE_PATH = "/muebles_y_signs/MueblesySigns_Bake_v01.webp";

export default function MueblesYSigns(props) {
  // Precargar todos los modelos
  usePreloadModel(MODEL_PATHS.SETUP);
  usePreloadModel(MODEL_PATHS.OFFICE);
  usePreloadModel(MODEL_PATHS.SIGN_MR);
  usePreloadModel(MODEL_PATHS.SIGN_WC);
  usePreloadTexture(TEXTURE_PATH);

  // Cargar los modelos
  const { nodes: nodesSetup } = useGLTF(MODEL_PATHS.SETUP);
  const { nodes: nodesOffice } = useGLTF(MODEL_PATHS.OFFICE);
  const { nodes: nodesMR } = useGLTF(MODEL_PATHS.SIGN_MR);
  const { nodes: nodesWC } = useGLTF(MODEL_PATHS.SIGN_WC);

  // Cargar textura
  const texture = useTexture(TEXTURE_PATH);

  // Crear varios materiales con diferentes propiedades
  const materials = useMemo(() => {
    if (!texture) {
      return {
        setup: nodesSetup.Mesa_SetUp002.material,
        office: nodesSetup.Mesa_SetUp002.material,
        signs: nodesSetup.Mesa_SetUp002.material,
      };
    }

    return {
      setup: new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x999999,
      }),
      office: new THREE.MeshBasicMaterial({
        map: texture,
        color: 0x666666,
      }),
      signs: new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xcccccc,
      }),
    };
  }, [texture, nodesSetup]);

  return (
    <group {...props} dispose={null}>
      {/* Mesa de setup con sillas */}
      <group>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesSetup.Mesa_SetUp002.geometry}
            material={materials.setup}
            position={[-2.918, 0.484, -4.449]}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesSetup.Silla_01.geometry}
            material={materials.setup}
            position={[-2.449, 0.554, -5.099]}
            rotation={[0, -0.682, Math.PI / 2]}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesSetup.Silla_02.geometry}
            material={materials.setup}
            position={[-2.802, 0.554, -6.526]}
            rotation={[0, -1.566, 1.571]}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesSetup.Silla_03.geometry}
            material={materials.setup}
            position={[-2.802, 0.554, -8.381]}
            rotation={[0, -1.566, 1.571]}
          />
        </RigidBody>
      </group>

      {/* Mesa de oficina con butacas */}
      <group>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesOffice.Tablero_Mesa001.geometry}
            material={materials.office}
            position={[0.006, 0.252, -0.157]}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesOffice.Butaca_2.geometry}
            material={materials.office}
            position={[-1.02, 0.01, -0.304]}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesOffice.Butaca_3.geometry}
            material={materials.office}
            position={[-0.288, 0.01, 0.84]}
          />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <mesh
            castShadow
            receiveShadow
            geometry={nodesOffice.Butaca_1.geometry}
            material={materials.office}
            position={[0.944, 0.01, -0.63]}
          />
        </RigidBody>
      </group>

      {/* Carteles con material emissive para destacar */}
      <mesh
        castShadow
        receiveShadow
        geometry={nodesMR.Cube069.geometry}
        material={materials.signs}
        position={[-3.867, 2.168, -1.696]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodesWC.Cube068.geometry}
        material={materials.signs}
        position={[2.315, 2.168, 4.71]}
      />
    </group>
  );
}
