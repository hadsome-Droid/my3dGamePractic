import {useRef} from 'react';
import {RigidBody} from "@react-three/rapier";

export const Bullet = () => {
    const rigidBody = useRef();
    return (
        <group>
            <group>
                <RigidBody ref={rigidBody}>
                    <mesh position-z={0.25}>
                        <boxGeometry args={[0.05, 0.05, 0.5]}/>
                    </mesh>
                </RigidBody>
            </group>
        </group>
    );
};
