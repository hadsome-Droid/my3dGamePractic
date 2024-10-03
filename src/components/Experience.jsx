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
    const healthMonster1 = useGameStore((state) => {
        return state.monsters.monster1.health
    });
    const healthMonster2 = useGameStore((state) => {
        return state.monsters.monster2.health
    });
    console.log(healthMonster1, healthMonster2);
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
                <MonsterController position={[3, 0, 0]} monsterName={'Demon'} targetDir={{x: -0.8, y: 0, z: 0.5}}
                                   health={healthMonster1} setTime={2000} monsterId={'monster1'}>
                    <Demon/>
                </MonsterController>
                <MonsterController position={[3, 0, 3]} monsterName={'Alien'} targetDir={{x: 0.5, y: 0, z: 0.5}}
                                   health={healthMonster2} setTime={3000} monsterId={'monster2'}>
                    <Alien/>
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