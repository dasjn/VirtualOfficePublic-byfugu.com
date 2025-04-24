/* eslint-disable react/no-unknown-property */
import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useKTX2Asset } from "@/hooks/useKTX2Asset";
import * as THREE from "three";
import { getAssetPath } from "@/data/assets";

export function MueblesYSignsGRP(props) {
  const { nodes } = useGLTF(getAssetPath("MUEBLES_SIGNS_GRP"));
  const texture = useKTX2Asset("MUEBLES_SIGNS_GRP_KTX2");
  const textureMaterial = useMemo(() => {
    // Asegúrate de manejar el caso cuando la textura aún no está cargada
    if (!texture) {
      // Fallback material
      return new THREE.MeshBasicMaterial({ color: 0xcccccc });
    }

    return new THREE.MeshBasicMaterial({ map: texture });
  }, [texture]);

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Silla_03.geometry}
        material={textureMaterial}
        position={[-2.802, 0.5535, -8.381]}
        rotation={[0, -1.566, 1.571]}
      />
    </group>
  );
}
