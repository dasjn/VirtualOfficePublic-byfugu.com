/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { getAssetPath } from "@/data/assets";

export default function MueblesYSigns(props) {
  const { nodes: nodesSetup } = useGLTF(getAssetPath("SETUP_MESA_BAKED"));
  const { nodes: nodesOffice } = useGLTF(getAssetPath("MESA_OFFICE_BAKED"));
  const { nodes: nodesMR } = useGLTF(getAssetPath("SIGN_MEETING_BAKED"));
  const { nodes: nodesWC } = useGLTF(getAssetPath("SIGN_WC_BAKED"));

  // Cargar textura
  const texture = useTexture(getAssetPath("MUEBLES_SIGNS_BAKE"));

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
