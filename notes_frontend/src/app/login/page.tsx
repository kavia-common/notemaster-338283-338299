"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { state, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm muted">
          Use your email/password to sync notes across devices.
        </p>

        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            try {
              await login(email.trim(), password);
              router.replace("/app");
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : "Failed to sign in";
              setError(message);
            }
          }}
        >
          <label className="text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            required
          />

          <label className="text-sm font-semibold mt-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            required
          />

          {error ? (
            <div className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </div>
          ) : null}

          <button className="btn btn-primary mt-2" type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Signing in…" : "Sign in"}
          </button>

          <button
            className="btn"
            type="button"
            onClick={() => router.push("/register")}
          >
            Create an account
          </button>

          <div className="text-xs muted">
            Backend URL:{" "}
            <code className="px-1 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
              {process.env.NEXT_PUBLIC_API_BASE_URL || "(not set)"}
            </code>
          </div>
        </form>
      </div>
    </main>
  );
}
