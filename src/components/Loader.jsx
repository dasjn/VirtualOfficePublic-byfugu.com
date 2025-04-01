import { Html } from "@react-three/drei";
import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import Landing from "./Landing";
import { useExperience } from "@/hooks/useExperience";
import { GAINMAPS } from "@/data/gainmaps-config";
import GainMapPreloader from "@/utils/GainMapPreloader";
import { useThree } from "@react-three/fiber";

Loader.propTypes = {
  progress: PropTypes.number.isRequired,
  enterExperience: PropTypes.bool.isRequired,
  setEnterExperience: PropTypes.func.isRequired,
  setIsPreLoading: PropTypes.func.isRequired,
};

export default function Loader({
  progress,
  enterExperience,
  setEnterExperience,
  setIsPreLoading,
}) {
  const [progressState, setProgressState] = useState(0);
  const { setCursorHover } = useExperience();
  const { gl } = useThree();

  // Referencia para evitar inicializaciones repetidas
  const initializedRef = useRef(false);
  const loadStartedRef = useRef(false);

  // Inicializar el GainMapPreloader al montar el componente
  useEffect(() => {
    if (!initializedRef.current && gl) {
      const success = GainMapPreloader.initialize(gl);
      if (success) {
        console.log("✅ GainMapPreloader inicializado correctamente");
        initializedRef.current = true;

        // Registrar todos los GainMaps una vez inicializado
        GAINMAPS.forEach((map) => {
          GainMapPreloader.register(map.id, map.urls);
        });
      }
    }
  }, [gl]);

  // Iniciar la carga de GainMaps cuando el usuario decide entrar a la experiencia
  useEffect(() => {
    if (enterExperience && initializedRef.current && !loadStartedRef.current) {
      console.log("🔄 Iniciando carga de GainMaps desde el Loader");
      loadStartedRef.current = true;
      GainMapPreloader.loadAll().catch((err) => {
        console.error("❌ Error cargando GainMaps:", err);
      });
    }
  }, [enterExperience]);

  // Animación suave del progreso
  useEffect(() => {
    let animationFrameId;

    const animateProgress = () => {
      setProgressState((prevProgress) => {
        // Calcula un progreso suavizado acercándose al valor de `progress`
        const diff = progress - prevProgress;
        const increment = Math.sign(diff) * Math.min(1, Math.abs(diff) * 0.02);
        const newProgress = prevProgress + increment;

        // Si el progreso es casi igual al final, lo fija
        if (Math.abs(newProgress - progress) < 0.5) {
          return progress;
        }
        return newProgress;
      });
      animationFrameId = requestAnimationFrame(animateProgress);
    };

    if (enterExperience) {
      animationFrameId = requestAnimationFrame(animateProgress);
    }

    // Al alcanzar el 100% de carga, desactiva `isPreLoading` después de un breve retardo
    if (progress === 100 && progressState >= 99) {
      const delayTimer = setTimeout(() => setIsPreLoading(false), 1000);
      return () => clearTimeout(delayTimer);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [progress, progressState, setIsPreLoading, enterExperience]);

  return (
    <>
      {!enterExperience ? (
        <Html center zIndexRange={[0, 1]} portal={false}>
          <Landing
            setEnterExperience={setEnterExperience}
            setCursorHover={setCursorHover}
          />
        </Html>
      ) : (
        <Html
          className="relative flex flex-col gap-4 items-center text-center text-white text-2xl justify-center w-screen h-screen py-24 px-16"
          center
          portal={false}
        >
          <p className="italic animate-move-up opacity-0">
            The physical distance between two points is just a number...
          </p>
          <p className="animate-move-up opacity-0 animate-delay-300">
            {`Even if you can't visit us in person, you're always welcome in our 24/7
            digital Onffice`}
          </p>

          <div className="w-96 h-2 bg-white bg-opacity-40 rounded-full overflow-hidden animate-move-up opacity-0 animate-delay-500 mt-4">
            <div
              className="bg-white bg-opacity-100 h-full"
              style={{
                width: `${progressState}%`,
                transition: "width 1s ease-out",
              }}
            ></div>
          </div>
        </Html>
      )}
    </>
  );
}
