import {CapsuleCollider, RigidBody, vec3} from "@react-three/rapier";
import {SkeletonMage} from "./SkeletonMage.jsx";
import {useEffect, useRef, useState} from "react";
import {Controls} from "../../App.jsx";
import {Billboard, useKeyboardControls, Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import SkillPanel from "../infoPanel/skillPanel.jsx";
import {useCharacterStore} from "../../stores/characterStore.js";
import {useSkillStore} from "../../stores/skillStore.js";
import {Bubble} from "../bubble/Bubble.jsx";

const JUMP_FORCE = 1;
const MOVEMENT_SPEED = 0.1;
const MAX_VEL = 3;
const RUN_VEL = 1.5
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
    const skillSelected = useSkillStore((state) => state.skillSelected)
    const updateCharacterHealth = useCharacterStore((state) => state.updateCharacterHealth)
    const health = useCharacterStore((state) => state.characters.player.health)

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
    const skill5Pressed = useKeyboardControls((state) => state[Controls.skill5]);
    const skill6Pressed = useKeyboardControls((state) => state[Controls.skill6]);

    const character = useRef();
    const rigidBody = useRef();
    const isOnFloor = useRef(true);
    const characterPosition = useRef(new THREE.Vector3());

    const isLeftMouseDown = useRef(false);
    const isRightMouseDown = useRef(false);
    const [movementSpeed, setMovementSpeed] = useState(0.1);
    const [skillId, setSkillId] = useState()
    const [isSpellcastInProgress, setIsSpellcastInProgress] = useState(false);

    const shootInterval = useRef(null);
    const animationInterval = useRef(null);

    const shoot = () => {
        // Get the character's rotation
        const rotation = character.current?.rotation;

        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(new THREE.Quaternion().setFromEuler(rotation));

        // const bulletPosition = vec3(character.current?.rotation);
        const bulletPosition = vec3(rigidBody.current?.translation());

        // Set the bullet's velocity based on the direction vector
        const bulletVelocity = direction.multiplyScalar(BULLET_SPEED);

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
            updateButtonPush(1, true)
            updateSkillSelected('Fireball')

        }

        if (skill2Pressed) {
            updateButtonPush(2, true)
            updateSkillSelected('Snowball')
        }

        if (skill3Pressed) {
            updateButtonPush(3, true)
            updateSkillSelected('Lightningball')

        }

        if (skill4Pressed) {
            const newHealth = health + 10
            updateButtonPush(4, true)
            updateSkillSelected('Heal')
            if (health <= 100) {
                setIsSpellcastInProgress(true);
                updateCharacterHealth('player', newHealth)
                setCharacterState('Spellcast_Raise');

                animationInterval.current = setTimeout(() => {
                    setCharacterState('Idle')
                    setIsSpellcastInProgress(false)
                    clearTimeout(animationInterval.current);
                }, 2000)
            }
        }

        if (skill5Pressed) {
            updateButtonPush(5, true)
        }

        if (skill6Pressed) {
            updateButtonPush(6, true)
        }

        const handleMouseDown = (event) => {
            if (event.button === 0 && skillSelected !== 'Heal') {
                // Left mouse button was pressed
                shoot()
                isLeftMouseDown.current = true;
                setCharacterState('Spellcast_Shoot');

                // Start shooting interval
                // shootInterval.current = setInterval(shoot, FIRE_RATE);
            }


        };

        const handleMouseUp = (event) => {
            if (event.button === 0 && skillSelected !== 'Heal') {
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

            // if (animationInterval.current) {
            //     clearTimeout(animationInterval.current);
            // }
        };
    }, [
        setCharacterState,
        skill1Pressed,
        skill2Pressed,
        skill3Pressed,
        skill4Pressed,
        updateSkillSelected,
        updateButtonPush,
        skill5Pressed,
        skill6Pressed,
    ]);

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
            if (!isLeftMouseDown.current && isOnFloor.current && !isSpellcastInProgress) {
                setCharacterState('Idle');
            }
        }


        if (changeRotation) {
            const angle = Math.atan2(linvel.x, linvel.z);
            character.current.rotation.y = angle;
        }


        const characterWorldPosition = character.current.getWorldPosition(new THREE.Vector3())
        characterPosition.current.copy(characterWorldPosition);

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
                    <PlayerInfo health={health}/>
                    <group ref={character}>
                        <SkeletonMage/>
                    </group>
                </RigidBody>
            </group>
            <Bubble characterPosition={characterPosition.current}/>
            {/*<FloatingPanel />*/}
        </>
    );
};

// полоска ХП
const PlayerInfo = ({health}) => {

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