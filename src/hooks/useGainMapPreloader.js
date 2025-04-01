// src/hooks/useGainMapPreloader.js
import { useState, useEffect, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import gainMapPreloader from "../utils/GainMapPreloader";

/**
 * Hook para inicializar el GainMapPreloader
 * @returns {boolean} - true si el preloader está inicializado
 */
export function useInitGainMapPreloader() {
  const { gl } = useThree();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (gl) {
      const success = gainMapPreloader.initialize(gl);
      setInitialized(success);
    }
  }, [gl]);

  return initialized;
}

/**
 * Hook para registrar GainMaps para precarga
 * @param {Array} gainMaps - Array de objetos {id, urls} con los GainMaps a registrar
 */
export function useRegisterGainMaps(gainMaps = []) {
  useEffect(() => {
    if (gainMaps.length > 0) {
      gainMaps.forEach(({ id, urls }) => {
        gainMapPreloader.register(id, urls);
      });
    }
  }, [gainMaps]);
}

/**
 * Hook para cargar todos los GainMaps registrados
 * @param {boolean} autoLoad - Si true, carga automáticamente al montar el componente
 * @returns {Object} - {loading, error, progress, ready, loadAll}
 */
export function useLoadGainMaps(initialized) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(gainMapPreloader.getProgress());
  const [ready, setReady] = useState(gainMapPreloader.isReady());
  const [loadCalled, setLoadCalled] = useState(false);

  // Suscribirse al progreso
  useEffect(() => {
    const removeListener = gainMapPreloader.addProgressListener((value) => {
      setProgress(value);
      setReady(gainMapPreloader.isReady());
    });

    return removeListener;
  }, []);

  // Modificar la carga para que solo se llame una vez
  useEffect(() => {
    const loadMaps = async () => {
      if (initialized && !loadCalled) {
        try {
          setLoading(true);
          await gainMapPreloader.loadAll();
          setLoading(false);
          setLoadCalled(true);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      }
    };

    loadMaps();
  }, [initialized, loadCalled]);

  return { loading, error, progress, ready };
}

/**
 * Hook para obtener el progreso de carga de GainMaps
 * @returns {number} - Porcentaje de progreso (0-100)
 */
export function useGainMapProgress() {
  const [progress, setProgress] = useState(gainMapPreloader.getProgress());

  useEffect(() => {
    // Asegurarse de obtener el progreso actual al montar el componente
    setProgress(gainMapPreloader.getProgress());

    // Suscribirse a cambios en el progreso
    const removeListener = gainMapPreloader.addProgressListener((value) => {
      setProgress(value);
    });

    return removeListener;
  }, []);

  return progress;
}
