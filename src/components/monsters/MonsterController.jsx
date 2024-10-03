import {useEffect, useRef, useState} from 'react';
import {CapsuleCollider, RigidBody} from "@react-three/rapier";
import {Billboard, Text} from "@react-three/drei";
import {Demon} from "./Demon.jsx";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {useGameStore} from "../../store.js";


export const MonsterController = ({
                                      children,
                                      position,
                                      monsterName,
                                      targetDir,
                                      health,
                                      setTime,
                                      monsterId,
                                      ...props
                                  }) => {
    const group = useRef()
    const monster = useRef()
    const rigidBodyMonster = useRef()
    const [direction, setDirection] = useState(targetDir); // Направление движения
    const [targetDirection, setTargetDirection] = useState({x: 1, y: 0, z: 0}); // Целевое направление движения
    const speed = 0.05; // Скорость движения
    const {updateMonsterHealth} = useGameStore((state) => state.updateMonsterHealth);


    // Ограничение области передвижения
    const bounds = {
        minX: -5,
        maxX: 5,
        minZ: -5,
        maxZ: 5,
    };

    useFrame(() => {
        if (rigidBodyMonster.current) {
            const position = rigidBodyMonster.current.translation();
            let newPosition = new THREE.Vector3(
                position.x + direction.x * speed,
                position.y + direction.y * speed,
                position.z + direction.z * speed
            );
            // let newPosition = {
            //     x: position.x + direction.x * speed,
            //     y: position.y + direction.y * speed,
            //     z: position.z + direction.z * speed,
            // };

            // Проверка на границы области
            // if (newPosition.x < bounds.minX || newPosition.x > bounds.maxX) {
            //     setTargetDirection({
            //         x: -targetDirection.x,
            //         y: targetDirection.y,
            //         z: targetDirection.z,
            //     });
            // }
            // if (newPosition.z < bounds.minZ || newPosition.z > bounds.maxZ) {
            //     setTargetDirection({
            //         x: targetDirection.x,
            //         y: targetDirection.y,
            //         z: -targetDirection.z,
            //     });
            // }

            // Проверка на границы области
            if (newPosition.x < bounds.minX || newPosition.x > bounds.maxX) {
                direction.x = -direction.x; // Изменяем направление движения по оси X
            }
            if (newPosition.z < bounds.minZ || newPosition.z > bounds.maxZ) {
                direction.z = -direction.z; // Изменяем направление движения по оси Z
            }

            // Обновляем позицию монстра
            rigidBodyMonster.current.setTranslation(newPosition);


            // Поворачиваем монстра в направлении движения
            const directionVector = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), directionVector);
            rigidBodyMonster.current.setRotation(quaternion);
        }
    });

    // Логика для изменения направления движения
    useEffect(() => {
        const interval = setInterval(() => {
            const newDirection = new THREE.Vector3(
                Math.random() * 2 - 1,
                0,
                Math.random() * 2 - 1
            ).normalize();

            // Плавно изменяем направление движения
            const lerpFactor = 0.05; // Фактор интерполяции
            setDirection((prevDirection) => {
                return new THREE.Vector3().copy(prevDirection).lerp(newDirection, lerpFactor);
            });
            // setDirection({
            //     x: Math.random() * 2 - 1,
            //     y: 0,
            //     z: Math.random() * 2 - 1,
            // });
        }, setTime); // Изменяем направление каждые 2 секунды

        return () => clearInterval(interval);
    }, [setTime]);


    return (
        <group ref={group} {...props} position={position}>
            <RigidBody
                ref={rigidBodyMonster}
                type="dynamic"
                colliders={false}
                scale={[0.5, 0.5, 0.5]}
                enabledRotations={[false, false, false]}
                onIntersectionEnter={({other}) => {
                    if (other.rigidBody.userData?.type === "bullet" && health > 0) {
                        // делаем расчет из ходя из того сколько получили урона
                        const newHealth = health - other.rigidBody.userData?.damage
                        if (newHealth <= 0) {
                            updateMonsterHealth(monsterId, 0);
                        } else {
                            updateMonsterHealth(monsterId, newHealth);
                        }
                        console.log(health, newHealth, monsterId);
                    }
                }}
            >
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]}/>
                <PlayerInfo monsterName={monsterName} health={health}/>
                <group ref={monster}>
                    {children}
                </group>
            </RigidBody>
        </group>
    );
};

// полоска ХП
const PlayerInfo = ({monsterName, health}) => {

    // const health = useGameStore((state) => {state.monsters.});
    const name = monsterName;
    return (
        <Billboard position-y={3}>
            <Text position-y={0.36} fontSize={0.4}>
                {name}
                <meshBasicMaterial color={'hotpink'}/>
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