import {CapsuleCollider, RigidBody} from "@react-three/rapier";
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

export const CharacterController = () => {
        const characterState = useGameStore((state) => state.characterState)
        const setCharacterState = useGameStore((state) => state.setCharacterState)

        const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
        const leftPressed = useKeyboardControls((state) => state[Controls.left]);
        const rightPressed = useKeyboardControls((state) => state[Controls.right]);
        const backPressed = useKeyboardControls((state) => state[Controls.back]);
        const forwardPressed = useKeyboardControls(
            (state) => state[Controls.forward]
        );

        const character = useRef();
        const rigidBody = useRef();
        const isOnFloor = useRef(true);

        useEffect(() => {
            document.addEventListener('mousedown', () => {
                setCharacterState('1H_Ranged_Reload')
            })

            document.addEventListener('mouseup', () => {
                setCharacterState('Idle')
            })
        }, [])

        useFrame((state) => {
            const impulse = {x: 0, y: 0, z: 0};
            if (jumpPressed && isOnFloor.current) {
                impulse.y += JUMP_FORCE;
                isOnFloor.current = false;
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
                // Running_Strafe_Left
                if (characterState !== 'Running_C') {
                    setCharacterState('Running_C');
                }
            } else {
                if (characterState !== 'Idle') {
                    setCharacterState('Idle');
                }
            }

            // if (impulse.y > 0) {
            //     console.log('+++')
            //     if (characterState !== 'Jump_Full_Long') {
            //         console.log('----')
            //         setCharacterState('Jump_Full_Long');
            //     }
            // }

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

        // console.log( characterState);

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
