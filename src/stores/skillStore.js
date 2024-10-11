import {create} from "zustand";
import Fireball from '../assets/image/skillIcon/The_Fireball_skill_icon_1.webp'
import Lightningball from '../assets/image/skillIcon/The_ball_lightning_skill_icon_2.webp'
import Icicle from '../assets/image/skillIcon/Ice_Peaks_skill_icon_3.webp'
import Teleportation from '../assets/image/skillIcon/Teleportation_skill_icon_2.webp'
import ElementalShield from '../assets/image/skillIcon/The_icon_of_the_Elemental_Shield_skill_2.webp'
import RestoreHealt from '../assets/image/skillIcon/Ability_to_restore_healt_0.webp'

export const useSkillStore = create((set) => ({
    skills: [
        {id: 1, name: "Fireball", damage: 20, isButtonPush: false, skillIcon: Fireball},
        {id: 2, name: "Snowball", damage: 20, isButtonPush: false, skillIcon: Icicle},
        {id: 3, name: "Lightningball", damage: 20, isButtonPush: false, skillIcon: Lightningball},
        {id: 4, name: "Heal", damage: -10, isButtonPush: false, skillIcon: RestoreHealt}, // Healing is represented as negative damage
        {id: 5, name: "Teleport", damage: 0, isButtonPush: false, skillIcon: Teleportation}, // Teleport doesn't cause damage
        {id: 6, name: "Shield", damage: 0, isButtonPush: false, skillIcon: ElementalShield} // Shield doesn't cause damage
    ],
    updateButtonPush: (skillId, buttonPush) =>
        set((state) => ({
            skills: state.skills.map((skill) =>
                skill.id === skillId ? {...skill, isButtonPush: buttonPush} : {...skill, isButtonPush: false}
            )
        })),
    skillSelected: 'Fireball',
    updateSkillSelected: (skillSelected) => set({skillSelected}),
}));