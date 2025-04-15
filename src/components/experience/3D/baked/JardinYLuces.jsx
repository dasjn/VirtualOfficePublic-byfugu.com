/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef } from "react";
import { Instance, Instances, useGLTF } from "@react-three/drei";
import TextComponent, { CARD_NAMES } from "../../TextComponent";
import { usePointerInteraction } from "@/hooks/usePointerInteraction";
import * as THREE from "three";
import { useGainMapTexture } from "@/hooks/useGainMapTexture";
import { usePreloadModel } from "@/hooks/usePreloadHooks";

// Definir la ruta del modelo como constante
const SUELO_PATH = "/jardin_y_luces/TheOFFice_SueloJardin_Baked_v02.glb";
const LUCES_PATH = "/jardin_y_luces/TheOFFice_Luces_Baked_v02.glb";
const PIEDRAS_PATH = "/jardin_y_luces/TheOFFice_Piedras_Baked_v02.glb";
// Definir el ID del GainMap (debe coincidir con el ID en gainmaps-config.js)
const GAINMAP_ID = "jardin_y_luces_texture";

export default function JardinYluces(props) {
  // Precargar el modelo una sola vez (evita duplicaciones)
  usePreloadModel(SUELO_PATH);
  usePreloadModel(LUCES_PATH);
  usePreloadModel(PIEDRAS_PATH);

  const { nodes: nodesSuelo } = useGLTF(SUELO_PATH);
  const { nodes: nodesLuces } = useGLTF(LUCES_PATH);
  const { nodes: nodesPiedras } = useGLTF(PIEDRAS_PATH);

  const texture = useGainMapTexture(GAINMAP_ID);

  const piedrasRef = useRef();

  const {
    objectRef: piedraRef,
    isNearby,
    handlePointerOver,
    handlePointerOut,
  } = usePointerInteraction({
    maxDistance: 5,
  });

  // Solución para el problema de frustum culling
  useEffect(() => {
    if (piedrasRef.current) {
      // Asegurarse de que las instancias tengan un bounding box correcto
      const computeBoundingSphere = () => {
        // Crear un objeto para calcular el bounding box
        const box = new THREE.Box3();
        const positions = [
          new THREE.Vector3(-6.765, 0.555, 3.204),
          new THREE.Vector3(-8.192, 0.534, 0.863),
          new THREE.Vector3(-6.236, 0.537, -0.088),
        ];

        // Ampliar el tamaño del box para cada instancia
        const instanceSize = 0.5; // Ajustar según el tamaño real de las piedras
        positions.forEach((pos) => {
          box.expandByPoint(
            new THREE.Vector3(
              pos.x - instanceSize,
              pos.y - instanceSize,
              pos.z - instanceSize
            )
          );
          box.expandByPoint(
            new THREE.Vector3(
              pos.x + instanceSize,
              pos.y + instanceSize,
              pos.z + instanceSize
            )
          );
        });

        // Encontrar la instancia y actualizar su bounding sphere
        piedrasRef.current.traverse((child) => {
          if (child.isInstancedMesh) {
            // Calcular una bounding sphere a partir del box
            const sphere = new THREE.Sphere();
            box.getBoundingSphere(sphere);

            // Hacer la bounding sphere ligeramente más grande para asegurarnos
            sphere.radius *= 1.5; // Incrementado para piedras que pueden ser más grandes

            // Actualizar la bounding sphere de la mesh
            child.boundingSphere = sphere;
            child.frustumCulled = true;
          }
        });
      };

      // Ejecutar después de que todo se haya cargado
      setTimeout(computeBoundingSphere, 100);
    }
  }, []);

  // Material a usar (con la textura GainMap si está disponible)
  const textureMaterial = useMemo(() => {
    if (!texture) {
      // Fallback al material original si la textura no está disponible
      return nodesSuelo.Floor_Sand001.material;
    }
    // Crear un material con la textura GainMap
    return new THREE.MeshBasicMaterial({ map: texture });
  }, [texture, nodesSuelo]);

  return (
    <group>
      <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodesSuelo.Floor_Sand001.geometry}
          material={textureMaterial}
          position={[0.209, 7.028, -1.986]}
        />
      </group>
      <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodesLuces.Luz_02001.geometry}
          material={textureMaterial}
          position={[0.236, 4.096, 0.607]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesLuces.Luz_03001.geometry}
          material={textureMaterial}
          position={[-1.632, 4.09, -6.774]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesLuces.Luz_01001.geometry}
          material={textureMaterial}
          position={[2.141, 4.09, -6.774]}
        />
      </group>
      <group ref={piedrasRef} {...props} dispose={null}>
        {/* <mesh
          castShadow
          receiveShadow
          geometry={nodesPiedras.Cube070.geometry}
          material={textureMaterial}
          position={[-6.765, 0.549, 3.204]}
          rotation={[0, 0.726, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesPiedras.Cube073.geometry}
          material={textureMaterial}
          position={[-6.236, 0.537, -0.088]}
          rotation={[0.109, 1.179, -1.665]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodesPiedras.Cube071.geometry}
          material={textureMaterial}
          position={[-8.192, 0.534, 0.863]}
          rotation={[-1.585, 0.037, -0.941]}
        /> */}
        <Instances
          geometry={nodesPiedras.Cube070.geometry}
          material={textureMaterial}
        >
          <Instance
            position={[-6.765, 0.555, 3.204]}
            rotation={[0, 0.726, 0]}
          />
          <Instance
            position={[-8.192, 0.534, 0.863]}
            rotation={[-1.585, 0.037, -0.941]}
          />
          <Instance
            ref={piedraRef}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            position={[-6.236, 0.537, -0.088]}
            rotation={[0.109, 1.179, -1.665]}
          >
            <TextComponent
              position={[0, 1, 0]}
              cardName={CARD_NAMES.Piedras}
              isNearby={isNearby}
            />
          </Instance>
        </Instances>
      </group>
    </group>
  );
}
