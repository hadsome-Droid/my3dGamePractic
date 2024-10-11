import {Instance, Instances} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {useEffect, useMemo, useRef} from "react";
import {Color, MathUtils, Vector3} from "three";
import {useSkillStore} from "../../stores/skillStore.js";

// const bulletHitcolor = new Color("orangered");
// bulletHitcolor.multiplyScalar(12);

const AnimatedBox = ({scale, target, speed}) => {
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current.scale.x > 0) {
            ref.current.scale.x =
                ref.current.scale.y =
                    ref.current.scale.z -=
                        speed * delta;
        }
        ref.current.position.lerp(target, speed);
    });
    return <Instance ref={ref} scale={scale} position={[0, 0, 0]}/>;
};

export const BulletHit = ({nb = 100, position, onEnded}) => {
    const skillSelected = useSkillStore((state) => state.skillSelected)
    let color
    switch (skillSelected) {
        case "Fireball":
            color = 'orangered'
            break;
        case "Snowball":
            color = 'lightskyblue'
            break;
        case "Lightningball":
            color = 'slateblue'
            break;
    }

    const bulletHitcolor = new Color(color);
    bulletHitcolor.multiplyScalar(12);


    const boxes = useMemo(
        () =>
            Array.from({length: nb}, () => ({
                target: new Vector3(
                    MathUtils.randFloat(-0.6, 0.6),
                    MathUtils.randFloat(-0.6, 0.6),
                    MathUtils.randFloat(-0.6, 0.6)
                ),
                scale: 0.1, //MathUtils.randFloat(0.03, 0.09),
                speed: MathUtils.randFloat(0.1, 0.3),
            })),
        [nb]
    );

    useEffect(() => {
        setTimeout(() => {
            // if (isHost()) {
            //     onEnded();
            // }
            onEnded();
        }, 500);
    }, []);

    return (
        <group position={[position.x, position.y + 1, position.z]}>
            <Instances>
                {/*<boxGeometry/>*/}
                <torusKnotGeometry args={[0.3, 0.1, 19, 5, 9, 4]}/>
                {/*<sphereGeometry/>*/}
                {/*<torusGeometry/>*/}
                <meshStandardMaterial toneMapped={false} color={bulletHitcolor}/>
                {boxes.map((box, i) => (
                    <AnimatedBox key={i} {...box} />
                ))}
            </Instances>
        </group>
    );
};