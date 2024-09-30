import {CapsuleCollider, RigidBody, vec3} from "@react-three/rapier";
import {SkeletonMage} from "./SkeletonMage.jsx";
import {useEffect, useRef} from "react";
import {Controls} from "../../App.jsx";
import {useKeyboardControls} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useGameStore} from "../../store.js";
import * as THREE from "three";

const JUMP_FORCE = 1;
const MOVEMENT_SPEED = 0.1;
const MAX_VEL = 3;
const RUN_VEL = 1.5
const BULLET_SPEED = 8

export const CharacterController = ({onFire, ...props}) => {
        const characterState = useGameStore((state) => state.characterState)
        const setCharacterState = useGameStore((state) => state.setCharacterState)

        const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
        const leftPressed = useKeyboardControls((state) => state[Controls.left]);
        const rightPressed = useKeyboardControls((state) => state[Controls.right]);
        const backPressed = useKeyboardControls((state) => state[Controls.back]);
        const shiftPressed = useKeyboardControls((state) => state[Controls.shift]);
        const forwardPressed = useKeyboardControls(
            (state) => state[Controls.forward]
        );

        const character = useRef();
        const rigidBody = useRef();
        const isOnFloor = useRef(true);

        const isLeftMouseDown = useRef(false);
        const isRightMouseDown = useRef(false);

        const shoot = () => {
            // Get the character's rotation
            const rotation = character.current?.rotation;
            // const rotation = rigidBody.current?.translation();

            // Calculate the direction vector
            const direction = new THREE.Vector3(0, 0, -1);
            direction.applyQuaternion(new THREE.Quaternion().setFromEuler(rotation));

            // Spawn the bullet at the character's position
            // const bulletPosition = character.current?.position.clone();

            const bulletPosition = vec3(rigidBody.current?.translation());

            // Set the bullet's velocity based on the direction vector
            const bulletVelocity = direction.multiplyScalar(BULLET_SPEED);


            const newBullet = {
                position: bulletPosition,
                angle: bulletVelocity
            }

            console.log(bulletPosition)

            onFire(newBullet);
            // Spawn the bullet with the calculated position and velocity
            // spawnBullet(bulletPosition, bulletVelocity);
        };
        // shoot()
        useEffect(() => {
            const handleMouseDown = (event) => {
                if (event.button === 0) {
                    // Left mouse button was pressed
                    isLeftMouseDown.current = true;
                    shoot()
                    setCharacterState('Spellcast_Shoot');
                }
                // else if (event.button === 2) {
                //     // Right mouse button was pressed
                //     isRightMouseDown.current = true;
                //     setCharacterState('RightMouseButton_Animation');
                // }

            };

            const handleMouseUp = (event) => {
                if (event.button === 0) {
                    // Left mouse button was released
                    isLeftMouseDown.current = false;
                    setCharacterState('Idle');
                }
                // else if (event.button === 2) {
                //     // Right mouse button was released
                //     isRightMouseDown.current = false;
                //     setCharacterState('Idle');
                // }
            };

            document.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousedown', handleMouseDown);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }, []);

        useFrame((state) => {
            const impulse = {x: 0, y: 0, z: 0};
            if (jumpPressed && isOnFloor.current) {
                impulse.y += JUMP_FORCE;
                isOnFloor.current = false;
                setCharacterState('Jump_Full_Short');
            }

            const linvel = rigidBody.current.linvel();
            let changeRotation = false;
            if (rightPressed && linvel.x < MAX_VEL) {
                impulse.x += MOVEMENT_SPEED;
                changeRotation = true;
            }
            if (leftPressed && linvel.x > -MAX_VEL) {
                impulse.x -= MOVEMENT_SPEED;
                changeRotation = true;
            }
            if (backPressed && linvel.z < MAX_VEL) {
                impulse.z += MOVEMENT_SPEED;
                changeRotation = true;
            }
            if (forwardPressed && linvel.z > -MAX_VEL) {
                impulse.z -= MOVEMENT_SPEED;
                changeRotation = true;
            }

            rigidBody.current?.applyImpulse(impulse, true);

            if (Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
                // Walking_A linvel.x !== 0 || linvel.z !== 0
                if (shiftPressed) {
                    setCharacterState('Running_C');
                } else {
                    if (!isLeftMouseDown.current && !isRightMouseDown.current && isOnFloor.current) {
                        setCharacterState('Walking_A');
                    }

                    // if(characterState !== 'Walking_A'){
                    //     setCharacterState('Walking_A');
                    // }
                }
            } else {
                // setCharacterState('Idle');
                if (!isLeftMouseDown.current && isOnFloor.current) {
                    setCharacterState('Idle');
                }
            }


            if (changeRotation) {
                const angle = Math.atan2(linvel.x, linvel.z);
                character.current.rotation.y = angle;
            }

            //Camera Follow
            const characterWorldPosition = character.current.getWorldPosition(new THREE.Vector3())
            state.camera.position.x = characterWorldPosition.x;
            state.camera.position.z = characterWorldPosition.z + 14;

            const targetCameraPosition = new THREE.Vector3(
                characterWorldPosition.x,
                0,
                characterWorldPosition.z + 14
            );

            const targetLookAt = new THREE.Vector3(characterWorldPosition.x, 0, characterWorldPosition.z);
            state.camera.lookAt(targetLookAt);
        })

        // console.log(shiftPressed);

        return (

            <RigidBody
                ref={rigidBody}
                type="dynamic"
                colliders={false}
                // linearDamping={12}
                scale={[0.5, 0.5, 0.5]}
                onCollisionEnter={() => {
                    isOnFloor.current = true;
                }}
                // lockRotations
                enabledRotations={[false, false, false]}
            >
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]}/>
                <group ref={character}>
                    <SkeletonMage/>
                </group>
            </RigidBody>

        );
    }
;
