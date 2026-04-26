"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { ScanQrCode, ShieldCheck, ShieldX } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";

type ScanResponse = {
  decision: "ALLOW" | "DENY";
  guestName?: string;
  ticketCode?: string;
  checkpoint?: string;
  alreadyUsed?: boolean;
  message: string;
};

export function ScannerClient({ checkpointLabel }: { checkpointLabel: string }) {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [pending, startTransition] = useTransition();
  const lastScannedRef = useRef<string | null>(null);

  const submitToken = useCallback((rawValue: string) => {
    if (!rawValue || pending || lastScannedRef.current === rawValue) {
      return;
    }

    lastScannedRef.current = rawValue;

    startTransition(async () => {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: rawValue }),
      });

      const payload = (await response.json()) as ScanResponse;
      setResult(payload);

      window.setTimeout(() => {
        lastScannedRef.current = null;
      }, 1800);
    });
  }, [pending, startTransition]);

  useEffect(() => {
    const ticketParam = searchParams.get("ticket");
    if (ticketParam) {
      if (!pending && lastScannedRef.current !== ticketParam) {
        submitToken(ticketParam);
      }
    }
  }, [searchParams, pending, submitToken]);

  return (
    <div className="scanner-grid">
      <section className="panel scanner-panel">
        <div className="panel-header">
          <p className="eyebrow">Live Camera</p>
          <h2>{checkpointLabel} scanner</h2>
          <p className="muted">
            Point the device camera at the QR code. Validation happens on the server.
          </p>
        </div>

        <div className="scanner-frame">
          <Scanner
            allowMultiple={false}
            onScan={(codes) => {
              const value = codes[0]?.rawValue;
              if (value) {
                submitToken(value);
              }
            }}
            styles={{
              container: { width: "100%" },
              video: { borderRadius: "24px" },
            }}
          />
        </div>
      </section>

      <section className={`panel scan-result ${result?.decision === "ALLOW" ? "allow" : "deny"}`}>
        <div className="result-icon">
          {result?.decision === "ALLOW" ? <ShieldCheck size={48} /> : <ShieldX size={48} />}
        </div>
        <p className="eyebrow">Scan verdict</p>
        <h2>{result?.decision ?? "Ready"}</h2>
        <p className="result-message">
          {result?.message ?? "Awaiting first scan."}
        </p>

        <dl className="result-list">
          <div>
            <dt>Guest</dt>
            <dd>{result?.guestName ?? "-"}</dd>
          </div>
          <div>
            <dt>Ticket ID</dt>
            <dd>{result?.ticketCode ?? "-"}</dd>
          </div>
          <div>
            <dt>Checkpoint</dt>
            <dd>{result?.checkpoint ?? checkpointLabel}</dd>
          </div>
          <div>
            <dt>Duplicate</dt>
            <dd>{result?.alreadyUsed ? "Yes" : "No"}</dd>
          </div>
        </dl>

        {pending ? (
          <p className="scanner-status">
            <ScanQrCode size={18} />
            Checking ticket...
          </p>
        ) : null}
      </section>
    </div>
  );
}
