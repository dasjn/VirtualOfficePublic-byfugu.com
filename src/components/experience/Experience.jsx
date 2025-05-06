/* eslint-disable react/no-unknown-property */
import { Environment, PointerLockControls } from "@react-three/drei";
import { useMemo, useCallback, useEffect } from "react";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import Player from "./Player";
import Office from "./Office";
import { useExperience } from "@/hooks/useExperience";
import { PanelTV } from "./3D/baked/PanelTV";
import { PlanoImgCuadro01 } from "./3D/baked/PlanoImgCuadro01";
import { PlanoImgCuadro02 } from "./3D/baked/PlanoImgCuadro02";
import { GoogleHome } from "./3D/baked/GoogleHome";
import { Tarjetas } from "./3D/baked/Tarjetas";
import { Latas } from "./3D/blenderMaterial/Latas";
import { Sofa } from "./3D/blenderMaterial/Sofa";
import { CameraController } from "@/controllers/CameraController";
import { useThree } from "@react-three/fiber";
import { GardenSpine } from "./3D/blenderMaterial/GardenSpine";
import GardenGlass from "./3D/blenderMaterial/GardenGlass";
import GlobosCielo from "./3D/blenderMaterial/GlobosCielo";
import Sobres from "./3D/baked/Sobres";
import JardinYLucesGRP from "./3D/baked/JardinYLucesGRP";
import { BigAssetsGRP } from "./3D/baked/BigAssetsGRP";
import { useKTX2Asset } from "@/hooks/useKTX2Asset";
import { Perf } from "r3f-perf";
import { SmallAssetsGRP } from "./3D/baked/SmallAssetsGRP";
import { MueblesYSignsGRP } from "./3D/baked/MueblesYSignsGRP";
import { MobileJoysticksLogic } from "./MobileJoysticks";

export default function Experience({ showLoader }) {
  const {
    isPointerLocked,
    setIsPointerLocked,
    pointerLockRef,
    isUserOnPC,
    setIsUserOnPC,
    rigidBodyRef,
    startCameraMovement,
    meshComputerRef,
    deviceType,
    setExperienceMounted,
  } = useExperience();

  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(-1, 0, 0);

    // Notificar que la experiencia está montada
    setTimeout(() => {
      setExperienceMounted(true);
    }, 1000); // Pequeño retraso para asegurar que todo está renderizado

    return () => {
      // Limpiar el estado cuando el componente se desmonta
      setExperienceMounted(false);
    };
  }, [camera, setExperienceMounted]);

  // Optimización: Vector reutilizable para posiciones
  const worldPositionComputer = useMemo(() => new THREE.Vector3(), []);

  // Optimización: Memoizar manejadores de eventos
  const handlePointerLock = useCallback(() => {
    if (pointerLockRef.current) {
      setIsPointerLocked(true);

      // Si el usuario está en la PC, iniciar animación para levantarse
      if (isUserOnPC) {
        meshComputerRef.current.getWorldPosition(worldPositionComputer);

        if (rigidBodyRef.current) {
          const currentPosition = rigidBodyRef.current.translation();
          const startPosition = new THREE.Vector3(
            currentPosition.x,
            currentPosition.y,
            currentPosition.z
          );

          const playerHeight = -0.25;
          const targetPosition = new THREE.Vector3(
            worldPositionComputer.x + 2,
            playerHeight,
            worldPositionComputer.z
          );

          startCameraMovement(
            startPosition,
            targetPosition,
            worldPositionComputer,
            1500,
            () => {
              setIsUserOnPC(false);
              rigidBodyRef.current.setBodyType(0); // Dynamic
            }
          );
        }
      }
    }
  }, [
    pointerLockRef,
    setIsPointerLocked,
    isUserOnPC,
    meshComputerRef,
    worldPositionComputer,
    rigidBodyRef,
    startCameraMovement,
    setIsUserOnPC,
  ]);

  const handlePointerUnlock = useCallback(() => {
    if (pointerLockRef.current) {
      setIsPointerLocked(false);
    }
  }, [pointerLockRef, setIsPointerLocked]);

  // Optimización: Memoizar texturas y materiales
  const bigAssetsTextureBaked = useKTX2Asset("BIG_ASSETS_GRP_KTX2");

  const bigAssetsTextureBakedMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: bigAssetsTextureBaked,
      }),
    [bigAssetsTextureBaked]
  );

  const smallAssetsTextureBaked = useKTX2Asset("SMALL_ASSETS_GRP_KTX2");

  const smallAssetsTextureBakedMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: smallAssetsTextureBaked,
      }),
    [smallAssetsTextureBaked]
  );

  // Optimización: Organizar componentes en grupos lógicos
  const renderBigAssets = useCallback(
    () => (
      <group position={[0, -2, 0]}>
        <BigAssetsGRP material={bigAssetsTextureBakedMaterial} />

        <JardinYLucesGRP />

        <MueblesYSignsGRP />

        <PanelTV />
        <PlanoImgCuadro01 />
        <PlanoImgCuadro02 />
      </group>
    ),
    [bigAssetsTextureBakedMaterial]
  );

  const renderSmallAssets = useCallback(
    () => (
      <group position={[0, -2, 0]}>
        <SmallAssetsGRP material={smallAssetsTextureBakedMaterial} />

        <GoogleHome material={smallAssetsTextureBakedMaterial} />
        <Tarjetas material={smallAssetsTextureBakedMaterial} />
        <Sobres />
      </group>
    ),
    [smallAssetsTextureBakedMaterial]
  );

  const renderBlenderAssets = useCallback(
    () => (
      <group position={[0, -2, 0]}>
        <Latas />
        <Sofa />
      </group>
    ),
    []
  );

  return (
    <>
      {/* <RendererInfo /> */}
      <Environment
        files={[
          "/hdr/HDRI_v02.webp",
          "/hdr/HDRI_v02-gainmap.webp",
          "/hdr/HDRI_v02.json",
        ]}
        environmentIntensity={0.8}
        background
      />
      {deviceType?.isTouchDevice && <MobileJoysticksLogic />}
      <CameraController />
      <Physics gravity={[0, -9.8, 0]}>
        {renderBigAssets()}
        {renderSmallAssets()}
        {renderBlenderAssets()}
        <Office />
        <Player />
      </Physics>
      {/* {!deviceType?.isTouchDevice && <Perf />} */}

      <group position={[0, -2, 0]}>
        <GardenSpine />
        <GardenGlass />
        <GlobosCielo />
      </group>

      {/* Sólo renderizar PointerLockControls en dispositivos no táctiles */}
      {!deviceType?.isTouchDevice && (
        <PointerLockControls
          ref={pointerLockRef}
          onLock={handlePointerLock}
          onUnlock={handlePointerUnlock}
        />
      )}

      {/* Efectos de post-procesamiento */}
      {/* <EffectComposer disableNormalPass multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0.8} />
        <ToneMapping
          adaptive
          resolution={256}
          middleGrey={1}
          maxLuminance={32.0}
          averageLuminance={1.0}
          adaptationRate={100.0}
        />
      </EffectComposer> */}
    </>
  );
}

function RendererInfo() {
  const { gl } = useThree();

  useEffect(() => {
    // gl es la instancia del renderer
    console.log("Renderer info:");
    console.table(gl.info);

    // Para ver información más detallada:
    console.log("Renderer info - render:", gl.info.render);
    console.log("Renderer info - memory:", gl.info.memory);
    console.log("Renderer info - programs:", gl.info.programs);
  }, [gl]);

  return null; // Este componente no renderiza nada
}
