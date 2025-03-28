/* eslint-disable react/no-unknown-property */
import { useVideoTexture } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

export function PanelTV(props) {
  const [videoUrl] = useState("/videos/video_reel_fugu_1080p.mp4");
  const meshRef = useRef();

  // Crear una textura de video
  const videoTexture = useVideoTexture(videoUrl, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "anonymous",
  });

  // Configurar la textura y el shader

  // Shaders
  const vertexShader = `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D videoTexture;
    varying vec2 vUv;
    
    void main() {
      vec4 videoColor = texture2D(videoTexture, vUv);
      
      // Aquí puedes agregar manipulaciones adicionales para asegurar
      // que el video se vea como deseas, independiente del composer
      
      gl_FragColor = videoColor;
    }
  `;

  return (
    <group {...props} dispose={null}>
      <mesh ref={meshRef} position={[0.794, 2.261, -10.03]} renderOrder={999}>
        <planeGeometry args={[16 * 0.224, 9 * 0.224]} />
        <shaderMaterial
          uniforms={{
            videoTexture: { value: videoTexture },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
