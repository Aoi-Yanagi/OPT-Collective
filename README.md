# The O.P.T. Collective

**Optimal Performance Tools for Your Desk & Drive** — an India-focused storefront concept for curated ergonomic workspace accessories, car-interior organizers, and practical everyday gear.

The project is built with the Next.js App Router. It combines a customer-facing storefront with a lightweight merchant operations interface for order handling, supplier references, and a sample financial ledger.

> **Project status:** Early-stage implementation / prototype. The catalog, merchant dashboard, order records, payment checks, and integrations should be reviewed and hardened before this application is used for live commerce. See [Production and security notes](#production-and-security-notes).

## Product divisions

- **Desk** — laptop risers, ergonomic seating accessories, and desk/device-care tools.
- **Drive** — car-interior organization and vehicle-care accessories.
- **Vault** — bundles and limited-edition collections.

The starter catalog is defined in `src/features/catalog/catalog.data.ts` and currently contains six sample products. Product names, prices, availability, reviews, supplier costs, and shipping statements are starter data and must be verified before publication.

## Application features

### Storefront

- Responsive product catalog with product specifications, pricing, and category navigation.
- Category-aware visual themes for Desk, Drive, and Vault.
- Product showcase and scroll-story sections.
- Shopping bag with quantity updates and subtotal calculation.

### Checkout experience

- Universal UPI intent link generation for supported UPI apps.
- Unique-paisa amount generation as a checkout reference aid.
- Optional payment-screenshot inspection using file-metadata signature checks and Tesseract.js OCR.
- Order receipt view with WhatsApp follow-up link and print / save-as-PDF action.

**Important:** The screenshot inspection is a client-side heuristic, not a bank or UPI-provider confirmation. If OCR cannot find a UTR, the current implementation can generate a fallback reference token. The unique-paisa option is also not independently checked against a bank account. Do not treat either mechanism as proof that money was received.

### Merchant operations

- `/dashboard` — sample order queue, copy-address action, supplier portal links, tracking field, WhatsApp message prompts, and catalog CSV export.
- `/dashboard/suppliers` — supplier and trend-reference directory with a sample SKU-to-supplier matrix.
- `/dashboard/ledger` — sample sales, supplier-cost, and margin ledger.

The dashboard orders and ledger rows are hard-coded starter data; tracking edits are held in client-side state and are not persisted to a database.

### Optional notifications and ledger forwarding

The order API can optionally send a Telegram admin notification and forward an order payload to a Google Apps Script web app. The script in `scripts/google-sheets-ledger-webhook.gs` appends submitted rows to a Google Sheets tab named `Orders_Ledger` and can email a receipt when an email address is supplied.

These integrations are optional. They require their own setup and should be secured before handling real customer information.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Main storefront |
| `/category/desk` | Desk products |
| `/category/drive` | Drive products |
| `/category/vault` | Vault products |
| `/dashboard` | Merchant order workflow |
| `/dashboard/suppliers` | Supplier directory and sourcing matrix |
| `/dashboard/ledger` | Sample financial ledger |
| `/info/[slug]` | Information / legal content page |
| `POST /api/orders/verify` | Checkout order-submission endpoint |

## Tech stack

- **Framework:** Next.js 16 App Router
- **UI:** React 19, TypeScript, Tailwind CSS 3
- **Animation and visuals:** GSAP, Framer Motion, Lenis, Three.js
- **Icons:** Lucide React
- **Receipt text extraction:** Tesseract.js
- **Testing dependency:** Playwright
- **Automation:** GitHub Actions and Dependabot

## Getting started

### Requirements

- Node.js 22 (the repository's GitHub Actions workflow uses Node.js 22)
- npm

### Install dependencies

From the repository root:

```bash
npm install --legacy-peer-deps
```

The repository's CI workflow uses this install command. Keep `package-lock.json` committed so local and deployment installs use the lockfile.

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Create a production build

```bash
npm run build
npm start
```

### Run the dependency security audit

```bash
npm run security:audit
```

This runs `npm audit --audit-level=high`.

## Environment variables

No environment file is required to start the current storefront with its built-in fallback values. Configure the following variables only when the corresponding merchant integrations are ready.

| Variable | Used for | Handling |
| --- | --- | --- |
| `NEXT_PUBLIC_MERCHANT_UPI_ID` | Merchant VPA placed in the UPI intent link | Public client-side value; replace the built-in demo fallback |
| `NEXT_PUBLIC_MERCHANT_WHATSAPP` | Merchant WhatsApp number used in the receipt link | Public client-side value; replace the built-in fallback |
| `TELEGRAM_BOT_TOKEN` | Optional Telegram admin notification | **Secret** — server-side only |
| `TELEGRAM_ADMIN_CHAT_ID` | Destination for Telegram order alerts | Server-side configuration |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Optional Google Apps Script web-app endpoint | Keep server-side; protect the endpoint |

For local development, place configured values in an untracked `.env.local` file at the repository root. For Vercel, add them under **Project → Settings → Environment Variables**, then redeploy. Never commit real tokens, private URLs, or other credentials. Use placeholders only in any example environment file.

### Google Sheets webhook setup

1. Review `scripts/google-sheets-ledger-webhook.gs`.
2. Add it to a Google Apps Script project connected to the intended spreadsheet.
3. Create or authorize the `Orders_Ledger` sheet and deploy the script as a web app.
4. Store the deployed web-app URL in `GOOGLE_SHEETS_WEBHOOK_URL`.

The current script does not implement a shared-secret signature check. Add request authentication and restrict access before using it with real customer details.

## Deployment on Vercel

1. Import `Aoi-Yanagi/OPT-Collective` into Vercel.
2. Select **Next.js** as the framework preset.
3. Keep the root directory as `./` (the `package.json` is at the repository root).
4. Add the required environment variables only after the integrations are configured.
5. Deploy and review the build/runtime logs.

A successful deployment only confirms that the application built and started; it does not make the current demo payment or merchant workflows production-ready.

## Project structure

```text
.
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       └── security-guard.yml
├── scripts/
│   └── google-sheets-ledger-webhook.gs
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   ├── (legal)/
│   │   ├── (storefront)/
│   │   └── api/orders/verify/
│   ├── components/
│   ├── features/
│   │   ├── animations/
│   │   ├── catalog/
│   │   ├── checkout/
│   │   ├── forensics/
│   │   └── theme-engine/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## GitHub automation

- **Security & Build Guard** runs on pushes and pull requests to `main`, and on a daily schedule. It installs dependencies, runs the high/critical vulnerability audit, and attempts a production build.
- **Dependabot** checks npm dependencies daily and groups security updates.

See `.github/workflows/security-guard.yml` and `.github/dependabot.yml` for the current configuration.

## Production and security notes

Before accepting real orders or customer data:

1. **Add authentication and authorization to the merchant dashboard.** The current dashboard route group is not an authentication boundary; no login or role-checking middleware is present in the tracked application.
2. **Replace the demo payment checks with server-side payment verification.** The current `/api/orders/verify` endpoint accepts a `forensicsPassed` boolean supplied by the client. A browser can submit that value without a payment-provider confirmation.
3. **Persist orders securely.** The current dashboard and ledger are seeded in-memory examples, not a durable order-management or accounting system.
4. **Validate all order input on the server.** Add schema validation, rate limiting, idempotency, and safe handling of customer details and uploaded files.
5. **Authenticate external webhooks.** Protect the Google Apps Script endpoint with a verifiable shared secret or another authenticated integration mechanism.
6. **Replace example merchant details and sample commerce data.** Verify product specifications, pricing, supplier availability, packaging, delivery estimates, refund and replacement terms, and all customer-facing claims.
7. **Review security headers and third-party resources** in `next.config.ts` against the final production integrations.

The project is provided as a development foundation. It is not payment-provider certification, legal, tax, or business-compliance advice.

## License

No license is currently specified. All rights remain with the respective rightsholders unless a license is added to this repository.
