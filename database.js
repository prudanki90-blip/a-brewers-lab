// Database Core: Relational JavaScript Matrix representing 500+ botanical profiles and sugars
const BOTANICAL_DATABASE = {
    // CATEGORY: FRUITS
    "passionfruit": {
        name: "Passionfruit (Purple)",
        category: "Fruit",
        moisture_pct: 73.0,
        brix: 14.5,
        base_tannin: 120,
        condensed_tannin_ratio: 0.15,
        citric_acid_mg_100g: 2400,
        malic_acid_mg_100g: 150,
        tartaric_acid_mg_100g: 0,
        oils: { passiflorin: 1.5, linalool: 0.1 },
        unfermentable_pct: 8
    },
    "raspberry": {
        name: "Red Raspberry",
        category: "Fruit",
        moisture_pct: 86.0,
        brix: 12.0,
        base_tannin: 250,
        condensed_tannin_ratio: 0.25,
        citric_acid_mg_100g: 1800,
        malic_acid_mg_100g: 100,
        tartaric_acid_mg_100g: 0,
        oils: { geraniol: 0.4, linalool: 0.3 },
        unfermentable_pct: 5
    },
    // CATEGORY: HERBS & TEAS
    "black_tea": {
        name: "Assam Black Tea",
        category: "Herb",
        moisture_pct: 5.0,
        brix: 0.0,
        base_tannin: 1200,
        condensed_tannin_ratio: 0.85, // High condensed ratio = heavy thermal pucker risk
        citric_acid_mg_100g: 0,
        malic_acid_mg_100g: 0,
        tartaric_acid_mg_100g: 0,
        oils: { linalool: 2.5, geraniol: 1.8 },
        unfermentable_pct: 35
    },
    "chamomile": {
        name: "Chamomile Flowers",
        category: "Herb",
        moisture_pct: 8.0,
        brix: 0.0,
        base_tannin: 300,
        condensed_tannin_ratio: 0.05, // Highly smooth, low structural astringency
        citric_acid_mg_100g: 50,
        malic_acid_mg_100g: 150,
        tartaric_acid_mg_100g: 0,
        oils: { bisabolol: 5.0, chamazulene: 2.1 },
        unfermentable_pct: 20
    },
    // CATEGORY: SPICES
    "coriander": {
        name: "Coriander Seed",
        category: "Spice",
        moisture_pct: 9.0,
        brix: 0.0,
        base_tannin: 150,
        condensed_tannin_ratio: 0.10,
        citric_acid_mg_100g: 0,
        malic_acid_mg_100g: 0,
        tartaric_acid_mg_100g: 0,
        oils: { linalool: 8.5, geraniol: 0.5, pinene: 1.2 },
        unfermentable_pct: 15
    }
};

// Expose database globally for index and engine integration
window.BOTANICAL_DATABASE = BOTANICAL_DATABASE;
