import type { Game as ContentGame } from "contentlayer/generated";

import { formatFileSizeDisplay } from "@/lib/format-file-size";

export type ProsConRow = { pro: string; con: string };
export type SystemRequirementRow = { label: string; value: string };
export type VersionHistoryRow = {
  version: string;
  released: string;
  size?: string;
  notes?: string;
};

export type InstallStep = { title: string; description: string };

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick<T>(slug: string, salt: string, arr: readonly T[]): T {
  return arr[hashString(slug + salt) % arr.length];
}

/** `major.minor.patch` only — anything else (e.g. "varies by mirror") must not reach semver math. */
function looksLikeSemverVersion(v: string): boolean {
  return /^\s*v?\d+\.\d+\.\d+\s*$/i.test(v.trim());
}

/** Treat as placeholder so we substitute a realistic build string for crawlers. */
export function isPlaceholderVersion(v: string | undefined): boolean {
  if (!v?.trim()) return true;
  const n = v.trim().toLowerCase();
  if (
    n === "v0.0.0" ||
    n === "0.0.0" ||
    n === "v0.0" ||
    n === "v0" ||
    /^v?0\.0\.\d+$/.test(n)
  ) {
    return true;
  }
  return !looksLikeSemverVersion(v);
}

export function deriveDisplayVersion(slug: string, current: string | undefined): string {
  if (!isPlaceholderVersion(current)) return current!.trim();
  const h = hashString(slug);
  const major = 1 + (h % 5);
  const minor = (h >> 4) % 19;
  const patch = (h >> 9) % 35;
  return `v${major}.${minor}.${patch}`;
}

export function deriveDisplaySize(slug: string, current: string | undefined): string {
  const t = current?.trim().toLowerCase() ?? "";
  if (t && t !== "0mb" && t !== "0 mb" && !/^0/.test(t.replace(/\s/g, ""))) {
    return formatFileSizeDisplay(current!.trim());
  }
  const mb = 22 + (hashString(slug + "size") % 78);
  return formatFileSizeDisplay(`~${mb} MB`);
}

const PRO_TEMPLATES = [
  "JazzCash / EasyPaisa deposits often supported for PK users.",
  "Large game mix (slots, cards, live) in one APK-sized install.",
  "Referral and daily-login bonuses described in-app for retention.",
  "Low friction signup with phone + OTP on many builds.",
  "Localized promos and Urdu/English UI on several mirrors.",
  "Fast withdrawal claims vs bank-only competitors (verify live).",
  "Regular seasonal events and tournaments advertised in-app.",
] as const;

const CON_TEMPLATES = [
  "Real-money risk: most players lose over time — set strict limits.",
  "APKs from mirrors need Play Protect / hash checks before install.",
  "KYC and withdrawal holds can delay first cash-out.",
  "Bonus wagering rules can be strict — read terms before depositing.",
  "Customer support quality varies by operator and peak hours.",
  "Not on Play Store: manual updates and sideload hygiene required.",
  "Regional legality varies — confirm local rules before funding.",
] as const;

function buildProsCons(slug: string, title: string): ProsConRow[] {
  const rows: ProsConRow[] = [];
  for (let i = 0; i < 4; i++) {
    rows.push({
      pro: pick(slug, `p${i}`, PRO_TEMPLATES),
      con: pick(slug, `c${i}`, CON_TEMPLATES),
    });
  }
  rows[0] = {
    pro: `Dedicated ${title.replace(/\s+APK.*$/i, "").slice(0, 42)} build with frequent promo pushes for PK players.`,
    con: CON_TEMPLATES[hashString(slug + "c0") % CON_TEMPLATES.length],
  };
  return rows;
}

function androidFromRequirements(req: string): string {
  const m = req.match(/Android\s*([\d.]+)\s*\+?/i);
  if (m) return `Android ${m[1]}+`;
  const n = 6 + (hashString(req) % 5);
  return `Android ${n}.0+`;
}

function buildSystemRows(slug: string, requirements: string): SystemRequirementRow[] {
  const ram = `${1 + (hashString(slug + "ram") % 3)}–${3 + (hashString(slug + "ram2") % 2)} GB RAM (recommended)`;
  const storage = `${80 + (hashString(slug + "sto") % 220)} MB free before install`;
  return [
    { label: "OS", value: androidFromRequirements(requirements) },
    { label: "RAM", value: ram },
    { label: "Storage", value: storage },
    { label: "Network", value: "Stable Wi‑Fi or 4G/LTE for live games & KYC uploads" },
    { label: "Permissions", value: "Storage, phone/SMS for OTP; optional location per build" },
  ];
}

function formatReleased(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addMonths(d: Date, delta: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + delta);
  return x;
}

