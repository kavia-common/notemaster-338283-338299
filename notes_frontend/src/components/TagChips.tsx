"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import type { Tag } from "@/lib/api";

export function TagChips({
  allTags,
  selected,
  onChange,
}: {
  allTags: Tag[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const suggestions = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q) return [];
    return allTags
      .map((t) => t.name)
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [allTags, draft]);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {selected.length === 0 ? (
          <div className="text-sm muted">No tags on this note.</div>
        ) : (
          selected.map((t) => (
            <button
              key={t}
              className={clsx(
                "text-xs px-2 py-1 rounded-full border",
                "border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface)]"
              )}
              onClick={() => onChange(selected.filter((x) => x !== t))}
              aria-label={`Remove tag ${t}`}
              title="Remove tag"
            >
              {t} ✕
            </button>
          ))
        )}
      </div>

      <div className="flex gap-2 items-center">
        <input
          className="input"
          placeholder="Add tag to note…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Add tag to note"
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            const name = draft.trim();
            if (!name) return;
            if (!selectedSet.has(name)) onChange([...selected, name]);
            setDraft("");
          }}
        >
          Add
        </button>
      </div>

      {suggestions.length ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              className="text-xs px-2 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
              onClick={() => {
                if (!selectedSet.has(s)) onChange([...selected, s]);
                setDraft("");
              }}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
