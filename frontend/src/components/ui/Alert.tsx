import type { ReactNode } from "react";

type AlertTone = "error" | "success" | "info";

const TONE_CLASSES: Record<AlertTone, string> = {
  error: "border-red-900 bg-red-950/60 text-red-200",
  success: "border-emerald-900 bg-emerald-950/60 text-emerald-200",
  info: "border-zinc-700 bg-zinc-900 text-zinc-300",
};

export const Alert = ({ tone = "error", children }: { tone?: AlertTone; children: ReactNode }) => (
  <div role={tone === "error" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${TONE_CLASSES[tone]}`}>
    {children}
  </div>
);
