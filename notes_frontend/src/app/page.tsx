"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasLocalSession } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(hasLocalSession() ? "/app" : "/login");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-6">
        <div className="text-xl font-semibold">Loading…</div>
        <div className="mt-2 text-sm muted">Preparing your workspace</div>
      </div>
    </main>
  );
}
