import {RigidBody} from "@react-three/rapier";
import {useControls} from "leva";
import {Sphere} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useRef} from "react";

// Define collision groups
const CHARACTER_GROUP = 0b1;
const SHIELD_GROUP = 0b10;
const ALL_GROUPS = CHARACTER_GROUP | SHIELD_GROUP;

export const Bubble = ({characterPosition}) => {
    const sphereRef = useRef();

    // const config = useControls({
    //     meshPhysicalMaterial: false,
    //     transmissionSampler: false,
    //     backside: false,
    //     samples: {value: 10, min: 1, max: 32, step: 1},
    //     resolution: {value: 1024, min: 256, max: 2048, step: 256},
    //     transmission: {value: 1, min: 0, max: 1},
    //     roughness: {value: 0.0, min: 0, max: 1, step: 0.01},
    //     thickness: {value: 0, min: 0, max: 10, step: 0.01},
    //     ior: {value: 1, min: 1, max: 5, step: 0.01},
    //     chromaticAberration: {value: 0, min: 0, max: 1},
    //     anisotropy: {value: 0, min: 0, max: 1, step: 0.01},
    //     distortion: {value: 0.0, min: 0, max: 1, step: 0.01},
    //     distortionScale: {value: 0, min: 0.01, max: 1, step: 0.01},
    //     temporalDistortion: {value: 0, min: 0, max: 1, step: 0.01},
    //     clearcoat: {value: 1, min: 0, max: 1},
    //     attenuationDistance: {value: 1, min: 0, max: 10, step: 0.01},
    //     attenuationColor: "#ffffff",
    //     color: "#efbeff",
    //     bg: "#ffffff",
    // });
    // console.log(config)

    const config2 = {
        "meshPhysicalMaterial": false,
        "transmissionSampler": false,
        "backside": false,
        "samples": 10,
        "resolution": 1024,
        "transmission": 1,
        "roughness": 0,
        "thickness": 0,
        "ior": 1,
        "chromaticAberration": 0,
        "anisotropy": 0,
        "distortion": 0,
        "distortionScale": 0.01,
        "temporalDistortion": 0,
        "clearcoat": 1,
        "attenuationDistance": 1,
        "attenuationColor": "#ffffff",
        "color": "#efbeff",
        "bg": "#ffffff"
    }

    useFrame(() => {
        // Update the sphere's position to match the character's position
        sphereRef.current.setNextKinematicTranslation(characterPosition);
    });

    return (
        <RigidBody
            ref={sphereRef}
            type="kinematicPosition" // Make the sphere follow the character's position
            collisionGroups={SHIELD_GROUP} // Assign the sphere to the SHIELD_GROUP
            collisionMask={ALL_GROUPS ^ SHIELD_GROUP} // Allow objects in all groups except SHIELD_GROUP to collide with the sphere
        >
            <Sphere args={[1, 32, 32]} position-y={0.5}>
                <meshPhysicalMaterial {...config2} />
            </Sphere>
        </RigidBody>
    );
};
