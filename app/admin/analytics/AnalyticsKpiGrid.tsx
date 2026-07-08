import {
  Download,
  MousePointerClick,
  Repeat,
  Smartphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { AnalyticsKpis } from "@/lib/analytics/admin-insights";
import { cn } from "@/lib/utils";

type AnalyticsKpiGridProps = {
  kpis: AnalyticsKpis;
  windowLabel: string;
};

const cards: {
  key: keyof AnalyticsKpis;
  label: string;
  icon: typeof Download;
  format: (k: AnalyticsKpis) => string;
  hint: (k: AnalyticsKpis) => string;
  accent: string;
}[] = [
  {
    key: "totalEvents",
    label: "Total events",
    icon: TrendingUp,
    format: (k) => k.totalEvents.toLocaleString(),
    hint: () => "All tracked interactions",
    accent: "from-primary/20 to-primary/5 border-primary/20",
  },
  {
    key: "downloadClicks",
    label: "APK downloads",
    icon: Download,
    format: (k) => k.downloadClicks.toLocaleString(),
    hint: (k) => `${k.mirrorClicks} mirror · ${k.ctaClicks} CTA`,
    accent: "from-accent/20 to-accent/5 border-accent/25",
  },
  {
    key: "firstTimeRate",
    label: "First-time clicks",
    icon: Sparkles,
    format: (k) => `${k.firstTimeRate}%`,
    hint: () => "Share marked as non-duplicate",
    accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/25",
  },
  {
    key: "mobileShare",
    label: "Mobile share",
    icon: Smartphone,
    format: (k) => `${k.mobileShare}%`,
    hint: (k) => `${100 - k.mobileShare}% desktop`,
    accent: "from-blue-500/20 to-blue-500/5 border-blue-500/25",
  },
  {
    key: "topGame",
    label: "Top game",
    icon: MousePointerClick,
    format: (k) => (k.topGame ? truncate(k.topGame, 18) : "—"),
    hint: (k) => (k.topGame ? `${k.topGameClicks} download clicks` : "No downloads yet"),
    accent: "from-violet-500/20 to-violet-500/5 border-violet-500/25",
  },
  {
    key: "filteredLogCount",
    label: "Log rows",
    icon: Repeat,
    format: (k) => k.filteredLogCount.toLocaleString(),
    hint: () => "Matching current filters (max 400)",
    accent: "from-orange-500/20 to-orange-500/5 border-orange-500/25",
  },
];

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

export function AnalyticsKpiGrid({ kpis, windowLabel }: AnalyticsKpiGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, icon: Icon, format, hint, accent }) => (
        <Card
          key={label}
          className={cn("overflow-hidden border bg-gradient-to-br", accent)}
        >
          <CardContent className="flex items-start gap-3 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/80 shadow-sm ring-1 ring-border/50">
              <Icon className="size-5 text-foreground/80" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="font-heading text-2xl font-bold tabular-nums tracking-tight text-foreground">
                {format(kpis)}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint(kpis)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <p className="col-span-full text-xs text-muted-foreground">{windowLabel}</p>
    </div>
  );
}
