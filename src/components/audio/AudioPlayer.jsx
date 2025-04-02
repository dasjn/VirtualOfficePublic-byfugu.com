import React, { useEffect, useRef, useCallback } from "react";
import { useExperience } from "@/hooks/useExperience";
import audioData from "@/data/audios.json";

const AudioPlayer = () => {
  const {
    selectedAudio,
    setSelectedAudio,
    isAudioPlaying,
    setIsAudioPlaying,
    isPointerLocked,
  } = useExperience();

  // References for the audio system
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const audioSourceRef = useRef(null);
  const audioElementRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const audioLoadedRef = useRef(false);

  // Configuration
  const DEFAULT_VOLUME = 0.75;
  const FADE_DURATION = 1000; // in milliseconds
  const FADE_STEP = 0.05;

  // Function to perform fade-in and fade-out (with useCallback)
  const fadeAudio = useCallback(
    (start, end, onComplete) => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      // If AudioContext is suspended, resume it
      if (
        audioContextRef.current &&
        audioContextRef.current.state === "suspended"
      ) {
        audioContextRef.current.resume();
      }

      let currentVolume = start;
      const step = end - start > 0 ? FADE_STEP : -FADE_STEP;
      const interval = FADE_DURATION / (Math.abs(end - start) / Math.abs(step));

      fadeIntervalRef.current = setInterval(() => {
        currentVolume += step;

        // Check if we've reached the final volume
        if (
          (step > 0 && currentVolume >= end) ||
          (step < 0 && currentVolume <= end)
        ) {
          currentVolume = end;
          clearInterval(fadeIntervalRef.current);
          if (onComplete) onComplete();
        }

        // Apply the volume if gainNode exists
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = currentVolume;
        }
      }, interval);
    },
    [FADE_STEP, FADE_DURATION]
  );

  // Function to start audio with fade-in (with useCallback)
  const startAudioWithFade = useCallback(() => {
    if (!gainNodeRef.current || !audioElementRef.current) return;

    // Make sure the audio is playing before fading in
    const playPromise = audioElementRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Successful playback
          fadeAudio(0, DEFAULT_VOLUME);
          setIsAudioPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          // Attempt to resume the context if suspended (autoplay policies)
          if (
            audioContextRef.current &&
            audioContextRef.current.state === "suspended"
          ) {
            audioContextRef.current
              .resume()
              .then(() => audioElementRef.current.play())
              .then(() => {
                fadeAudio(0, DEFAULT_VOLUME);
                setIsAudioPlaying(true);
              });
          }
        });
    }
  }, [fadeAudio, DEFAULT_VOLUME, setIsAudioPlaying]);

  // Function to pause audio with fade-out (with useCallback)
  const pauseAudioWithFade = useCallback(() => {
    if (!gainNodeRef.current || !audioElementRef.current) return;

    // We'll just fade out without disconnecting the source
    fadeAudio(gainNodeRef.current.gain.value, 0, () => {
      audioElementRef.current.pause();
      setIsAudioPlaying(false);
    });
  }, [fadeAudio, setIsAudioPlaying]);

  // Function to change audio track (with useCallback)
  const changeAudio = useCallback(
    (newAudio) => {
      if (!audioContextRef.current) return;

      const loadAndPlayAudio = () => {
        // Create a new audio element
        const audioElement = new Audio(newAudio.url);
        audioElementRef.current = audioElement;
        audioElement.loop = true;

        // Connect to AudioContext
        const source =
          audioContextRef.current.createMediaElementSource(audioElement);
        source.connect(gainNodeRef.current);
        audioSourceRef.current = source;

        // Start playback and fade-in
        audioElement
          .play()
          .then(() => {
            startAudioWithFade();
            audioLoadedRef.current = true;
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            // Attempt to resume the context if suspended (autoplay policies)
            if (
              audioContextRef.current &&
              audioContextRef.current.state === "suspended"
            ) {
              audioContextRef.current.resume();
            }
          });
      };

      // If there's already a track playing, fade out before changing
      if (audioSourceRef.current) {
        // Modified: Instead of using stopAudioWithFade, we'll disconnect the old source after fade
        fadeAudio(gainNodeRef.current.gain.value, 0, () => {
          if (audioElementRef.current) {
            audioElementRef.current.pause();
          }
          if (audioSourceRef.current) {
            audioSourceRef.current.disconnect();
            audioSourceRef.current = null;
          }
          loadAndPlayAudio();
        });
      } else {
        loadAndPlayAudio();
      }
    },
    [startAudioWithFade, fadeAudio]
  );

  // Initialize AudioContext
  useEffect(() => {
    // Initialize AudioContext
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.gain.value = 0; // Start with volume 0 for fade-in
    gainNodeRef.current.connect(audioContextRef.current.destination);

    // Cleanup when unmounting
    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
        }

        if (audioSourceRef.current) {
          audioSourceRef.current.disconnect();
        }

        audioContextRef.current.close();
      }
    };
  }, []);

  // Set default audio (separate to avoid circular dependencies)
  useEffect(() => {
    if (!selectedAudio) {
      const defaultAudio = audioData.find(
        (audio) => audio.name === "A_Chill_Evening"
      );
      if (defaultAudio) {
        setSelectedAudio(defaultAudio);
      }
    }
  }, [selectedAudio, setSelectedAudio]);

  // Effect to change track when selectedAudio changes
  useEffect(() => {
    if (selectedAudio && audioContextRef.current) {
      changeAudio(selectedAudio);
    }
  }, [selectedAudio, changeAudio]);

  // Handle the "M" key to mute/unmute audio
  useEffect(() => {
    const handleKeyPress = (event) => {
      if ((event.key === "m" || event.key === "M") && audioLoadedRef.current) {
        if (isAudioPlaying) {
          pauseAudioWithFade();
        } else if (audioElementRef.current) {
          startAudioWithFade();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isAudioPlaying, pauseAudioWithFade, startAudioWithFade]);

  // Adjust audio volume when pointer is locked/unlocked
  useEffect(() => {
    if (!audioLoadedRef.current || !gainNodeRef.current) return;

    if (!isPointerLocked && isAudioPlaying) {
      fadeAudio(gainNodeRef.current.gain.value, 0.1);
    } else if (isPointerLocked && isAudioPlaying) {
      fadeAudio(gainNodeRef.current.gain.value, DEFAULT_VOLUME);
    }
  }, [isPointerLocked, isAudioPlaying, DEFAULT_VOLUME, fadeAudio]);

  // Component doesn't render anything visible, just handles audio logic
  return null;
};

export default AudioPlayer;
