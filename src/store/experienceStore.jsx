import { create } from "zustand";
import { createRef } from "react";
import * as THREE from "three";
import audioData from "@/data/audios.json";
import { QualityLevels } from "@/data/assets";

// Optimización: Vectores reutilizables para animaciones
const sharedVectors = {
  position: new THREE.Vector3(),
  direction: new THREE.Vector3(),
  lookAt: new THREE.Vector3(),
};

// Optimización: Función de easing reutilizable
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

// Función para detectar el tipo de dispositivo
const detectDeviceType = () => {
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  // Detectar si es móvil o tablet basado en el tamaño de pantalla
  const isPhone = isTouchDevice && window.innerWidth < 768;
  const isTablet =
    isTouchDevice && window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = !isTouchDevice || window.innerWidth >= 1024;

  return {
    isTouchDevice,
    isPhone,
    isTablet,
    isDesktop,
  };
};

export const useExperienceStore = create((set, get) => ({
  // Referencias
  rigidBodyRef: createRef(),
  pointerLockRef: createRef(),
  meshComputerRef: createRef(),

  // Estados de dispositivo
  deviceType: detectDeviceType(),
  updateDeviceType: () => set({ deviceType: detectDeviceType() }),

  // Estado de calidad
  qualityLevel: QualityLevels.HIGH,
  setQualityLevel: (quality) => set({ qualityLevel: quality }),

  // Función para determinar si se debe usar calidad baja
  shouldUseLowQuality: () => {
    const { deviceType } = get();

    // Verificar si es un dispositivo móvil
    const isMobile = deviceType.isPhone || deviceType.isTablet;
    console.log(
      `[QualityDetection] Es dispositivo móvil: ${isMobile ? "Sí" : "No"}`
    );

    // Verificar si es un dispositivo con poca memoria o GPU limitada
    const hasLimitedGPU = !window.navigator.gpu; // WebGPU no disponible
    console.log(
      `[QualityDetection] GPU limitada (sin WebGPU): ${
        hasLimitedGPU ? "Sí" : "No"
      }`
    );

    // Verificar memoria disponible (si el navegador lo permite)
    const hasLimitedMemory =
      window.navigator.deviceMemory && window.navigator.deviceMemory < 4;
    console.log(
      `[QualityDetection] Memoria limitada: ${hasLimitedMemory ? "Sí" : "No"} ${
        window.navigator.deviceMemory
          ? `(${window.navigator.deviceMemory}GB)`
          : "(No detectable)"
      }`
    );

    // Verificar ancho de pantalla pequeño
    const hasSmallScreen = window.innerWidth < 768;
    console.log(
      `[QualityDetection] Pantalla pequeña: ${hasSmallScreen ? "Sí" : "No"} (${
        window.innerWidth
      }px de ancho)`
    );

    // Si cualquiera de estas condiciones es verdadera, usar calidad baja
    const shouldUseLow =
      isMobile || hasLimitedGPU || hasLimitedMemory || hasSmallScreen;
    console.log(
      `[QualityDetection] Decisión final: ${
        shouldUseLow ? "USAR CALIDAD BAJA" : "USAR CALIDAD ALTA"
      }`
    );

    // Información adicional sobre el navegador y dispositivo
    console.log(`[QualityDetection] User Agent: ${navigator.userAgent}`);
    console.log(
      `[QualityDetection] Resolución: ${window.innerWidth}x${window.innerHeight}`
    );
    console.log(`[QualityDetection] Pixel Ratio: ${window.devicePixelRatio}`);

    return shouldUseLow;
  },

  // Inicializar nivel de calidad basado en el dispositivo
  initializeQualityLevel: () => {
    const { shouldUseLowQuality, setQualityLevel } = get();
    const quality = shouldUseLowQuality()
      ? QualityLevels.LOW
      : QualityLevels.HIGH;
    setQualityLevel(quality);
    return quality;
  },

  // Estado para controlar la transición de la experiencia
  experienceMounted: false,
  setExperienceMounted: (value) => set({ experienceMounted: value }),

  // Estados
  isPointerLocked: false,
  setIsPointerLocked: (value) => set({ isPointerLocked: value }),

  canMoveCamera: true,
  setCanMoveCamera: (value) => set({ canMoveCamera: value }),

  canMovePlayer: true,
  setCanMovePlayer: (value) => set({ canMovePlayer: value }),

  cursorHover: false,
  setCursorHover: (value) => set({ cursorHover: value }),

  isAudioPlaying: false,
  setIsAudioPlaying: (value) => set({ isAudioPlaying: value }),

  availableAudios: audioData,
  setAvailableAudios: (value) => set({ availableAudios: value }),

  selectedAudio: null,
  setSelectedAudio: (value) => set({ selectedAudio: value }),

  isUserOnPC: false,
  setIsUserOnPC: (value) => set({ isUserOnPC: value }),

  animationCooldown: false,
  setAnimationCooldown: (value) => set({ animationCooldown: value }),

  hasShownWelcomeModal: localStorage.getItem("hasShownWelcomeModal") === "true",
  setHasShownWelcomeModal: (value) => {
    // Save to localStorage for persistence across sessions
    // localStorage.setItem("hasShownWelcomeModal", value);
    set({ hasShownWelcomeModal: value });
  },

  // Optimización: Función optimizada para detener el movimiento de la cámara
  stopCameraMovement: () => {
    const { cameraMovement } = get();

    set({
      cameraMovement: {
        ...cameraMovement,
        isMoving: false,
      },
      animationCooldown: true,
    });

    // Optimización: Uso de un solo temporizador para animationCooldown
    setTimeout(() => set({ animationCooldown: false }), 300);

    if (cameraMovement.onComplete) {
      cameraMovement.onComplete();
    }
  },

  // Estados para el movimiento de la cámara
  cameraMovement: {
    isMoving: false,
    startPosition: null,
    targetPosition: null,
    startRotation: null,
    targetLookAt: null,
    startTime: 0,
    duration: 2000,
    onComplete: null,
  },

  // Optimización: Función optimizada para iniciar el movimiento de la cámara
  startCameraMovement: (
    startPosition,
    targetPosition,
    targetLookAt = null,
    duration = 2000,
    onComplete = null
  ) => {
    const { rigidBodyRef } = get();

    // Crear quaternion para la rotación
    const startRotation = rigidBodyRef.current
      ? new THREE.Quaternion().copy(rigidBodyRef.current.rotation())
      : new THREE.Quaternion();

    // Si no se proporciona lookAt, calcular uno
    let lookAtPoint = targetLookAt;
    if (!lookAtPoint) {
      // Calcular dirección con vectors reutilizables
      sharedVectors.direction
        .copy(targetPosition)
        .sub(startPosition)
        .normalize();

      // Calcular punto de lookAt con vector reutilizable
      sharedVectors.lookAt
        .copy(targetPosition)
        .add(sharedVectors.direction.multiplyScalar(5));

      lookAtPoint = sharedVectors.lookAt.clone();
    }

    set({
      cameraMovement: {
        isMoving: true,
        startPosition: startPosition.clone(),
        targetPosition: targetPosition.clone(),
        startRotation,
        targetLookAt: lookAtPoint,
        startTime: Date.now(),
        duration,
        onComplete,
      },
    });
  },

  // Optimización: Función optimizada para actualizar la posición de la cámara
  updateCameraPosition: () => {
    const { cameraMovement, rigidBodyRef } = get();

    if (!cameraMovement.isMoving || !rigidBodyRef.current) return;

    // Calcular progreso de la animación
    const currentTime = Date.now();
    const elapsedTime = currentTime - cameraMovement.startTime;
    const progress = Math.min(elapsedTime / cameraMovement.duration, 1);
    const easedProgress = easeOutCubic(progress);

    // Calcular nueva posición con vector reutilizable
    sharedVectors.position.lerpVectors(
      cameraMovement.startPosition,
      cameraMovement.targetPosition,
      easedProgress
    );

    // Aplicar al rigidBody
    rigidBodyRef.current.setTranslation(sharedVectors.position, true);

    // Terminar animación si completada
    if (progress >= 1) {
      get().stopCameraMovement();
    }

    // Retornar posición clonada para CameraController
    return sharedVectors.position.clone();
  },

  // Métodos para manejar el PointerLock
  lockPointer: () => {
    const { pointerLockRef } = get();
    if (pointerLockRef.current) {
      pointerLockRef.current.lock();
    }
  },

  unlockPointer: () => {
    const { pointerLockRef } = get();
    if (pointerLockRef.current) {
      pointerLockRef.current.unlock();
    }
  },

  togglePointerLock: () => {
    const { isPointerLocked, lockPointer, unlockPointer } = get();
    if (isPointerLocked) {
      unlockPointer();
    } else {
      lockPointer();
    }
  },
}));
