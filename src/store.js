import {create} from "zustand";

export const useGameStore = create((set) => ({
    //Character Controller
    characterState: 'Idle',
    setCharacterState: (characterState) => set({
        characterState,
    })
}))

