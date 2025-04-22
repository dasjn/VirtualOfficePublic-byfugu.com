// assets/preloadAssets.js
import { assets, AssetTypes } from "@/data/assets";
import { useGLTF, useTexture } from "@react-three/drei";

export const preloadAssets = () => {
  assets.forEach(({ path, type }) => {
    if (type === AssetTypes.GLTF) useGLTF.preload(path);
    if (type === AssetTypes.TEXTURE) useTexture.preload(path);
  });
};
