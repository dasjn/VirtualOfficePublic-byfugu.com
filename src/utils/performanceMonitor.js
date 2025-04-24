// src/utils/performanceMonitor.js
/**
 * Utilidad para monitorear el rendimiento y detectar cuellos de botella
 */

// Objeto para almacenar las mediciones
const measurements = {};

// Configurar el observer de rendimiento
export const setupPerformanceMonitor = () => {
  if (
    typeof window === "undefined" ||
    typeof PerformanceObserver === "undefined"
  )
    return;

  // Limpiar marcas anteriores
  performance.clearMarks();
  performance.clearMeasures();

  // Configurar el observer
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === "measure") {
        if (!measurements[entry.name]) {
          measurements[entry.name] = [];
        }
        measurements[entry.name].push(entry.duration);

        // Mostrar en consola con colores según la duración
        const duration = entry.duration.toFixed(2);
        const color =
          entry.duration > 100
            ? "color: red; font-weight: bold"
            : entry.duration > 30
              ? "color: orange"
              : "color: green";

        console.log(`%c🔍 ${entry.name}: ${duration}ms`, color);
      }
    });
  });

  observer.observe({ entryTypes: ["measure"] });
  return observer;
};

// Iniciar una medición
export const startMeasure = (id) => {
  if (typeof performance === "undefined") return;
  performance.mark(`${id}-start`);
};

// Finalizar una medición
export const endMeasure = (id, label = id) => {
  if (typeof performance === "undefined") return;
  performance.mark(`${id}-end`);
  try {
    performance.measure(label, `${id}-start`, `${id}-end`);
  } catch (e) {
    console.warn("Error al medir rendimiento:", e);
  }
};

// Obtener resumen de las mediciones
export const getPerformanceSummary = () => {
  const summary = {};
  Object.keys(measurements).forEach((key) => {
    const durations = measurements[key];
    if (durations.length > 0) {
      summary[key] = {
        avg: durations.reduce((a, b) => a + b, 0) / durations.length,
        min: Math.min(...durations),
        max: Math.max(...durations),
        count: durations.length,
      };
    }
  });
  return summary;
};

// Mostrar resumen en consola
export const logPerformanceSummary = () => {
  const summary = getPerformanceSummary();
  console.group("📊 Resumen de Rendimiento");
  Object.keys(summary).forEach((key) => {
    const { avg, min, max, count } = summary[key];
    console.log(
      `${key}:\n` +
        `  Promedio: ${avg.toFixed(2)}ms\n` +
        `  Min: ${min.toFixed(2)}ms\n` +
        `  Max: ${max.toFixed(2)}ms\n` +
        `  # Ejecuciones: ${count}`
    );
  });
  console.groupEnd();
};

// Medir el tiempo de ejecución de una función
export const measureFunction = (fn, id) => {
  return (...args) => {
    startMeasure(id);
    const result = fn(...args);
    if (result instanceof Promise) {
      return result.finally(() => endMeasure(id));
    }
    endMeasure(id);
    return result;
  };
};

// Monitor de frames
let lastFrameTime = 0;
let frameCount = 0;
let frameTimes = [];
const MAX_FRAME_SAMPLES = 60;

export const monitorFrameRate = (time) => {
  if (lastFrameTime === 0) {
    lastFrameTime = time;
    return;
  }

  // Calcular tiempo de frame
  const delta = time - lastFrameTime;
  lastFrameTime = time;

  // Guardar tiempo de frame
  frameTimes.push(delta);
  if (frameTimes.length > MAX_FRAME_SAMPLES) {
    frameTimes.shift();
  }

  frameCount++;

  // Mostrar FPS cada segundo
  if (frameCount % 60 === 0) {
    const avgFrameTime =
      frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const fps = 1000 / avgFrameTime;

    // Detectar caídas de FPS
    const minFPS = 1000 / Math.max(...frameTimes);
    const color =
      minFPS < 30
        ? "color: red; font-weight: bold"
        : minFPS < 50
          ? "color: orange"
          : "color: green";

    console.log(
      `%c⚡ FPS: ${fps.toFixed(1)} (min: ${minFPS.toFixed(1)})`,
      color
    );
  }
};

// Exportar función para limpiar todo
export const resetPerformanceMonitor = () => {
  performance.clearMarks();
  performance.clearMeasures();
  Object.keys(measurements).forEach((key) => {
    delete measurements[key];
  });
  lastFrameTime = 0;
  frameCount = 0;
  frameTimes = [];
};
