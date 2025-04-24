// TextComponent.jsx
import { Html } from "@react-three/drei";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  Sobres: "Sobres",
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
  {
    name: "Sobres",
    title: "These invites? Yeah… we forgot to send them out too.",
    description: "Good thing you found your way in anyway.",
  },
];

// Versión optimizada con animaciones de entrada y salida correctas
export default function TextComponent({
  position = [0, 0, 0],
  cardName,
  isNearby = false,
}) {
  // Estado para controlar la visibilidad de la tarjeta
  const [isVisible, setIsVisible] = useState(false);

  // Estado separado para controlar el montaje del componente HTML
  const [shouldRender, setShouldRender] = useState(false);

  // Buscar la tarjeta por nombre
  const card = cardData.find((item) => item.name === cardName) || {
    title: "Título no encontrado",
    description: "Descripción no encontrada",
  };

  // Efecto para manejar la visibilidad basado en isNearby
  useEffect(() => {
    let showTimer, hideTimer;

    if (isNearby) {
      // Siempre renderizamos primero
      setShouldRender(true);

      // Pequeño delay para evitar parpadeos y luego mostramos
      showTimer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
    } else {
      // Cuando ya no estamos cerca, primero ocultamos
      setIsVisible(false);

      // Y luego de que termine la animación, dejamos de renderizar
      hideTimer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Este tiempo debe coincidir con la duración de la animación
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isNearby]);

  // Si no deberíamos renderizar nada, retornamos null
  if (!shouldRender) return null;

  return (
    <Html position={position} center zIndexRange={[100, 1000]} sprite>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={`card-${cardName}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="text-white gap-2 select-none flex flex-col p-4 w-96 gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow z-50"
            style={{ pointerEvents: "none" }}
          >
            <p className="text-xl font-bold">{card.title}</p>
            <p>{card.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
}

// Validación simple con PropTypes
TextComponent.propTypes = {
  position: PropTypes.array,
  cardName: PropTypes.oneOf(Object.values(CARD_NAMES)).isRequired,
  isNearby: PropTypes.bool,
};
