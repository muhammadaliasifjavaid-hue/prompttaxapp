import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Monitor,
  Upload,
  PenLine,
  CheckCircle2,
  ArrowRight,
  Info,
  Shield,
  Clock,
  Wifi,
  WifiOff,
  FileJson,
  FileSpreadsheet,
  Chrome,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import { useAppState } from "@/lib/app-state";
import { AI_CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";
import { REGION_COEFFICIENTS } from "@/lib/coefficients";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import type { UsageEntry, AICategory } from "@/lib/types";

export default function ConnectPage() {
  const { setUsage, region, setRegion, setHasOnboarded, connections, setConnections } = useAppState();
  const navigate = useNavigate();
  const [manualValues, setManualValues] = useState<Record<AICategory, number>>(
    Object.fromEntries(CATEGORY_ORDER.map((c) => [c, 0])) as Record<AICategory, number>
  );

  const handleManualSubmit = () => {
    const entries: UsageEntry[] = CATEGORY_ORDER.map((cat) => ({
      category: cat,
      minutesPerDay: manualValues[cat] || 0,
    }));
    setUsage(entries);
    setHasOnboarded(true);
    setConnections(
      connections.map((c) =>
        c.type === "manual" ? { ...c, connected: true, lastSync: new Date().toISOString(), dataFreshness: "fresh" as const } : c
      )
    );
    navigate("/dashboard");
  };

  const handleFileUpload = (type: "ios" | "android") => {
    // Simulate a successful import with demo data
    const demoEntries: UsageEntry[] = [
      { category: "chatbots", minutesPerDay: 35 },
      { category: "ai_search", minutesPerDay: 18 },
      { category: "ai_image_gen", minutesPerDay: 8 },
      { category: "ai_video_gen", minutesPerDay: 3 },
      { category: "ai_writing", minutesPerDay: 12 },
    ];
    setUsage(demoEntries);
    setHasOnboarded(true);
    const connType = type === "ios" ? "ios_shortcuts" : "android_wellbeing";
    setConnections(
      connections.map((c) =>
        c.type === connType ? { ...c, connected: true, lastSync: new Date().toISOString(), dataFreshness: "fresh" as const } : c
      )
    );
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold">Connect Your AI Usage Data</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose how you want to provide your screen time data. Your privacy is our priority.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              Data stays on your device
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Takes under 2 minutes
            </div>
          </div>
        </motion.div>

        {/* Region selector */}
        <div className="mb-8 p-4 rounded-xl glass flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Your Region</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>Your region determines grid carbon intensity and environmental coefficients</TooltipContent>
            </Tooltip>
          </div>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REGION_COEFFICIENTS.map((r) => (
                <SelectItem key={r.regionCode} value={r.regionCode}>
                  {r.regionName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Connection status */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {connections.map((conn) => (
            <div
              key={conn.type}
              className={`p-3 rounded-xl text-center text-sm transition-all ${
                conn.connected
                  ? "glass border-primary/30 bg-primary/5"
                  : "glass-subtle"
              }`}
            >
              {conn.connected ? (
                <Wifi className="h-4 w-4 text-primary mx-auto mb-1" />
              ) : (
                <WifiOff className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              )}
              <p className="font-medium text-xs">{conn.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {conn.connected ? "Connected" : "Not connected"}
              </p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="manual" className="space-y-6">
          <TabsList className="glass w-full justify-start flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="manual" className="gap-1.5">
              <PenLine className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="ios" className="gap-1.5">
              <Smartphone className="h-4 w-4" />
              iOS Shortcuts
            </TabsTrigger>
            <TabsTrigger value="android" className="gap-1.5">
              <Smartphone className="h-4 w-4" />
              Android
            </TabsTrigger>
            <TabsTrigger value="extension" className="gap-1.5">
              <Monitor className="h-4 w-4" />
              Connected Mode
            </TabsTrigger>
          </TabsList>

          {/* Manual Entry */}
          <TabsContent value="manual">
            <motion.div
              className="p-6 rounded-2xl glass space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">Enter Your Daily AI Usage</h3>
                <p className="text-sm text-muted-foreground">
                  Estimate how many minutes per day you spend on each AI category.
                </p>
              </div>

              <div className="grid gap-4">
                {CATEGORY_ORDER.map((cat) => {
                  const info = AI_CATEGORIES[cat];
                  return (
                    <div key={cat} className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
                      <div className="flex-1">
                        <Label className="text-sm font-medium">{info.label}</Label>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={1440}
                          value={manualValues[cat]}
                          onChange={(e) =>
                            setManualValues({ ...manualValues, [cat]: parseInt(e.target.value) || 0 })
                          }
                          className="w-20 text-center"
                        />
                        <span className="text-xs text-muted-foreground w-12">min/day</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                className="gradient-primary text-white border-0 w-full h-11"
                onClick={handleManualSubmit}
              >
                Calculate My Impact
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </TabsContent>

          {/* iOS Shortcuts */}
          <TabsContent value="ios">
            <motion.div
              className="p-6 rounded-2xl glass space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">iOS Screen Time Import</h3>
                <p className="text-sm text-muted-foreground">
                  Use an iOS Shortcut to export your Screen Time data, then upload the JSON file here.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Download the PromptTax Shortcut</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tap below to add our Screen Time Export shortcut to your device. It reads your Screen Time
                      summary and creates a JSON file.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2 gap-1.5">
                      <Smartphone className="h-3.5 w-3.5" />
                      Get Shortcut
                    </Button>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Run the shortcut and save the file</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Open the Shortcuts app, run "PromptTax Export", and save the generated JSON to Files.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upload your export file</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Select the JSON file you saved to import your data.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 gap-1.5"
                      onClick={() => handleFileUpload("ios")}
                    >
                      <FileJson className="h-3.5 w-3.5" />
                      Upload JSON File
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Android */}
          <TabsContent value="android">
            <motion.div
              className="p-6 rounded-2xl glass space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">Android Digital Wellbeing Import</h3>
                <p className="text-sm text-muted-foreground">
                  Export your usage data from Android Digital Wellbeing and upload the CSV or JSON file.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Open Digital Wellbeing settings</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Go to Settings → Digital Wellbeing & Parental Controls on your Android device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Export your usage data</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use Google Takeout to export Digital Wellbeing data as CSV, or use a third party app
                      to export as JSON.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upload your export</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 gap-1.5"
                      onClick={() => handleFileUpload("android")}
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Upload CSV or JSON
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Browser Extension */}
          <TabsContent value="extension">
            <motion.div
              className="p-6 rounded-2xl glass space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">Connected Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Install the PromptTax browser extension to automatically track time spent on web based AI tools.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 flex items-center gap-4">
                <Chrome className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">PromptTax Extension for Chrome</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Automatically detects usage of ChatGPT, Claude, Midjourney, and other AI tools.
                  </p>
                  <p className="text-xs text-pt-amber mt-1">Coming soon. Use manual entry or device import for now.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <WifiOff className="h-3 w-3" /> Not installed
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Sync</span>
                  <span className="text-xs text-muted-foreground">N/A</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Data Freshness</span>
                  <span className="text-xs text-muted-foreground">N/A</span>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
