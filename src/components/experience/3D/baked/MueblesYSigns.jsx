/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
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

  // Referencias para las mallas
  const meshRefs = {
    mesaSetup: useRef(),
    silla01: useRef(),
    silla02: useRef(),
    silla03: useRef(),
    mesaOffice: useRef(),
    butaca1: useRef(),
    butaca2: useRef(),
    butaca3: useRef(),
    cartelMR: useRef(),
    cartelWC: useRef(),
  };

  // Función para calcular el tamaño y centro de un objeto 3D
  const calcularDimensiones = (object) => {
    if (!object || !object.geometry) return null;

    // Crear una copia temporal de la geometría
    const geometry = object.geometry.clone();

    // Aplicar la matriz del objeto a la geometría para obtener tamaños en espacio mundial
    geometry.applyMatrix4(object.matrixWorld);

    // Actualizar la geometría para calcular el bounding box
    geometry.computeBoundingBox();

    const boundingBox = geometry.boundingBox;
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Tamaño para cuboid collider (args toma la mitad del tamaño)
    const colliderSize = [size.x / 2, size.y / 2, size.z / 2];

    return {
      center: [center.x, center.y, center.z],
      size: colliderSize,
      boundingBox: {
        min: [boundingBox.min.x, boundingBox.min.y, boundingBox.min.z],
        max: [boundingBox.max.x, boundingBox.max.y, boundingBox.max.z],
      },
      dimensions: [size.x, size.y, size.z],
    };
  };

  // Log de dimensiones cuando los componentes estén cargados
  useEffect(() => {
    // Esperar un frame para que las matrices de transformación estén actualizadas
    const timeoutId = setTimeout(() => {
      console.log("=== DIMENSIONES DE OBJETOS PARA COLLIDERS ===");

      for (const [name, ref] of Object.entries(meshRefs)) {
        if (ref.current) {
          const dimensiones = calcularDimensiones(ref.current);
          if (dimensiones) {
            console.log(`${name}:`, {
              position: ref.current.position.toArray(),
              rotation: ref.current.rotation.toArray(),
              colliderSize: dimensiones.size,
              dimensions: dimensiones.dimensions,
              center: dimensiones.center,
            });
          }
        }
      }
    }, 1000); // Pequeño retraso para asegurar que todo está cargado

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <group {...props} dispose={null}>
      {/* Mesa de setup con sillas */}
      <group>
        <mesh
          ref={meshRefs.mesaSetup}
          castShadow
          receiveShadow
          geometry={nodesSetup.Mesa_SetUp002.geometry}
          material={materials.setup}
          position={[-2.918, 0.484, -4.449]}
        />
        <mesh
          ref={meshRefs.silla01}
          castShadow
          receiveShadow
          geometry={nodesSetup.Silla_01.geometry}
          material={materials.setup}
          position={[-2.449, 0.554, -5.099]}
          rotation={[0, -0.682, Math.PI / 2]}
        />
        <mesh
          ref={meshRefs.silla02}
          castShadow
          receiveShadow
          geometry={nodesSetup.Silla_02.geometry}
          material={materials.setup}
          position={[-2.802, 0.554, -6.526]}
          rotation={[0, -1.566, 1.571]}
        />
        <mesh
          ref={meshRefs.silla03}
          castShadow
          receiveShadow
          geometry={nodesSetup.Silla_03.geometry}
          material={materials.setup}
          position={[-2.802, 0.554, -8.381]}
          rotation={[0, -1.566, 1.571]}
        />
      </group>

      {/* Mesa de oficina con butacas */}
      <group>
        <mesh
          ref={meshRefs.mesaOffice}
          castShadow
          receiveShadow
          geometry={nodesOffice.Tablero_Mesa001.geometry}
          material={materials.office}
          position={[0.006, 0.252, -0.157]}
        />
        <mesh
          ref={meshRefs.butaca2}
          castShadow
          receiveShadow
          geometry={nodesOffice.Butaca_2.geometry}
          material={materials.office}
          position={[-1.02, 0.01, -0.304]}
        />
        <mesh
          ref={meshRefs.butaca3}
          castShadow
          receiveShadow
          geometry={nodesOffice.Butaca_3.geometry}
          material={materials.office}
          position={[-0.288, 0.01, 0.84]}
        />
        <mesh
          ref={meshRefs.butaca1}
          castShadow
          receiveShadow
          geometry={nodesOffice.Butaca_1.geometry}
          material={materials.office}
          position={[0.944, 0.01, -0.63]}
        />
      </group>

      {/* Carteles con material emissive para destacar */}
      <mesh
        ref={meshRefs.cartelMR}
        castShadow
        receiveShadow
        geometry={nodesMR.Cube069.geometry}
        material={materials.signs}
        position={[-3.867, 2.168, -1.696]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <mesh
        ref={meshRefs.cartelWC}
        castShadow
        receiveShadow
        geometry={nodesWC.Cube068.geometry}
        material={materials.signs}
        position={[2.315, 2.168, 4.71]}
      />
    </group>
  );
}
