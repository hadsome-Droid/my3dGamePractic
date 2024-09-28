import {CapsuleCollider, RigidBody} from "@react-three/rapier";
import {SkeletonMage} from "./SkeletonMage.jsx";
import {useRef} from "react";
import {Controls} from "../../App.jsx";
import {useKeyboardControls} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";

const JUMP_FORCE = 0.5;
const MOVEMENT_SPEED = 0.1;
const MAX_VEL = 3;

export const CharacterController = () => {
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

    useFrame(() => {
        const impulse = {x: 0, y: 0, z: 0};
        if (jumpPressed && isOnFloor.current) {
            impulse.y += JUMP_FORCE;
            isOnFloor.current = false;
            console.log('+', impulse.y)
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
        if (changeRotation) {
            const angle = Math.atan2(linvel.x, linvel.z);
            character.current.rotation.y = angle;
            console.log(impulse);
        }
    })
    // console.log(rigidBody.current);
    return (
        <group>
            <RigidBody
                ref={rigidBody}
                type="dynamic"
                colliders={false}
                // linearDamping={12}
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
        </group>
    );
};
