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
export function useLoadGainMaps(autoLoad = true) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(gainMapPreloader.getProgress());
  const [ready, setReady] = useState(gainMapPreloader.isReady());

  // Suscribirse al progreso
  useEffect(() => {
    const removeListener = gainMapPreloader.addProgressListener((value) => {
      setProgress(value);
      setReady(gainMapPreloader.isReady());
    });

    return removeListener;
  }, []);

  // Función para cargar manualmente - usando useCallback para evitar recreaciones
  const loadAll = useCallback(async () => {
    if (loading) return;

    try {
      console.log("🔄 Iniciando carga de GainMaps...");
      const startTime = performance.now();

      setLoading(true);
      setError(null);

      // Aquí es donde necesitamos modificar el gainMapPreloader para que
      // registre tiempos por cada textura individual
      await gainMapPreloader.loadAll();

      const endTime = performance.now();
      console.log(
        `✅ Carga de GainMaps completada en ${(endTime - startTime).toFixed(
          2
        )}ms`
      );

      setError(gainMapPreloader.getError());
      setLoading(false);
    } catch (err) {
      console.error("❌ Error en carga de GainMaps:", err);
      setError(err);
      setLoading(false);
    }
  }, [loading]);

  // Carga automática
  useEffect(() => {
    if (autoLoad) {
      loadAll();
    }
  }, [autoLoad, loadAll]); // Ahora incluimos loadAll en las dependencias

  return { loading, error, progress, ready, loadAll };
}

/**
 * Hook para obtener el progreso de carga de GainMaps
 * @returns {number} - Porcentaje de progreso (0-100)
 */
export function useGainMapProgress() {
  const [progress, setProgress] = useState(gainMapPreloader.getProgress());

  useEffect(() => {
    const removeListener = gainMapPreloader.addProgressListener(setProgress);
    return removeListener;
  }, []);

  return progress;
}
