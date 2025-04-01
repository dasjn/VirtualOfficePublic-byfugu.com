import React, { useEffect, useState } from "react";
import { useExperience } from "@/hooks/useExperience";

export default function RotationMessage() {
  const { deviceType } = useExperience();
  const [isPortrait, setIsPortrait] = useState(false);

  // Verificar orientación inicial y configurar listener para cambios
  useEffect(() => {
    if (!deviceType?.isPhone) return;

    const checkOrientation = () => {
      const isPortraitMode = window.innerHeight > window.innerWidth;
      setIsPortrait(isPortraitMode);
    };

    // Verificar orientación inicial
    checkOrientation();

    // Configurar listener para cambios de orientación
    window.addEventListener("resize", checkOrientation);

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, [deviceType?.isPhone]);

  // No mostrar nada si no es un teléfono o ya está en modo paisaje
  if (!deviceType?.isPhone || !isPortrait) return null;

  return (
    <div className="rotation-message">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        width="80"
        height="80"
      >
        <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z" />
        <path d="M12 12l5-5-5-5v10z" transform="rotate(90 12 12)" />
      </svg>
      <h2 className="text-xl font-bold mb-2">¡Gira tu dispositivo!</h2>
      <p className="mb-4">
        Para una mejor experiencia, te recomendamos usar tu dispositivo en modo
        horizontal.
      </p>
      <p className="text-sm">Gira tu teléfono para continuar.</p>
    </div>
  );
}
