import { useExperience } from "@/hooks/useExperience";
import { useKeyboardControls } from "@react-three/drei";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback, useRef } from "react";

const ARROW_ICON_MAP = {
  W: "keyboard_arrow_up",
  A: "keyboard_arrow_left",
  S: "keyboard_arrow_down",
  D: "keyboard_arrow_right",
};

export default function Key({ keyName, keyLetter, keyTitle, keyIcon }) {
  const [subscribeToKeys] = useKeyboardControls();
  const [isPressed, setIsPressed] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const intervalRef = useRef(null);
  const { isPointerLocked } = useExperience();

  const toggleArrow = useCallback(() => {
    setShowArrow((prev) => !prev);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToKeys((keys) => {
      setIsPressed(keys[keyName]);
    });

    return () => {
      unsubscribe();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [keyName, subscribeToKeys]);

  useEffect(() => {
    if (!ARROW_ICON_MAP[keyLetter]) return;
    if (!isPointerLocked) return;

    intervalRef.current = setInterval(toggleArrow, 1200);
    return () => clearInterval(intervalRef.current);
  }, [keyLetter, toggleArrow, isPointerLocked]);

  return (
    <>
      {keyTitle && keyIcon && (
        <div
          className="self-center text-base flex gap-1"
          aria-label={`${keyTitle} key`}
        >
          <span className="material-symbols-outlined">{keyIcon}</span>
          <p>{keyTitle}</p>
        </div>
      )}

      <div
        className={`w-12 h-12 bg-white rounded-md flex items-center justify-center 
          ${isPressed ? "bg-opacity-30" : "bg-opacity-15"} 
          relative overflow-hidden`}
        aria-pressed={isPressed}
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            font-bold text-xl transition-all duration-500 ease-in-out
            ${showArrow ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
        >
          {keyLetter}
        </div>

        {ARROW_ICON_MAP[keyLetter] && (
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              material-symbols-outlined transition-all duration-500 ease-in-out
              ${showArrow ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          >
            {ARROW_ICON_MAP[keyLetter]}
          </div>
        )}
      </div>
    </>
  );
}

Key.propTypes = {
  keyName: PropTypes.string,
  keyLetter: PropTypes.string,
  keyTitle: PropTypes.string,
  keyIcon: PropTypes.string,
};
