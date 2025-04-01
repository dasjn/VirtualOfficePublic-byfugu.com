// src/hooks/useGainMapTexture.js
import { useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import gainMapPreloader from "../utils/GainMapPreloader";

/**
 * Hook para acceder a una textura GainMap ya cargada centralmente
 * @param {string} id - ID del GainMap
 * @returns {THREE.Texture|null} - Textura GainMap o null si no está disponible
 */
export function useGainMapTexture(id) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    // Crear una función para acceder a la textura precargada
    const getPreloadedTexture = () => {
      // Intentar obtener la textura del sistema central
      const preloadedTexture = gainMapPreloader.getTexture(id);

      if (preloadedTexture) {
        console.log(`✓ Textura GainMap "${id}" obtenida del sistema central`);
        setTexture(preloadedTexture);
        return true;
      }

      // Si no está disponible pero la carga central está en progreso, configurar un temporizador para volver a intentarlo
      if (gainMapPreloader.isLoading()) {
        console.log(
          `⏳ Esperando textura GainMap "${id}" del sistema central...`
        );
        const checkTimer = setTimeout(() => {
          const retryTexture = gainMapPreloader.getTexture(id);
          if (retryTexture) {
            console.log(`✓ Textura GainMap "${id}" obtenida después de espera`);
            setTexture(retryTexture);
          } else {
            console.warn(
              `⚠️ Textura GainMap "${id}" no disponible después de espera`
            );
          }
        }, 1000); // Esperar 1 segundo y volver a intentar

        return () => clearTimeout(checkTimer);
      }

      console.warn(
        `⚠️ Textura GainMap "${id}" no encontrada en el sistema central`
      );
      return false;
    };

    // Intentar obtener la textura precargada inmediatamente
    getPreloadedTexture();

    // Suscribirse a cambios en el estado de carga para volver a intentarlo cuando termine
    const unsubscribe = gainMapPreloader.addProgressListener(() => {
      if (gainMapPreloader.isReady() && !texture) {
        getPreloadedTexture();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id, texture]);

  return texture;
}
