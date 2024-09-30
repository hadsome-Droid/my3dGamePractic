import {OrbitControls, Sky} from "@react-three/drei";
import {Ground} from "./ground/Ground.jsx";
import {RigidBody} from "@react-three/rapier";
import {CharacterController} from "./character/CharacterController.jsx";
import {useState} from "react";
import {Bullet} from "./bullet/Bullet.jsx";

export const Experience = () => {
    const [bullets, setBullets] = useState([])

    const onFire = (bullet) => {

        // когда нажата кнопка fire просиходит добавления пуль в масив
        setBullets((bullets) => [...bullets, bullet])
    }
    return (
        <>
            <OrbitControls/>
            <Sky sunPosition={[100, 20, 100]}/>
            <ambientLight intensity={1.5}/>
            <directionalLight
                intensity={1.5}
                position={[5, 5, 5]}
                castShadow
                color={'#9e69da'}
            />
            <group position-y={-1}>
                <CharacterController onFire={onFire}/>
                {
                    bullets.map((bullet, index) => {
                        // console.log(bullet);
                       return <Bullet key={index} {...bullet}/>
                })
                }
                <Ground/>
            </group>

            {/*<mesh>*/}
            {/*    <boxGeometry/>*/}
            {/*    <meshNormalMaterial/>*/}
            {/*</mesh>*/}

        </>
    );
};