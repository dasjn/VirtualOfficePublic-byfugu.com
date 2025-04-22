/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useMemo } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { useExperience } from "@/hooks/useExperience";
import * as THREE from "three";

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
  const [isIframeVisible, setIsIframeVisible] = useState(false);

  // Efecto para controlar la visibilidad del iframe
  useEffect(() => {
    if (isUserOnPC) {
      setShowIframe(true);
      // Pequeño retraso antes de iniciar la animación de entrada (similar al delay de Framer Motion)
      const showTimer = setTimeout(() => {
        setIsIframeVisible(true);
      }, 200); // 0.2s de retraso para la entrada

      return () => clearTimeout(showTimer);
    } else {
      // Cuando isUserOnPC pasa a false, primero animamos la salida
      setIsIframeVisible(false);

      // Y después de que termine la animación, ocultamos el iframe
      const hideTimer = setTimeout(() => {
        setShowIframe(false);
      }, 500); // Este tiempo debe ser igual o mayor a la duración de la animación de salida

      return () => clearTimeout(hideTimer);
    }
  }, [isUserOnPC]);

  // Crear un material básico que use la misma textura
  const basicMaterial = useMemo(() => {
    // Crear un nuevo material básico
    const material = new THREE.MeshBasicMaterial({ color: 0xeeeeee });

    // Si el material original tiene un mapa de textura, copiarlo al nuevo material
    if (materials["Pantalla ON"].map) {
      material.map = materials["Pantalla ON"].map;
    }

    return material;
  }, [materials]);

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
    // Crear un material básico que use la misma textura
    return basicMaterial;
  }, [isUserOnPC, materials, showIframe, basicMaterial]);

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
                {(isUserOnPC || showIframe) && (
                  <div
                    key="iframe"
                    className={`transform transition-all duration-500 ease-out ${
                      isIframeVisible
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    }`}
                    style={{ width: "auto", height: "auto" }}
                  >
                    <iframe
                      src="https://byfugu.com"
                      style={screenStyles.iframe}
                    />
                  </div>
                )}
              </div>
            </Html>
          </group>
        )}
      </mesh>
    </group>
  );
}
