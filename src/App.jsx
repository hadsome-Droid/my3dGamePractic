import {Canvas} from "@react-three/fiber";
import {Experience} from "./components/Experience.jsx";
import "./index.css";

function App() {
    return (
        <div id="container">
            <div className="aim"></div>
            <Canvas shadows camera={{position: [3, 3, 3], fov: 30}}>
                <color attach="background" args={["#ececec"]}/>
                <Experience/>
            </Canvas>
        </div>
    );
}

export default App
