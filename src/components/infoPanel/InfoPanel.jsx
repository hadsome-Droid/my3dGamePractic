import s from './infoPanel.module.scss'
import {v4 as uuidv4} from 'uuid';
// import {useGameStore} from "../../stores/store.js";
import {Html} from "@react-three/drei";
import {useMemo} from "react";


export const InfoPanel = () => {
    // const isButtonPush = useGameStore((state) => state.isButtonPush);
    const isButtonPush = false;

    const skills = useMemo(() => [
        {skillName: '0', id: uuidv4()},
        {skillName: '1', id: uuidv4()},
        {skillName: '2', id: uuidv4()},
        {skillName: '3', id: uuidv4()},
        {skillName: '4', id: uuidv4()},
        {skillName: '5', id: uuidv4()},
        {skillName: '6', id: uuidv4()}
    ], []);
    return (
        // <Html center transform>
            <div className={s.infoPanel}>
                <div className={s.skills}>
                    {skills.map(skill => (
                        <button
                            key={skill.id}
                            className={isButtonPush ? s.skillSelected : s.skill}
                        >
                            {skill.skillName}
                        </button>
                    ))}
                </div>
            </div>
        // </Html>
    );
};
