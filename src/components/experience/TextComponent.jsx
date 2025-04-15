// TextComponent.jsx
import { Html } from "@react-three/drei";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

// Definimos aquí las constantes para tener autocompletado
export const CARD_NAMES = {
  GardenSpine: "GardenSpine",
  Piedras: "Piedras",
  Cuadro1: "Cuadro1",
  Cuadro2: "Cuadro2",
  WC: "WC",
  Latas: "Latas",
  Tarjetas: "Tarjetas",
  GoogleHome: "GoogleHome",
  MeetingRoom: "MeetingRoom",
  Exit: "Exit",
};

// Datos de las tarjetas
const cardData = [
  {
    name: "GardenSpine",
    title: "FUGU's Spine",
    description:
      "One structure, built from many minds. It embodies the collective expertise, creativity, and precision that define our agency — a single, living form shaped by years of shared experience. It follows you because we're always looking ahead — anticipating what could be the right next step for your project.",
  },
  {
    name: "Piedras",
    title: "Volcanic Stone",
    description:
      "The remaining stone on volcanic islands reminds us of our origins — and of the importance of staying grounded. It reflects the raw energy we come from and the enduring strength we carry forward. It's a symbol of our claim, Canarian Global Creative Agency, and a reminder that everything we build starts from our roots.",
  },
  {
    name: "Cuadro1",
    title: "Great design doesn't happen alone",
    description:
      "What we build together is always better — that's why each FUGU Spine comes together to form something greater: a shared creative structure that holds everything in place.",
  },
  {
    name: "Cuadro2",
    title: "International Communication, Islander Origins",
    description:
      "We truly believe that our origins and roots make us different, providing us with a unique perspective that we channel into our design work",
  },
  {
    name: "WC",
    title: "Whoops! Occupied.",
    description: "Someone's probably brainstorming.",
  },
  {
    name: "Latas",
    title: "100% Creative Carbonated Juice",
    description: "Brewed in the Canary Islands. Best served with bold ideas.",
  },
  {
    name: "Tarjetas",
    title: "This is The Core Team",
    description:
      "Focused, hands-on, and proud of what's built. But great work takes more than three — so we collaborate with the best to deliver what each project truly needs.",
  },
  {
    name: "GoogleHome",
    title: "Click here to change the song",
    description:
      "Tap the speaker to change the soundtrack — because every idea deserves its own rhythm.",
  },
  {
    name: "MeetingRoom",
    title: "Meeting Room",
    description:
      "It seems that Fugu's team is currently in a meeting. You can book a video call with them by reaching out to hola@byfugu.com or using the Onffice's computer.",
  },
  {
    name: "Exit",
    title: "Offline? Not through here.",
    description:
      "Want to leave? Just press 'Escape' and close the tab. We won't take it personally",
  },
];

export default function TextComponent({
  position = [0, 0, 0],
  cardName,
  isNearby = false,
}) {
  // Buscar la tarjeta por nombre
  const card = cardData.find((item) => item.name === cardName) || {
    title: "Título no encontrado",
    description: "Descripción no encontrada",
  };

  // Estado para controlar la visibilidad del componente en el DOM
  const [showComponent, setShowComponent] = useState(false);
  // Estado para controlar la animación
  const [animationState, setAnimationState] = useState("hidden"); // "hidden", "entering", "visible", "exiting"

  // Efecto para manejar la aparición y desaparición con un ligero retraso
  useEffect(() => {
    let showTimer, animateInTimer, animateOutTimer, hideTimer;

    if (isNearby) {
      // Mostrar el componente
      setShowComponent(true);

      // Iniciar animación de entrada después de un pequeño delay
      animateInTimer = setTimeout(() => {
        setAnimationState("entering");

        // Cambiar a estado visible cuando termina la animación
        showTimer = setTimeout(() => {
          setAnimationState("visible");
        }, 500); // Duración de la animación de entrada
      }, 50);
    } else {
      // Si estaba visible, iniciar animación de salida
      if (showComponent) {
        setAnimationState("exiting");

        // Ocultar el componente cuando termina la animación de salida
        hideTimer = setTimeout(() => {
          setShowComponent(false);
          setAnimationState("hidden");
        }, 500); // Duración de la animación de salida
      }
    }

    // Limpiar temporizadores
    return () => {
      clearTimeout(showTimer);
      clearTimeout(animateInTimer);
      clearTimeout(animateOutTimer);
      clearTimeout(hideTimer);
    };
  }, [isNearby, showComponent]);

  // Determinar clases de animación según el estado
  const getAnimationClasses = () => {
    switch (animationState) {
      case "entering":
      case "visible":
        return "opacity-100 scale-100";
      case "exiting":
        return "opacity-0 scale-95";
      default:
        return "opacity-0 scale-95";
    }
  };

  return (
    <Html position={position} center>
      {showComponent && (
        <div className="flex items-center justify-center w-screen h-screen">
          <div
            className={`text-white gap-2 select-none flex flex-col p-4 w-96 gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow transform transition-all duration-500 ease-in-out ${getAnimationClasses()}`}
          >
            <p className="text-xl font-bold">{card.title}</p>
            <p>{card.description}</p>
          </div>
        </div>
      )}
    </Html>
  );
}

// Validación simple con PropTypes
TextComponent.propTypes = {
  position: PropTypes.array,
  cardName: PropTypes.oneOf(Object.values(CARD_NAMES)).isRequired,
  isNearby: PropTypes.bool,
};
