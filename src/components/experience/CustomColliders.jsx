import { CuboidCollider, RigidBody } from "@react-three/rapier";

const colliders = {
  // Mesa setup
  mesaSetup: {
    position: [-3.518, 0.684, -6.749],
    rotation: [0, 0, 0],
    size: [0.438, 0.036, 3.258], // Valores exactos de colliderSize
  },
  // Sillas setup
  silla01: {
    position: [-2.449, 0.554, -5.399],
    rotation: [0, -0.682, 1.571],
    size: [0.447, 0.362, 0.447],
  },
  silla02: {
    position: [-2.502, 0.554, -6.726],
    rotation: [0, -1.566, 1.571],
    size: [0.356, 0.362, 0.37],
  },
  silla03: {
    position: [-2.502, 0.554, -8.581],
    rotation: [0, -1.566, 1.571],
    size: [0.356, 0.362, 0.37],
  },
  // Mesa oficina (usando los valores proporcionados)
  mesaOffice: {
    position: [0.006, 0.452, -0.157],
    rotation: [0, 0, 0],
    size: [0.5, 0.451, 0.5], // Valores de colliderSize
  },
  // Butacas
  butaca1: {
    position: [0.944, 0.41, -0.63],
    rotation: [0, 0, 0],
    size: [0.231, 0.382, 0.231],
  },
  butaca2: {
    position: [-1.02, 0.41, -0.304],
    rotation: [0, 0, 0],
    size: [0.231, 0.382, 0.231],
  },
  butaca3: {
    position: [-0.288, 0.41, 0.84],
    rotation: [0, 0, 0],
    size: [0.231, 0.382, 0.231],
  },

  // Lengua Ventana
  lenguaVentana: {
    position: [3.1, 1.5, -2.1],
    rotation: [-Math.PI / 16, 0, 0],
    size: [0.45, 1.5, 0.1],
  },
};

export default function CustomColliders() {
  return (
    <>
      {/* Mesa setup */}
      <RigidBody
        type="fixed"
        position={colliders.mesaSetup.position}
        rotation={colliders.mesaSetup.rotation}
      >
        <CuboidCollider args={colliders.mesaSetup.size} />
      </RigidBody>

      {/* Sillas setup */}
      <RigidBody
        type="fixed"
        position={colliders.silla01.position}
        rotation={colliders.silla01.rotation}
      >
        <CuboidCollider args={colliders.silla01.size} />
      </RigidBody>
      <RigidBody
        type="fixed"
        position={colliders.silla02.position}
        rotation={colliders.silla02.rotation}
      >
        <CuboidCollider args={colliders.silla02.size} />
      </RigidBody>
      <RigidBody
        type="fixed"
        position={colliders.silla03.position}
        rotation={colliders.silla03.rotation}
      >
        <CuboidCollider args={colliders.silla03.size} />
      </RigidBody>

      {/* Mesa oficina */}
      <RigidBody
        type="fixed"
        position={colliders.mesaOffice.position}
        rotation={colliders.mesaOffice.rotation}
      >
        <CuboidCollider args={colliders.mesaOffice.size} />
      </RigidBody>

      {/* Butacas */}
      <RigidBody
        type="fixed"
        position={colliders.butaca1.position}
        rotation={colliders.butaca1.rotation}
      >
        <CuboidCollider args={colliders.butaca1.size} />
      </RigidBody>
      <RigidBody
        type="fixed"
        position={colliders.butaca2.position}
        rotation={colliders.butaca2.rotation}
      >
        <CuboidCollider args={colliders.butaca2.size} />
      </RigidBody>
      <RigidBody
        type="fixed"
        position={colliders.butaca3.position}
        rotation={colliders.butaca3.rotation}
      >
        <CuboidCollider args={colliders.butaca3.size} />
      </RigidBody>

      {/* Lengua Ventana */}
      <RigidBody
        type="fixed"
        position={colliders.lenguaVentana.position}
        rotation={colliders.lenguaVentana.rotation}
      >
        <CuboidCollider args={colliders.lenguaVentana.size} />
      </RigidBody>
    </>
  );
}
