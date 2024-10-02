import {useEffect, useRef, useState} from 'react';
import {RigidBody, vec3} from "@react-three/rapier";
import {MeshBasicMaterial} from "three";
import {WEAPON_OFFSET} from "../character/CharacterController.jsx";

const BULLET_SPEED = 18;

const bulletMaterial = new MeshBasicMaterial({
    // color: "hotpink",
    color: "green",
    toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

export const Bullet = ({angle, position, rotation, onHit}) => {
    const rigidBody = useRef();
    const [isVisible, setIsVisible] = useState(true);
    const [gravity, setGravity] = useState(0);
    const [touch, setTouch] = useState(0);


    useEffect(() => {
        const velocity = {
            x: Math.sin(rotation.y) * BULLET_SPEED,
            y: 0,
            z: Math.cos(rotation.y) * BULLET_SPEED,
        };
        rigidBody.current?.setLinvel(velocity, true);

    }, [rigidBody, rotation]);
    // console.log('rott', rotation);
    if (!isVisible) {
        return null; // Если компонент не видим, возвращаем null, чтобы удалить его из DOM
    }

    const handleIntersectionEnter = (e) => {
        const currentVelocity = rigidBody.current?.linvel();

        // Изменяем скорость, чтобы объект отскочил
        const newVelocity = {
            x: -currentVelocity.x,
            y: -currentVelocity.y,
            z: -currentVelocity.z,
        };

        rigidBody.current?.setLinvel(newVelocity, true);
        setTouch(touch + 1)

        if (touch === 2) {
            // rigidBody.current?.setEnabled(false)
            setIsVisible(false); // Удаляем компонент из DOM
            onHit(vec3(rigidBody.current?.translation()))

        }
        // rigidBody.current?.setEnabled(false)
        // setGravity(5)
        // onHit(vec3(rigidBody.current?.translation()))
        // setIsVisible(false); // Удаляем компонент из DOM
    }
    return (
        // <group position={[position.x, (position.y + 3), position.z]} rotation-y={rotation.y}>
        <group position={[position.x, (position.y + 2.5), position.z]}>
            <group
                // position-x={WEAPON_OFFSET.x}
                // position-y={WEAPON_OFFSET.y}
                // position-z={WEAPON_OFFSET.z}
            >
                <RigidBody
                    ref={rigidBody}
                    gravityScale={gravity}
                    sensor onIntersectionEnter={(e) => {
                    if (e.other.rigidBody.userData?.type !== 'bullet') {
                        handleIntersectionEnter()
                    }
                    // console.log(e)
                }}
                    userData={{
                        type: "bullet",
                        damage: 10,
                    }}
                >
                    <mesh position-z={0.25} material={bulletMaterial} castShadow>
                        {/*<boxGeometry args={[0.05, 0.05, 0.5]}/>*/}
                        <sphereGeometry args={[0.05, 32, 16]}/>
                    </mesh>
                </RigidBody>
            </group>
        </group>
    );
};
