import {useEffect, useRef} from 'react';
import {RigidBody, vec3} from "@react-three/rapier";
import {MeshBasicMaterial} from "three";
import {WEAPON_OFFSET} from "../character/CharacterController.jsx";

const BULLET_SPEED = 80;

const bulletMaterial = new MeshBasicMaterial({
    // color: "hotpink",
    color: "green",
    toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

export const Bullet = ({angle, position, rotation, onHit}) => {
    const rigidBody = useRef();

    useEffect(() => {
        const velocity = {
            x: Math.sin(rotation.y) * BULLET_SPEED,
            y: 0,
            z: Math.cos(rotation.y) * BULLET_SPEED,
        };
        rigidBody.current?.setLinvel(velocity, true);

    }, [rigidBody, rotation]);
    // console.log('rott', rotation);
    return (
        // <group position={[position.x, (position.y + 3), position.z]} rotation-y={rotation.y}>
        <group position={[position.x, (position.y + 3.5), position.z]}>
            <group
                // position-x={WEAPON_OFFSET.x}
                // position-y={WEAPON_OFFSET.y}
                // position-z={WEAPON_OFFSET.z}
            >
                <RigidBody
                    ref={rigidBody}
                    gravityScale={0}
                    sensor onIntersectionEnter={(e) => {
                    if (e.other.rigidBody.userData?.type !== 'bullet') {
                        rigidBody.current?.setEnabled(false)
                        onHit(vec3(rigidBody.current?.translation()))
                    }
                    // console.log(e)
                }}
                    userData={{
                        type: "bullet",
                        damage: 10,
                    }}
                >
                    <mesh position-z={0.25} material={bulletMaterial} castShadow>
                        {/*<boxGeometry args={[0.05, 0.05, 0.5]}/>*/}
                        <sphereGeometry args={[0.5, 32, 16]}/>
                    </mesh>
                </RigidBody>
            </group>
        </group>
    );
};
