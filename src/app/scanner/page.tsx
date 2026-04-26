import { Role } from "@prisma/client";
import { LogoutButton } from "@/components/logout-button";
import { ScannerClient } from "@/components/scanner-client";
import { requireScannerPage } from "@/lib/guards";

export default async function ScannerPage() {
  const session = await requireScannerPage();
  const checkpointLabel = session.role === Role.OUTSIDE ? "Outside entrance" : "Inside door";

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Scanner Console</p>
          <h1>{checkpointLabel}</h1>
          <p className="muted">
            Camera-based validation for secure QR invitation tickets at this checkpoint.
          </p>
        </div>
        <div className="hero-actions">
          <LogoutButton />
        </div>
      </section>

      <ScannerClient checkpointLabel={checkpointLabel} />
    </main>
  );
}
