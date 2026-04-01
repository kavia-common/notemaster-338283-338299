"use client";

import React from "react";
import clsx from "clsx";

export function Shell({
  sidebar,
  topbar,
  list,
  editor,
}: {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  list: React.ReactNode;
  editor: React.ReactNode;
}) {
  return (
    <div className="container-app">
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside
          className={clsx(
            "hidden md:flex flex-col",
            "w-[var(--sidebar-w)] shrink-0",
            "border-r border-[var(--border)] bg-[var(--surface)]"
          )}
        >
          {sidebar}
        </aside>

        {/* Main area */}
        <section className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface)]">
            {topbar}
          </header>

          <div className="flex-1 min-h-0 flex">
            {/* List */}
            <div className="hidden lg:block w-[var(--list-w)] shrink-0 border-r border-[var(--border)] bg-[var(--surface)]">
              {list}
            </div>

            {/* Editor */}
            <div className="flex-1 min-w-0">{editor}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
