
"use strict";

/**
 * A BREWER'S LAB — Data Quality Auditor
 * Version: 1.0.0
 *
 * Read-only audit of the ingredient registry.
 * This module does not alter ingredient data or invent missing values.
 */
(function attachDataQualityAuditor(global) {
  const ALLOWED_EVIDENCE_LEVELS = new Set([
    "verified",
    "literature",
    "starter_estimate",
    "exploratory"
  ]);

  function isKnownNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  function auditIngredient(id, item) {
    const errors = [];
    const warnings = [];

    if (!item || typeof item !== "object") {
      return {
        id,
        valid: false,
        evidenceLevel: "unknown",
        sourceCount: 0,
        knownCompounds: 0,
        unknownCompounds: 0,
        errors: ["Ingredient record is missing or invalid."],
        warnings
      };
    }

    const evidence = item.evidence || {};
    const sources = Array.isArray(evidence.sources)
      ? evidence.sources
      : [];

    const compounds =
      item.compounds && typeof item.compounds === "object"
        ? item.compounds
        : {};

    if (!item.id || item.id !== id) {
      errors.push("Record ID is missing or does not match its registry key.");
    }

    if (!item.name) {
      errors.push("Ingredient name is missing.");
    }

    if (!item.scientificName) {
      warnings.push("Scientific name is missing.");
    }

    if (!ALLOWED_EVIDENCE_LEVELS.has(evidence.level)) {
      errors.push("Evidence level is missing or unrecognized.");
    }

    if (evidence.verified === true && evidence.level !== "verified") {
      errors.push(
        "Record is marked verified but its evidence level is not verified."
      );
    }

    if (
      (evidence.level === "verified" ||
        evidence.level === "literature") &&
      sources.length === 0
    ) {
      errors.push(
        "Verified or literature-level data must include traceable sources."
      );
    }

    if (sources.length === 0) {
      warnings.push("No sources are recorded for this ingredient.");
    }

    if (evidence.level === "starter_estimate") {
      warnings.push("Values are development estimates, not verified measurements.");
    }

    if (evidence.level === "exploratory") {
      warnings.push("Profile is exploratory and needs research.");
    }

    for (const field of ["moisturePct", "brix"]) {
      const value = item[field];

      if (!isKnownNumber(value)) {
        warnings.push(field + " is missing or not a numeric value.");
      } else if (value < 0 || value > 100) {
        errors.push(field + " must be between 0 and 100.");
      }
    }

    if (
      isKnownNumber(item.tanninIndex) &&
      item.tanninIndex < 0
    ) {
      errors.push("tanninIndex cannot be negative.");
    }

    if (
      isKnownNumber(item.condensedTanninRatio) &&
      (item.condensedTanninRatio < 0 ||
        item.condensedTanninRatio > 1)
    ) {
      errors.push("condensedTanninRatio must be between 0 and 1.");
    }

    const acids = item.acidsMgPer100g;

    if (!acids || typeof acids !== "object") {
      warnings.push("Acid profile is missing.");
    } else {
      for (const acid of ["citric", "malic", "tartaric"]) {
        const value = acids[acid];

        if (!isKnownNumber(value)) {
          warnings.push(acid + " acid concentration is unknown.");
        } else if (value < 0) {
          errors.push(acid + " acid concentration cannot be negative.");
        }
      }
    }

    if (!item.compounds || typeof item.compounds !== "object") {
      warnings.push("Aroma-compound profile is missing.");
    }

    let knownCompounds = 0;
    let unknownCompounds = 0;

    for (const [name, value] of Object.entries(compounds)) {
      if (value === null || value === undefined) {
        unknownCompounds++;
      } else if (isKnownNumber(value) && value >= 0) {
        knownCompounds++;
      } else {
        errors.push(
          "Compound " + name +
          " must be a non-negative number or null when unknown."
        );
      }
    }

    if (unknownCompounds > 0) {
      warnings.push(
        unknownCompounds +
        " aroma-compound value(s) are unknown; do not treat them as zero."
      );
    }

    return {
      id,
      name: item.name || id,
      valid: errors.length === 0,
      evidenceLevel: evidence.level || "unknown",
      sourceCount: sources.length,
      knownCompounds,
      unknownCompounds,
      errors,
      warnings
    };
  }

  function auditRegistry(registry) {
    const source = registry || {};
    const records = Object.entries(source).map(([id, item]) =>
      auditIngredient(id, item)
    );

    const evidenceCounts = {};
    for (const record of records) {
      const level = record.evidenceLevel;
      evidenceCounts[level] = (evidenceCounts[level] || 0) + 1;
    }

    const totalSources = records.reduce(
      (sum, record) => sum + record.sourceCount,
      0
    );

    const recordsWithSources = records.filter(
      record => record.sourceCount > 0
    ).length;

    const recordsWithErrors = records.filter(
      record => record.errors.length > 0
    ).length;

    const recordsWithWarnings = records.filter(
      record => record.warnings.length > 0
    ).length;

    const knownCompounds = records.reduce(
      (sum, record) => sum + record.knownCompounds,
      0
    );

    const unknownCompounds = records.reduce(
      (sum, record) => sum + record.unknownCompounds,
      0
    );

    return {
      auditVersion: "1.0.0",
      auditedAt: new Date().toISOString(),
      ingredientCount: records.length,
      recordsWithSources,
      sourceCoveragePct: records.length
        ? Math.round((recordsWithSources / records.length) * 100)
        : 0,
      totalSourceEntries: totalSources,
      recordsWithErrors,
      recordsWithWarnings,
      knownCompounds,
      unknownCompounds,
      evidenceCounts,
      records,
      predictionReadiness:
        records.length > 0 &&
        recordsWithErrors === 0 &&
        recordsWithSources === records.length &&
        records.every(record => record.evidenceLevel === "verified")
    };
  }

  function runAudit() {
    const registry = global.BOTANICAL_DATABASE;

    if (!registry || typeof registry !== "object") {
      return {
        auditVersion: "1.0.0",
        error: "BOTANICAL_DATABASE was not found. Load database.js first."
      };
    }

    const report = auditRegistry(registry);

    global.BREWING_DATA_AUDIT = report;

    if (typeof console !== "undefined") {
      console.info("A Brewer's Lab — Data Quality Audit", report);
      console.table(
        report.records.map(record => ({
          ingredient: record.name || record.id,
          evidence: record.evidenceLevel,
          sources: record.sourceCount,
          knownCompounds: record.knownCompounds,
          unknownCompounds: record.unknownCompounds,
          valid: record.valid,
          errors: record.errors.length,
          warnings: record.warnings.length
        }))
      );
    }

    return report;
  }

  global.BrewingDataQuality = {
    version: "1.0.0",
    auditIngredient,
    auditRegistry,
    runAudit
  };

  // Run immediately because the database must load first.
  runAudit();
})(window);
