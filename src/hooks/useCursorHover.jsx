import { useEffect } from "react";
import { useExperience } from "./useExperience";

// Custom hook to manage cursor hover state
export function useCursorHover(setCursorHoverProp) {
  // Obtén el valor de setCursorHover desde el contexto si no se pasa como prop
  const { setCursorHover: setCursorHoverContext } = useExperience() || {};

  // Usar setCursorHoverProp si se pasa como prop, de lo contrario usar el contexto
  const setCursorHover = setCursorHoverProp || setCursorHoverContext;

  // Asegúrate de que setCursorHover esté disponible
  useEffect(() => {
    // Si setCursorHover no está disponible, no se hace nada
    if (!setCursorHover) {
      console.error("setCursorHover is not available.");
      return;
    }

    // Limpieza para resetear el cursorHover a false cuando el componente se desmonte
    return () => {
      setCursorHover(false);
    };
  }, [setCursorHover]); // El useEffect siempre se ejecutará, pero solo si setCursorHover está disponible

  // Si setCursorHover es válido, crea las funciones de evento
  const handlePointerOver = () => {
    setCursorHover(true);
  };

  const handlePointerOut = () => {
    setCursorHover(false);
  };

  return {
    handlePointerOver,
    handlePointerOut,
  };
}
