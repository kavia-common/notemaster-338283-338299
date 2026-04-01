"use client";

import React from "react";
import clsx from "clsx";
import type { Theme } from "@/lib/theme";

export function SettingsModal({
  open,
  theme,
  onClose,
  onSetTheme,
  onLogout,
}: {
  open: boolean;
  theme: Theme;
  onClose: () => void;
  onSetTheme: (t: Theme) => void;
  onLogout: () => Promise<void>;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close settings"
      />
      <div className="relative card w-full max-w-lg p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">Settings</div>
            <div className="text-sm muted">Theme & account</div>
          </div>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="mt-5">
          <div className="text-sm font-semibold mb-2">Theme</div>
          <div className="flex gap-2">
            <button
              className={clsx("btn", theme === "light" && "btn-primary")}
              onClick={() => onSetTheme("light")}
            >
              Light
            </button>
            <button
              className={clsx("btn", theme === "dark" && "btn-primary")}
              onClick={() => onSetTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)]">
          <div className="text-sm font-semibold mb-2">Account</div>
          <button className="btn" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
