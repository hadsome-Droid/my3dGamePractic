import {create} from "zustand";


export const useSkillStore = create((set) => ({
    skills: [
        {id: 1, name: "Fireball", damage: 20, isButtonPush: false},
        {id: 2, name: "Snowball", damage: 20, isButtonPush: false},
        {id: 3, name: "Waterball", damage: 20, isButtonPush: false},
        {id: 4, name: "Heal", damage: -10, isButtonPush: false}, // Healing is represented as negative damage
        {id: 5, name: "Teleport", damage: 0, isButtonPush: false}, // Teleport doesn't cause damage
        {id: 6, name: "Shield", damage: 0, isButtonPush: false} // Shield doesn't cause damage
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