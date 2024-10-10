import {Html} from '@react-three/drei';
import s from './infoPanel.module.scss'
import {useSkillStore} from "../../stores/skillStore.js";

const SkillPanel = ({skillId}) => {
    const skills = useSkillStore((state) => state.skills)

    return (
        <Html
            distanceFactor={10}
            style={{pointerEvents: 'none'}}
            calculatePosition={
                (obj, camera, size) => {
                    // console.log(obj, camera, size);
                    return [obj.position.x, obj.position.y, obj.position.z]
                }}>
            <div className={s.infoPanel}>
                <h3 className={s.skillsTitle}>Skills</h3>
                <ul className={s.skills}>
                    {skills.map((skill) => (
                        // <li key={index}>{skill}</li>
                        <button key={skill.id} id={skill.id}
                                className={`${s.skill} ${skill.isButtonPush ? s.skillSelected : ''}`}>{skill.name}</button>
                    ))}
                </ul>
            </div>
        </Html>
    );
};

export default SkillPanel;
