import {OrbitControls, Sky} from "@react-three/drei";
import {Ground} from "./ground/Ground.jsx";
import {RigidBody} from "@react-three/rapier";
import {CharacterController} from "./character/CharacterController.jsx";

export const Experience = () => {
    return (
        <>
            <OrbitControls/>
            <Sky sunPosition={[100, 20, 100]}/>
            <ambientLight intensity={1.5}/>
            <group position-y={-1}>
                <CharacterController />
                <Ground/>
            </group>

            {/*<mesh>*/}
            {/*    <boxGeometry/>*/}
            {/*    <meshNormalMaterial/>*/}
            {/*</mesh>*/}

        </>
    );
};