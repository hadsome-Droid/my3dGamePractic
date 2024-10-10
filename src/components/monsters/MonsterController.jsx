import {useEffect, useRef, useState} from 'react';
import {CapsuleCollider, RigidBody} from "@react-three/rapier";
import {Billboard, Text} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
// import {useGameStore} from "../../stores/store.js";
import {useMonsterStore} from "../../stores/monsterStore.js";
import {useCharacterStore} from "../../stores/characterStore.js";


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
    const { updateMonsterHealth, setMonsterAnimation, updateMonsterSpeed} = useMonsterStore()
    // const updateMonsterHealth = useGameStore((state) => state.updateMonsterHealth);
    // const setMonsterAnimation = useGameStore((state) => state.setMonsterAnimation);
    const monsterAnimation = useMonsterStore((state) => state.monsters[monsterId].monsterAnimation);
    // const updateMonsterSpeed = useGameStore((state) => state.updateMonsterSpeed);
    const monsterSpeed = useMonsterStore((state) => state.monsters[monsterId].speed); //скорость движения
    const playerPosition = useCharacterStore((state) => state.playerPosition); // Получаем позицию персонажа
    // const playerPosition = false; // Получаем позицию персонажа
    // console.log(playerPosition)
    const randomNumber = parseFloat((Math.random() * (0.1 - 0.04) + 0.04).toFixed(2));

    // Ограничение области передвижения (круг)
    const center = new THREE.Vector3(0, position.y, 0); // Центр круга на той же высоте, что и монстр
    const radius = 20; // Радиус круга

    useFrame(() => {
        if (rigidBodyMonster.current && monsterSpeed > 0.00) {
            const position = rigidBodyMonster.current?.translation();

            // Проверка на правильность значений
            if (playerPosition) {
                console.error('Invalid playerPosition or position:', playerPosition, position);
                // Рассчитываем направление к персонажу
                const directionToPlayer = playerPosition.clone().sub(position).normalize();

                // Обновляем позицию монстра
                let newPosition = new THREE.Vector3(
                    position.x + directionToPlayer.x * monsterSpeed,
                    position.y,
                    position.z + directionToPlayer.z * monsterSpeed
                );

                // Проверка на границы круга
                const distanceToCenter = new THREE.Vector2(newPosition.x, newPosition.z)
                    .distanceTo(new THREE.Vector2(center.x, center.z));

                if (distanceToCenter > radius) {
                    // Если монстр вышел за пределы круга, отражаем вектор движения
                    const directionToCenter = new THREE.Vector2(newPosition.x - center.x, newPosition.z - center.z).normalize();
                    const normal = new THREE.Vector3(directionToCenter.x, 0, directionToCenter.y);
                    const reflectedDirection = new THREE.Vector3(directionToPlayer.x, 0, directionToPlayer.z).reflect(normal);
                    newPosition = new THREE.Vector3(
                        position.x + reflectedDirection.x * monsterSpeed,
                        position.y,
                        position.z + reflectedDirection.z * monsterSpeed
                    );
                    // setDirection(reflectedDirection);
                }

                // Обновляем позицию монстра
                rigidBodyMonster.current.setTranslation(newPosition);

                // Поворачиваем монстра в направлении движения
                const directionVector = new THREE.Vector3(directionToPlayer.x, 0, directionToPlayer.z).normalize();
                const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), directionVector);
                rigidBodyMonster.current.setRotation(quaternion);
                return;
            }

            if (rigidBodyMonster.current && monsterSpeed > 0.00) {
                const position = rigidBodyMonster.current.translation();
                let newPosition = new THREE.Vector3(
                    position.x + direction.x * monsterSpeed,
                    position.y,
                    position.z + direction.z * monsterSpeed
                );

                // Проверка на границы круга
                const distanceToCenter = new THREE.Vector2(newPosition.x, newPosition.z)
                    .distanceTo(new THREE.Vector2(center.x, center.z));
                if (distanceToCenter > radius) {
                    // Если монстр вышел за пределы круга, отражаем вектор движения
                    const directionToCenter = new THREE.Vector2(newPosition.x - center.x, newPosition.z - center.z).normalize();
                    const normal = new THREE.Vector3(directionToCenter.x, 0, directionToCenter.y);
                    const reflectedDirection = new THREE.Vector3(direction.x, 0, direction.z).reflect(normal);

                    // Обновляем направление движения без интерполяции
                    setDirection(reflectedDirection);

                }

                // Обновляем позицию монстра
                rigidBodyMonster.current.setTranslation(newPosition);

                // Поворачиваем монстра в направлении движения
                const directionVector = new THREE.Vector3(direction.x, direction.y, direction.z).normalize();
                const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), directionVector);
                rigidBodyMonster.current.setRotation(quaternion);
            }


        }
    });


    // Логика для изменения направления движения
    useEffect(() => {
        updateMonsterSpeed(monsterId, 0.00)
        if (monsterSpeed >= 0.01) {
            if (monsterSpeed >= 0.07) {
                setMonsterAnimation(monsterId, 'CharacterArmature|Run')
            }

            if (monsterSpeed <= 0.06 && monsterSpeed >= 0.01) {
                setMonsterAnimation(monsterId, 'CharacterArmature|Walk')

            }
        } else {
            if (monsterAnimation !== 'CharacterArmature|Death') {
                setMonsterAnimation(monsterId, 'CharacterArmature|Idle')
            }
        }
    }, [monsterId, monsterSpeed, setMonsterAnimation, monsterAnimation]);


    // Логика для изменения направления при столкновении с другим монстром
    const handleCollision = ({other}) => {

        if (other.rigidBody.userData?.type === "monster") {

        }
    };

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
                            updateMonsterSpeed(monsterId, 0.00)
                            setMonsterAnimation(monsterId, 'CharacterArmature|Death')
                            updateMonsterHealth(monsterId, 0);
                            setTimeout(() => {
                                // вернём возможность монстра получать урон и восстановим здоровье монстру,
                                rigidBodyMonster.current?.setEnabled(true)
                                updateMonsterHealth(monsterId, 100);
                                setMonsterAnimation(monsterId, 'CharacterArmature|Walk')
                                updateMonsterSpeed(monsterId, 0.04)

                            }, 2000)
                        } else {
                            setMonsterAnimation(monsterId, 'CharacterArmature|HitReact')
                            updateMonsterHealth(monsterId, newHealth);
                        }
                    }
                }}
                userData={
                    {type: 'monster'}
                }
                onCollisionEnter={handleCollision} // Обработка столкновения с другим монстром
            >
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]}/>
                <PlayerInfo monsterName={monsterName} health={health}/>
                <group ref={monster}>
                    {children}
                </group>
            </RigidBody>
        </group>
    );
}

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