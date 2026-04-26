"use client";

import { Trash2 } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type DeleteTicketButtonProps = {
  guestName: string;
  redirectTo?: Route;
  ticketId: string;
  variant?: "button" | "icon";
};

export function DeleteTicketButton({
  guestName,
  redirectTo,
  ticketId,
  variant = "button",
}: DeleteTicketButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onDelete = () => {
    const confirmed = window.confirm(
      `Delete ticket for ${guestName}? This also removes its scan history.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Ticket deletion failed.");
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
      }

      router.refresh();
    });
  };

  if (variant === "icon") {
    return (
      <>
        <button
          aria-label={`Delete ticket for ${guestName}`}
          className="icon-action icon-action-danger"
          disabled={pending}
          onClick={onDelete}
          title="Delete ticket"
          type="button"
        >
          <Trash2 size={16} />
        </button>
        {error ? <span className="table-action-error">{error}</span> : null}
      </>
    );
  }

  return (
    <div className="delete-ticket-control">
      <button className="button button-danger" disabled={pending} onClick={onDelete} type="button">
        <Trash2 size={18} />
        {pending ? "Deleting..." : "Delete ticket"}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
