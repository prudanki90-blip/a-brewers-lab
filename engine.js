 // A BREWER'S LAB
 // Kinetic extraction and mass-balance core — compatibility milestone

"use strict";

class BrewingKineticEngine {
    constructor() {
        this.modelVersion = "1.1.0-approximate";
        this.warnings = [
            "Tannin and volatile-oil calculations are uncalibrated relative models.",
            "Mass balance omits solid displacement, evaporation, and process losses.",
            "Final pH cannot be calculated reliably from acid concentration alone."
        ];

        const registry = typeof window !== "undefined"
            ? window.BOTANICAL_DATABASE
            : null;

        if (registry && typeof registry === "object") {
            for (const [id, item] of Object.entries(registry)) {
                if (item && typeof item === "object") {
                    this.normalizeIngredient(item, id);
                }
            }
        }
    }

 
    normalizeIngredient(item, id) {
        if (!item.id) item.id = id;

        // Null, undefined and blank strings represent unknown data.
        const isKnownNumber = (value) =>
            value !== null &&
            value !== undefined &&
            !(typeof value === "string" && value.trim() === "") &&
            Number.isFinite(Number(value));

        const aliases = [
            ["moisture_pct", "moisturePct"],
            ["unfermentable_pct", "unfermentablePct"],
            ["condensed_tannin_ratio", "condensedTanninRatio"],
            ["base_tannin", "tanninIndex"]
        ];

        for (const [legacy, current] of aliases) {
            if (!isKnownNumber(item[legacy]) &&
                isKnownNumber(item[current])) {
                item[legacy] = Number(item[current]);
            }
        }

        if (!isKnownNumber(item.citric_acid_mg_100g) &&
            isKnownNumber(item.acidsMgPer100g?.citric)) {
            item.citric_acid_mg_100g =
                Number(item.acidsMgPer100g.citric);
        }

        if (!isKnownNumber(item.malic_acid_mg_100g) &&
            isKnownNumber(item.acidsMgPer100g?.malic)) {
            item.malic_acid_mg_100g =
                Number(item.acidsMgPer100g.malic);
        }

        // Only genuinely known numeric compound values are retained.
        if (!item.oils || typeof item.oils !== "object") {
            const knownOils = {};

            for (const [name, value] of Object.entries(item.compounds || {})) {
                if (typeof value === "number" &&
                    Number.isFinite(value) && value >= 0) {
                    knownOils[name] = value;
                }
            }

            item.oils = knownOils;
        }

        return item;
    }



 
    assertFinite(value, label) {
        if (value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "")) {
            throw new TypeError(label + " is missing or unknown.");
        }

        const number = Number(value);

        if (!Number.isFinite(number)) {
            throw new TypeError(label + " must be a finite number.");
        }

