import {OrbitControls, Sky} from "@react-three/drei";

export const Experience = () => {
    return (
        <>
            <OrbitControls/>
            <Sky sunPosition={[100, 20, 100]}/>
            <mesh>
                <boxGeometry/>
                <meshNormalMaterial/>
            </mesh>
        </>
    );
};