import { useExperience } from "@/hooks/useExperience";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";

CustomCursor.propTypes = {
  enterExperience: PropTypes.bool,
};

export default function CustomCursor({ enterExperience }) {
  const { isPointerLocked, cursorHover } = useExperience(); // Usa los valores necesarios del contexto
  const [isMouseActive, setIsMouseActive] = useState(false);

  const cursorRef = useRef(null);

  useEffect(() => {
    const checkMouseStatus = () => {
      setIsMouseActive(
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      );
    };

    checkMouseStatus();

    const handleMouseMove = (e) => {
      if (isMouseActive) {
        const x = e.clientX;
        const y = e.clientY;

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`; // Mantén el movimiento suave
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", checkMouseStatus);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMouseStatus);
    };
  }, [isMouseActive]);

  if (!isMouseActive) return null;

  return (
    <>
      {(enterExperience && !isPointerLocked) || !enterExperience ? (
        <div
          ref={cursorRef}
          className={`z-[100] fixed -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white bg-opacity-40 pointer-events-none 
          ${cursorHover ? "w-6 h-6" : "w-4 h-4"} 
          transition-[width,height] duration-300 ease-in-out`}
        />
      ) : null}
    </>
  );
}
