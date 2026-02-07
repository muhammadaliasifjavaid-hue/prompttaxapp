import { motion } from "framer-motion";
import { FileText, Download, Share2, Image, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { useAppState } from "@/lib/app-state";
import { calculateImpact, formatImpactValue } from "@/lib/calculator";
import { REGION_COEFFICIENTS } from "@/lib/coefficients";
import { AI_CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import { useMemo } from "react";

export default function ReportsPage() {
  const { usage, region, hasOnboarded } = useAppState();

  const demoUsage = [
    { category: "chatbots" as const, minutesPerDay: 45 },
    { category: "ai_search" as const, minutesPerDay: 20 },
    { category: "ai_image_gen" as const, minutesPerDay: 10 },
    { category: "ai_video_gen" as const, minutesPerDay: 5 },
    { category: "ai_writing" as const, minutesPerDay: 15 },
  ];

  const activeUsage = hasOnboarded ? usage : demoUsage;
  const monthly = useMemo(() => calculateImpact(activeUsage, region, "monthly"), [activeUsage, region]);
  const annual = useMemo(() => calculateImpact(activeUsage, region, "annual"), [activeUsage, region]);
  const regionInfo = REGION_COEFFICIENTS.find((r) => r.regionCode === region);

  const handleExportCSV = () => {
    const headers = "Category,Minutes Per Day,Monthly CO2 (g),Monthly kWh,Monthly Water (L)\n";
    const rows = monthly.breakdown
      .map(
        (b) =>
          `${AI_CATEGORIES[b.category].label},${b.minutesUsed / 30},${b.co2Grams.toFixed(2)},${b.electricityKwh.toFixed(4)},${b.waterLiters.toFixed(2)}`
      )
      .join("\n");
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompttax-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const co2M = formatImpactValue(monthly.co2Grams, "g");
  const co2A = formatImpactValue(annual.co2Grams, "g");

  return (
    <Layout>
      <div className="container py-12 max-w-4xl space-y-8">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold">Impact Reports</h1>
          <p className="text-muted-foreground">
            Generate, download, and share your environmental impact data
          </p>
        </motion.div>

        {/* Report preview */}
        <div className="p-8 rounded-2xl glass space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">PromptTax Impact Report</h2>
              <p className="text-sm text-muted-foreground">
                Generated {new Date().toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCSV}>
                <FileSpreadsheet className="h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Monthly Impact</p>
              <p className="font-display text-2xl font-bold">{co2M.value} {co2M.unit}</p>
              <p className="text-xs text-muted-foreground">CO₂ emissions</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Annualized Projection</p>
              <p className="font-display text-2xl font-bold">{co2A.value} {co2A.unit}</p>
              <p className="text-xs text-muted-foreground">CO₂ emissions</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display font-semibold">Breakdown by Category</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Category</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Min/Day</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">CO₂/Month</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">kWh/Month</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.breakdown.map((b) => (
                    <tr key={b.category} className="border-b border-border/50">
                      <td className="py-2">{AI_CATEGORIES[b.category].label}</td>
                      <td className="text-right py-2">{(b.minutesUsed / 30).toFixed(0)}</td>
                      <td className="text-right py-2">{b.co2Grams.toFixed(1)}g</td>
                      <td className="text-right py-2">{b.electricityKwh.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/30">
            <h4 className="font-display font-semibold text-sm mb-2">Region &amp; Coefficients</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <span>Region: {regionInfo?.regionName}</span>
              <span>Grid Intensity: {regionInfo?.gridIntensityGCO2PerKwh} gCO₂/kWh</span>
              <span>PUE: {regionInfo?.pueMultiplier}</span>
              <span>Uncertainty: ±{monthly.uncertaintyPct}%</span>
            </div>
          </div>
        </div>

        {/* Share card */}
        <div className="p-6 rounded-2xl glass space-y-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            <h3 className="font-display font-semibold">Share Card</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate a shareable image card for social media showing your environmental impact summary.
          </p>
          <div className="aspect-video max-w-md rounded-xl gradient-primary p-6 flex flex-col justify-between text-white">
            <div>
              <p className="text-sm opacity-80">My AI Environmental Impact</p>
              <p className="font-display text-3xl font-bold mt-1">{co2M.value} {co2M.unit} CO₂</p>
              <p className="text-sm opacity-80">per month</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">{regionInfo?.regionName}</span>
              <span className="font-display font-bold text-sm">PromptTax</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Download Share Card
          </Button>
        </div>
      </div>
    </Layout>
  );
}
