// Types for the PromptTax calculation engine

export type AICategory =
  | "chatbots"
  | "ai_search"
  | "ai_image_gen"
  | "ai_video_gen"
  | "ai_writing";

export interface CategoryInfo {
  id: AICategory;
  label: string;
  icon: string;
  description: string;
  avgWattsPerMinute: number; // Server-side power draw per active user-minute
}

export interface UsageEntry {
  category: AICategory;
  minutesPerDay: number;
}

export interface DailyUsage {
  date: string; // ISO date
  entries: UsageEntry[];
}

export interface RegionCoefficients {
  regionCode: string;
  regionName: string;
  country: string;
  gridIntensityGCO2PerKwh: number; // grams CO2 per kWh
  waterLitersPerKwh: number; // liters of water per kWh (cooling + generation)
  pm25FactorMgPerKwh: number; // mg PM2.5 per kWh
  so2FactorMgPerKwh: number; // mg SO2 per kWh
  noxFactorMgPerKwh: number; // mg NOx per kWh
  pueMultiplier: number; // Power Usage Effectiveness (datacenter overhead)
}

export interface ImpactResult {
  electricityKwh: number;
  co2Grams: number;
  waterLiters: number;
  pm25Mg: number;
  so2Mg: number;
  noxMg: number;
  period: "daily" | "weekly" | "monthly" | "annual";
  region: string;
  breakdown: CategoryImpact[];
  uncertaintyPct: number; // ±percentage uncertainty
}

export interface CategoryImpact {
  category: AICategory;
  minutesUsed: number;
  electricityKwh: number;
  co2Grams: number;
  waterLiters: number;
}

export interface ComparisonScenario {
  label: string;
  usage: UsageEntry[];
  region: string;
  result?: ImpactResult;
}

export interface CarbonCredit {
  id: string;
  projectName: string;
  projectType: string;
  verificationStandard: string;
  vintage: number;
  region: string;
  pricePerTonUsd: number;
  description: string;
  availableTons: number;
  imageUrl?: string;
}

export interface OffsetPurchase {
  id: string;
  creditId: string;
  tonsPurchased: number;
  totalCostUsd: number;
  purchaseDate: string;
  status: "simulated" | "pending" | "completed";
  periodCovered: string;
}

export interface UserProfile {
  id: string;
  email: string;
  region: string;
  usageHistory: DailyUsage[];
  purchases: OffsetPurchase[];
  settings: UserSettings;
  connections: ConnectionStatus[];
}

export interface UserSettings {
  region: string;
  budgetCo2GramsPerDay?: number;
  screenTimeCapMinutes?: Record<AICategory, number>;
  notificationsEnabled: boolean;
  reductionTargetPct?: number;
  reductionTargetDays?: number;
}

export interface ConnectionStatus {
  type: "manual" | "ios_shortcuts" | "android_wellbeing" | "browser_extension";
  label: string;
  connected: boolean;
  lastSync?: string;
  dataFreshness?: "fresh" | "stale" | "unknown";
}
