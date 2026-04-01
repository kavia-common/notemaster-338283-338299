"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/AppShell";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { NoteList } from "@/components/NoteList";
import { NoteEditor } from "@/components/NoteEditor";
import { SettingsModal } from "@/components/SettingsModal";
import { useAuth } from "@/lib/auth";
import {
  apiCreateNote,
  apiDeleteNote,
  apiListNotes,
  apiListTags,
  apiCreateTag,
  apiDeleteTag,
  apiUpdateNote,
  type Note,
  type Tag,
} from "@/lib/api";
import { applyTheme, getStoredTheme, setStoredTheme, type Theme } from "@/lib/theme";

export default function AppPage() {
  const router = useRouter();
  const { state, logout } = useAuth();

  const [theme, setTheme] = useState<Theme>("light");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [tags, setTags] = useState<Tag[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activePinned, setActivePinned] = useState(false);
  const [query, setQuery] = useState("");

  const [autosaveStatus, setAutosaveStatus] = useState<
    "saved" | "saving" | "error" | "idle"
  >("idle");

  const autosaveTimer = useRef<number | null>(null);
  const pendingPatch = useRef<
    Partial<Pick<Note, "title" | "content" | "tag_ids">> & { id?: string }
  >({});

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // Auth gate
  useEffect(() => {
    if (state.status === "guest") router.replace("/login");
  }, [router, state.status]);

  // Theme init
  useEffect(() => {
    const t = getStoredTheme();
    setTheme(t);
    applyTheme(t);
  }, []);

  async function refreshTags() {
    const t = await apiListTags();
    setTags(t);
  }

  async function refreshNotes() {
    const n = await apiListNotes({
      q: query.trim() || undefined,
      tag_id: activeTag || undefined,
      pinned: activePinned ? true : undefined,
    });
    setNotes(n);
    // keep selection valid
    if (selectedId && !n.some((x) => x.id === selectedId)) {
      setSelectedId(n[0]?.id ?? null);
    }
    if (!selectedId && n[0]?.id) setSelectedId(n[0].id);
  }

  // initial load after authed
  useEffect(() => {
    if (state.status !== "authed") return;
    let alive = true;
    (async () => {
      try {
        await Promise.all([refreshTags(), refreshNotes()]);
      } catch {
        // if backend returns 401, force logout
        if (alive) {
          await logout();
          router.replace("/login");
        }
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  // reload list on filters/query change (debounced)
  useEffect(() => {
    if (state.status !== "authed") return;
    const t = window.setTimeout(() => {
      refreshNotes().catch(() => undefined);
    }, 200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeTag, activePinned, state.status]);

  function scheduleAutosave(id: string, patch: Partial<Pick<Note, "title" | "content" | "tag_ids">>) {
    pendingPatch.current = { ...pendingPatch.current, ...patch, id };
    setAutosaveStatus("saving");

    if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);

    autosaveTimer.current = window.setTimeout(async () => {
      const p = pendingPatch.current;
      pendingPatch.current = {};
      if (!p.id) return;
      try {
        const updated = await apiUpdateNote(p.id, {
          title: p.title,
          content: p.content,
          tag_ids: p.tag_ids,
        });
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setAutosaveStatus("saved");
        window.setTimeout(() => setAutosaveStatus("idle"), 900);
      } catch {
        setAutosaveStatus("error");
      }
    }, 700);
  }

  async function onNewNote() {
    const created = await apiCreateNote({
      title: "Untitled",
      content: "",
      tag_ids: activeTag ? [activeTag] : [],
      pinned: false,
    });
    setNotes((prev) => [created, ...prev]);
    setSelectedId(created.id);
  }

  async function onDelete(id: string) {
    await apiDeleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
    setAutosaveStatus("idle");
  }

  async function onTogglePinned(id: string, pinned: boolean) {
    const updated = await apiUpdateNote(id, { pinned });
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }

  async function onCreateTag(name: string) {
    await apiCreateTag(name);
    await refreshTags();
  }

  async function onDeleteTag(tagId: string) {
    await apiDeleteTag(tagId);
    if (activeTag === tagId) setActiveTag(null);
    await refreshTags();
    await refreshNotes();
  }

  return (
    <Shell
      sidebar={
        <Sidebar
          tags={tags}
          activeTag={activeTag}
          activePinned={activePinned}
          onSelectTag={(t) => {
            setActiveTag(t);
            setActivePinned(false);
          }}
          onTogglePinned={() => setActivePinned((v) => !v)}
          onOpenSettings={() => setSettingsOpen(true)}
          onCreateTag={onCreateTag}
          onDeleteTag={onDeleteTag}
        />
      }
      topbar={
        <TopBar
          query={query}
          onQueryChange={setQuery}
          theme={theme}
          onToggleTheme={() => {
            const next: Theme = theme === "light" ? "dark" : "light";
            setTheme(next);
            setStoredTheme(next);
          }}
          onNewNote={onNewNote}
          autosaveStatus={autosaveStatus}
        />
      }
      list={
        <NoteList
          notes={notes}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          onTogglePinned={onTogglePinned}
        />
      }
      editor={
        <div className="h-full">
          {/* Mobile list for <lg */}
          <div className="lg:hidden border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Notes</div>
              <button className="btn btn-primary" onClick={onNewNote}>
                New note
              </button>
            </div>
            <div className="max-h-[38vh] overflow-auto">
              <NoteList
                notes={notes}
                selectedId={selectedId}
                onSelect={(id) => setSelectedId(id)}
                onTogglePinned={onTogglePinned}
              />
            </div>
          </div>

          <NoteEditor
            note={selectedNote}
            allTags={tags}
            autosaveStatus={autosaveStatus}
            onDelete={onDelete}
            onChangeDraft={(patch) => {
              if (!selectedNote) return;
              // Update local state immediately
              setNotes((prev) =>
                prev.map((n) =>
                  n.id === selectedNote.id
                    ? { ...n, ...patch, tag_ids: patch.tag_ids ?? n.tag_ids }
                    : n
                )
              );
              scheduleAutosave(selectedNote.id, patch);
            }}
          />

          <SettingsModal
            open={settingsOpen}
            theme={theme}
            onClose={() => setSettingsOpen(false)}
            onSetTheme={(t) => {
              setTheme(t);
              setStoredTheme(t);
            }}
            onLogout={async () => {
              await logout();
              router.replace("/login");
            }}
          />
        </div>
      }
    />
  );
}
