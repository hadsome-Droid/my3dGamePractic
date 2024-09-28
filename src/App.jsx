import {Canvas} from "@react-three/fiber";
import {Experience} from "./components/Experience.jsx";
import "./index.css";
import {Suspense, useMemo} from "react";
import {Physics} from "@react-three/rapier";
import {KeyboardControls} from "@react-three/drei";

export const Controls = {
    forward: "forward",
    back: "back",
    left: "left",
    right: "right",
    jump: "jump",
};

function App() {

    const map = useMemo(
        () => [
            {name: Controls.forward, keys: ["ArrowUp", "KeyW"]},
            {name: Controls.back, keys: ["ArrowDown", "KeyS"]},
            {name: Controls.left, keys: ["ArrowLeft", "KeyA"]},
            {name: Controls.right, keys: ["ArrowRight", "KeyD"]},
            {name: Controls.jump, keys: ["Space"]},
        ],
        []
    );
    return (
        <KeyboardControls map={map}>
            <div id="container">
                <div className="aim"></div>
                <Canvas shadows camera={{position: [0, 30, 0], fov: 30}}>
                    <color attach="background" args={["#ececec"]}/>
                    <Suspense>
                        <Physics debug={true}>
                            <Experience/>
                        </Physics>
                    </Suspense>
                </Canvas>
            </div>
        </KeyboardControls>

    );
}

export default App
