// src/App.jsx
import "./index.css";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import Background from "./components/Background";
import Loader from "./components/Loader";
import { Canvas } from "@react-three/fiber";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  KeyboardControls,
  Preload,
} from "@react-three/drei";

import AudioPlayer from "./components/audio/AudioPlayer";
import CustomCursor from "./components/experience/CustomCursor";
import { initialPosition } from "./data/constants";
import { useExperience } from "./hooks/useExperience";
import { preloadAssets } from "./utils/preloadAssets";
import ProgressTracker from "./components/experience/ProgressTracker";
import * as THREE from "three";

// Lazy load components that might cause render-time state updates
const Experience = lazy(() => import("./components/experience/Experience"));
const MobileJoysticks = lazy(
  () => import("./components/experience/MobileJoysticks")
);
const UI3D = lazy(() => import("./components/experience/UI3D"));

// Fallback component for suspense
const LoadingFallback = () => null;

export default function App() {
  // Estados
  const [enterExperience, setEnterExperience] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [showExperience, setShowExperience] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assetsPreloaded, setAssetsPreloaded] = useState(false);

  // Referencias
  const startTimeRef = useRef(null);
  const transitionRef = useRef({
    loadingComplete: false,
    transitionStarted: false,
  });

  // Contexto de experiencia
  const { updateDeviceType, deviceType, setIsPointerLocked } = useExperience();

  // Actualizar tipo de dispositivo
  useEffect(() => {
    const handleResize = () => {
      // Wrap in requestAnimationFrame to avoid state updates during render
      requestAnimationFrame(() => {
        updateDeviceType();
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateDeviceType]);

  // Iniciar transición
  const startTransition = useCallback(() => {
    if (transitionRef.current.transitionStarted) return;

    // Use requestAnimationFrame to avoid state updates during render
    requestAnimationFrame(() => {
      transitionRef.current.transitionStarted = true;
      setShowExperience(true);
      setShowLoader(false);
    });
  }, []);

  // Failsafe para forzar transición si tarda demasiado
  useEffect(() => {
    if (enterExperience && showLoader) {
      const failsafeId = setTimeout(() => {
        if (!transitionRef.current.transitionStarted) {
          startTransition();
        }
      }, 8000);

      return () => clearTimeout(failsafeId);
    }
  }, [enterExperience, showLoader, startTransition]);

  // Manejar clic en "Entrar"
  const handleEnterExperience = useCallback(() => {
    // Use requestAnimationFrame to avoid state updates during render
    requestAnimationFrame(() => {
      setEnterExperience(true);
      startTimeRef.current = Date.now();

      if (deviceType?.isTouchDevice) {
        setTimeout(() => setIsPointerLocked(true), 100);
      }
    });
  }, [deviceType, setIsPointerLocked]);

  // Manejar finalización de carga - ahora con useCallback para evitar recreaciones
  const handleLoadingComplete = useCallback(() => {
    if (transitionRef.current.loadingComplete) return;

    // Use requestAnimationFrame to avoid state updates during render
    requestAnimationFrame(() => {
      transitionRef.current.loadingComplete = true;

      // Verificar tiempo mínimo de carga (3 segundos)
      const elapsedTime = Date.now() - (startTimeRef.current || Date.now());
      const minLoadingTime = 3000;

      if (elapsedTime < minLoadingTime) {
        setTimeout(() => startTransition(), minLoadingTime - elapsedTime);
      } else {
        startTransition();
      }
    });
  }, [startTransition]);

  // Safe progress update handler to avoid render-time state updates
  const handleProgressUpdate = useCallback((progress) => {
    // Use requestAnimationFrame to avoid state updates during render
    requestAnimationFrame(() => {
      setLoadingProgress(progress);
    });
  }, []);

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
          { name: "touchInteractPressed", keys: ["Space"] },
        ]}
      >
        {/* UI Components with Suspense boundaries */}
        {!showLoader && !deviceType?.isTouchDevice && (
          <Suspense fallback={<LoadingFallback />}>
            <UI3D />
          </Suspense>
        )}

        {!showLoader && deviceType?.isTouchDevice && (
          <Suspense fallback={<LoadingFallback />}>
            <MobileJoysticks />
          </Suspense>
        )}

        {enterExperience && <AudioPlayer />}

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
          // gl={
          //   {
          //     // toneMapping: THREE.ACESFilmicToneMapping,
          //     // toneMappingExposure: 2,
          //   }
          // }
          dpr={[0.5, 2]}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          <Preload all />

          {/* Tracker de progreso - movido fuera del ciclo de renderizado principal */}
          {enterExperience && showLoader && (
            <ProgressTracker
              onProgress={handleProgressUpdate}
              onComplete={handleLoadingComplete}
            />
          )}

          {/* Experience (detrás) - solo renderizar cuando esté listo */}
          {showExperience && assetsPreloaded && (
            <Suspense fallback={<LoadingFallback />}>
              <Experience showLoader={showLoader} />
            </Suspense>
          )}

          {/* Loader */}
          {(showLoader || !enterExperience) && (
            <Loader
              progress={loadingProgress}
              enterExperience={enterExperience}
              setEnterExperience={handleEnterExperience}
              setAssetsPreloaded={setAssetsPreloaded}
            />
          )}
        </Canvas>
      </KeyboardControls>

      <Background />
    </>
  );
}
