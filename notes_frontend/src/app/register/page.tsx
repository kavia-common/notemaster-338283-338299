"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { state, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm muted">
          Create an account to store notes securely in the cloud.
        </p>

        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            try {
              await register(email.trim(), password);
              router.replace("/app");
            } catch (err: unknown) {
              const message =
                err instanceof Error ? err.message : "Failed to register";
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
            placeholder="Choose a strong password"
            type="password"
            autoComplete="new-password"
            required
          />

          {error ? (
            <div className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </div>
          ) : null}

          <button className="btn btn-primary mt-2" type="submit" disabled={state.status === "loading"}>
            {state.status === "loading" ? "Creating…" : "Create account"}
          </button>

          <button className="btn" type="button" onClick={() => router.push("/login")}>
            Back to sign in
          </button>
        </form>
      </div>
    </main>
  );
}
