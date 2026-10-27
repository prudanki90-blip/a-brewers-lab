
/**
 * A BREWER'S LAB
 * Production Ingredient Registry — Milestone 1
 *
 * Evidence levels:
 * verified          = traceable analytical source reviewed
 * literature        = sourced from published literature
 * starter_estimate  = development estimate; not verified
 * exploratory       = placeholder for future research
 *
 * Never interpret an unverified profile as certified chemistry.
 */
(function attachIngredientRegistry(global) {
  "use strict";

  const registry = {
    black_currant: {
      id: "black_currant",
      name: "Black Currant",
      scientificName: "Ribes nigrum",
      category: "fruit",
      form: "fresh_fruit",

      moisturePct: 82,
      brix: 15,

      acidsMgPer100g: {
        citric: 3100,
        malic: 2200,
        tartaric: 0
      },

      tanninIndex: 480,
      condensedTanninRatio: 0.18,
      unfermentablePct: 12,

      compounds: {
        betaCaryophyllene: null,
        terpinolene: null
      },

      evidence: {
        level: "starter_estimate",
        verified: false,
        sources: [],
        notes: "Illustrative development profile. Confirm cultivar, maturity, and analytical basis."
      }
    },

    yellow_passionfruit: {
      id: "yellow_passionfruit",
      name: "Yellow Passionfruit",
      scientificName: "Passiflora edulis",
      category: "fruit",
      form: "fresh_pulp",

      moisturePct: 75,
      brix: 16,

      acidsMgPer100g: {
        citric: 4200,
        malic: 400,
        tartaric: 0
      },

      tanninIndex: 90,
      condensedTanninRatio: 0.05,
      unfermentablePct: 6,

      compounds: {
        ethylButyrate: null,
        hexylButyrate: null,
        linalool: null
      },

      evidence: {
        level: "starter_estimate",
        verified: false,
        sources: [],
        notes: "Illustrative profile; acid and aroma values require source verification."
      }
    },

    raspberry: {
      id: "raspberry",
      name: "Red Raspberry",
      scientificName: "Rubus idaeus",
      category: "fruit",
      form: "fresh_fruit",

      moisturePct: 86,
      brix: 12,

      acidsMgPer100g: {
        citric: 1800,
        malic: 100,
        tartaric: 0
      },

      tanninIndex: 250,
      condensedTanninRatio: 0.25,
      unfermentablePct: 5,

      compounds: {
        linalool: null,
        geraniol: null
      },

      evidence: {
        level: "starter_estimate",
        verified: false,
        sources: [],
        notes: "Generic starter profile; cultivar and ripeness affect composition."
      }
    },

    apple: {
      id: "apple",
      name: "Apple",
      scientificName: "Malus domestica",
      category: "fruit",
      form: "fresh_fruit",

      moisturePct: 85,
      brix: 12,

      acidsMgPer100g: {
        citric: 20,
        malic: 500,
        tartaric: 0
      },

      tanninIndex: 100,
      condensedTanninRatio: 0.12,
      unfermentablePct: 8,

      compounds: {
        hexylAcetate: null
      },

      evidence: {
        level: "exploratory",
        verified: false,
        sources: [],
        notes: "Generic placeholder; variety and maturity must be considered."
      }
    },

    hibiscus_calyx: {
      id: "hibiscus_calyx",
      name: "Hibiscus Calyces",
      scientificName: "Hibiscus sabdariffa",
      category: "flower",
      form: "dried_calyx",

      moisturePct: 9,
      brix: 0,

      acidsMgPer100g: {
        citric: 12000,
        malic: 8000,
        tartaric: 0
      },

      tanninIndex: 850,
      condensedTanninRatio: 0.12,
      unfermentablePct: 25,

      compounds: {
        eugenol: null,
        geraniol: null
      },

      evidence: {
        level: "starter_estimate",
        verified: false,
        sources: [],
        notes: "Illustrative profile; verify acid values and dry-weight basis."
      }
    },

    black_tea: {
      id: "black_tea",
      name: "Assam Black Tea",
      scientificName: "Camellia sinensis",
      category: "herb",
      form: "dried_leaf",

      moisturePct: 5,
      brix: 0,

      acidsMgPer100g: {
        citric: 0,
        malic: 0,
        tartaric: 0
      },

      tanninIndex: 1200,
      condensedTanninRatio: 0.85,
      unfermentablePct: 35,

      compounds: {
        linalool: null,
        geraniol: null
      },

      evidence: {
        level: "starter_estimate",
        verified: false,
        sources: [],
        notes: "Tannin and aroma indices are illustrative, not certified concentrations."
      }
    },

    wormwood: {
      id: "wormwood",
      name: "Wormwood",
      scientificName: "Artemisia absinthium",
      category: "herb",
      form: "dried_leaf",

      moisturePct: 8.5,
      brix: 0,

      acidsMgPer100g: {
        citric: 0,
        malic: 200,
        tartaric: 0
      },

      tanninIndex: 1400,
      condensedTanninRatio: 0.72,
      unfermentablePct: 15,

      compounds: {
        thujone: null,
        chamazulene: null
      },

      evidence: {
        level: "exploratory",
        verified: false,
        sources: [],
        notes: "Research-only entry. Composition, safety, and applicable brewing regulations require review."
      }
    },

    coriander: {
      id: "coriander",
      name: "Coriander Seed",
      scientificName: "Coriandrum sativum",
      category: "spice",
      form: "seed",

      moisturePct: 9,
      brix: 0,

      acidsMgPer100g: {
        citric: 0,
        malic: 0,
        tartaric: 0
      },

      tanninIndex: 150,
      condensedTanninRatio: 0.10,
      unfermentablePct: 15,

      compounds: {
        linalool: null,
        geraniol: null,
        pinene: null
      },

      evidence: {
        level: "starter_estimate",
        verified: false,
        sources: [],
        notes: "Essential-oil concentrations need sourced values and a defined measurement basis."
      }
    },

    sweet_orange_peel: {
      id: "sweet_orange_peel",
      name: "Sweet Orange Peel",
      scientificName: "Citrus sinensis",
      category: "spice",
      form: "dried_peel",

      moisturePct: 11.5,
      brix: 0,

      acidsMgPer100g: {
        citric: 1500,
        malic: 100,
        tartaric: 0
      },

      tanninIndex: 320,
      condensedTanninRatio: 0.45,
      unfermentablePct: 40,

      compounds: {
        limonene: null,
        myrcene: null,
        linalool: null
      },

      evidence: {
        level: "starter_estimate",
        verified: false,
        sources: [],
        notes: "Illustrative profile; peel preparation strongly affects oil composition."
      }
    },

    cinnamon: {
      id: "cinnamon",
      name: "Cinnamon Bark",
      scientificName: "Cinnamomum verum",
      category: "spice",
      form: "dried_bark",

      moisturePct: 10,
      brix: 0,

      acidsMgPer100g: {
        citric: 0,
        malic: 0,
        tartaric: 0
      },

      tanninIndex: 450,
      condensedTanninRatio: 0.25,
      unfermentablePct: 30,

      compounds: {
        cinnamaldehyde: null,
        eugenol: null
      },

      evidence: {
        level: "exploratory",
        verified: false,
        sources: [],
        notes: "Confirm species and source-specific composition before using in predictions."
      }
    }
  };

  const numericFields = [
    "moisturePct",
    "brix",
    "tanninIndex",
    "condensedTanninRatio",
    "unfermentablePct"
  ];

  function validateIngredient(id, item) {
    const errors = [];

    if (!id || !item || typeof item !== "object") {
      return ["Ingredient ID and object are required."];
    }

    if (item.id !== id) {
      errors.push("Record ID must match its registry key.");
    }

    if (!item.name || !item.scientificName) {
      errors.push("Display name and scientific name are required.");
    }

    for (const field of numericFields) {
      if (!Number.isFinite(item[field])) {
        errors.push(field + " must be a finite number.");
      }
    }

    if (Number.isFinite(item.moisturePct) &&
        (item.moisturePct < 0 || item.moisturePct > 100)) {
      errors.push("moisturePct must be between 0 and 100.");
    }

    if (Number.isFinite(item.brix) &&
        (item.brix < 0 || item.brix > 100)) {
      errors.push("brix must be between 0 and 100.");
    }

    if (Number.isFinite(item.condensedTanninRatio) &&
        (item.condensedTanninRatio < 0 || item.condensedTanninRatio > 1)) {
      errors.push("condensedTanninRatio must be between 0 and 1.");
    }

    for (const acid of ["citric", "malic", "tartaric"]) {
      const value = item.acidsMgPer100g?.[acid];

      if (!Number.isFinite(value) || value < 0) {
        errors.push("Invalid acid value: " + acid);
      }
    }

    if (!item.evidence?.level || !Array.isArray(item.evidence.sources)) {
      errors.push("Evidence level and source list are required.");
    }

    if (!item.compounds || typeof item.compounds !== "object") {
      errors.push("Compound profile is required.");
    }

    return errors;
  }

  function validateRegistry(source) {
    const results = [];

    for (const [id, item] of Object.entries(source)) {
      results.push({
        id,
        valid: validateIngredient(id, item).length === 0,
        errors: validateIngredient(id, item)
      });
    }

    return results;
  }

  // Preserve the existing global name so the current UI can continue
  // reading the database while later milestones migrate to the new schema.
  global.BOTANICAL_DATABASE = registry;
  global.BREWING_INGREDIENT_REGISTRY = registry;

  global.BREWING_INGREDIENT_SCHEMA = {
    version: "1.0.0",
    validateIngredient,
    validateRegistry
  };

  global.BREWING_INGREDIENT_VALIDATION = validateRegistry(registry);

})(window);
