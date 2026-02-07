// Deterministic calculation engine for environmental impact
// No LLM usage — all computations are formula-based using stored coefficients

import type {
  UsageEntry,
  RegionCoefficients,
  ImpactResult,
  CategoryImpact,
} from "./types";
import { AI_CATEGORIES } from "./categories";
import { getRegion } from "./coefficients";

const UNCERTAINTY_PCT = 35; // ±35% uncertainty range

/**
 * Calculate the environmental impact for a set of usage entries and a region
 * @param entries Array of usage entries (category + minutes per day)
 * @param regionCode Region code for grid intensity lookup
 * @param period Aggregation period
 * @returns Computed impact result
 */
export function calculateImpact(
  entries: UsageEntry[],
  regionCode: string,
  period: "daily" | "weekly" | "monthly" | "annual" = "daily"
): ImpactResult {
  const region = getRegion(regionCode);
  if (!region) {
    throw new Error(`Unknown region: ${regionCode}`);
  }

  const multiplier = getPeriodMultiplier(period);
  const breakdown: CategoryImpact[] = [];

  let totalKwh = 0;
  let totalCO2 = 0;
  let totalWater = 0;

  for (const entry of entries) {
    const categoryInfo = AI_CATEGORIES[entry.category];
    if (!categoryInfo) continue;

    // Calculate daily electricity: watts * minutes * 60s / 1000 / 3600 = kWh
    // Simplified: (watts * minutes) / 60000 = kWh
    const dailyKwh =
      (categoryInfo.avgWattsPerMinute * entry.minutesPerDay * region.pueMultiplier) / 60;

    const periodKwh = dailyKwh * multiplier;
    const periodCO2 = periodKwh * region.gridIntensityGCO2PerKwh;
    const periodWater = periodKwh * region.waterLitersPerKwh;

    breakdown.push({
      category: entry.category,
      minutesUsed: entry.minutesPerDay * multiplier,
      electricityKwh: periodKwh,
      co2Grams: periodCO2,
      waterLiters: periodWater,
    });

    totalKwh += periodKwh;
    totalCO2 += periodCO2;
    totalWater += periodWater;
  }

  return {
    electricityKwh: totalKwh,
    co2Grams: totalCO2,
    waterLiters: totalWater,
    pm25Mg: totalKwh * region.pm25FactorMgPerKwh,
    so2Mg: totalKwh * region.so2FactorMgPerKwh,
    noxMg: totalKwh * region.noxFactorMgPerKwh,
    period,
    region: regionCode,
    breakdown,
    uncertaintyPct: UNCERTAINTY_PCT,
  };
}

function getPeriodMultiplier(
  period: "daily" | "weekly" | "monthly" | "annual"
): number {
  switch (period) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30;
    case "annual":
      return 365;
  }
}

/**
 * Calculate how many tons CO2 need to be offset for a given impact
 */
export function calculateOffsetTons(co2Grams: number): number {
  return co2Grams / 1_000_000; // grams to metric tons
}

/**
 * Format a large number with appropriate units
 */
export function formatImpactValue(
  value: number,
  unit: "g" | "kg" | "L" | "mg" | "kWh"
): { value: string; unit: string } {
  if (unit === "g") {
    if (value >= 1_000_000) return { value: (value / 1_000_000).toFixed(2), unit: "t" };
    if (value >= 1_000) return { value: (value / 1_000).toFixed(1), unit: "kg" };
    return { value: value.toFixed(1), unit: "g" };
  }
  if (unit === "mg") {
    if (value >= 1_000_000) return { value: (value / 1_000_000).toFixed(2), unit: "kg" };
    if (value >= 1_000) return { value: (value / 1_000).toFixed(1), unit: "g" };
    return { value: value.toFixed(1), unit: "mg" };
  }
  if (unit === "L") {
    if (value >= 1_000) return { value: (value / 1_000).toFixed(1), unit: "kL" };
    return { value: value.toFixed(1), unit: "L" };
  }
  if (unit === "kWh") {
    if (value >= 1_000) return { value: (value / 1_000).toFixed(2), unit: "MWh" };
    return { value: value.toFixed(3), unit: "kWh" };
  }
  return { value: value.toFixed(2), unit };
}

/**
 * Generate mock time series data for demo purposes
 */
export function generateMockTimeSeries(
  entries: UsageEntry[],
  regionCode: string,
  days: number = 30
): { date: string; co2: number; kwh: number; water: number }[] {
  const data: { date: string; co2: number; kwh: number; water: number }[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Add some realistic variance (±20%)
    const variance = 0.8 + Math.random() * 0.4;
    const variedEntries = entries.map((e) => ({
      ...e,
      minutesPerDay: e.minutesPerDay * variance,
    }));

    const result = calculateImpact(variedEntries, regionCode, "daily");

    data.push({
      date: date.toISOString().split("T")[0],
      co2: Math.round(result.co2Grams * 100) / 100,
      kwh: Math.round(result.electricityKwh * 10000) / 10000,
      water: Math.round(result.waterLiters * 100) / 100,
    });
  }

  return data;
}
