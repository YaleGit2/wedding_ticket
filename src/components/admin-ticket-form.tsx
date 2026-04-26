"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AdminTicketForm() {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName,
          numberOfGuests: numberOfGuests ? Number(numberOfGuests) : null,
          tableNumber: tableNumber || null,
          notes: notes || null,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Ticket creation failed.");
        return;
      }

      const payload = (await response.json()) as { ticketId: string };
      router.push(`/admin/tickets/${payload.ticketId}`);
      router.refresh();
    });
  };

  return (
    <form className="panel stack-lg" onSubmit={onSubmit}>
      <div className="panel-header">
        <p className="eyebrow">Issue Ticket</p>
        <h2>Create a new invitation</h2>
      </div>

      <label className="field">
        <span>Guest name</span>
        <input
          name="guestName"
          onChange={(event) => setGuestName(event.target.value)}
          placeholder="e.g. Minji Kim"
          required
          value={guestName}
        />
      </label>

      <label className="field">
        <span>Number of guests</span>
        <input
          inputMode="numeric"
          min="1"
          name="numberOfGuests"
          onChange={(event) => setNumberOfGuests(event.target.value)}
          placeholder="Optional"
          type="number"
          value={numberOfGuests}
        />
      </label>

      <label className="field">
        <span>Table number</span>
        <input
          name="tableNumber"
          onChange={(event) => setTableNumber(event.target.value)}
          placeholder="Optional"
          value={tableNumber}
        />
      </label>

      <label className="field">
        <span>Notes</span>
        <textarea
          name="notes"
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional seating or logistics notes"
          rows={4}
          value={notes}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="button button-primary" disabled={pending} type="submit">
        {pending ? "Creating..." : "Create ticket"}
      </button>
    </form>
  );
}
