"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Note, Tag } from "@/lib/api";
import { TagChips } from "@/components/TagChips";

export function NoteEditor({
  note,
  allTags,
  autosaveStatus,
  onChangeDraft,
  onDelete,
}: {
  note: Note | null;
  allTags: Tag[];
  autosaveStatus: "saved" | "saving" | "error" | "idle";
  onChangeDraft: (patch: Partial<Pick<Note, "title" | "content" | "tags">>) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setConfirming(false);
  }, [note?.id]);

  const statusLabel = useMemo(() => {
    if (autosaveStatus === "saving") return "Saving…";
    if (autosaveStatus === "saved") return "Saved";
    if (autosaveStatus === "error") return "Autosave error";
    return "—";
  }, [autosaveStatus]);

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="card p-6 max-w-xl w-full">
          <div className="text-xl font-semibold">Select or create a note</div>
          <div className="mt-2 text-sm muted">
            Use “New note” to get started. Your edits autosave.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 p-4 lg:p-6">
      <div className="card h-full flex flex-col min-h-0">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm muted">Autosave</div>
            <div className="text-sm font-semibold">{statusLabel}</div>
          </div>

          <div className="flex items-center gap-2">
            {!confirming ? (
              <button
                className="btn"
                onClick={() => setConfirming(true)}
                aria-label="Delete note"
              >
                Delete
              </button>
            ) : (
              <>
                <button
                  className="btn"
                  onClick={() => setConfirming(false)}
                  aria-label="Cancel delete"
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => onDelete(note.id)}
                  aria-label="Confirm delete"
                >
                  Confirm
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-[var(--border)]">
          <label className="block text-sm font-semibold mb-2" htmlFor="note-title">
            Title
          </label>
          <input
            id="note-title"
            className="input"
            value={note.title ?? ""}
            onChange={(e) => onChangeDraft({ title: e.target.value })}
            placeholder="Untitled"
          />
        </div>

        <div className="p-4 flex-1 min-h-0 flex flex-col gap-3">
          <label className="block text-sm font-semibold" htmlFor="note-content">
            Content
          </label>
          <textarea
            id="note-content"
            ref={contentRef}
            className="input flex-1 min-h-[220px] resize-none"
            value={note.content ?? ""}
            onChange={(e) => onChangeDraft({ content: e.target.value })}
            placeholder="Write your note…"
          />

          <div className="pt-2 border-t border-[var(--border)]">
            <div className="text-sm font-semibold mb-2">Tags</div>
            <TagChips
              allTags={allTags}
              selected={note.tags ?? []}
              onChange={(tags) => onChangeDraft({ tags })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
