import {create} from "zustand";
import * as THREE from "three";

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
    playerPosition: new THREE.Vector3(0, 0, 0),
    setPlayerPosition: (position) => set({playerPosition: position}),
    // Characters
    characters: {
        player: {
            health: 100,
            stamina: 100,
        },
    },

    // Monsters
    // run 0.08
    //walk 0.04
    monsters: {
        Demon1: {
            monsterAnimation: 'CharacterArmature|Idle',
            health: 100,
            stamina: 50,
            speed: 0.04,
        },
        Alien1: {
            monsterAnimation: 'CharacterArmature|Idle',
            health: 150,
            stamina: 50,
            speed: 0.04,
        },
        Demon2: {
            monsterAnimation: 'CharacterArmature|Idle',
            health: 100,
            stamina: 50,
            speed: 0.04,
        },
        Alien2: {
            monsterAnimation: 'CharacterArmature|Idle',
            health: 150,
            stamina: 50,
            speed: 0.04,
        },
        Demon3: {
            monsterAnimation: 'CharacterArmature|Idle',
            health: 100,
            stamina: 50,
            speed: 0.04,
        },
        Alien3: {
            monsterAnimation: 'CharacterArmature|Idle',
            health: 150,
            stamina: 50,
            speed: 0.04,
        },

    },


    setMonsterAnimation: (monsterId, monsterAnimation) => set((state) => ({
        monsters: {
            ...state.monsters,
            [monsterId]: {
                ...state.monsters[monsterId],
                monsterAnimation,
            },
        },
    })),

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
        set((state) => {
            console.log(`Updating monster ${monsterId} health to ${health}`)
            return {
                monsters: {
                    ...state.monsters,
                    [monsterId]: {
                        ...state.monsters[monsterId],
                        health,
                    },
                },
            }
        }),

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
    updateMonsterSpeed: (monsterId, speed) =>
        set((state) => ({
            monsters: {
                ...state.monsters,
                [monsterId]: {
                    ...state.monsters[monsterId],
                    speed,
                },
            },
        })),
    isButtonPush: false,
    updateButtonPush: (isButtonPush) => (set({isButtonPush}))
}))

