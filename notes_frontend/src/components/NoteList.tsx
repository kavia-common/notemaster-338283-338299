"use client";

import React, { useMemo } from "react";
import clsx from "clsx";
import type { Note } from "@/lib/api";

function snippet(text: string, max = 120) {
  const s = text.replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

export function NoteList({
  notes,
  selectedId,
  onSelect,
  onTogglePinned,
}: {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onTogglePinned: (id: string, pinned: boolean) => void;
}) {
  const sorted = useMemo(() => {
    const n = [...notes];
    // pinned first, then updatedAt descending if provided
    n.sort((a, b) => {
      const ap = Boolean(a.pinned);
      const bp = Boolean(b.pinned);
      if (ap !== bp) return ap ? -1 : 1;
      const at = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bt = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bt - at;
    });
    return n;
  }, [notes]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="text-sm font-semibold">Notes</div>
        <div className="text-xs muted">{sorted.length}</div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {sorted.length === 0 ? (
          <div className="p-4 text-sm muted">No notes found.</div>
        ) : (
          <ul className="p-2 flex flex-col gap-2">
            {sorted.map((n) => (
              <li key={n.id}>
                <button
                  className={clsx(
                    "w-full text-left p-3 rounded-xl border",
                    "border-[var(--border)] bg-[var(--surface)]",
                    "hover:bg-[var(--surface-2)] transition",
                    selectedId === n.id && "ring-2 ring-[rgba(59,130,246,0.35)]"
                  )}
                  onClick={() => onSelect(n.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">
                        {n.title?.trim() ? n.title : "Untitled"}
                      </div>
                      <div className="text-sm muted mt-1">
                        {snippet(n.content || "")}
                      </div>
                    </div>

                    <button
                      className="btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePinned(n.id, !Boolean(n.pinned));
                      }}
                      aria-label={n.pinned ? "Unpin note" : "Pin note"}
                      title={n.pinned ? "Unpin" : "Pin"}
                    >
                      {n.pinned ? "📌" : "📍"}
                    </button>
                  </div>

                  {n.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {n.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-2)]"
                        >
                          {t}
                        </span>
                      ))}
                      {n.tags.length > 4 && (
                        <span className="text-xs muted">+{n.tags.length - 4}</span>
                      )}
                    </div>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
