"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import type { Tag } from "@/lib/api";

export function Sidebar({
  tags,
  activeTag,
  activePinned,
  onSelectTag,
  onTogglePinned,
  onOpenSettings,
  onCreateTag,
  onDeleteTag,
}: {
  tags: Tag[];
  activeTag: string | null;
  activePinned: boolean;
  onSelectTag: (tag: string | null) => void;
  onTogglePinned: () => void;
  onOpenSettings: () => void;
  onCreateTag: (name: string) => Promise<void>;
  onDeleteTag: (name: string) => Promise<void>;
}) {
  const [newTag, setNewTag] = useState("");

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => a.name.localeCompare(b.name)),
    [tags]
  );

  return (
    <div className="h-full p-4 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">NoteMaster</div>
          <button className="btn" onClick={onOpenSettings} aria-label="Open settings">
            Settings
          </button>
        </div>
        <div className="mt-1 text-sm muted">
          Organize with tags, pin favorites, autosave edits.
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          className={clsx("btn justify-start", !activeTag && !activePinned && "btn-primary")}
          onClick={() => {
            onTogglePinned();
            onSelectTag(null);
          }}
        >
          All notes
        </button>

        <button
          className={clsx("btn justify-start", activePinned && "btn-primary")}
          onClick={() => onTogglePinned()}
        >
          Pinned
        </button>

        <button
          className={clsx("btn justify-start", activeTag === null && "hidden")}
          onClick={() => onSelectTag(null)}
        >
          Clear tag filter
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold">Tags</div>
        </div>

        <div className="flex flex-col gap-1 overflow-auto pr-1 max-h-[45vh]">
          {sortedTags.length === 0 ? (
            <div className="text-sm muted">No tags yet.</div>
          ) : (
            sortedTags.map((t) => (
              <div key={t.name} className="flex items-center gap-2">
                <button
                  className={clsx(
                    "btn w-full justify-start",
                    activeTag === t.name && "btn-primary"
                  )}
                  onClick={() => onSelectTag(t.name)}
                >
                  {t.name}
                </button>
                <button
                  className="btn"
                  onClick={() => onDeleteTag(t.name)}
                  aria-label={`Delete tag ${t.name}`}
                  title="Delete tag"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <form
          className="mt-3 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const name = newTag.trim();
            if (!name) return;
            await onCreateTag(name);
            setNewTag("");
          }}
        >
          <input
            className="input"
            placeholder="New tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            aria-label="New tag name"
          />
          <button className="btn btn-primary" type="submit">
            Add
          </button>
        </form>
      </div>

      <div className="text-xs muted">
        Tip: Use the search bar to filter notes by title/content.
      </div>
    </div>
  );
}
