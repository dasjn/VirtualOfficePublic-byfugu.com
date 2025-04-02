import { useExperience } from "@/hooks/useExperience";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Key from "./Key";
import WelcomeModal from "./WelcomeModal";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function UI3D() {
  const {
    isPointerLocked,
    cursorHover,
    deviceType,
    setCursorHover,
    lockPointer,
    selectedAudio,
    isAudioPlaying,
  } = useExperience();

  // State to control if the welcome modal is shown
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  // State to control the scene transition effect
  const [sceneFadeIn, setSceneFadeIn] = useState(false);
  // State to force reload of Lottie animation when audio state changes
  const [lottieKey, setLottieKey] = useState(0);
  // Reference to Lottie component
  const lottieRef = useRef(null);

  // Start the transition animation when the component mounts
  useEffect(() => {
    // Start the transition animation
    const fadeTimer = setTimeout(() => {
      setSceneFadeIn(true);
    }, 100);

    return () => clearTimeout(fadeTimer);
  }, []);

  // Reset Lottie animation when audio state changes
  useEffect(() => {
    // Force reload of Lottie component when audio state changes
    setLottieKey((prevKey) => prevKey + 1);
  }, [isAudioPlaying]);

  // Function to handle welcome modal acceptance
  const handleModalAccept = () => {
    // Hide the welcome modal
    setShowWelcomeModal(false);

    // Activate pointer lock after a brief delay to allow the modal animation to complete
    setTimeout(() => {
      lockPointer();
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
      {/* Scene transition overlay */}
      <AnimatePresence>
        {!sceneFadeIn && (
          <motion.div
            className="absolute inset-0 bg-black z-[10000] pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

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
        <AnimatePresence>
          {showWelcomeModal && (
            <WelcomeModal
              onAccept={handleModalAccept}
              setCursorHover={setCursorHover}
            />
          )}
        </AnimatePresence>

        {/* Audio controls (for desktop devices) */}
        {!isTouchDevice && (
          <motion.div
            className="z-[9999] select-none flex flex-col p-4 absolute bottom-[28%] left-[2%] w-auto gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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
          </motion.div>
        )}

        {/* Keyboard controls (for desktop devices) */}
        {!isTouchDevice && (
          <motion.div
            className="z-[9999] select-none flex flex-col p-4 absolute bottom-[2%] left-[2%] w-60 h-64 gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow pointer-events-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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
          </motion.div>
        )}
      </div>
    </>
  );
}
