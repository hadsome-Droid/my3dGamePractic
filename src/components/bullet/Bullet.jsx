import {useEffect, useRef, useState} from 'react';
import {RigidBody, vec3} from "@react-three/rapier";
import {MeshBasicMaterial} from "three";
import {WEAPON_OFFSET} from "../character/CharacterController.jsx";
import * as THREE from "three";
import {useSkillStore} from "../../stores/skillStore.js";

const BULLET_SPEED = 13;


// const bulletMaterial = () => {
//     const skillSelected = useSkillStore((state) => state.skillSelected)
//
//     console.log(skillSelected);
//     const materialBullet = new MeshBasicMaterial({
//         // color: "hotpink",
//         // color: "lime",
//         // color: "lightskyblue",
//         // color: "aquamarine",
//         // color: "greenyellow",
//         // color: "mediumpurple",
//         color: skillSelected === 'Fireball' ? "orangered" : 'lightskyblue',
//         // color: "orange",
//         // color: "fuchsia",
//         // color: "aqua",
//         // color: "tomato",
//         // color: "chocolate",
//         // color: "slateblue",
//         // color: "dodgerblue",
//         // color: "gold",
//         // color: "goldenrod",
//         // color: "silver",
//         // color: "crimson",
//
//         toneMapped: false,
//     });
//     materialBullet.color.multiplyScalar(42);
//     return materialBullet
// }


export const Bullet = ({position, rotation, onHit}) => {
    const rigidBody = useRef();
    const [isVisible, setIsVisible] = useState(true);
    const [gravity, setGravity] = useState(0);
    const [touch, setTouch] = useState(0);
    const skillSelected = useSkillStore((state) => state.skillSelected)


    const materialBullet = new MeshBasicMaterial({
        // color: "hotpink",
        // color: "lime",
        // color: "lightskyblue",
        // color: "aquamarine",
        // color: "greenyellow",
        // color: "mediumpurple",
        color: skillSelected === 'Fireball' ? "orangered" : 'lightskyblue',
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
    materialBullet.color.multiplyScalar(42);

    console.log(skillSelected);
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

    const ballGeometry = () => {
        if (skillSelected === 'Fireball') {
            return <sphereGeometry args={[0.08, 32, 16]}/>
        }

        if (skillSelected === 'Snowball') {
            return <coneGeometry args={[0.03, 0.6, 7]}/>
        }
    }

    // Применяем смещение к позиции пули
    // const bulletPosition = new THREE.Vector3(position.x, position.y + 1.5, position.z)
    //     .add(new THREE.Vector3(WEAPON_OFFSET.x, 0, WEAPON_OFFSET.z));
    // console.log(bulletPosition)

    return (
        <group position={[position.x, (position.y + 1.5), position.z]} rotation={rotation}>
            <group>
                <RigidBody
                    ref={rigidBody}
                    gravityScale={gravity}
                    sensor onIntersectionEnter={(e) => {
                    if (e.other.rigidBody.userData?.type !== 'bullet') {
                        handleIntersectionEnter()
                    }
                }}
                    userData={{
                        type: "bullet",
                        damage: 25,
                    }}
                >
                    <mesh position-z={0.45} material={materialBullet} castShadow
                          rotation-x={Math.PI / 2}>
                        {ballGeometry()}
                        {/*<boxGeometry args={[0.05, 0.05, 0.5]}/>*/}
                        {/*<sphereGeometry args={[0.08, 32, 16]}/>*/}
                        {/*<torusGeometry args={[0.1, 0.02, 12, 48]}/>*/}
                        {/*<coneGeometry args={[0.05, 0.3, 7]}/>*/}
                    </mesh>
                </RigidBody>
            </group>
        </group>
    );
};

