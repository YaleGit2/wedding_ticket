"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type ScannerRole = "OUTSIDE" | "INSIDE";

export function ScannerLoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<ScannerRole>("OUTSIDE");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Login failed.");
        return;
      }

      router.push("/scanner");
      router.refresh();
    });
  };

  return (
    <form className="stack-lg" onSubmit={onSubmit}>
      <fieldset className="role-picker">
        <legend>Checkpoint role</legend>
        <label>
          <input
            checked={role === "OUTSIDE"}
            name="role"
            onChange={() => setRole("OUTSIDE")}
            type="radio"
          />
          <span>Outside entrance</span>
        </label>
        <label>
          <input
            checked={role === "INSIDE"}
            name="role"
            onChange={() => setRole("INSIDE")}
            type="radio"
          />
          <span>Inside door</span>
        </label>
      </fieldset>

      <label className="field">
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter checkpoint password"
          required
          type="password"
          value={password}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Signing in..." : "Open scanner"}
      </button>
    </form>
  );
}
