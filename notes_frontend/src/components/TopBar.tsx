"use client";

import React from "react";
import clsx from "clsx";
import type { Theme } from "@/lib/theme";

export function TopBar({
  query,
  onQueryChange,
  theme,
  onToggleTheme,
  onNewNote,
  autosaveStatus,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onNewNote: () => void;
  autosaveStatus: "saved" | "saving" | "error" | "idle";
}) {
  return (
    <div className="px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <input
          className={clsx("input", "h-11")}
          placeholder="Search notes…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <div
          className={clsx(
            "text-xs px-2 py-1 rounded-full border",
            "border-[var(--border)] bg-[var(--surface)]"
          )}
          aria-label="Autosave status"
          title="Autosave status"
        >
          {autosaveStatus === "saving"
            ? "Saving…"
            : autosaveStatus === "saved"
              ? "Saved"
              : autosaveStatus === "error"
                ? "Save error"
                : "—"}
        </div>

        <button className="btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "Dark" : "Light"}
        </button>

        <button className="btn btn-primary" onClick={onNewNote}>
          New note
        </button>
      </div>

      <div className="sm:hidden flex items-center gap-2">
        <button className="btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "Dark" : "Light"}
        </button>
        <button className="btn btn-primary" onClick={onNewNote} aria-label="Create new note">
          +
        </button>
      </div>
    </div>
  );
}
