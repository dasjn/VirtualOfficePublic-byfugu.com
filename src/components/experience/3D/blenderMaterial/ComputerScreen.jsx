/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useExperience } from "@/hooks/useExperience";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";

const screenStyles = {
  container: {
    overflow: "hidden",
    position: "relative",
    background: "#000",
  },
  iframe: {
    border: "none",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
};

export default function ComputerScreen(props) {
  const { nodes, materials } = useGLTF(
    "/computer_screen/TheOFFice_PcOn_Screen_Shader_v01.glb"
  );

  const { isUserOnPC } = useExperience();
  const [showIframe, setShowIframe] = useState(false);

  // Efecto para controlar la visibilidad del iframe
  useEffect(() => {
    if (isUserOnPC) {
      setShowIframe(true);
    } else {
      // Cuando isUserOnPC pasa a false, mantenemos showIframe true
      // para permitir que se complete la animación de salida
      const timer = setTimeout(() => {
        setShowIframe(false);
      }, 500); // Este tiempo debe ser igual o mayor a la duración de la animación de salida
      return () => clearTimeout(timer);
    }
  }, [isUserOnPC]);

  // Usar el material original
  const screenMaterial = React.useMemo(() => {
    if (isUserOnPC || showIframe) {
      // Clonar el material original para no modificarlo
      const transparentMaterial = materials["Pantalla ON"].clone();
      transparentMaterial.transparent = true;
      transparentMaterial.opacity = 0;
      return transparentMaterial;
    }
    // Si no está en PC, devolver el material original
    return materials["Pantalla ON"];
  }, [isUserOnPC, materials, showIframe]);
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Screen_Panel002.geometry}
        material={screenMaterial}
        position={[-3.524, 1.183, -4.864]}
        rotation={[0, 0, -0.003]}
      >
        {(isUserOnPC || showIframe) && (
          <group rotation={[0, 0, THREE.MathUtils.degToRad(8)]}>
            <Html
              position={[0.001, 0, 0]}
              zIndexRange={[100, 1000]}
              transform
              wrapperClass="computerScreen"
              distanceFactor={0.187}
              rotation={[0, Math.PI / 2, 0]}
            >
              <div style={screenStyles.container}>
                <AnimatePresence mode="wait">
                  {isUserOnPC && (
                    <motion.div
                      key="iframe"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: isUserOnPC ? 0.2 : 0, // Solo retraso en la entrada
                      }}
                      style={{ width: "auto", height: "auto" }}
                    >
                      <iframe
                        src="https://byfugu.com"
                        style={screenStyles.iframe}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Html>
          </group>
        )}
      </mesh>
    </group>
  );
}

useGLTF.preload("/computer_screen/TheOFFice_PcOn_Screen_Shader_v01.glb");
