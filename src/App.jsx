// src/App.jsx
import "./index.css";
import { useState, useEffect, useRef } from "react";
import Background from "./components/Background";
import Loader from "./components/Loader";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  KeyboardControls,
  Preload,
  useProgress,
} from "@react-three/drei";
import Experience from "./components/experience/Experience";
import { Perf } from "r3f-perf";
import UI3D from "./components/experience/UI3D";
import MobileJoysticks from "./components/experience/MobileJoysticks";
import AudioPlayer from "./components/audio/AudioPlayer";
import CustomCursor from "./components/experience/CustomCursor";
import { initialPosition } from "./data/constants";

// Removida la importación de useGainMapProgress
import { useExperience } from "./hooks/useExperience";

export default function App() {
  // Estado original
  const [enterExperience, setEnterExperience] = useState(false);
  const [isPreLoading, setIsPreLoading] = useState(true);
  // Estado para controlar si los assets están listos
  const [assetsAreReady, setAssetsAreReady] = useState(false);
  // Estado para controlar si el tiempo mínimo ha pasado
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  // Obtener la función de actualización del tipo de dispositivo y el estado actual
  const {
    updateDeviceType,
    deviceType,
    setIsPointerLocked,
    experienceMounted,
  } = useExperience();

  // Referencias
  const maxLoadingTimeRef = useRef(null);
  const enterTimeRef = useRef(null);
  const minimumTimerRef = useRef(null);
  const transitionTimerRef = useRef(null);

  // Obtener progreso solo de drei
  const { progress } = useProgress();

  // Constante para tiempo mínimo y máximo de carga
  const MINIMUM_LOADING_TIME = 5000; // 5 segundos
  const MAXIMUM_LOADING_TIME = 15000; // 15 segundos

  const shouldShowLoaders = !enterExperience || isPreLoading;

  // Función para manejar la entrada a la experiencia
  const handleEnterExperience = () => {
    // Registrar el tiempo en que el usuario inició la experiencia
    enterTimeRef.current = Date.now();
    setEnterExperience(true);

    // Configurar el temporizador de tiempo mínimo
    minimumTimerRef.current = setTimeout(() => {
      console.log(
        `⏱️ Tiempo mínimo de carga (${MINIMUM_LOADING_TIME}ms) completado`
      );
      setMinimumTimeElapsed(true);
    }, MINIMUM_LOADING_TIME);

    // Configurar el temporizador de tiempo máximo como respaldo
    maxLoadingTimeRef.current = setTimeout(() => {
      console.log(
        "⚠️ Tiempo máximo de carga alcanzado, entrando a la experiencia"
      );
      setIsPreLoading(false);
    }, MAXIMUM_LOADING_TIME);

    // Si es un dispositivo táctil, configurar para experiencia móvil
    if (deviceType?.isTouchDevice) {
      // En dispositivos móviles, establecemos isPointerLocked como true
      // para habilitar controles aunque no haya bloqueo de puntero real
      setTimeout(() => {
        setIsPointerLocked(true);
      }, 100);
    }
  };

  // Efecto para actualizar el tipo de dispositivo cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      updateDeviceType();
    };

    // Ejecutar al montar para asegurar detección inicial
    handleResize();

    // Agregar listener para el evento resize
    window.addEventListener("resize", handleResize);

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateDeviceType]);

  // Actualizar el estado de los assets cuando el progreso llega a 100%
  useEffect(() => {
    if (progress >= 100 && !assetsAreReady) {
      console.log("🎮 Assets listos para usar");
      setAssetsAreReady(true);
    }
  }, [progress, assetsAreReady]);

  // EFECTO CLAVE: Este efecto se encarga específicamente de verificar
  // cuando todas las condiciones (assets listos, tiempo mínimo y experiencia montada) se cumplen
  useEffect(() => {
    // Solo verificar si todas las condiciones se cumplen cuando estamos cargando
    if (
      enterExperience &&
      assetsAreReady &&
      minimumTimeElapsed &&
      isPreLoading
    ) {
      console.log(
        "🎯 CONDICIONES BÁSICAS CUMPLIDAS - Esperando a que la experiencia esté montada..."
      );

      // Si estamos esperando a que la experiencia se monte, no hacemos nada aún
      if (!experienceMounted && !shouldShowLoaders) {
        console.log(
          "⏳ Esperando a que la experiencia esté montada completamente..."
        );
        return;
      }

      // Pequeño retraso para asegurar consistencia entre estados
      transitionTimerRef.current = setTimeout(() => {
        console.log(
          "✅ Tiempo mínimo, assets listos y experiencia montada, completando transición"
        );
        setIsPreLoading(false);
      }, 100);
    }
  }, [
    enterExperience,
    assetsAreReady,
    minimumTimeElapsed,
    isPreLoading,
    experienceMounted,
    shouldShowLoaders,
  ]);

  // Limpieza de todos los temporizadores al desmontar
  useEffect(() => {
    return () => {
      if (minimumTimerRef.current) clearTimeout(minimumTimerRef.current);
      if (maxLoadingTimeRef.current) clearTimeout(maxLoadingTimeRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Monitorear progreso
  useEffect(() => {
    if (enterExperience) {
      const elapsedSinceEnter = enterTimeRef.current
        ? Math.floor((Date.now() - enterTimeRef.current) / 1000)
        : 0;

      console.log(`Progreso (${elapsedSinceEnter}s): ${progress.toFixed(1)}%`);

      // Registrar en la consola el estado actual de las condiciones
      console.log(`Estado de carga:
      - Assets listos: ${assetsAreReady ? "SI" : "NO"}
      - Tiempo mínimo completado: ${minimumTimeElapsed ? "SI" : "NO"}
      - Experiencia montada: ${experienceMounted ? "SI" : "NO"}
      - Sigue cargando: ${isPreLoading ? "SI" : "NO"}`);
    }
  }, [
    enterExperience,
    progress,
    assetsAreReady,
    minimumTimeElapsed,
    experienceMounted,
    isPreLoading,
  ]);

  // IMPORTANTE: Esta es una función vacía que pasaremos al Loader
  // para evitar que modifique isPreLoading directamente
  const dummySetIsPreLoading = () => {
    // No hace nada, el control de isPreLoading está gestionado internamente en este componente
    console.log("⚠️ Intento de cambiar isPreLoading desde el Loader ignorado");
  };

  return (
    <>
      <KeyboardControls
        map={[
          { name: "forwardKeyPressed", keys: ["ArrowUp", "KeyW"] },
          { name: "rightKeyPressed", keys: ["ArrowRight", "KeyD"] },
          { name: "backwardKeyPressed", keys: ["ArrowDown", "KeyS"] },
          { name: "leftKeyPressed", keys: ["ArrowLeft", "KeyA"] },
          { name: "escapeKeyPressed", keys: ["Escape"] },
          { name: "muteKeyPressed", keys: ["KeyM"] },
          // Añadir teclas para eventos simulados en dispositivos táctiles
          { name: "touchInteractPressed", keys: ["Space"] },
        ]}
      >
        {/* Controles de teclado para escritorio */}
        {!shouldShowLoaders && !deviceType?.isTouchDevice && <UI3D />}

        {/* Controles móviles como componente DOM separado */}
        {!shouldShowLoaders && deviceType?.isTouchDevice && <MobileJoysticks />}

        {enterExperience && <AudioPlayer />}

        {/* Mostrar el cursor personalizado solo en dispositivos no táctiles */}
        {!deviceType?.isTouchDevice && (
          <CustomCursor enterExperience={enterExperience} />
        )}

        <Canvas
          camera={{
            fov: 50,
            near: 0.1,
            far: 200,
            position: initialPosition,
          }}
          dpr={[0.5, 2]}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />
          {/* Mostrar Perf solo en desarrollo y preferiblemente en desktop */}
          {!deviceType?.isPhone && <Perf />}

          {shouldShowLoaders ? (
            <Loader
              progress={progress}
              enterExperience={enterExperience}
              setEnterExperience={handleEnterExperience}
              setIsPreLoading={dummySetIsPreLoading} // Usamos la función dummy para evitar cambios directos
            />
          ) : (
            <Experience fadeIn={!isPreLoading} />
          )}
        </Canvas>
      </KeyboardControls>

      <Background />
    </>
  );
}
