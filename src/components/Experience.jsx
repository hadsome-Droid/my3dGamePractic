import {OrbitControls, Sky} from "@react-three/drei";
import {Ground} from "./ground/Ground.jsx";
import {RigidBody} from "@react-three/rapier";
import {CharacterController} from "./character/CharacterController.jsx";
import {useState} from "react";
import {Bullet} from "./bullet/Bullet.jsx";
import {BulletHit} from "./bullet/BulletHit.jsx";
import {MonsterController} from "./monsters/MonsterController.jsx";
import {Demon} from "./monsters/Demon.jsx";
import {Alien} from "./monsters/Alien.jsx";
import {useGameStore} from "../store.js";

export const Experience = () => {
    const [bullets, setBullets] = useState([])
    const [hits, setHits] = useState([])
    const healthMonster1 = useGameStore((state) => state.monsters.Demon1.health);
    const healthMonster2 = useGameStore((state) => state.monsters.Alien1.health);
    const healthMonster3 = useGameStore((state) => state.monsters.Demon2.health);
    const healthMonster4 = useGameStore((state) => state.monsters.Alien2.health);
    const healthMonster5 = useGameStore((state) => state.monsters.Demon3.health);
    const healthMonster6 = useGameStore((state) => state.monsters.Alien3.health);
    // console.log(healthMonster1, healthMonster2);
    const onFire = (bullet) => {
        setBullets((bullets) => [...bullets, bullet])
    }

    const onHit = (bulletId, position) => {
        // убираем пули которые попали кудато
        setBullets((bullets) => bullets.filter((b) => {
            return b.id !== bulletId
        }))
        setHits((hits) => [...hits, {id: bulletId, position}])
    }

    const onHitsEnded = (hitId) => {
        setHits((hits) => hits.filter((h) => h.id !== hitId))
    }
    return (
        <>
            {/*<OrbitControls/>*/}
            <Sky sunPosition={[100, 20, 100]}/>
            <ambientLight intensity={1.5}/>
            <directionalLight
                intensity={1.5}
                position={[5, 5, 5]}
                castShadow
                // color={'#9e69da'}
                color={'white'}
            />
            <group position-y={-1}>
                <CharacterController onFire={onFire}/>
                {
                    bullets.map((bullet, index) => {
                        // console.log(bullet);
                        return <Bullet
                            key={index}
                            {...bullet}
                            onHit={(position) => onHit(index + '-' + +new Date(), position)}
                        />
                    })
                }
                {

                    hits.map((hit) => (
                        <BulletHit key={hit.id} {...hit} onEnded={() => onHitsEnded(hit.id)}/>
                    ))
                }
                <RigidBody type={"fixed"}>
                    <mesh position-z={-15}>
                        <boxGeometry args={[12, 10, 0.5]}/>
                    </mesh>
                    <mesh position-z={15}>
                        <boxGeometry args={[12, 10, 0.5]}/>
                    </mesh>
                    <mesh position-x={15} rotation-y={-Math.PI / 2}>
                        <boxGeometry args={[12, 10, 0.5]}/>
                    </mesh>
                    <mesh position-x={-15} rotation-y={-Math.PI / 2}>
                        <boxGeometry args={[12, 10, 0.5]}/>
                    </mesh>
                </RigidBody>
                <MonsterController position={[3, 0, 0.5]} monsterName={'Demon'} targetDir={{x: -0.3, y: 0, z: -0.3}}
                                   health={healthMonster1} setTime={2000} monsterId={'Demon1'}>
                    <Demon monsterId={'Demon1'}/>
                </MonsterController>
                <MonsterController position={[-3, 0, -0.5]} monsterName={'Alien'} targetDir={{x: -0.5, y: 0, z: 0.5}}
                                   health={healthMonster2} setTime={3000} monsterId={'Alien1'}>
                    <Alien monsterId={'Alien1'}/>
                </MonsterController>
                <MonsterController position={[4.5, 0, 0.5]} monsterName={'Demon'} targetDir={{x: -0.3, y: 0, z: -0.3}}
                                   health={healthMonster3} setTime={2000} monsterId={'Demon2'}>
                    <Demon monsterId={'Demon2'}/>
                </MonsterController>
                <MonsterController position={[-4.5, 0, -0.5]} monsterName={'Alien'} targetDir={{x: -0.5, y: 0, z: 0.5}}
                                   health={healthMonster4} setTime={3000} monsterId={'Alien2'}>
                    <Alien monsterId={'Alien2'}/>
                </MonsterController>
                <MonsterController position={[1.5, 0, 0.5]} monsterName={'Demon'} targetDir={{x: -0.3, y: 0, z: -0.3}}
                                   health={healthMonster5} setTime={2000} monsterId={'Demon3'}>
                    <Demon monsterId={'Demon3'}/>
                </MonsterController>
                <MonsterController position={[-1.5, 0, -0.5]} monsterName={'Alien'} targetDir={{x: -0.5, y: 0, z: 0.5}}
                                   health={healthMonster6} setTime={3000} monsterId={'Alien3'}>
                    <Alien monsterId={'Alien3'}/>
                </MonsterController>
                <Ground/>
            </group>

            {/*<mesh>*/}
            {/*    <boxGeometry/>*/}
            {/*    <meshNormalMaterial/>*/}
            {/*</mesh>*/}

        </>
    );
};