import {Canvas} from "@react-three/fiber";
import {Experience} from "./components/Experience.jsx";
import "./index.css";
import {Suspense, useMemo} from "react";
import {Physics} from "@react-three/rapier";
import {KeyboardControls} from "@react-three/drei";
import {Bloom, EffectComposer} from "@react-three/postprocessing";

export const Controls = {
    forward: "forward",
    back: "back",
    left: "left",
    right: "right",
    jump: "jump",
    shift: "shift",
};

function App() {

    const map = useMemo(
        () => [
            {name: Controls.forward, keys: ["ArrowUp", "KeyW"]},
            {name: Controls.back, keys: ["ArrowDown", "KeyS"]},
            {name: Controls.left, keys: ["ArrowLeft", "KeyA"]},
            {name: Controls.right, keys: ["ArrowRight", "KeyD"]},
            {name: Controls.jump, keys: ["Space"]},
            {name: Controls.shift, keys: ["Shift"]},
        ],
        []
    );

    return (
        <KeyboardControls map={map}>
            {/*<div id="container">*/}
            {/*    <div className="aim"></div>*/}
            <Canvas shadows camera={{position: [0, 6, 14], fov: 42}}>
                <color attach="background" args={["#ececec"]}/>
                <Suspense>
                    <Physics>
                        <Experience/>
                    </Physics>
                </Suspense>
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur/>
                </EffectComposer>
            </Canvas>
            {/*</div>*/}
        </KeyboardControls>

    );
}

export default App
