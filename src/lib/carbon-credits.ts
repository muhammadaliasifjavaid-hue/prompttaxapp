// Mock carbon credit listings for the Offset Store

import type { CarbonCredit } from "./types";

export const CARBON_CREDITS: CarbonCredit[] = [
  {
    id: "cc-001",
    projectName: "Amazon Rainforest Protection Initiative",
    projectType: "REDD+ Forest Conservation",
    verificationStandard: "Verra VCS",
    vintage: 2024,
    region: "Brazil",
    pricePerTonUsd: 14.50,
    description:
      "Protects over 200,000 hectares of native Amazon rainforest from deforestation, preserving biodiversity and supporting indigenous communities.",
    availableTons: 50000,
  },
  {
    id: "cc-002",
    projectName: "Gujarat Solar Farm Expansion",
    projectType: "Renewable Energy",
    verificationStandard: "Gold Standard",
    vintage: 2024,
    region: "India",
    pricePerTonUsd: 8.75,
    description:
      "Expanding solar photovoltaic capacity in Gujarat state, displacing coal fired electricity generation and providing clean energy to rural communities.",
    availableTons: 120000,
  },
  {
    id: "cc-003",
    projectName: "Kenyan Cookstove Distribution Program",
    projectType: "Clean Cooking",
    verificationStandard: "Gold Standard",
    vintage: 2023,
    region: "Kenya",
    pricePerTonUsd: 12.00,
    description:
      "Distributes fuel efficient cookstoves to rural households, reducing wood fuel consumption by up to 60% and improving indoor air quality.",
    availableTons: 30000,
  },
  {
    id: "cc-004",
    projectName: "Scottish Peatland Restoration",
    projectType: "Wetland Restoration",
    verificationStandard: "Peatland Code",
    vintage: 2024,
    region: "United Kingdom",
    pricePerTonUsd: 22.00,
    description:
      "Restoring degraded peatlands in the Scottish Highlands, re wetting and revegetating areas to restore natural carbon sequestration capacity.",
    availableTons: 8000,
  },
  {
    id: "cc-005",
    projectName: "Texas Wind Power Collective",
    projectType: "Renewable Energy",
    verificationStandard: "American Carbon Registry",
    vintage: 2024,
    region: "United States",
    pricePerTonUsd: 10.25,
    description:
      "A collective of wind farms across West Texas generating clean electricity and displacing fossil fuel generation from the ERCOT grid.",
    availableTons: 75000,
  },
  {
    id: "cc-006",
    projectName: "Indonesian Mangrove Reforestation",
    projectType: "Blue Carbon",
    verificationStandard: "Verra VCS",
    vintage: 2023,
    region: "Indonesia",
    pricePerTonUsd: 18.50,
    description:
      "Planting and restoring mangrove forests along the coast of Sumatra, providing coastal protection and sequestering carbon at rates 3 to 5 times higher than terrestrial forests.",
    availableTons: 15000,
  },
];
