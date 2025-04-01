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
import { useThree } from "@react-three/fiber";

import {
  addGainMapsToPreload,
  loadAllGainMaps,
  useGainMapProgress,
  useInitGainMapPreloader,
} from "./hooks/usePreloadGainMap";
import { PAREDES_GAINMAP } from "./components/experience/3D/blenderMaterial/Paredes";
import { SUELO_GAINMAP } from "./components/experience/3D/baked/Suelo";

// Lista de GainMaps a precargar
const gainMapsToPreload = [
  { id: PAREDES_GAINMAP.name, urls: PAREDES_GAINMAP.urls },
  { id: SUELO_GAINMAP.name, urls: SUELO_GAINMAP.urls },
  // Añadir más texturas aquí
];

// Componente para inicializar el preloader
function PreloadInitializer() {
  const { gl } = useThree();
  const initRef = useRef(false);

  // Inicializar el preloader con el renderer
  const isInitialized = useInitGainMapPreloader(gl);

  useEffect(() => {
    if (isInitialized && !initRef.current) {
      initRef.current = true;

      console.log("GainMapPreloader inicializado, añadiendo texturas...");
      // Añadir texturas al sistema de preload
      addGainMapsToPreload(gainMapsToPreload);

      // Iniciar la carga
      loadAllGainMaps()
        .then(() => {
          console.log("Todas las texturas GainMap cargadas con éxito");
        })
        .catch((error) => {
          console.error("Error durante la carga de texturas:", error);
        });
    }
  }, [isInitialized]);

  return null;
}

export default function App() {
  // Estado original
  const [enterExperience, setEnterExperience] = useState(false);
  const [isPreLoading, setIsPreLoading] = useState(true);

  // Referencia para tracking de tiempo máximo
  const maxLoadingTimeRef = useRef(null);

  // Obtener progreso de drei y GainMap
  const { progress: dreiProgress, active: dreiActive } = useProgress();
  const gainMapProgress = useGainMapProgress();

  // Calcular progreso combinado
  const combinedProgress = dreiProgress * 0.6 + gainMapProgress * 0.4;

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
        )}%, GainMap ${gainMapProgress.toFixed(
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

          {/* Inicializador de precarga siempre presente */}
          <PreloadInitializer />

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
