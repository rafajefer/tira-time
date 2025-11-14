export const levels = {
  'S': 10, 'A+': 9.5, 'A': 9, 'B+': 8.5, 'B': 8, 'C': 7, 'D': 6
};

export function getSkillValue(skill) {
    if (typeof skill === 'number') return skill;
    if (levels && levels[skill] !== undefined) return Number(levels[skill]);
    const n = parseFloat(skill);
    return Number.isFinite(n) ? n : 0;
}