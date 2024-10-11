import { create } from "zustand";

export const useMonsterStore = create((set) => ({
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

    // Methods to update monster parameters
    updateMonsterHealth: (monsterId, health) =>
        set((state) => {
            return {
                monsters: {
                    ...state.monsters,
                    [monsterId]: {
                        ...state.monsters[monsterId],
                        health,
                    },
                },
            };
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
}));