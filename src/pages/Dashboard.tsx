import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Wind,
  Droplets,
  Leaf,
  TrendingDown,
  TrendingUp,
  Calendar,
  SlidersHorizontal,
  BarChart3,
  Globe,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/Layout";
import { useAppState } from "@/lib/app-state";
import { calculateImpact, formatImpactValue, generateMockTimeSeries } from "@/lib/calculator";
import { AI_CATEGORIES, CATEGORY_ORDER, CATEGORY_COLORS } from "@/lib/categories";
import { REGION_COEFFICIENTS } from "@/lib/coefficients";
import type { UsageEntry, ImpactResult } from "@/lib/types";

// Demo usage for when user hasn't onboarded
const demoUsage: UsageEntry[] = [
  { category: "chatbots", minutesPerDay: 45 },
  { category: "ai_search", minutesPerDay: 20 },
  { category: "ai_image_gen", minutesPerDay: 10 },
  { category: "ai_video_gen", minutesPerDay: 5 },
  { category: "ai_writing", minutesPerDay: 15 },
];

type Period = "daily" | "weekly" | "monthly" | "annual";

export default function DashboardPage() {
  const { usage, region, hasOnboarded } = useAppState();
  const activeUsage = hasOnboarded ? usage : demoUsage;
  const [period, setPeriod] = useState<Period>("daily");
  const [simUsage, setSimUsage] = useState<UsageEntry[] | null>(null);
  const [compareRegion, setCompareRegion] = useState<string | null>(null);

  const impact = useMemo(
    () => calculateImpact(simUsage ?? activeUsage, region, period),
    [simUsage, activeUsage, region, period]
  );

  const compareImpact = useMemo(
    () => (compareRegion ? calculateImpact(simUsage ?? activeUsage, compareRegion, period) : null),
    [simUsage, activeUsage, compareRegion, period]
  );

  const timeSeries = useMemo(
    () => generateMockTimeSeries(activeUsage, region, 30),
    [activeUsage, region]
  );

  const co2F = formatImpactValue(impact.co2Grams, "g");
  const kwhF = formatImpactValue(impact.electricityKwh, "kWh");
  const waterF = formatImpactValue(impact.waterLiters, "L");
  const pm25F = formatImpactValue(impact.pm25Mg, "mg");

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">
              {hasOnboarded ? "Your Impact Dashboard" : "Demo Dashboard"}
            </h1>
            <p className="text-muted-foreground">
              {hasOnboarded
                ? "Real time environmental impact of your AI usage"
                : "Explore with sample data. Connect your data for personalized results."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
              <SelectTrigger className="w-36 glass">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            icon={Zap}
            label="Electricity"
            value={kwhF.value}
            unit={kwhF.unit}
            color="text-pt-amber"
            bgColor="bg-pt-amber/10"
          />
          <SummaryCard
            icon={Wind}
            label="CO₂ Emissions"
            value={co2F.value}
            unit={co2F.unit}
            color="text-pt-rose"
            bgColor="bg-pt-rose/10"
          />
          <SummaryCard
            icon={Droplets}
            label="Water Usage"
            value={waterF.value}
            unit={waterF.unit}
            color="text-pt-blue"
            bgColor="bg-pt-blue/10"
          />
          <SummaryCard
            icon={Leaf}
            label="PM2.5 Particulates"
            value={pm25F.value}
            unit={pm25F.unit}
            color="text-pt-emerald"
            bgColor="bg-pt-emerald/10"
          />
        </div>

        {/* Uncertainty disclosure */}
        <div className="px-4 py-3 rounded-xl glass-subtle text-sm text-muted-foreground flex items-center gap-2">
          <Globe className="h-4 w-4 flex-shrink-0" />
          <span>
            Region: {REGION_COEFFICIENTS.find((r) => r.regionCode === region)?.regionName ?? region}.
            All estimates carry a ±{impact.uncertaintyPct}% uncertainty range.{" "}
            <a href="/methodology" className="text-primary hover:underline">View methodology</a>
          </span>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="simulator">What If</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          {/* Trends */}
          <TabsContent value="trends" className="space-y-4">
            <div className="p-6 rounded-2xl glass">
              <h3 className="font-display font-semibold mb-4">CO₂ Emissions (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={timeSeries}>
                  <defs>
                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(152, 68%, 40%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(152, 68%, 40%)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
                    formatter={(v: number) => [`${v.toFixed(1)}g`, "CO₂"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="co2"
                    stroke="hsl(152, 68%, 40%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCo2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Breakdown */}
          <TabsContent value="breakdown" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl glass">
                <h3 className="font-display font-semibold mb-4">By Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impact.breakdown.filter((b) => b.co2Grams > 0)}
                      dataKey="co2Grams"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={3}
                      label={({ category }) => AI_CATEGORIES[category as keyof typeof AI_CATEGORIES]?.label ?? category}
                    >
                      {impact.breakdown.map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={CATEGORY_COLORS[entry.category]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => [`${v.toFixed(1)}g CO₂`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 rounded-2xl glass space-y-4">
                <h3 className="font-display font-semibold mb-2">Category Details</h3>
                {impact.breakdown.map((b) => {
                  const cat = AI_CATEGORIES[b.category];
                  const pct = impact.co2Grams > 0 ? (b.co2Grams / impact.co2Grams) * 100 : 0;
                  return (
                    <div key={b.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{cat.label}</span>
                        <span className="text-muted-foreground">
                          {b.co2Grams.toFixed(1)}g CO₂ ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[b.category] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          {/* What If Simulator */}
          <TabsContent value="simulator" className="space-y-4">
            <WhatIfSimulator
              baseUsage={activeUsage}
              region={region}
              period={period}
              onSimulate={setSimUsage}
            />
          </TabsContent>

          {/* Compare */}
          <TabsContent value="compare" className="space-y-4">
            <div className="p-6 rounded-2xl glass space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-display font-semibold">Region Comparison</h3>
                <Select value={compareRegion ?? ""} onValueChange={setCompareRegion}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select region to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGION_COEFFICIENTS.filter((r) => r.regionCode !== region).map((r) => (
                      <SelectItem key={r.regionCode} value={r.regionCode}>
                        {r.regionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {compareImpact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ComparisonCard
                    label={REGION_COEFFICIENTS.find((r) => r.regionCode === region)?.regionName ?? region}
                    impact={impact}
                  />
                  <ComparisonCard
                    label={REGION_COEFFICIENTS.find((r) => r.regionCode === compareRegion)?.regionName ?? compareRegion!}
                    impact={compareImpact}
                  />
                </div>
              )}
              {!compareRegion && (
                <p className="text-center text-muted-foreground py-8">
                  Select a region above to compare environmental impact
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  bgColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  color: string;
  bgColor: string;
}) {
  return (
    <motion.div
      className="p-5 rounded-2xl glass hover:shadow-lg transition-all group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bgColor} mb-3`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </motion.div>
  );
}

function ComparisonCard({
  label,
  impact,
}: {
  label: string;
  impact: ImpactResult;
}) {
  const co2 = formatImpactValue(impact.co2Grams, "g");
  const kwh = formatImpactValue(impact.electricityKwh, "kWh");
  const water = formatImpactValue(impact.waterLiters, "L");
  return (
    <div className="p-5 rounded-xl bg-muted/50 space-y-3">
      <h4 className="font-display font-semibold">{label}</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">CO₂</span>
          <span className="font-medium">{co2.value} {co2.unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Electricity</span>
          <span className="font-medium">{kwh.value} {kwh.unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Water</span>
          <span className="font-medium">{water.value} {water.unit}</span>
        </div>
      </div>
    </div>
  );
}

function WhatIfSimulator({
  baseUsage,
  region,
  period,
  onSimulate,
}: {
  baseUsage: UsageEntry[];
  region: string;
  period: Period;
  onSimulate: (usage: UsageEntry[] | null) => void;
}) {
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const simUsage = baseUsage.map((e) => ({
    ...e,
    minutesPerDay: Math.max(0, e.minutesPerDay * (1 + (adjustments[e.category] ?? 0) / 100)),
  }));

  const baseImpact = calculateImpact(baseUsage, region, period);
  const simImpact = calculateImpact(simUsage, region, period);
  const diff = simImpact.co2Grams - baseImpact.co2Grams;
  const diffPct = baseImpact.co2Grams > 0 ? (diff / baseImpact.co2Grams) * 100 : 0;

  const handleSlider = (category: string, value: number[]) => {
    const newAdj = { ...adjustments, [category]: value[0] };
    setAdjustments(newAdj);
    const newUsage = baseUsage.map((e) => ({
      ...e,
      minutesPerDay: Math.max(0, e.minutesPerDay * (1 + (newAdj[e.category] ?? 0) / 100)),
    }));
    onSimulate(newUsage);
  };

  return (
    <div className="p-6 rounded-2xl glass space-y-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold">What If Simulator</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Adjust usage by category to see how changes affect your impact. Drag left to reduce, right to increase.
      </p>

      <div className="space-y-5">
        {CATEGORY_ORDER.map((cat) => {
          const info = AI_CATEGORIES[cat];
          const adj = adjustments[cat] ?? 0;
          return (
            <div key={cat} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{info.label}</span>
                <span className={adj < 0 ? "text-pt-emerald" : adj > 0 ? "text-pt-rose" : "text-muted-foreground"}>
                  {adj > 0 ? "+" : ""}{adj}%
                </span>
              </div>
              <Slider
                value={[adj]}
                onValueChange={(v) => handleSlider(cat, v)}
                min={-100}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
        <span className="text-sm font-medium">Projected Change</span>
        <div className="flex items-center gap-2">
          {diff < 0 ? (
            <TrendingDown className="h-4 w-4 text-pt-emerald" />
          ) : diff > 0 ? (
            <TrendingUp className="h-4 w-4 text-pt-rose" />
          ) : null}
          <span className={`font-display font-bold ${diff < 0 ? "text-pt-emerald" : diff > 0 ? "text-pt-rose" : ""}`}>
            {diffPct > 0 ? "+" : ""}{diffPct.toFixed(1)}% CO₂
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setAdjustments({});
          onSimulate(null);
        }}
      >
        Reset Simulator
      </Button>
    </div>
  );
}
