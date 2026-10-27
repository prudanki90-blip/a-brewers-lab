// Kinetic Extraction and Mass-Balance Physics Core
class BrewingKineticEngine {
    constructor() {}

    // Converts Fruit Brix potential directly to Specific Gravity points
    brixToSG(brix) {
        if (brix <= 0) return 1.000;
        return 1.0 + (brix / (258.6 - ((brix / 258.2) * 227.1)));
    }

    // Engine Section 2A: Non-Linear Tannin Extraction Curve Math
    calculateTanninExtraction(baseTannin, weightKg, tempC, timeMin, ph) {
        let tempMultiplier = 1.0;
        // Thermal break: Past 85C, hydrogen cell walls collapse completely
        if (tempC > 85) {
            tempMultiplier += Math.pow((tempC - 85), 1.8);
        }
        // Alkaline break: Elevated extraction rates under high pH fluid environments
        if (ph > 5.5) {
            tempMultiplier *= (1.0 + (ph - 5.5) * 2.0);
        }
        
        const baseLoad = baseTannin * (weightKg / 2.0);
        const diffusionConstant = 0.06;
        return baseLoad * (1 - Math.exp(-diffusionConstant * timeMin)) * tempMultiplier;
    }

    // Engine Section 2B: Volatile Oil Preservation Index
    calculateOilPreservation(initialOils, weightKg, tempC, timeMin) {
        const volatilityFactor = 15.0;
        // 85% Volatility protection shield when step runs sub-boil whirlpool (<80C)
        const effectiveTime = (tempC < 80) ? (timeMin * 0.15) : timeMin;
        
        const absoluteInitialLoad = initialOils * weightKg;
        return absoluteInitialLoad * Math.exp(-(effectiveTime / volatilityFactor));
    }

    // Engine Section 2C: Complex Sugar Mass-Balance Dilution Matrix
    simulateMassBalance(baseVolL, baseSG, adjunctWeightKg, moisturePct, adjunctBrix) {
        const waterAddedL = adjunctWeightKg * (moisturePct / 100.0);
        const finalVolumeL = baseVolL + waterAddedL;
        
        const adjunctSG = this.brixToSG(adjunctBrix);
        const basePoints = (baseSG - 1.0) * 1000 * baseVolL;
        const adjunctPoints = (adjunctSG - 1.0) * 1000 * (adjunctWeightKg * (1 - (moisturePct / 100.0)));
        
        const blendedSG = 1.0 + ((basePoints + adjunctPoints) / finalVolumeL) / 1000;
        return { finalVolumeL, blendedSG };
    }
}

window.BrewingKineticEngine = BrewingKineticEngine;
