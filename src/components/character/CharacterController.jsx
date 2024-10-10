import {CapsuleCollider, RigidBody, vec3} from "@react-three/rapier";
import {SkeletonMage} from "./SkeletonMage.jsx";
import {useEffect, useRef, useState} from "react";
import {Controls} from "../../App.jsx";
import {Billboard, useKeyboardControls, Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
// import {useGameStore} from "../../stores/store.js";
import * as THREE from "three";
import SkillPanel from "../infoPanel/skillPanel.jsx";
import {useCharacterStore} from "../../stores/characterStore.js";
import {useSkillStore} from "../../stores/skillStore.js";

const JUMP_FORCE = 1;
const MOVEMENT_SPEED = 0.1;
const MAX_VEL = 3;
const RUN_VEL = 1.5
// const RUN_VEL = 3
const BULLET_SPEED = 80
const FIRE_RATE = 120;
const BULLET_COUNT = 10;
const POSITION_UPDATE_INTERVAL = 50; // Интервал обновления позиции в миллисекундах

export const WEAPON_OFFSET = {
    // x: -0.2,
    // y: 1.4,
    // z: 0.8,
};

export const CharacterController = ({onFire, ...props}) => {
    const group = useRef();
    const characterState = useCharacterStore((state) => state.characterState)
    const setCharacterState = useCharacterStore((state) => state.setCharacterState)
    const progressAnimation = useCharacterStore((state) => state.progressAnimation)
    const setPlayerPosition = useCharacterStore((state) => state.setPlayerPosition);
    const updateButtonPush = useSkillStore((state) => state.updateButtonPush)
    const updateSkillSelected = useSkillStore((state) => state.updateSkillSelected)
    const lastShoot = useRef(0);
    const lastPositionUpdate = useRef(Date.now());

    const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
    const leftPressed = useKeyboardControls((state) => state[Controls.left]);
    const rightPressed = useKeyboardControls((state) => state[Controls.right]);
    const backPressed = useKeyboardControls((state) => state[Controls.back]);
    const shiftPressed = useKeyboardControls((state) => state[Controls.shift]);
    const forwardPressed = useKeyboardControls(
        (state) => state[Controls.forward]
    );
    const skill1Pressed = useKeyboardControls((state) => state[Controls.skill1]);
    const skill2Pressed = useKeyboardControls((state) => state[Controls.skill2]);
    const skill3Pressed = useKeyboardControls((state) => state[Controls.skill3]);
    const skill4Pressed = useKeyboardControls((state) => state[Controls.skill4]);

    const character = useRef();
    const rigidBody = useRef();
    const isOnFloor = useRef(true);

    const isLeftMouseDown = useRef(false);
    const isRightMouseDown = useRef(false);
    const [movementSpeed, setMovementSpeed] = useState(0.1);
    const [skillId, setSkillId] = useState()

    const shootInterval = useRef(null);

    const shoot = () => {
        // Get the character's rotation
        const rotation = character.current?.rotation;

        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(new THREE.Quaternion().setFromEuler(rotation));

        // const bulletPosition = vec3(character.current?.rotation);
        const bulletPosition = vec3(rigidBody.current?.translation());

        // Set the bullet's velocity based on the direction vector
        const bulletVelocity = direction.multiplyScalar(BULLET_SPEED);

        // if (Date.now() - lastShoot.current > FIRE_RATE) {
        //     lastShoot.current = Date.now();
        //     const newBullet = {
        //         // id: Date.now(),
        //         position: bulletPosition,
        //         angle: bulletVelocity,
        //         rotation: rotation,
        //     }
        //     onFire(newBullet);
        //
        // }

        const newBullet = {
            // id: Date.now(),
            position: bulletPosition,
            angle: bulletVelocity,
            rotation: rotation,
        }
        onFire(newBullet);

    };


    useEffect(() => {

        if (skill1Pressed) {
            console.log('++')
            updateButtonPush(1, true)
            updateSkillSelected('Fireball')

        }

        if (skill2Pressed) {
            updateButtonPush(2, true)
            updateSkillSelected('Snowball')
        }

        if (skill3Pressed) {
            console.log('skill3')
            updateButtonPush(3, true)
            updateSkillSelected('Waterball')

        }

        if (skill4Pressed) {
            console.log('skill4')
            updateButtonPush(4, true)
        }

        const handleMouseDown = (event) => {
            if (event.button === 0) {
                // Left mouse button was pressed
                shoot()
                isLeftMouseDown.current = true;
                setCharacterState('Spellcast_Shoot');

                // Start shooting interval
                shootInterval.current = setInterval(shoot, FIRE_RATE);
            }


        };

        const handleMouseUp = (event) => {
            if (event.button === 0) {
                // Left mouse button was released
                isLeftMouseDown.current = false;
                setCharacterState('Idle');

                // Clear shooting interval
                clearInterval(shootInterval.current);
                shootInterval.current = null;
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            if (shootInterval.current) {
                clearInterval(shootInterval.current);
            }
        };
    }, [setCharacterState, skill1Pressed, skill2Pressed, skill3Pressed, skill4Pressed]);
    // console.log(skill1Pressed)
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
            impulse.x += movementSpeed;
            changeRotation = true;
        }
        if (leftPressed && linvel.x > -MAX_VEL) {
            impulse.x -= movementSpeed;
            changeRotation = true;
        }
        if (backPressed && linvel.z < MAX_VEL) {
            impulse.z += movementSpeed;
            changeRotation = true;
        }
        if (forwardPressed && linvel.z > -MAX_VEL) {
            impulse.z -= movementSpeed;
            changeRotation = true;
        }

        rigidBody.current?.applyImpulse(impulse, true);


        if (Math.abs(linvel.x) > RUN_VEL || Math.abs(linvel.z) > RUN_VEL) {
            if (shiftPressed) {
                setMovementSpeed(0.5)
                setCharacterState('Running_C');
            } else {
                if (!isLeftMouseDown.current && !isRightMouseDown.current && isOnFloor.current) {
                    setMovementSpeed(0.1)
                    setCharacterState('Walking_A');
                }
            }
        } else {
            // setCharacterState('Idle');
            if (!isLeftMouseDown.current && isOnFloor.current) {
                setCharacterState('Idle');
            }
        }


        // if (changeRotation) {
        //     const angle = Math.atan2(velocity.x, velocity.z);
        //     character.current.rotation.y = angle;
        // }
        if (changeRotation) {
            const angle = Math.atan2(linvel.x, linvel.z);
            character.current.rotation.y = angle;
        }

        //Camera Follow

        // const characterWorldPosition = character.current.getWorldPosition(new THREE.Vector3());
        // const characterRotation = character.current.rotation;
        //
        // // Calculate camera position behind the character
        // const cameraOffset = new THREE.Vector3(4, 2, 8);
        // const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(characterRotation);
        // cameraOffset.applyMatrix4(rotationMatrix);
        // state.camera.position.copy(characterWorldPosition).add(cameraOffset);
        //
        // // Make the camera look at the character
        // state.camera.lookAt(cameraOffset);
        // console.log(cameraOffset)

        const characterWorldPosition = character.current.getWorldPosition(new THREE.Vector3())

        state.camera.position.x = characterWorldPosition.x;
        state.camera.position.z = characterWorldPosition.z + 10;
        state.camera.position.y = characterWorldPosition.y + 4;


        const targetLookAt = new THREE.Vector3(characterWorldPosition.x, 0, characterWorldPosition.z);
        state.camera.lookAt(targetLookAt);

        // Обновляем позицию персонажа в хранилище Zustand
        const now = Date.now();
        if (now - lastPositionUpdate.current >= POSITION_UPDATE_INTERVAL) {
            setPlayerPosition(characterWorldPosition);
            lastPositionUpdate.current = now;
        }
    })


    return (
        <>
            <group ref={group} {...props}>
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
                    <SkillPanel skillId={skillId}/>
                    <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]}/>
                    <PlayerInfo/>
                    <group ref={character}>
                        <SkeletonMage/>
                    </group>
                </RigidBody>
            </group>
            {/*<FloatingPanel />*/}
        </>
    );
};

// полоска ХП
const PlayerInfo = ({state}) => {
    const health = 10;
    const name = 'Roki';
    return (
        <Billboard position-y={3}>
            <Text position-y={0.36} fontSize={0.4}>
                {name}
                <meshBasicMaterial color={'green'}/>
            </Text>
            <mesh position-z={-0.1}>
                <planeGeometry args={[1, 0.2]}/>
                <meshBasicMaterial color="black" transparent opacity={0.5}/>
            </mesh>
            <mesh scale-x={health / 100} position-x={-0.5 * (1 - health / 100)}>
                <planeGeometry args={[1, 0.2]}/>
                <meshBasicMaterial color="red"/>
            </mesh>
        </Billboard>
    );
};