import assert from 'node:assert/strict';
import test from 'node:test';
import { getOlimpiadaNacionalWeightClass } from '../weight-categories.mjs';

// Fixture transcribed from the user's Olimpiada Nacional table.
const weightClassCases = [
    { ageGroup: 'CADETE', gender: 'F', label: '14-15 femenil', limits: [47, 54, 61] },
    { ageGroup: 'CADETE', gender: 'M', label: '14-15 varonil', limits: [52, 57, 63, 70] },
    { ageGroup: 'JUNIOR', gender: 'F', label: '16-17 femenil', limits: [48, 53, 59, 66] },
    { ageGroup: 'JUNIOR', gender: 'M', label: '16-17 varonil', limits: [55, 61, 68, 76] },
    { ageGroup: 'U21', gender: 'F', label: '18-20 femenil', limits: [50, 55, 61, 68] },
    { ageGroup: 'U21', gender: 'M', label: '18-20 varonil', limits: [60, 67, 75, 84] }
];

for (const { ageGroup, gender, label, limits } of weightClassCases) {
    for (let index = 0; index < limits.length; index++) {
        const limit = limits[index];
        const nextClass = limits[index + 1] === undefined
            ? `+${limit}kg`
            : `-${limits[index + 1]}kg`;

        test(`${label}: ${limit}.00 kg pertenece a -${limit}kg y ${limit}.01 kg pasa a ${nextClass}`, () => {
            assert.equal(getOlimpiadaNacionalWeightClass(limit, ageGroup, gender), `-${limit}kg`);
            assert.equal(getOlimpiadaNacionalWeightClass(limit + 0.01, ageGroup, gender), nextClass);
        });
    }
}

test('no asigna división si falta un grupo, una rama o un peso positivo', () => {
    assert.equal(getOlimpiadaNacionalWeightClass(47, 'SENIOR', 'F'), '');
    assert.equal(getOlimpiadaNacionalWeightClass(47, 'CADETE', 'X'), '');
    assert.equal(getOlimpiadaNacionalWeightClass(0, 'CADETE', 'F'), '');
});
