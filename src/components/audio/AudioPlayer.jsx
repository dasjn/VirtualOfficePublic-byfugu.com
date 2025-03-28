import React, { useEffect, useRef, useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import audioData from "@/data/audios.json"; // Importa el JSON de audios

const AudioPlayer = () => {
  const {
    selectedAudio,
    setSelectedAudio,
    isAudioPlaying,
    setIsAudioPlaying,
    isPointerLocked,
  } = useExperience();
  const audioRef = useRef(null);
  const [isFirstAudioLoad, setIsFirstAudioLoad] = useState(true);

  return <></>;

  // useEffect(() => {
  //   // Si no hay audio seleccionado, establece el Main_Theme del JSON como predeterminado
  //   if (!selectedAudio) {
  //     const defaultAudio = audioData.find(
  //       (audio) => audio.name === "Main_Theme"
  //     );
  //     if (defaultAudio) {
  //       setSelectedAudio(defaultAudio);
  //     }
  //   }
  // }, [selectedAudio, setSelectedAudio]);

  // // Manejo de la tecla "M" para toggle del audio
  // useEffect(() => {
  //   const handleKeyPress = (event) => {
  //     // Si se presiona la tecla "M"
  //     if (event.key === "m" || event.key === "M") {
  //       const audio = audioRef.current;
  //       if (audio) {
  //         if (isAudioPlaying) {
  //           // Si el audio está sonando, se pausa
  //           audio.pause();
  //         } else {
  //           // Si el audio está pausado, se reproduce
  //           audio.play();
  //         }
  //         setIsAudioPlaying(!isAudioPlaying); // Alternar el estado de reproducción
  //       }
  //     }
  //   };

  //   // Añadir el event listener
  //   window.addEventListener("keydown", handleKeyPress);

  //   // Limpieza: eliminar el event listener cuando el componente se desmonte
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [isAudioPlaying, setIsAudioPlaying]);

  // useEffect(() => {
  //   const audio = audioRef.current;

  //   if (audio && selectedAudio) {
  //     audio.src = selectedAudio.url; // Establecer el audio seleccionado

  //     if (isFirstAudioLoad) {
  //       // Realiza el fade-in si es la primera carga
  //       audio.volume = 0; // Inicia el volumen en 0
  //       audio.play().then(() => {
  //         let currentVolume = 0;
  //         const volumeInterval = setInterval(() => {
  //           if (currentVolume < 0.75) {
  //             currentVolume += 0.01;

  //             audio.volume = Math.min(currentVolume, 0.75);
  //           } else {
  //             clearInterval(volumeInterval);
  //             setIsFirstAudioLoad(false); // Marca como completado el fade-in
  //           }
  //         }, 100); // Incremento gradual cada 100ms
  //       });
  //     } else {
  //       // Si no es la primera carga, establece el volumen por defecto directamente
  //       audio.volume = 0.75;
  //       audio.play();
  //     }

  //     setIsAudioPlaying(true);
  //   }

  //   // Limpieza: detiene el audio al desmontar
  //   return () => {
  //     if (audio) {
  //       audio.pause();
  //       audio.currentTime = 0;
  //       setIsAudioPlaying(false);
  //     }
  //   };
  // }, [selectedAudio, setIsAudioPlaying, isFirstAudioLoad]);

  // return (
  //   <div>
  //     {selectedAudio ? (
  //       <audio ref={audioRef} loop />
  //     ) : (
  //       <p>No hay audio seleccionado para reproducir.</p>
  //     )}
  //   </div>
  // );
};

export default AudioPlayer;
