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
import MobileJoysticks from "./components/experience/MobileJoysticks"; // Importamos componente DOM
import AudioPlayer from "./components/audio/AudioPlayer";
import CustomCursor from "./components/experience/CustomCursor";
import { initialPosition } from "./data/constants";

// Sólo importamos useGainMapProgress
import { useGainMapProgress } from "./hooks/useGainMapPreloader";
import { useExperience } from "./hooks/useExperience";

export default function App() {
  // Estado original
  const [enterExperience, setEnterExperience] = useState(false);
  const [isPreLoading, setIsPreLoading] = useState(true);

  // Obtener la función de actualización del tipo de dispositivo y el estado actual
  const { updateDeviceType, deviceType, setIsPointerLocked } = useExperience();

  // Referencia para tracking de tiempo máximo
  const maxLoadingTimeRef = useRef(null);

  // Obtener progreso de drei y del sistema de GainMaps
  const { progress: dreiProgress } = useProgress();
  const gainMapProgress = useGainMapProgress();

  // Calcular progreso combinado - ahora dando más peso a los GainMaps
  const combinedProgress = dreiProgress * 0.4 + gainMapProgress * 0.6;

  // Comprobar si todos los recursos están listos
  const assetsReady = dreiProgress >= 100 && gainMapProgress >= 100;

  // Función para manejar la entrada a la experiencia
  const handleEnterExperience = () => {
    setEnterExperience(true);

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

  // Establecer un tiempo máximo de carga (15 segundos)
  useEffect(() => {
    if (enterExperience && isPreLoading) {
      maxLoadingTimeRef.current = setTimeout(() => {
        if (isPreLoading) {
          console.warn(
            "Tiempo máximo de carga alcanzado, forzando entrada a la experiencia"
          );
          setIsPreLoading(false);
        }
      }, 15000);
    }

    return () => {
      if (maxLoadingTimeRef.current) {
        clearTimeout(maxLoadingTimeRef.current);
      }
    };
  }, [enterExperience, isPreLoading]);

  // Desactivar la pantalla de carga cuando todo esté listo
  useEffect(() => {
    if (enterExperience && assetsReady && isPreLoading) {
      // Pequeño retraso para asegurar que todos los componentes estén listos
      const timer = setTimeout(() => {
        console.log("Todos los assets cargados, entrando a la experiencia");
        setIsPreLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [enterExperience, assetsReady, isPreLoading]);

  // Monitorear progreso
  useEffect(() => {
    if (enterExperience) {
      console.log(
        `Progreso de carga: Drei ${dreiProgress.toFixed(
          1
        )}%, GainMaps ${gainMapProgress.toFixed(
          1
        )}%, Combinado ${combinedProgress.toFixed(1)}%`
      );
    }
  }, [enterExperience, dreiProgress, gainMapProgress, combinedProgress]);

  const shouldShowLoaders = !enterExperience || isPreLoading;

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
              progress={combinedProgress}
              enterExperience={enterExperience}
              setEnterExperience={handleEnterExperience} // Usar la nueva función
              setIsPreLoading={setIsPreLoading}
            />
          ) : (
            <Experience />
          )}
        </Canvas>
      </KeyboardControls>

      <Background />
    </>
  );
}
