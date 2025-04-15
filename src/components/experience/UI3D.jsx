import { useExperience } from "@/hooks/useExperience";
import { useState, useEffect, useRef } from "react";
import Key from "./Key";
import WelcomeModal from "./WelcomeModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PauseModal from "./PauseModal";

export default function UI3D() {
  const {
    isPointerLocked,
    cursorHover,
    deviceType,
    setCursorHover,
    lockPointer,
    selectedAudio,
    isAudioPlaying,
    experienceMounted,
    isUserOnPC,
  } = useExperience();

  // State to control if the welcome modal is shown
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  // State to control if the pause modal is shown
  const [showPauseModal, setShowPauseModal] = useState(false);
  // State to control the scene transition effect
  const [sceneFadeIn, setSceneFadeIn] = useState(false);
  // State to control audio control visibility
  const [showAudioControl, setShowAudioControl] = useState(false);
  // State to control keyboard control visibility
  const [showKeyboardControl, setShowKeyboardControl] = useState(false);
  // State to force reload of Lottie animation when audio state changes
  const [lottieKey, setLottieKey] = useState(0);
  // Añade este estado al componente UI3D
  const [inWelcomeTransition, setInWelcomeTransition] = useState(false);
  // Reference to Lottie component
  const lottieRef = useRef(null);

  useEffect(() => {
    if (
      !isPointerLocked &&
      experienceMounted &&
      !isUserOnPC &&
      !showWelcomeModal &&
      !inWelcomeTransition // Añadir esta condición
    ) {
      setShowPauseModal(true);
    }
  }, [
    experienceMounted,
    isPointerLocked,
    isUserOnPC,
    showWelcomeModal,
    inWelcomeTransition,
  ]);

  // Start the transition animation when the experience is mounted
  useEffect(() => {
    if (experienceMounted) {
      // Start the transition animation only when experience is ready
      const fadeTimer = setTimeout(() => {
        setSceneFadeIn(true);
      }, 100);

      // Setup staggered animations for UI elements
      const audioTimer = setTimeout(() => {
        setShowAudioControl(true);
      }, 1300); // 1.2s delay for audio control

      const keyboardTimer = setTimeout(() => {
        setShowKeyboardControl(true);
      }, 1600); // 1.5s delay for keyboard control

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(audioTimer);
        clearTimeout(keyboardTimer);
      };
    }
  }, [experienceMounted]);

  // Reset Lottie animation when audio state changes
  useEffect(() => {
    // Force reload of Lottie component when audio state changes
    setLottieKey((prevKey) => prevKey + 1);
  }, [isAudioPlaying]);

  // Function to handle welcome modal acceptance
  const handleWelcomeModalAccept = () => {
    setInWelcomeTransition(true); // Entramos en estado de transición

    setTimeout(() => {
      if (!isPointerLocked) {
        lockPointer();
      }
      setShowWelcomeModal(false);

      // Finaliza el estado de transición después de que el puntero se bloquee
      setTimeout(() => {
        setInWelcomeTransition(false);
      }, 500);
    }, 300);
  };

  const handlePauseModalAccept = () => {
    // Activate pointer lock after a brief delay to allow the modal animation to complete
    setTimeout(() => {
      if (!isPointerLocked) {
        lockPointer();
      }
      setShowPauseModal(false);
    }, 300);
  };

  // Check if the device is touch-enabled
  const isTouchDevice = deviceType?.isTouchDevice;

  // Function to format the current audio name
  const formatAudioName = (name) => {
    if (!name) return "No audio selected";

    // Replace underscores with spaces and format each word
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <>
      {/* Scene transition overlay with Tailwind animation */}
      {(!sceneFadeIn || !experienceMounted) && (
        <div
          className={`absolute inset-0 bg-black z-[10000] pointer-events-none transition-opacity duration-1500 ease-in-out ${
            experienceMounted ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      <div className="absolute w-screen h-screen text-white pointer-events-none">
        {/* Pointer (only visible on non-touch devices when locked) */}
        {isPointerLocked && !isTouchDevice && (
          <div
            className={`z-[9999] select-none absolute top-1/2 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 border border-white bg-white bg-opacity-40 ${
              cursorHover ? "w-6 h-6" : "w-4 h-4"
            } 
          transition-[width,height] duration-300 ease-in-out`}
          />
        )}

        {/* Welcome Modal */}
        {showWelcomeModal && experienceMounted && (
          <WelcomeModal
            onAccept={handleWelcomeModalAccept}
            setCursorHover={setCursorHover}
          />
        )}

        {/* Pause Modal */}
        {showPauseModal && experienceMounted && !isUserOnPC && (
          <PauseModal
            onAccept={handlePauseModalAccept}
            setCursorHover={setCursorHover}
          />
        )}

        {/* Audio controls and Keyboard controls (for desktop devices) - in a single container with gap */}
        {!isTouchDevice && experienceMounted && (
          <div className="absolute bottom-[2%] left-[2%] flex flex-col gap-4">
            {/* Audio controls with Tailwind animation */}
            <div
              className={`z-[9999] select-none flex flex-col p-4 w-auto gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow pointer-events-auto transform transition-all duration-500 ease-out ${
                showAudioControl && sceneFadeIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 h-16">
                  {/* Key attribute forces re-render when isAudioPlaying changes */}
                  <DotLottieReact
                    key={lottieKey}
                    ref={lottieRef}
                    src="audio/Sound_ONFFICE_v2.lottie"
                    loop={isAudioPlaying}
                    autoplay={true}
                    style={{
                      opacity: isAudioPlaying ? 1 : 0.5,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs opacity-70">Now Playing:</span>
                  <span className="font-medium">
                    {isAudioPlaying
                      ? formatAudioName(selectedAudio?.name)
                      : "Audio Paused"}
                  </span>
                  <span className="text-xs opacity-70 mt-1">
                    Press M to toggle audio
                  </span>
                </div>
              </div>
            </div>

            {/* Keyboard controls with Tailwind animation */}
            <div
              className={`z-[9999] select-none flex flex-col p-4 w-60 h-64 gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow pointer-events-auto transform transition-all duration-500 ease-out ${
                showKeyboardControl && sceneFadeIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-5"
              }`}
            >
              {/* Upper section with Escape and Mute keys */}
              <div className="flex h-2/5 justify-center items-center w-full">
                <div className="flex flex-row gap-8 justify-center items-center w-full">
                  {/* Escape key with fixed width container */}
                  <div className="flex flex-col gap-1 items-center w-20">
                    <Key
                      keyName="escapeKeyPressed"
                      keyLetter="Esc"
                      keyTitle="Stop"
                      keyIcon="pause"
                    />
                  </div>

                  {/* Mute key with fixed width container */}
                  <div className="flex flex-col gap-1 items-center w-20">
                    <Key
                      keyName="muteKeyPressed"
                      keyLetter="M"
                      keyTitle={isAudioPlaying ? "Mute" : "Unmute"}
                      keyIcon={isAudioPlaying ? "volume_up" : "volume_off"}
                    />
                  </div>
                </div>
              </div>

              {/* Lower section with WASD keys */}
              <div className="flex flex-col h-3/5 gap-1 justify-end items-center">
                <Key
                  keyName="forwardKeyPressed"
                  keyLetter="W"
                  keyTitle="Move"
                  keyIcon="footprint"
                />
                <div className="flex flex-row gap-1 self-center">
                  <Key keyName="leftKeyPressed" keyLetter="A" />
                  <Key keyName="backwardKeyPressed" keyLetter="S" />
                  <Key keyName="rightKeyPressed" keyLetter="D" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
