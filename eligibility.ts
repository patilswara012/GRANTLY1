/**
 * GRANTLY eligibility scoring engine.
 * This module uses strict TypeScript and only evaluates illustrative demo criteria.
 */

interface ScholarshipCriteria {
    id: number;
    name: string;
    level: string;
    marks: number;
    income: number;
}

interface StudentProfile {
    level: string;
    course: string;
    marks: number;
    income: number;
    category: string;
}

interface EligibilityMatch extends ScholarshipCriteria {
    score: number;
    levelPoints: number;
    marksPoints: number;
    incomePoints: number;
}

interface GrantlyEligibilityAPI {
    calculate(
        profile: StudentProfile,
        opportunities: ScholarshipCriteria[]
    ): EligibilityMatch[];
}

interface Window {
    GrantlyEligibility: GrantlyEligibilityAPI;
}

function calculateEligibility(
    profile: StudentProfile,
    opportunities: ScholarshipCriteria[]
): EligibilityMatch[] {
    return opportunities
        .map((opportunity): EligibilityMatch => {
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
