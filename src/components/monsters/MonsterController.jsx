import {useEffect, useRef, useState} from 'react';
import {CapsuleCollider, RigidBody} from "@react-three/rapier";
import {Billboard, Text} from "@react-three/drei";
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
    const updateMonsterHealth = useGameStore((state) => state.updateMonsterHealth);
    const setMonsterAnimation = useGameStore((state) => state.setMonsterAnimation);
    const monsterAnimation = useGameStore((state) => state.monsters[monsterId].monsterAnimation);
    const updateMonsterSpeed = useGameStore((state) => state.updateMonsterSpeed);
    const monsterSpeed = useGameStore((state) => state.monsters[monsterId].speed); //скорость движения

    const randomNumber = parseFloat((Math.random() * (0.1 - 0.04) + 0.04).toFixed(2));
    // console.log(monsterSpeed)


    // Ограничение области передвижения
    const bounds = {
        minX: -5,
        maxX: 5,
        minZ: -5,
        maxZ: 5,
    };

    // Ограничение области передвижения (круг)
    const center = new THREE.Vector3(0, position.y, 0); // Центр круга на той же высоте, что и монстр
    const radius = 10; // Радиус круга

    useFrame(() => {

        if (rigidBodyMonster.current && monsterSpeed > 0.00) {
            // console.log(monsterAnimation)
            // setMonsterAnimation(monsterId, 'CharacterArmature|Walk');
            const position = rigidBodyMonster.current.translation();
            let newPosition = new THREE.Vector3(
                position.x + direction.x * monsterSpeed,
                position.y,
                position.z + direction.z * monsterSpeed
            );

            // Проверка на границы круга
            const distanceToCenter = new THREE.Vector2(newPosition.x, newPosition.z).distanceTo(new THREE.Vector2(center.x, center.z));
            if (distanceToCenter > radius) {
                // Если монстр вышел за пределы круга, отражаем вектор движения
                const directionToCenter = new THREE.Vector2(newPosition.x - center.x, newPosition.z - center.z).normalize();
                const normal = new THREE.Vector3(directionToCenter.x, 0, directionToCenter.y);
                const reflectedDirection = new THREE.Vector3(direction.x, 0, direction.z).reflect(normal);

                // Обновляем направление движения без интерполяции
                setDirection(reflectedDirection);

                // Корректируем позицию монстра, чтобы он не выходил за пределы круга
                const offset = directionToCenter.multiplyScalar(radius - distanceToCenter);
                // console.log(offset);
                // newPosition.x -= offset.x;
                // newPosition.z -= offset.x;
            }

            // Обновляем позицию монстра
            rigidBodyMonster.current.setTranslation(newPosition);

            // Поворачиваем монстра в направлении движения
            const directionVector = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();
            const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), directionVector);
            rigidBodyMonster.current.setRotation(quaternion);
            // // Проверка на границы области
            // if (newPosition.x <= bounds.minX || newPosition.x >= bounds.maxX) {
            //     direction.x = -direction.x; // Изменяем направление движения по оси X
            // }
            // if (newPosition.z < bounds.minZ || newPosition.z > bounds.maxZ) {
            //     direction.z = -direction.z; // Изменяем направление движения по оси Z
            // }
            //
            // // Обновляем позицию монстра
            // rigidBodyMonster.current.setTranslation(newPosition);
            //
            //
            // // Поворачиваем монстра в направлении движения
            // const directionVector = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();
            // const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), directionVector);
            // rigidBodyMonster.current.setRotation(quaternion);
        }
    });
    let interval
    // Логика для изменения направления движения
    useEffect(() => {
        // if (monsterAnimation === 'CharacterArmature|Death') {
        //     updateMonsterSpeed(0.00)
        //     setMonsterAnimation(monsterId, 'CharacterArmature|Idle')
        // }
        // updateMonsterSpeed(monsterId, 0.00)
        if (monsterSpeed >= 0.01) {
            if (monsterSpeed >= 0.07) {
                setMonsterAnimation(monsterId, 'CharacterArmature|Run')
            }

            if (monsterSpeed <= 0.06 && monsterSpeed >= 0.01) {
                console.log('=')
                setMonsterAnimation(monsterId, 'CharacterArmature|Walk')

            }
            interval = setTimeout(() => {
                updateMonsterSpeed(monsterId, randomNumber);

                const newDirection = new THREE.Vector3(
                    Math.random() * 2 - 1,
                    0,
                    Math.random() * 2 - 1
                ).normalize();
                setDirection(newDirection)
                console.log(newDirection)
                // Плавно изменяем направление движения
                // const lerpFactor = 0.05; // Фактор интерполяции
                // setDirection((prevDirection) => {
                //     return new THREE.Vector3().copy(prevDirection).lerp(newDirection, lerpFactor);
                // });
            }, setTime); // Изменяем направление каждые 2 секунды
        }


        return () => clearInterval(interval);
    }, [monsterAnimation, randomNumber, setTime, updateMonsterSpeed, monsterId, monsterSpeed, setMonsterAnimation]);


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
                            rigidBodyMonster.current?.setEnabled(false)
                            clearInterval(interval)
                            updateMonsterSpeed(monsterId, 0.00)
                            setMonsterAnimation(monsterId, 'CharacterArmature|Death')
                            updateMonsterHealth(monsterId, 0);
                        } else {
                            // console.log('====', newHealth, monsterId)
                            setMonsterAnimation(monsterId, 'CharacterArmature|HitReact')
                            updateMonsterHealth(monsterId, newHealth);
                        }
                        // console.log(other.rigidBody.userData?.damage);
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