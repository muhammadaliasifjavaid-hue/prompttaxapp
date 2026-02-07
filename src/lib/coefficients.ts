// Regional grid intensity and environmental coefficients
// Sources: IEA, EPA, EU emission factors, published utility data
// All values are approximate and for educational/demonstration purposes

import type { RegionCoefficients } from "./types";

export const REGION_COEFFICIENTS: RegionCoefficients[] = [
  {
    regionCode: "US",
    regionName: "United States (Average)",
    country: "United States",
    gridIntensityGCO2PerKwh: 390,
    waterLitersPerKwh: 2.2,
    pm25FactorMgPerKwh: 18,
    so2FactorMgPerKwh: 420,
    noxFactorMgPerKwh: 320,
    pueMultiplier: 1.2,
  },
  {
    regionCode: "US-CA",
    regionName: "California",
    country: "United States",
    gridIntensityGCO2PerKwh: 210,
    waterLitersPerKwh: 1.8,
    pm25FactorMgPerKwh: 10,
    so2FactorMgPerKwh: 180,
    noxFactorMgPerKwh: 200,
    pueMultiplier: 1.15,
  },
  {
    regionCode: "US-TX",
    regionName: "Texas",
    country: "United States",
    gridIntensityGCO2PerKwh: 420,
    waterLitersPerKwh: 2.5,
    pm25FactorMgPerKwh: 22,
    so2FactorMgPerKwh: 500,
    noxFactorMgPerKwh: 380,
    pueMultiplier: 1.25,
  },
  {
    regionCode: "GB",
    regionName: "United Kingdom",
    country: "United Kingdom",
    gridIntensityGCO2PerKwh: 230,
    waterLitersPerKwh: 1.5,
    pm25FactorMgPerKwh: 8,
    so2FactorMgPerKwh: 200,
    noxFactorMgPerKwh: 220,
    pueMultiplier: 1.18,
  },
  {
    regionCode: "DE",
    regionName: "Germany",
    country: "Germany",
    gridIntensityGCO2PerKwh: 350,
    waterLitersPerKwh: 1.8,
    pm25FactorMgPerKwh: 14,
    so2FactorMgPerKwh: 300,
    noxFactorMgPerKwh: 280,
    pueMultiplier: 1.2,
  },
  {
    regionCode: "FR",
    regionName: "France",
    country: "France",
    gridIntensityGCO2PerKwh: 55,
    waterLitersPerKwh: 3.0,
    pm25FactorMgPerKwh: 3,
    so2FactorMgPerKwh: 80,
    noxFactorMgPerKwh: 90,
    pueMultiplier: 1.15,
  },
  {
    regionCode: "IN",
    regionName: "India",
    country: "India",
    gridIntensityGCO2PerKwh: 710,
    waterLitersPerKwh: 3.5,
    pm25FactorMgPerKwh: 45,
    so2FactorMgPerKwh: 900,
    noxFactorMgPerKwh: 650,
    pueMultiplier: 1.35,
  },
  {
    regionCode: "CN",
    regionName: "China",
    country: "China",
    gridIntensityGCO2PerKwh: 580,
    waterLitersPerKwh: 2.8,
    pm25FactorMgPerKwh: 38,
    so2FactorMgPerKwh: 750,
    noxFactorMgPerKwh: 520,
    pueMultiplier: 1.3,
  },
  {
    regionCode: "JP",
    regionName: "Japan",
    country: "Japan",
    gridIntensityGCO2PerKwh: 470,
    waterLitersPerKwh: 2.0,
    pm25FactorMgPerKwh: 15,
    so2FactorMgPerKwh: 350,
    noxFactorMgPerKwh: 300,
    pueMultiplier: 1.2,
  },
  {
    regionCode: "BR",
    regionName: "Brazil",
    country: "Brazil",
    gridIntensityGCO2PerKwh: 75,
    waterLitersPerKwh: 4.0,
    pm25FactorMgPerKwh: 5,
    so2FactorMgPerKwh: 100,
    noxFactorMgPerKwh: 120,
    pueMultiplier: 1.25,
  },
  {
    regionCode: "AU",
    regionName: "Australia",
    country: "Australia",
    gridIntensityGCO2PerKwh: 620,
    waterLitersPerKwh: 2.6,
    pm25FactorMgPerKwh: 28,
    so2FactorMgPerKwh: 600,
    noxFactorMgPerKwh: 450,
    pueMultiplier: 1.22,
  },
  {
    regionCode: "SE",
    regionName: "Sweden",
    country: "Sweden",
    gridIntensityGCO2PerKwh: 12,
    waterLitersPerKwh: 1.2,
    pm25FactorMgPerKwh: 1,
    so2FactorMgPerKwh: 15,
    noxFactorMgPerKwh: 25,
    pueMultiplier: 1.1,
  },
  {
    regionCode: "NO",
    regionName: "Norway",
    country: "Norway",
    gridIntensityGCO2PerKwh: 8,
    waterLitersPerKwh: 1.0,
    pm25FactorMgPerKwh: 0.5,
    so2FactorMgPerKwh: 10,
    noxFactorMgPerKwh: 18,
    pueMultiplier: 1.08,
  },
];

export function getRegion(regionCode: string): RegionCoefficients | undefined {
  return REGION_COEFFICIENTS.find((r) => r.regionCode === regionCode);
}

export function getRegionsByCountry(): Record<string, RegionCoefficients[]> {
  const map: Record<string, RegionCoefficients[]> = {};
  for (const r of REGION_COEFFICIENTS) {
    if (!map[r.country]) map[r.country] = [];
    map[r.country].push(r);
  }
  return map;
}
