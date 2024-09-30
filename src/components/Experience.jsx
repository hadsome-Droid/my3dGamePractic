import {OrbitControls, Sky} from "@react-three/drei";
import {Ground} from "./ground/Ground.jsx";
import {RigidBody} from "@react-three/rapier";
import {CharacterController} from "./character/CharacterController.jsx";

export const Experience = () => {
    return (
        <>
            {/*<OrbitControls/>*/}
            <Sky sunPosition={[100, 20, 100]}/>
            <ambientLight intensity={1.5}/>
            <directionalLight
                intensity={1.5}
                position={[5, 5, 5]}
                castShadow
                color={'#9e69da'}
            />
            <group position-y={-1}>
                <CharacterController/>
                <Ground/>
            </group>

            {/*<mesh>*/}
            {/*    <boxGeometry/>*/}
            {/*    <meshNormalMaterial/>*/}
            {/*</mesh>*/}

        </>
    );
};