import {useEffect, useRef} from 'react';
import {RigidBody} from "@react-three/rapier";
import {MeshBasicMaterial} from "three";

const BULLET_SPEED = 8;

const bulletMaterial = new MeshBasicMaterial({
    color: "hotpink",
    toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

export const Bullet = ({angle, position}) => {
    const rigidBody = useRef();

    useEffect(() => {
        // const velocity = {
        //     x: Math.sin(angle.x / angle.z) * BULLET_SPEED,
        //     y: 0,
        //     z: Math.cos(angle.x / angle.z) * BULLET_SPEED,
        // };
        //
        rigidBody.current?.setLinvel(angle, true);
        // angle.multiplyScalar(BULLET_SPEED)

    }, [rigidBody, angle]);
    console.log('pos', position);
    return (
        <group position={[position.x, (position.y + 3), position.z]}>
            <group>
                <RigidBody ref={rigidBody} gravityScale={1}>
                    <mesh position-z={0.25} material={bulletMaterial}>
                        <boxGeometry args={[0.05, 0.05, 0.5]}/>
                    </mesh>
                </RigidBody>
            </group>
        </group>
    );
};
