# Wedding Ticket Service

Local Next.js web service for issuing wedding invitation tickets, generating QR-coded printable PDFs, and validating guest entry at separate checkpoints.

## Stack

- Next.js App Router with TypeScript
- SQLite with Prisma
- Signed HTTP-only cookie sessions
- QR generation with `qrcode`
- PDF generation with `@react-pdf/renderer`
- Camera scanning with `@yudiel/react-qr-scanner`

## Setup

1. Copy `.env.example` to `.env`.
2. Set `SESSION_SECRET`, the three role passwords, and your event details.
3. Run:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

If you later change any role password in `.env`, restarting the app is enough. The login flow will sync the stored hash automatically.

4. Open `http://localhost:3000`.

If you want phones on the same network to scan against this app, set `NEXT_PUBLIC_APP_URL` to your machine's reachable LAN URL, for example `http://192.168.0.20:3000`.

## Main routes

- `/admin/login`
- `/admin/tickets`
- `/admin/tickets/new`
- `/admin/tickets/[id]`
- `/scanner/login`
- `/scanner`
- `/api/tickets`
- `/api/scan`

## How it works

- Admin signs in with the admin password, creates a ticket, and receives a unique ticket record.
- Ticket issuance creates:
  - a human-readable ticket code
  - a random secure token
  - a SHA-256 hash of that token stored in SQLite
- The QR code encodes the ticket token inside a scanner URL. Guest data is not embedded in the QR payload.
- Scanner roles sign in separately as either outside entrance or inside door.
- Each scan is sent to `/api/scan`, where the server:
  - verifies the scanner session
  - hashes the scanned token
  - looks up the ticket
  - checks whether that checkpoint was already used
  - returns `ALLOW` or `DENY`
- Ticket PDFs are generated on demand from the server and formatted for A6 printing.

## Database schema

The app stores:

- `Credential`: role-specific password hashes
- `EventSettings`: one shared wedding profile used across all tickets
- `Ticket`: guest ticket metadata plus secure token hash
- `ScanEvent`: audit log for allow/deny scans per checkpoint

## Local commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:generate
npm run db:push
npm run db:seed
```
