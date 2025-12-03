export const levels = {
  'S+': 10, 'S': 9.5, 'A+': 9, 'A': 8.5, 'B+': 8, 'B': 7.5, 'C': 7, 'D': 6
};

export function getSkillValue(skill) {
    if (typeof skill === 'number') return skill;
    if (levels && levels[skill] !== undefined) return Number(levels[skill]);
    const n = parseFloat(skill);
    return Number.isFinite(n) ? n : 0;
}