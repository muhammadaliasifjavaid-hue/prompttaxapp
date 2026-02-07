import { motion } from "framer-motion";
import {
  BookOpen,
  Cpu,
  Globe,
  Droplets,
  Wind,
  Zap,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { AI_CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import { REGION_COEFFICIENTS } from "@/lib/coefficients";

export default function MethodologyPage() {
  return (
    <Layout>
      <div className="container py-12 max-w-3xl space-y-12">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Methodology</h1>
          </div>
          <p className="text-muted-foreground">
            PromptTax uses a deterministic, formula based calculation engine. No AI or machine learning is used
            in any estimation. All computations are transparent, reproducible, and based on publicly available data.
          </p>
        </motion.div>

        {/* Model overview */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            Calculation Model
          </h2>
          <div className="p-5 rounded-xl glass space-y-3 text-sm">
            <p>The impact of a user's AI usage is calculated as follows:</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                <strong className="text-foreground">Power estimation:</strong> Each AI category has an estimated average server side
                power draw per user minute (in kW), derived from published datacenter workload analyses.
              </li>
              <li>
                <strong className="text-foreground">Electricity consumption:</strong> Power (kW) × Time (hours) × PUE multiplier = kWh.
                The PUE (Power Usage Effectiveness) accounts for cooling, networking, and other datacenter overhead.
              </li>
              <li>
                <strong className="text-foreground">Carbon emissions:</strong> kWh × Grid Intensity (gCO₂/kWh) = grams of CO₂.
                Grid intensity varies by region and reflects the local electricity generation mix.
              </li>
              <li>
                <strong className="text-foreground">Water usage:</strong> kWh × Water Intensity (L/kWh) = liters.
                This includes cooling water for both the datacenter and upstream power generation.
              </li>
              <li>
                <strong className="text-foreground">Air pollutants:</strong> kWh × Pollutant Factor (mg/kWh) for PM2.5, SO₂, and NOx.
              </li>
            </ol>
          </div>
        </section>

        {/* Category power estimates */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-pt-amber" />
            Power Consumption Estimates
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Avg kW per Minute</th>
                  <th className="text-left py-2 pl-4 font-medium text-muted-foreground">Notes</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_ORDER.map((cat) => {
                  const info = AI_CATEGORIES[cat];
                  return (
                    <tr key={cat} className="border-b border-border/50">
                      <td className="py-2 font-medium">{info.label}</td>
                      <td className="text-right py-2">{info.avgWattsPerMinute} kW</td>
                      <td className="py-2 pl-4 text-muted-foreground">{info.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Regional coefficients */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-pt-blue" />
            Regional Coefficients
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-medium text-muted-foreground">Region</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">gCO₂/kWh</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">L/kWh</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">PUE</th>
                </tr>
              </thead>
              <tbody>
                {REGION_COEFFICIENTS.map((r) => (
                  <tr key={r.regionCode} className="border-b border-border/50">
                    <td className="py-2 font-medium">{r.regionName}</td>
                    <td className="text-right py-2">{r.gridIntensityGCO2PerKwh}</td>
                    <td className="text-right py-2">{r.waterLitersPerKwh}</td>
                    <td className="text-right py-2">{r.pueMultiplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Uncertainty */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-pt-amber" />
            Uncertainty &amp; Limitations
          </h2>
          <div className="p-5 rounded-xl glass space-y-3 text-sm text-muted-foreground">
            <p>
              All estimates carry a <strong className="text-foreground">±35% uncertainty range</strong>.
              Key sources of uncertainty include:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Actual server hardware and efficiency varies between AI providers</li>
              <li>Datacenter PUE values are averages and vary by facility</li>
              <li>Grid intensity changes hourly based on generation mix; we use annual averages</li>
              <li>User reported screen time may not perfectly reflect active AI inference time</li>
              <li>Water usage coefficients include both direct cooling and upstream power generation</li>
            </ul>
            <p>
              These estimates are designed for awareness and education. They should not be used
              for regulatory compliance, carbon accounting, or offset verification without independent validation.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
