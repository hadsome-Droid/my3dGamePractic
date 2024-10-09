import {Html} from '@react-three/drei';
import s from './infoPanel.module.scss'

const SkillPanel = ({skills}) => {
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
                    {skills.map((skill, index) => (
                        // <li key={index}>{skill}</li>
                        <button key={index} className={s.skill}>{skill}</button>
                    ))}
                </ul>
            </div>
        </Html>
    );
};

export default SkillPanel;
