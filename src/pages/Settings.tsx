import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Shield,
  Trash2,
  Target,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/Layout";
import { useAppState } from "@/lib/app-state";
import { REGION_COEFFICIENTS } from "@/lib/coefficients";
import { AI_CATEGORIES, CATEGORY_ORDER } from "@/lib/categories";

export default function SettingsPage() {
  const { region, setRegion, settings, setSettings, connections } = useAppState();

  return (
    <Layout>
      <div className="container py-12 max-w-2xl space-y-8">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-7 w-7" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your preferences, region, and integrations</p>
        </motion.div>

        {/* Region */}
        <section className="p-6 rounded-2xl glass space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold">Region</h2>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm flex-shrink-0">Your region</Label>
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
        </section>

        {/* Impact Budgets */}
        <section className="p-6 rounded-2xl glass space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-pt-violet" />
            <h2 className="font-display font-semibold">Impact Budget</h2>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm flex-shrink-0 w-40">Daily CO₂ budget (g)</Label>
            <Input
              type="number"
              min={0}
              value={settings.budgetCo2GramsPerDay ?? ""}
              placeholder="No limit set"
              onChange={(e) =>
                setSettings({
                  ...settings,
                  budgetCo2GramsPerDay: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-32"
            />
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Screen Time Caps</span>
            </div>
            {CATEGORY_ORDER.map((cat) => (
              <div key={cat} className="flex items-center gap-4">
                <Label className="text-sm flex-shrink-0 w-40">{AI_CATEGORIES[cat].label}</Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="No cap"
                  className="w-24"
                />
                <span className="text-xs text-muted-foreground">min/day</span>
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="p-6 rounded-2xl glass space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-pt-amber" />
            <h2 className="font-display font-semibold">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable notifications</p>
              <p className="text-xs text-muted-foreground">Get reminders when approaching your budget</p>
            </div>
            <Switch
              checked={settings.notificationsEnabled}
              onCheckedChange={(v) => setSettings({ ...settings, notificationsEnabled: v })}
            />
          </div>
        </section>

        {/* Connections */}
        <section className="p-6 rounded-2xl glass space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-pt-emerald" />
            <h2 className="font-display font-semibold">Connected Integrations</h2>
          </div>
          {connections.map((conn) => (
            <div key={conn.type} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{conn.label}</p>
                <p className="text-xs text-muted-foreground">
                  {conn.connected
                    ? `Connected · Last sync: ${conn.lastSync ? new Date(conn.lastSync).toLocaleDateString() : "N/A"}`
                    : "Not connected"}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  conn.connected
                    ? "bg-pt-emerald/10 text-pt-emerald"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {conn.connected ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </section>

        {/* Privacy */}
        <section className="p-6 rounded-2xl glass space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            <h2 className="font-display font-semibold">Privacy &amp; Data</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Your usage data is stored locally in your browser. No personal data is sent to external servers.
          </p>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive border-destructive/30">
            <Trash2 className="h-4 w-4" />
            Delete All My Data
          </Button>
        </section>
      </div>
    </Layout>
  );
}
