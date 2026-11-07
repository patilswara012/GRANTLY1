"use strict";
/**
 * GRANTLY eligibility scoring engine.
 * This module uses strict TypeScript and only evaluates illustrative demo criteria.
 */
function calculateEligibility(profile, opportunities) {
    return opportunities
        .map((opportunity) => {
        const levelPoints = profile.level === opportunity.level ? 40 : 0;
        const marksPoints = profile.marks >= opportunity.marks ? 35 : 0;
        const incomePoints = profile.income <= opportunity.income ? 25 : 0;
        return {
            ...opportunity,
            score: levelPoints + marksPoints + incomePoints,
            levelPoints,
            marksPoints,
            incomePoints
        };
    })
        .sort((first, second) => second.score - first.score);
}
window.GrantlyEligibility = {
    calculate: calculateEligibility
};
