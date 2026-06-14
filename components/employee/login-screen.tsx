"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Field, inputClass } from "@/components/ui/form-field";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid username or password.");
    } else {
      window.location.href = "/employee-portal/general";
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 py-12">
      <div className="space-y-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Deck Doctors</p>
        <h1 className="font-display text-h2 font-bold text-primary">Employee Login</h1>
        <p className="text-sm text-muted-foreground">Sign in to access the employee portal.</p>
      </div>

      <div className="card space-y-4 p-6">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/employee-portal" })}
          className="elevated flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          Sign in with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <Field label="Username" required>
            <input
              className={inputClass(false)}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </Field>
          <Field label="Password" error={error || undefined} required>
            <input
              type="password"
              className={inputClass(!!error)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <button
            type="submit"
            disabled={loading}
            className="primary w-full rounded-md px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
