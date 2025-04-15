import { useCursorHover } from "@/hooks/useCursorHover";
import { useExperience } from "@/hooks/useExperience";
import BehanceIcon from "@/icons/BehanceIcon";
import InstagramIcon from "@/icons/InstagramIcon";
import { useEffect, useState } from "react";

const PauseModal = ({ onAccept, setCursorHover }) => {
  const { handlePointerOver, handlePointerOut } =
    useCursorHover(setCursorHover);
  const { isPointerLocked, isUserOnPC } = useExperience();
  const [isVisible, setIsVisible] = useState(false);

  // Efecto para animar la entrada al montar el componente
  useEffect(() => {
    // Pequeño tiempo de espera para que la animación se note
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isPointerLocked) {
      setIsVisible(false);

      setTimeout(() => {
        onAccept();
      }, 500);
    }
  }, [isPointerLocked, onAccept]);

  // Función para manejar el clic en el botón "Got it!"
  const handleAccept = (event) => {
    event.stopPropagation();
    // Primero animamos la salida
    setIsVisible(false);
    // Después de la animación de salida, ejecutamos la acción de aceptar
    setTimeout(() => {
      onAccept();
    }, 500); // Este tiempo debe ser consistente con la duración de la transición
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99] pointer-events-none">
      <div
        className={`flex flex-col gap-6 w-[450px] p-8 h-auto gradient-keyboard bg-opacity-40 bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow pointer-events-auto transform transition-all duration-1000 ease-out ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="flex flex-col gap-2 items-center">
          <span className="bg-opacity-40 bg-white rounded-full w-16 h-16 flex items-center justify-center font-bold cursor-none transform">
            <span className="material-symbols-outlined">drag_click</span>
          </span>
        </div>
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xl font-bold">
            Onffice&apos;s Experience is currently stopped. Please click to
            resume.
          </p>
        </div>
        <div className="flex flex-col border-y-[1px] py-6 text-sm gap-2">
          <div className="inline-flex items-center justify-center">
            <button
              className="bg-[#2364B3] py-3 px-10 rounded-full font-bold text-xl transform transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={handleAccept}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              Got it!
            </button>
          </div>
        </div>
        <div className="flex gap-2 items-center w-full justify-between text-xs px-12">
          <div className="flex flex-col items-center gap-1">
            <a
              href={"https://www.byfugu.com/"}
              target="_blank"
              className="bg-opacity-15 bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-none transform transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={(event) => {
                event.stopPropagation(); // Evitar que el evento se propague
              }}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <span className="material-symbols-outlined">captive_portal</span>
            </a>
            <p>byfugu.com</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <a
              href={"https://www.instagram.com/wearefugu/"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-opacity-15 bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-none transform transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <InstagramIcon />
            </a>
            <p>@wearefugu</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <a
              href={"https://www.behance.net/byfugu"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-opacity-15 bg-white rounded-full w-12 h-12 flex items-center justify-center font-bold cursor-none transform transition-transform duration-200 hover:scale-105 active:scale-95"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerOver={handlePointerOver}
              onPointerOut={handlePointerOut}
            >
              <BehanceIcon />
            </a>
            <p>/byfugu</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseModal;
