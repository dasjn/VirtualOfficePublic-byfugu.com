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
import AudioPlayer from "./components/audio/AudioPlayer";
import CustomCursor from "./components/experience/CustomCursor";
import { initialPosition } from "./data/constants";

// Importar configuración de GainMaps y hooks de precarga
import { GAINMAPS } from "./data/gainmaps-config";
import {
  useInitGainMapPreloader,
  useRegisterGainMaps,
  useLoadGainMaps,
  useGainMapProgress,
} from "./hooks/useGainMapPreloader";

// Componente para gestionar la carga de GainMaps
function GainMapLoader() {
  // Inicializar el preloader de GainMaps
  const initialized = useInitGainMapPreloader();

  // Registrar todos los GainMaps
  useRegisterGainMaps(GAINMAPS);

  // Cargar GainMaps y obtener estado
  const { loading, error, ready } = useLoadGainMaps(initialized);

  // Log de error si ocurre
  useEffect(() => {
    if (error) {
      console.error("Error cargando GainMaps:", error);
    }
  }, [error]);

  // Log de estado cuando estén listos
  useEffect(() => {
    if (ready) {
      console.log("✅ Todos los GainMaps han sido cargados");
    }
  }, [ready]);

  return null;
}

export default function App() {
  // Estado original
  const [enterExperience, setEnterExperience] = useState(false);
  const [isPreLoading, setIsPreLoading] = useState(true);

  // Referencia para tracking de tiempo máximo
  const maxLoadingTimeRef = useRef(null);

  // Obtener progreso de drei y del sistema de GainMaps
  const { progress: dreiProgress, active: dreiActive } = useProgress();
  const gainMapProgress = useGainMapProgress();

  // Calcular progreso combinado - ahora dando más peso a los GainMaps
  const combinedProgress = dreiProgress * 0.4 + gainMapProgress * 0.6;

  // Comprobar si todos los recursos están listos
  const assetsReady = dreiProgress >= 100 && gainMapProgress >= 100;

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
        ]}
      >
        {!shouldShowLoaders && <UI3D />}
        {enterExperience && <AudioPlayer />}
        <CustomCursor enterExperience={enterExperience} />
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
          <Perf />

          {/* Gestor de carga de GainMaps */}
          <GainMapLoader />

          {shouldShowLoaders ? (
            <Loader
              progress={combinedProgress}
              enterExperience={enterExperience}
              setEnterExperience={setEnterExperience}
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
