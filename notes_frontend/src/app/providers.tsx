"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth";

/**
 * PUBLIC_INTERFACE
 */
export function Providers({ children }: { children: React.ReactNode }) {
  /** Top-level client providers (auth, future query cache, etc.). */
  return <AuthProvider>{children}</AuthProvider>;
}