        return number;
    }


 


    

  
    brixToSG(brix) {
        const value = this.assertFinite(brix, "Brix");

        if (value < 0 || value > 100) {
            throw new RangeError("Brix must be between 0 and 100.");
        }
        if (value === 0) return 1.000;

        return 1 + value /
            (258.6 - ((value / 258.2) * 227.1));
    }

    // Relative tannin extraction index, not a concentration.
    // Bounded temperature and pH factors prevent runaway predictions.
    calculateTanninExtraction(baseTannin, weightKg, tempC, timeMin, ph) {
        const tannin = this.assertFinite(baseTannin, "Base tannin index");
        const weight = this.assertFinite(weightKg, "Ingredient weight");
        const temp = this.assertFinite(tempC, "Temperature");
        const time = this.assertFinite(timeMin, "Extraction time");
        const acidity = this.assertFinite(ph, "pH");

        if (tannin < 0 || weight < 0 || time < 0) {
            throw new RangeError("Tannin, weight, and time cannot be negative.");
        }
        if (temp < 0 || temp > 150) {
            throw new RangeError("Temperature must be between 0 and 150 C.");
        }
        if (acidity < 0 || acidity > 14) {
            throw new RangeError("pH must be between 0 and 14.");
        }

        const baseLoad = tannin * (weight / 2);
        const temperatureMultiplier = Math.min(
            2.5,
            Math.max(0.25, Math.pow(2, (temp - 70) / 10))
        );
        const phMultiplier = Math.min(
            1.8,
            Math.max(0.5, 1 + (acidity - 5) * 0.25)
        );

        const rate = 0.018 * temperatureMultiplier * phMultiplier;
        const extractedFraction = 1 - Math.exp(-rate * time);

        return baseLoad * Math.min(1, Math.max(0, extractedFraction));
    }

    // Relative remaining oil load, not a measured concentration.
    calculateOilPreservation(initialOils, weightKg, tempC, timeMin) {
        const oils = this.assertFinite(initialOils, "Initial oil index");
        const weight = this.assertFinite(weightKg, "Ingredient weight");
        const temp = this.assertFinite(tempC, "Temperature");
        const time = this.assertFinite(timeMin, "Exposure time");

        if (oils < 0 || weight < 0 || time < 0) {
            throw new RangeError("Oil index, weight, and time cannot be negative.");
        }
        if (temp < 0 || temp > 150) {
            throw new RangeError("Temperature must be between 0 and 150 C.");
        }

        const initialLoad = oils * weight;
        const temperatureMultiplier = Math.pow(2, (temp - 70) / 10);
        const rate = Math.LN2 / 45;

        return initialLoad * Math.exp(
            -rate * temperatureMultiplier * time
        );
    }

    // Approximate gravity mass balance.
    // Brix is applied to wet adjunct mass. Solid displacement, evaporation,
    // filtration loss, and volume contraction are not modeled.
    simulateMassBalance(baseVolL, baseSG, adjunctWeightKg, moisturePct, adjunctBrix) {
        const volume = this.assertFinite(baseVolL, "Base volume");
        const gravity = this.assertFinite(baseSG, "Base specific gravity");
        const weight = this.assertFinite(adjunctWeightKg, "Adjunct weight");
        const moisture = this.assertFinite(moisturePct, "Moisture percentage");
        const brix = this.assertFinite(adjunctBrix, "Adjunct Brix");

        if (volume <= 0) {
            throw new RangeError("Base volume must be greater than zero.");
        }
        if (gravity < 0.9 || gravity > 1.3) {
            throw new RangeError("Base specific gravity must be between 0.900 and 1.300.");
        }
        if (weight < 0) {
            throw new RangeError("Adjunct weight cannot be negative.");
        }
        if (moisture < 0 || moisture > 100) {
            throw new RangeError("Moisture must be between 0 and 100 percent.");
        }
        if (brix < 0 || brix > 100) {
            throw new RangeError("Brix must be between 0 and 100.");
        }

        const waterAddedL = weight * moisture / 100;
        const finalVolumeL = volume + waterAddedL;
        const basePointLitres = (gravity - 1) * 1000 * volume;

        // Approximate soluble extract in kg; 384 point-litres per kg is
        // an engineering approximation, not a universal ingredient constant.
        const solubleExtractKg = weight * brix / 100;
        const adjunctPointLitres = solubleExtractKg * 384;

        const blendedSG = 1 + (
            (basePointLitres + adjunctPointLitres) /
            (finalVolumeL * 1000)
        );

        return {
            finalVolumeL,
            blendedSG,
            waterAddedL,
            solubleExtractKg,
            basePointLitres,
            adjunctPointLitres,
            assumptions: [
                "Brix approximates soluble-solids mass fraction in the wet adjunct.",
                "Ingredient water is added to liquid volume; solid displacement is omitted.",
                "Evaporation, filtration loss, and volume contraction are not modeled."
            ]
        };
    }
}

if (typeof window !== "undefined") {
    window.BrewingKineticEngine = BrewingKineticEngine;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = BrewingKineticEngine;
}
