import {useEffect, useRef, useState} from 'react';
import {RigidBody, vec3} from "@react-three/rapier";
import {MeshBasicMaterial} from "three";
import {WEAPON_OFFSET} from "../character/CharacterController.jsx";
import * as THREE from "three";

const BULLET_SPEED = 18;

const bulletMaterial = new MeshBasicMaterial({
    // color: "hotpink",
    // color: "lime",
    // color: "lightskyblue",
    // color: "aquamarine",
    // color: "greenyellow",
    // color: "mediumpurple",
    color: "orangered",
    // color: "orange",
    // color: "fuchsia",
    // color: "aqua",
    // color: "tomato",
    // color: "chocolate",
    // color: "slateblue",
    // color: "dodgerblue",
    // color: "gold",
    // color: "goldenrod",
    // color: "silver",
    // color: "crimson",

    toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

export const Bullet = ({position, rotation, onHit}) => {
    const rigidBody = useRef();
    const [isVisible, setIsVisible] = useState(true);
    const [gravity, setGravity] = useState(0);
    const [touch, setTouch] = useState(0);


    useEffect(() => {
        const direction = new THREE.Vector3(0, 0, 1);
        direction.applyQuaternion(new THREE.Quaternion().setFromEuler(rotation));

        const velocity = direction.multiplyScalar(BULLET_SPEED);

        rigidBody.current?.setLinvel(velocity, true);

    }, [rigidBody, rotation]);

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

        // if (touch === 2) {
        //     setIsVisible(false); // Удаляем компонент из DOM
        //     onHit(vec3(rigidBody.current?.translation()))
        //
        // }
        // rigidBody.current?.setEnabled(false)
        // setGravity(5)
        onHit(vec3(rigidBody.current?.translation()))
        setIsVisible(false); // Удаляем компонент из DOM
    }

    return (
        <group position={[position.x, (position.y + 1.5), position.z]} rotation={rotation}>
            {/*// <group position={[position.x + 0.4, (position.y + 1.2), position.z - 0.8]}>*/}
            <group>
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
                        damage: 25,
                    }}
                >
                    <mesh position-z={0.25} material={bulletMaterial} castShadow>
                        {/*<boxGeometry args={[0.05, 0.05, 0.5]}/>*/}
                        <sphereGeometry args={[0.08, 32, 16]}/>
                    </mesh>
                </RigidBody>
            </group>
        </group>
    );
};

