import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-card">
        <p className="eyebrow">Wedding Ticket Service</p>
        <h1>Elegant local ticket issuing and QR validation for your wedding day.</h1>
        <p className="landing-copy">
          Issue printable invitation tickets, generate secure QR codes, and validate guests at
          multiple checkpoints from one local Next.js service.
        </p>

        <div className="landing-actions">
          <Link className="button button-primary" href="/admin/login">
            Admin login
          </Link>
          <Link className="button button-secondary" href="/scanner/login">
            Scanner login
          </Link>
        </div>
      </section>
    </main>
  );
}
