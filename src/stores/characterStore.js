import { create } from "zustand";
import * as THREE from "three";

export const useCharacterStore = create((set) => ({
    // Character Controller
    characterState: 'Idle',
    setCharacterState: (characterState) => set({ characterState }),
    progressAnimation: 0,
    setProgressAnimation: (progressAnimation) => set({ progressAnimation }),
    playerPosition: new THREE.Vector3(0, 0, 0),
    setPlayerPosition: (position) => set({ playerPosition: position }),

    // Characters
    characters: {
        player: {
            health: 10,
            stamina: 100,
        },
    },

    // Methods to update character parameters
    updateCharacterHealth: (characterId, health) =>
        set((state) => ({
            characters: {
                ...state.characters,
                [characterId]: {
                    ...state.characters[characterId],
                    health,
                },
            },
        })),

    updateCharacterStamina: (characterId, stamina) =>
        set((state) => ({
            characters: {
                ...state.characters,
                [characterId]: {
                    ...state.characters[characterId],
                    stamina,
                },
            },
        })),
}));