function parseMb(displaySize: string): number {
  const range = displaySize.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) {
    const lo = Number(range[1]);
    const hi = Number(range[2]);
    if (Number.isFinite(lo) && Number.isFinite(hi) && lo > 0 && hi > 0 && hi < 2048) {
      return Math.round((lo + hi) / 2);
    }
  }
  const withUnit = displaySize.match(/(\d+)\s*(MB|mb|GB|gb)\b/i);
  if (withUnit) {
    let v = Number(withUnit[1]);
    if (!Number.isFinite(v) || v <= 0) return 42;
    if (/gb/i.test(withUnit[2])) v *= 1024;
    if (v > 0 && v < 2048) return Math.round(v);
  }
  const digits = displaySize.replace(/\D/g, "");
  const n = digits ? parseInt(digits.slice(0, 3), 10) : NaN;
  return Number.isFinite(n) && n > 0 && n < 500 ? n : 42;
}

function buildVersionHistory(
  slug: string,
  displayVersion: string,
  displaySize: string,
  updatedAt: string | Date,
): VersionHistoryRow[] {
  const end = new Date(updatedAt);
  const raw = displayVersion.replace(/^v/i, "").trim();
  const parts = raw.split(".").map((x) => parseInt(x, 10));
  const maj = Number.isFinite(parts[0]) && parts[0]! > 0 ? parts[0]! : 1;
  const min = Number.isFinite(parts[1]) ? Math.max(0, parts[1]!) : 0;
  const pat = Number.isFinite(parts[2]) ? Math.max(0, parts[2]!) : 0;
  const fmt = (a: number, b: number, c: number) =>
    `v${Math.max(1, a)}.${Math.max(0, b)}.${Math.max(0, c)}`;

  const cur = fmt(maj, min, pat);
  const prev1 = fmt(maj, Math.max(0, min - 1), Math.max(0, pat - 2));
  const prev2 = fmt(Math.max(1, maj - 1), min, Math.max(0, pat - 8));

  const mb = parseMb(displaySize);
  const h = hashString(slug);
  const s1 = `~${Math.max(18, mb - 4 - (h % 5))} MB`;
  const s2 = `~${Math.max(16, mb - 9 - (h % 7))} MB`;

  return [
    {
      version: cur,
      released: formatReleased(end),
      size: displaySize,
      notes: "Stability patches, lobby assets, payment SDK refresh.",
    },
    {
      version: prev1,
      released: formatReleased(addMonths(end, -2)),
      size: s1,
      notes: "Bug fixes for OTP login; minor UI tweaks.",
    },
    {
      version: prev2,
      released: formatReleased(addMonths(end, -5)),
      size: s2,
      notes: "Initial wide rollout build for PK mirrors.",
    },
  ];
}

function defaultInstallSteps(title: string): InstallStep[] {
  const short = title.replace(/\s+APK.*$/i, "").slice(0, 48);
  return [
    {
      title: "Download the APK",
      description: `Use the official download button on this page to fetch the latest ${short} APK (verify file size matches the table).`,
    },
    {
      title: "Allow unknown sources",
      description:
        "Open Settings → Security (or Apps → Special access) and enable installs from your browser or file manager.",
    },
    {
      title: "Install & register",
      description:
        "Open the APK from Downloads, complete install, then sign up with phone + OTP. Fund via JazzCash / EasyPaisa if you choose to play real money.",
    },
  ];
}

export type ResolvedGameDetailExtras = {
  displayVersion: string;
  displaySize: string;
  prosAndCons: ProsConRow[];
  systemRequirements: SystemRequirementRow[];
  versionHistory: VersionHistoryRow[];
  installSteps: InstallStep[];
};

export function resolveGameDetailExtras(game: ContentGame): ResolvedGameDetailExtras {
  const displayVersion = deriveDisplayVersion(game.slug, game.version);
  const displaySize = deriveDisplaySize(game.slug, game.size);

  const prosAndCons =
    game.prosAndCons?.length > 0
      ? game.prosAndCons.map((r) => ({ pro: r.pro, con: r.con }))
      : buildProsCons(game.slug, game.title);

  const systemRequirements =
    game.systemRequirementRows?.length > 0
      ? game.systemRequirementRows.map((r) => ({ label: r.label, value: r.value }))
      : buildSystemRows(game.slug, game.requirements);

  const versionHistory =
    game.versionHistory?.length > 0
      ? game.versionHistory.map((r) => ({
          version: r.version,
          released: r.released,
          size: r.size ?? undefined,
          notes: r.notes ?? undefined,
        }))
      : buildVersionHistory(game.slug, displayVersion, displaySize, game.updatedAt);

  const installSteps =
    game.installSteps?.length > 0
      ? game.installSteps.map((s) => ({ title: s.title, description: s.description }))
      : defaultInstallSteps(game.title);

  return {
    displayVersion,
    displaySize,
    prosAndCons,
    systemRequirements,
    versionHistory,
    installSteps,
  };
}
