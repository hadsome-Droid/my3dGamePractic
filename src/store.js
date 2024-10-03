import {create} from "zustand";

export const useGameStore = create((set) => ({
    //Character Controller
    characterState: 'Idle',
    setCharacterState: (characterState) => set({
        characterState,
    }),
    progressAnimation: 0,
    setProgressAnimation: (progressAnimation) => set({
        progressAnimation,
    }),
    // Characters
    characters: {
        player: {
            health: 100,
            stamina: 100,
        },
    },

    // Monsters
    monsters: {
        monster1: {
            health: 100,
            stamina: 50,
        },
        monster2: {
            health: 150,
            stamina: 50,
        },
    },

    monsterAnimation: 'CharacterArmature|Walk',
    setMonsterAnimation: (characterState) => set({
        characterState,
    }),

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

    // Methods to update monster parameters
    updateMonsterHealth: (monsterId, health) =>
        set((state) => ({
            monsters: {
                ...state.monsters,
                [monsterId]: {
                    ...state.monsters[monsterId],
                    health,
                },
            },
        })),

    updateMonsterStamina: (monsterId, stamina) =>
        set((state) => ({
            monsters: {
                ...state.monsters,
                [monsterId]: {
                    ...state.monsters[monsterId],
                    stamina,
                },
            },
        })),
}))

