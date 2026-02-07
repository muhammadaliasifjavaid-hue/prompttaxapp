import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  TreePine,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { useAppState } from "@/lib/app-state";
import { calculateImpact, calculateOffsetTons, formatImpactValue } from "@/lib/calculator";
import { CARBON_CREDITS } from "@/lib/carbon-credits";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function StorePage() {
  const { usage, region, hasOnboarded } = useAppState();
  const [offsetPeriod, setOffsetPeriod] = useState<"weekly" | "monthly" | "annual">("monthly");
  const [selectedCredit, setSelectedCredit] = useState<string | null>(null);

  const demoUsage = [
    { category: "chatbots" as const, minutesPerDay: 45 },
    { category: "ai_search" as const, minutesPerDay: 20 },
    { category: "ai_image_gen" as const, minutesPerDay: 10 },
    { category: "ai_video_gen" as const, minutesPerDay: 5 },
    { category: "ai_writing" as const, minutesPerDay: 15 },
  ];

  const activeUsage = hasOnboarded ? usage : demoUsage;
  const impact = useMemo(
    () => calculateImpact(activeUsage, region, offsetPeriod),
    [activeUsage, region, offsetPeriod]
  );
  const tonsNeeded = calculateOffsetTons(impact.co2Grams);
  const co2F = formatImpactValue(impact.co2Grams, "g");

  const selected = CARBON_CREDITS.find((c) => c.id === selectedCredit);
  const totalCost = selected ? tonsNeeded * selected.pricePerTonUsd : 0;

  return (
    <Layout>
      <div className="container py-12 space-y-8">
        <motion.div className="space-y-2" {...fadeIn}>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Offset Store</h1>
          <p className="text-muted-foreground">
            Purchase carbon credits to offset your computed AI emissions
          </p>
        </motion.div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl glass-subtle border-pt-amber/30 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-pt-amber flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Purchase Simulation Mode</p>
            <p className="text-muted-foreground">
              This store is in simulation mode. Purchases are recorded locally and do not result in actual carbon credit retirement.
              Credits listed are based on real project types and pricing but are for demonstration purposes.
            </p>
          </div>
        </div>

        {/* Your emissions summary */}
        <div className="p-6 rounded-2xl glass space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold">Your Emissions to Offset</h3>
              <p className="text-sm text-muted-foreground">Based on your current usage data</p>
            </div>
            <Select value={offsetPeriod} onValueChange={(v) => setOffsetPeriod(v as typeof offsetPeriod)}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Last 7 days</SelectItem>
                <SelectItem value="monthly">Last 30 days</SelectItem>
                <SelectItem value="annual">Full year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold">{co2F.value}</span>
            <span className="text-lg text-muted-foreground">{co2F.unit} CO₂</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {tonsNeeded < 0.001
              ? "Less than 0.001 metric tons"
              : `${tonsNeeded.toFixed(4)} metric tons`}{" "}
            to fully offset
          </p>
        </div>

        {/* Credit listings */}
        <div className="space-y-4">
          <h3 className="font-display text-xl font-semibold">Available Carbon Credits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CARBON_CREDITS.map((credit) => {
              const isSelected = selectedCredit === credit.id;
              const costForThis = tonsNeeded * credit.pricePerTonUsd;
              return (
                <motion.div
                  key={credit.id}
                  className={`p-5 rounded-2xl glass cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedCredit(credit.id)}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {credit.projectType}
                    </Badge>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                  <h4 className="font-display font-semibold mb-2">{credit.projectName}</h4>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{credit.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-3.5 w-3.5" />
                      {credit.verificationStandard}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {credit.region}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      Vintage {credit.vintage}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="font-display text-lg font-bold">${credit.pricePerTonUsd.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground"> / ton</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ${costForThis < 0.01 ? "<0.01" : costForThis.toFixed(2)} to offset
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Checkout */}
        {selected && (
          <motion.div
            className="p-6 rounded-2xl glass space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-display font-semibold text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credit</span>
                <span className="font-medium">{selected.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tons to offset</span>
                <span className="font-medium">{tonsNeeded.toFixed(4)} t</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per ton</span>
                <span className="font-medium">${selected.pricePerTonUsd.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-semibold">Total</span>
                <span className="font-display font-bold text-lg">
                  ${totalCost < 0.01 ? "<0.01" : totalCost.toFixed(2)}
                </span>
              </div>
            </div>
            <Button className="gradient-primary text-white border-0 w-full h-11">
              <DollarSign className="h-4 w-4 mr-2" />
              Purchase (Simulation)
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This is a simulated purchase. No real payment will be processed.
            </p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
