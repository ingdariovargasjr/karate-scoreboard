export const WEIGHTS_OLIMPIADA_NACIONAL = {
    CADETE: { F: [47, 54, 61], M: [52, 57, 63, 70] },
    JUNIOR: { F: [48, 53, 59, 66], M: [55, 61, 68, 76] },
    U21: { F: [50, 55, 61, 68], M: [60, 67, 75, 84] }
};

export const OLIMPIADA_AGE_GROUP_LABELS = {
    CADETE: '14-15 AÑOS (2013-2012)',
    JUNIOR: '16-17 AÑOS (2011-2010)',
    U21: '18-20 (2009-2007)'
};

export const getWeightClassLabel = (weight, thresholds) => {
    const numericWeight = Number(weight);
    const limits = (thresholds || []).filter(limit => Number.isFinite(limit) && limit < 999);
    if (!Number.isFinite(numericWeight) || numericWeight <= 0 || !limits.length) return '';

    const weightInHundredths = Math.round(numericWeight * 100);
    const upperLimit = limits.find(limit => weightInHundredths <= limit * 100);
    return upperLimit === undefined ? `+${limits[limits.length - 1]}kg` : `-${upperLimit}kg`;
};

export const getOlimpiadaNacionalWeightClass = (weight, ageGroupId, gender) => {
    const thresholds = WEIGHTS_OLIMPIADA_NACIONAL[ageGroupId]?.[gender];
    return getWeightClassLabel(weight, thresholds);
};
