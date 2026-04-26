"use client";

import { FormEvent, useState, useTransition } from "react";

type EventSettingsFormProps = {
  initialValues: {
    weddingTitle: string;
    coupleNames: string;
    weddingDate: string;
    venue: string;
    programDetails: string;
  };
};

export function EventSettingsForm({ initialValues }: EventSettingsFormProps) {
  const [values, setValues] = useState(initialValues);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const update = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Could not save settings.");
        return;
      }

      setMessage("Event settings updated.");
    });
  };

  return (
    <form className="panel stack-lg" onSubmit={onSubmit}>
      <div className="panel-header">
        <p className="eyebrow">Wedding Profile</p>
        <h2>Shared event details</h2>
      </div>

      <label className="field">
        <span>Wedding title</span>
        <input
          onChange={(event) => update("weddingTitle", event.target.value)}
          value={values.weddingTitle}
        />
      </label>

      <label className="field">
        <span>Couple names</span>
        <input
          onChange={(event) => update("coupleNames", event.target.value)}
          value={values.coupleNames}
        />
      </label>

      <label className="field">
        <span>Date</span>
        <input
          onChange={(event) => update("weddingDate", event.target.value)}
          value={values.weddingDate}
        />
      </label>

      <label className="field">
        <span>Venue</span>
        <input onChange={(event) => update("venue", event.target.value)} value={values.venue} />
      </label>

      <label className="field">
        <span>Program detail</span>
        <textarea
          onChange={(event) => update("programDetails", event.target.value)}
          rows={5}
          value={values.programDetails}
        />
      </label>

      {message ? <p className="form-success">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <button className="button button-secondary" disabled={pending} type="submit">
        {pending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
