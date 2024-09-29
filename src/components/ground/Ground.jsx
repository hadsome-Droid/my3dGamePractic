import * as THREE from "three";
import {Cylinder, useTexture} from "@react-three/drei";
// import floorTexture from "/src/assets/image/cub.png";
// import floorTexture from "/src/assets/image/floor.jpg";
// import floorTexture from "/src/assets/image/floor3.jpg";
import floorTexture from "/src/assets/image/floor4.jpg";
import {CylinderCollider, RigidBody} from "@react-three/rapier";
// import floorTexture from "/src/assets/image/floor2.webp";
// import floorTexture from "/src/assets/image/floor5.webp";

export const Ground = () => {

    // return (
    //     <RigidBody color={false} type={'fixed'} position-y={-0.5} friction={2}>
    //         <CylinderCollider args={[1 / 2, 5]}/>
    //         <Cylinder scale={[5, 1, 5]} receiveShadow={true}>
    //             <meshStandardMaterial color={'white'}/>
    //         </Cylinder>
    //     </RigidBody>
    // )
    const texture = useTexture(floorTexture);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(100, 100);
    texture.needsUpdate = true;

    // console.log(texture);
    return (
        <RigidBody type={'fixed'} friction={2}>
            <mesh position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[500, 500]}/>
                <meshStandardMaterial color="grey" map={texture}/>
            </mesh>
        </RigidBody>

    );
}
