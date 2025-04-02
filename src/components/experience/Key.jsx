import { useKeyboardControls } from "@react-three/drei";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

Key.propTypes = {
  keyName: PropTypes.string,
  keyLetter: PropTypes.string,
  keyTitle: PropTypes.string,
  keyIcon: PropTypes.string,
};

export default function Key({ keyName, keyLetter, keyTitle, keyIcon }) {
  const [subscribeToKeys] = useKeyboardControls();
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Suscribirse al evento de la tecla específica
    const unsubscribe = subscribeToKeys((keys) => {
      // Cambia el estado dependiendo de si la tecla está presionada o no
      setIsPressed(keys[keyName]);
    });

    // Limpia la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, [keyName, subscribeToKeys]);

  return (
    <>
      {keyTitle && keyIcon ? (
        <div className="self-center text-base flex gap-1">
          <span className="material-symbols-outlined">{keyIcon}</span>
          <p>{keyTitle}</p>
        </div>
      ) : null}

      <div
        className={`w-12 h-12 ${
          isPressed ? "bg-opacity-30" : "bg-opacity-15"
        } bg-white rounded-md flex items-center justify-center self-center font-bold text-xl`}
      >
        {keyLetter}
      </div>
    </>
  );
}
