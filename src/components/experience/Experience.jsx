import {
  Environment,
  Html,
  PointerLockControls,
  useTexture,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { useRef, useMemo, useCallback, useEffect } from "react";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import Player from "./Player";
import Office from "./Office";
import { useExperience } from "@/hooks/useExperience";

import { Alfombra } from "./3D/baked/Alfombra";
import { LenguaVentana } from "./3D/baked/LenguaVentana";
import { MarcoCuadro01 } from "./3D/baked/MarcoCuadro01";
import { MarcoCuadro02 } from "./3D/baked/MarcoCuadro02";
import { MarcoVentana } from "./3D/baked/MarcoVentana";
import { PanelTV } from "./3D/baked/PanelTV";
import { PlanoImgCuadro01 } from "./3D/baked/PlanoImgCuadro01";
import { PlanoImgCuadro02 } from "./3D/baked/PlanoImgCuadro02";
import { BotonPuerta } from "./3D/baked/BotonPuerta";
import { CuerdaMesa } from "./3D/baked/CuerdaMesa";
import { GoogleHome } from "./3D/baked/GoogleHome";
import { ManetasPuertas } from "./3D/baked/ManetasPuertas";
import { PCOff } from "./3D/baked/PCOff";
import { PCOn } from "./3D/baked/PCOn";
import { Tarjetas } from "./3D/baked/Tarjetas";
import { Latas } from "./3D/blenderMaterial/Latas";
import { SetUpMesa } from "./3D/blenderMaterial/SetUpMesa";
import { OfficeMesa } from "./3D/blenderMaterial/OfficeMesa";
import { SueloJardin } from "./3D/blenderMaterial/SueloJardin";
import { Piedras } from "./3D/blenderMaterial/Piedras";
import { MeetingRoomSign } from "./3D/blenderMaterial/MeetingRoomSign";
import { WCSign } from "./3D/blenderMaterial/WCSign";
import { Sofa } from "./3D/blenderMaterial/Sofa";
import { MarcoTV } from "./3D/baked/MarcoTV";
import { CameraController } from "@/controllers/CameraController";
import { useThree } from "@react-three/fiber";
import TextComponent from "./TextComponent";
import { GardenSpine } from "./3D/blenderMaterial/GardenSpine";
import GardenGlass from "./3D/blenderMaterial/GardenGlass";
import { MobileJoysticksLogic } from "./MobileJoysticks";
import GlobosCielo from "./3D/blenderMaterial/GlobosCielo";

import MueblesYSigns from "./3D/baked/MueblesYSigns";
import JardinYluces from "./3D/baked/JardinYLuces";
import Sobres from "./3D/baked/Sobres";

export default function Experience() {
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
    camera.lookAt(-1, 1.5, 0);

    // Notificar que la experiencia está montada
    setTimeout(() => {
      setExperienceMounted(true);
    }, 100); // Pequeño retraso para asegurar que todo está renderizado

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
  const bigAssetsTextureBaked = useTexture(
    "/big_assets_baked/Bake_Assets_Big_v03.jpg"
  );
  bigAssetsTextureBaked.flipY = false;

  const bigAssetsTextureBakedMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: bigAssetsTextureBaked,
        color: new THREE.Color(0x888888), // Un color gris oscuro que oscurecerá la textura
      }),
    [bigAssetsTextureBaked]
  );

  const smallAssetsTextureBaked = useTexture(
    "/small_assets_baked/SmallAssets_Bake_v01.jpg"
  );
  smallAssetsTextureBaked.flipY = false;

  const smallAssetsTextureBakedMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: smallAssetsTextureBaked,
        color: new THREE.Color(0x888888),
      }),
    [smallAssetsTextureBaked]
  );

  // Optimización: Organizar componentes en grupos lógicos
  const renderBigAssets = useCallback(
    () => (
      <group position={[0, -2, 0]}>
        <Alfombra material={bigAssetsTextureBakedMaterial} />
        <LenguaVentana material={bigAssetsTextureBakedMaterial} />
        <MarcoCuadro01 material={bigAssetsTextureBakedMaterial} />
        <MarcoCuadro02 material={bigAssetsTextureBakedMaterial} />
        <MarcoVentana material={bigAssetsTextureBakedMaterial} />
        <MarcoTV material={bigAssetsTextureBakedMaterial} />

        <JardinYluces />
        <MueblesYSigns />

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
        <BotonPuerta material={smallAssetsTextureBakedMaterial} />
        <CuerdaMesa material={smallAssetsTextureBakedMaterial} />
        <GoogleHome material={smallAssetsTextureBakedMaterial} />
        <ManetasPuertas material={smallAssetsTextureBakedMaterial} />
        <PCOff material={smallAssetsTextureBakedMaterial} />
        <PCOn material={smallAssetsTextureBakedMaterial} />
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
      <Environment
        files={[
          "/hdr/HDRI_v02.webp",
          "/hdr/HDRI_v02-gainmap.webp",
          "/hdr/HDRI_v02.json",
        ]}
        environmentIntensity={0.8}
        background
      />
      {/* {deviceType?.isTouchDevice && <MobileJoysticksLogic />} */}
      <CameraController />
      <Physics gravity={[0, -9.8, 0]}>
        {renderBigAssets()}
        {renderSmallAssets()}
        {renderBlenderAssets()}
        <Office />
        <Player />
      </Physics>

      <group position={[0, -2, 0]}>
        <GardenSpine />
        <GardenGlass />
        <GlobosCielo />
      </group>

      <PointerLockControls
        ref={pointerLockRef}
        onLock={handlePointerLock}
        onUnlock={handlePointerUnlock}
      />

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
