// TextComponent.jsx
import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

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

  return (
    <Html position={position} center>
      <AnimatePresence>
        {isNearby && (
          <motion.div
            className="flex items-center justify-center w-screen h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.div className="text-white gap-2 select-none flex flex-col p-4 w-96 gradient-keyboard bg-gradient-to-b from-[#39393960] to-[#61616160] rounded-3xl backdrop-blur-xl custom-box-shadow">
              <p className="text-xl font-bold">{card.title}</p>
              <p>{card.description}</p>
            </motion.div>
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
