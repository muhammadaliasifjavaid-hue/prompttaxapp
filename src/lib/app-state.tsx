import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { UsageEntry, UserSettings, ConnectionStatus } from "@/lib/types";
import { CATEGORY_ORDER } from "@/lib/categories";

interface AppState {
  usage: UsageEntry[];
  setUsage: (usage: UsageEntry[]) => void;
  region: string;
  setRegion: (region: string) => void;
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  connections: ConnectionStatus[];
  setConnections: (connections: ConnectionStatus[]) => void;
  hasOnboarded: boolean;
  setHasOnboarded: (val: boolean) => void;
}

const defaultUsage: UsageEntry[] = CATEGORY_ORDER.map((cat) => ({
  category: cat,
  minutesPerDay: 0,
}));

const defaultSettings: UserSettings = {
  region: "US",
  notificationsEnabled: false,
};

const defaultConnections: ConnectionStatus[] = [
  { type: "manual", label: "Manual Entry", connected: false },
  { type: "ios_shortcuts", label: "iOS Shortcuts", connected: false },
  { type: "android_wellbeing", label: "Android Digital Wellbeing", connected: false },
  { type: "browser_extension", label: "Browser Extension", connected: false },
];

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState<UsageEntry[]>(defaultUsage);
  const [region, setRegion] = useState("US");
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [connections, setConnections] = useState<ConnectionStatus[]>(defaultConnections);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  return (
    <AppContext.Provider
      value={{
        usage,
        setUsage,
        region,
        setRegion,
        settings,
        setSettings,
        connections,
        setConnections,
        hasOnboarded,
        setHasOnboarded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppState must be used within AppProvider");
  return context;
}
