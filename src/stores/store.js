import { useCharacterStore } from './characterStore';
import { useMonsterStore } from './monsterStore';
import { useSkillStore } from './skillStore';

export const useGameStore = () => {
    const characterStore = useCharacterStore();
    const monsterStore = useMonsterStore();
    const skillStore = useSkillStore();

    return {
        ...characterStore,
        ...monsterStore,
        ...skillStore,
    };
};
