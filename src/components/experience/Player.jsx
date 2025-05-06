import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useExperience } from "@/hooks/useExperience";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { initialPosition } from "@/data/constants";

// Constants
const SPEED = 200;
const MIN_HEIGHT = initialPosition[1];
const HEIGHT_BUFFER = 0.1;

// Critical safety limits
const MAX_DELTA_TIME = 1 / 30; // Maximum allowed deltaTime (prevents huge jumps)
const MAX_VELOCITY = 200; // Maximum allowed velocity magnitude

const Player = () => {
  const [, getKeys] = useKeyboardControls();
  const {
    rigidBodyRef,
    isPointerLocked,
    cameraMovement,
    isUserOnPC,
    canMovePlayer,
    animationCooldown,
  } = useExperience();
  const { camera } = useThree();

  // Track previous camera quaternion to avoid unnecessary calculations
  const prevCameraQuaternionRef = useRef(new THREE.Quaternion());

  // Track document visibility
  const visibilityRef = useRef({
    wasHidden: false,
    lastActiveTime: performance.now(),
  });

  // Movement state cache to reduce computation and object creation
  const movementStateRef = useRef({
    isMoving: false,
    lastCalculated: 0,
    movementVector: { x: 0, y: 0, z: 0 },
  });

  // Optimized vectors as single allocation for the component's lifecycle
  const vectors = useMemo(
    () => ({
      velocity: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      sideways: new THREE.Vector3(),
      combined: new THREE.Vector3(),
      position: new THREE.Vector3(),
      cameraQuat: new THREE.Quaternion(),
    }),
    []
  );

  // Add visibility change detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityRef.current.wasHidden = true;
      } else {
        // When returning from hidden state, prepare for next frame
        if (visibilityRef.current.wasHidden) {
          visibilityRef.current.lastActiveTime = performance.now();
          visibilityRef.current.wasHidden = false;

          // Force zero velocity when returning to prevent jumps
          if (rigidBodyRef.current) {
            const currentVel = rigidBodyRef.current.linvel();
            rigidBodyRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 });
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [rigidBodyRef]);

  // Optimized movement calculation with safety limits
  const calculateMovement = useCallback(
    (keys, deltaTime) => {
      // Safety: Clamp deltaTime to prevent huge movements after tab becomes active again
      const safeDeltaTime = Math.min(deltaTime, MAX_DELTA_TIME);

      const {
        forwardKeyPressed,
        rightKeyPressed,
        backwardKeyPressed,
        leftKeyPressed,
      } = keys;

      // Quick exit if no movement keys are pressed
      if (
        !forwardKeyPressed &&
        !rightKeyPressed &&
        !backwardKeyPressed &&
        !leftKeyPressed
      ) {
        if (movementStateRef.current.isMoving) {
          movementStateRef.current.isMoving = false;
          movementStateRef.current.movementVector = { x: 0, y: 0, z: 0 };
        }
        return null;
      }

      movementStateRef.current.isMoving = true;

      // Calculate movement direction
      vectors.forward.set(0, 0, -forwardKeyPressed + backwardKeyPressed);
      vectors.sideways.set(rightKeyPressed - leftKeyPressed, 0, 0);
      vectors.combined.copy(vectors.forward).add(vectors.sideways);

      // Only normalize and apply camera rotation if we have movement
      if (vectors.combined.lengthSq() > 0.001) {
        vectors.combined.normalize();

        // Apply quaternion and speed (adjusted for frame rate)
        // Use a fixed deltaTime value when returning from background
        const timeSinceActive =
          performance.now() - visibilityRef.current.lastActiveTime;
        const useFixedDelta = timeSinceActive < 100; // Within 100ms of becoming active

        // Apply speed with either safe delta or fixed value
        const frameAdjustedSpeed =
          SPEED * (useFixedDelta ? 1 / 60 : safeDeltaTime);
        vectors.combined.multiplyScalar(frameAdjustedSpeed);

        // Check if camera quaternion has changed significantly
        camera.getWorldQuaternion(vectors.cameraQuat);
        if (!vectors.cameraQuat.equals(prevCameraQuaternionRef.current)) {
          prevCameraQuaternionRef.current.copy(vectors.cameraQuat);
        }

        // Apply camera rotation
        vectors.combined.applyQuaternion(prevCameraQuaternionRef.current);

        // Safety: Clamp velocity magnitude to prevent extremely high speeds
        const speed = vectors.combined.length();
        if (speed > MAX_VELOCITY) {
          vectors.combined.multiplyScalar(MAX_VELOCITY / speed);
        }
      }

      // Return the movement vector
      return {
        x: vectors.combined.x,
        y: 0,
        z: vectors.combined.z,
      };
    },
    [camera, vectors]
  );

  // Optimized frame update with safety checks
  useFrame((state, deltaTime) => {
    const body = rigidBodyRef.current;
    if (!body) return;

    // Update activity tracking
    visibilityRef.current.lastActiveTime = performance.now();

    // Early exit for states that block movement
    const movementBlocked =
      cameraMovement.isMoving || animationCooldown || isUserOnPC;
    if (movementBlocked) return;

    const currentVel = body.linvel();

    // Handle movement only when allowed
    if (isPointerLocked && canMovePlayer) {
      // Calculate movement
      const keys = getKeys();
      const movement = calculateMovement(keys, deltaTime);

      // Apply movement if we have it
      if (movement) {
        body.wakeUp();

        // Safety check: verify movement isn't too extreme
        const moveMagnitude = Math.sqrt(
          movement.x * movement.x + movement.z * movement.z
        );

        if (moveMagnitude > MAX_VELOCITY) {
          const scaleFactor = MAX_VELOCITY / moveMagnitude;
          movement.x *= scaleFactor;
          movement.z *= scaleFactor;
        }

        body.setLinvel({
          x: movement.x,
          y: currentVel.y,
          z: movement.z,
        });
      } else if (currentVel.x !== 0 || currentVel.z !== 0) {
        // Only update velocity if it's not already zero (reduces physics updates)
        body.setLinvel({ x: 0, y: currentVel.y, z: 0 });
      }
    } else if (currentVel.x !== 0 || currentVel.z !== 0) {
      // When not in control, ensure velocity is zeroed (but only if needed)
      body.setLinvel({ x: 0, y: currentVel.y, z: 0 });
    }

    // Update camera position when not in animation
    if (!cameraMovement.isMoving && !animationCooldown) {
      const translation = body.translation();

      // Check if player is out of bounds or moving too fast (recovery mechanism)
      const playerSpeed = Math.sqrt(
        currentVel.x * currentVel.x + currentVel.z * currentVel.z
      );

      if (playerSpeed > MAX_VELOCITY * 1.5) {
        // Emergency velocity correction - player is moving too fast
        body.setLinvel({
          x: 0,
          y: currentVel.y,
          z: 0,
        });
      }

      // Apply height constraint (floor level)
      if (translation.y < MIN_HEIGHT + HEIGHT_BUFFER) {
        // Batch physics operations - only update Y if needed
        if (Math.abs(translation.y - MIN_HEIGHT) > 0.01) {
          body.setTranslation({
            x: translation.x,
            y: MIN_HEIGHT,
            z: translation.z,
          });
        }
        translation.y = MIN_HEIGHT;
      }

      // Update camera position
      vectors.position.set(translation.x, translation.y, translation.z);
      camera.position.copy(vectors.position);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={80}
      friction={0}
      restitution={0}
      position={initialPosition}
      enabledRotations={[false, false, false]}
      linearDamping={0.95} // Smooth deceleration
    >
      <CapsuleCollider args={[1.5, 0.25]} />
    </RigidBody>
  );
};

export default Player;
