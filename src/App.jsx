import "./index.css";
import { useState } from "react";
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

export default function App() {
  // Estado original
  const [enterExperience, setEnterExperience] = useState(false);
  const [isPreLoading, setIsPreLoading] = useState(true);

  // Estado de pruebas
  // const [enterExperience, setEnterExperience] = useState(true);
  // const [isPreLoading, setIsPreLoading] = useState(false);

  const { progress } = useProgress(); // Progreso de carga

  const shouldShowLoaders = !enterExperience || isPreLoading;

  // const { active, progress, errors, item, loaded, total } = useProgress();
  // console.log(
  //   `Active: ${active}, Progress: ${progress}%, Errors: ${errors}, Item: ${item}, Loaded: ${loaded}, Total: ${total}`
  // );

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
          {shouldShowLoaders ? (
            <Loader
              progress={progress}
              enterExperience={enterExperience}
              setEnterExperience={setEnterExperience}
              setIsPreLoading={setIsPreLoading}
            />
          ) : (
            <Experience />
          )}
        </Canvas>
      </KeyboardControls>

      {/* Mostrar Background solo si enterExperience es verdadero y no se está cargando */}
      <Background />
    </>
  );
}
