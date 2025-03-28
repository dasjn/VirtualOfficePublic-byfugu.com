import { CuboidCollider, RigidBody } from "@react-three/rapier";

export default function WallColliders() {
  return (
    <>
      {/* Entrance wall */}
      <RigidBody type="fixed">
        <CuboidCollider
          position={[0, 4, 4.6]}
          rotation={[0, 0, 0]}
          args={[5, 5, 0.05]}
        />
      </RigidBody>
      {/* Back wall */}
      <RigidBody type="fixed">
        <CuboidCollider
          position={[0, 4, -10]}
          rotation={[0, 0, 0]}
          args={[5, 5, 0.05]}
        />
      </RigidBody>
      {/* Side wall */}
      <RigidBody type="fixed">
        <CuboidCollider
          position={[4.2, 4, -3]}
          rotation={[0, Math.PI / 2, 0]}
          args={[8, 5, 0.05]}
        />
      </RigidBody>
      {/* Side wall (window)*/}
      <RigidBody type="fixed">
        <CuboidCollider
          position={[-3.8, 4, -3]}
          rotation={[0, Math.PI / 2, 0]}
          args={[8, 5, 0.05]}
        />
      </RigidBody>
    </>
  );
}
