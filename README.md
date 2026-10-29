# Vyntra

Sells international phone numbers to customers in Nigeria. Customers top up a wallet in naira through Paystack, rent a number for 30 days at a time, and read incoming texts in their dashboard.

## Deploy to Vercel

### 1. Create the database (Neon, free)

Easiest: in your Vercel project, open **Storage → Create Database → Neon**. Vercel adds `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for you, so skip to step 2.

Or set it up yourself:

1. Sign up at https://neon.tech and create a project. Pick the region closest to your Vercel region, for example Frankfurt (`eu-central-1`).
2. On the project dashboard, click **Connect**. Copy the connection string twice:
   - with **Connection pooling ON**: this is `DATABASE_URL` (the host contains `-pooler`)
   - with **Connection pooling OFF**: this is `DATABASE_URL_UNPOOLED`
3. Optional, for local development: in Neon, create a branch called `dev` and put its two URLs in your local `.env`. Then run `npm run db:push` and `npm run db:seed`.

### 2. Put the code on GitHub

Create an empty private repository on GitHub, then from this folder:

```bash
git init
git add .
git commit -m "Initial Vyntra site"
git branch -M main
git remote add origin https://github.com/<you>/vyntra.git
git push -u origin main
```

`.env` is in `.gitignore`, so your keys and passwords are not uploaded.

### 3. Import into Vercel

1. At https://vercel.com/new, import the GitHub repository. Vercel detects Next.js; leave the build settings as they are.
2. Under **Environment Variables**, add:

| Name                  | Value                                                                              |
| --------------------- | ---------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Neon pooled URL (added automatically by Vercel's Neon integration)                |
| `DATABASE_URL_UNPOOLED` | Neon direct URL (added automatically by Vercel's Neon integration)                |
| `AUTH_SECRET`         | a long random string. Generate a new one; don't reuse the one in your local `.env` |
| `APP_URL`             | your site's address, e.g. `https://vyntra.vercel.app`. No trailing slash.          |
| `PAYSTACK_SECRET_KEY` | `sk_test_...` while testing, `sk_live_...` when you launch                         |
| `NUMBER_PROVIDER`     | `twilio`                                                                           |
| `TWILIO_ACCOUNT_SID`  | from the Twilio Console                                                            |
| `TWILIO_AUTH_TOKEN`   | from the Twilio Console                                                            |
| `ADMIN_EMAIL`         | your real email                                                                    |
| `ADMIN_PASSWORD`      | a strong password for the admin login                                              |

3. Click **Deploy**. Each build creates or updates the database tables, adds the starting countries and creates your admin account. Prices you change in the admin panel are never overwritten.
4. If your address isn't what you guessed for `APP_URL`, update `APP_URL` and redeploy.

### 4. Connect Paystack's webhook

In the Paystack dashboard, go to **Settings → API Keys & Webhooks**. Set the **Test** webhook URL (and later the **Live** one) to:

```
https://<your-domain>/api/webhooks/paystack
```

The redirect after checkout already credits wallets. The webhook is a backup in case a customer closes the tab before being redirected.

### 5. Test it

1. Sign up with a real email address (Paystack rejects made-up ones), top up ₦5,000, and choose **Success** on Paystack's test checkout.
2. Buy a **US** number. A Twilio trial account allows one number, and other countries need ID or address documents first.
3. Text that number from your phone. The message should appear in the number's inbox within a few seconds.

On the live site, fake numbers and instant test top-ups are switched off. If Twilio isn't configured, purchases fail and the customer is refunded straight away.

### Going live with real money

- Activate your Paystack business, then switch `PAYSTACK_SECRET_KEY` to the `sk_live_` key and set the live webhook URL.
- Upgrade Twilio from trial and check its monthly price for each country, so your naira prices cover it.
- Add your own domain under Vercel → Settings → Domains, then update `APP_URL`.

## Run locally

```bash
npm install
cp .env.example .env        # fill in the Postgres URLs, AUTH_SECRET, ADMIN_PASSWORD
npm run db:push             # applies migrations
npm run db:seed             # adds countries, the admin and a test customer
npm run dev
```

In development, without a Paystack key, top-ups succeed instantly. With `NUMBER_PROVIDER="mock"`, you get fake numbers, and each number page has a **Simulate SMS** button.

After changing `prisma/schema.prisma`, run `npm run db:migrate` to create a new migration and commit it.

## Where things are

| Area             | Files                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Pages            | `src/app` (landing, login/register, `dashboard/*`, `admin`)                                                  |
| Server actions   | `src/app/actions/*` (auth, wallet top-up, buy/renew/release, admin)                                          |
| Payments         | `src/lib/paystack.ts`, `src/lib/wallet.ts`, `src/app/api/paystack/callback`, `src/app/api/webhooks/paystack` |
| Number providers | `src/lib/numbers.ts` (mock and Twilio)                                                                       |
| Inbound SMS      | `src/app/api/webhooks/twilio/sms`                                                                            |
| Database         | `prisma/schema.prisma`, `prisma/migrations`, `prisma/seed.mjs`                                               |

Amounts are stored as integer kobo. Each wallet top-up is credited exactly once, even if both the redirect and the webhook arrive.
