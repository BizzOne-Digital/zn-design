# ZN Design

Creative design studio website for **ZN Design** — portfolio, services, pricing, booking consultations, and an admin CMS. Built with Next.js, MongoDB, Cloudinary, and Gmail SMTP.

---

## Prerequisites

- **Node.js** 20 or later (LTS recommended)
- **npm** 10+
- A **MongoDB Atlas** cluster (free tier works for development)
- A **Cloudinary** account for image uploads
- A **Gmail** account with an App Password for transactional email
- (Optional) **Cloudflare Turnstile** keys for spam protection on public forms

---

## MongoDB Atlas setup

1. Sign in at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster.
2. Under **Database Access**, create a database user with read/write privileges. Save the username and password.
3. Under **Network Access**, add your current IP for local development. For production, allow your hosting provider's IPs or `0.0.0.0/0` only if you understand the security trade-off (always require authentication).
4. Click **Connect** on your cluster → **Drivers** → copy the connection string.
5. Replace `<password>` with your database user password and set the database name (e.g. `zn-design`):

   ```
   mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/zn-design?retryWrites=true&w=majority
   ```

6. Set this value as `MONGODB_URI` in `.env.local`.

---

## Cloudinary setup

1. Create an account at [cloudinary.com](https://cloudinary.com).
2. From the **Dashboard**, note your **Cloud name**, **API Key**, and **API Secret**.
3. Add them to `.env.local`:

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Admin image uploads use these credentials server-side. Seed data uses external Unsplash URLs and does not require Cloudinary for the initial seed.

---

## Gmail App Password setup

The site sends booking confirmations and contact notifications via SMTP.

1. Enable **2-Step Verification** on your Google account: [myaccount.google.com/security](https://myaccount.google.com/security).
2. Open **App passwords** (search "App passwords" in Google Account settings).
3. Create a new app password for **Mail** on **Other (Custom name)** — e.g. `ZN Design`.
4. Copy the 16-character password (no spaces) into `.env.local`:

   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=zafreennihmathullah@gmail.com
   SMTP_APP_PASSWORD=your_16_char_app_password
   BOOKING_NOTIFICATION_EMAIL=zafreennihmathullah@gmail.com
   ```

---

## Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL (`http://localhost:3000` in dev) |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `AUTH_SECRET` | Yes | Random string for NextAuth session signing (32+ chars) |
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_INITIAL_PASSWORD` | Yes | Initial admin password (min 8 chars; used by `create-admin` only) |
| `CLOUDINARY_CLOUD_NAME` | Yes* | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes* | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes* | Cloudinary API secret |
| `SMTP_HOST` | Yes* | SMTP host (Gmail: `smtp.gmail.com`) |
| `SMTP_PORT` | Yes* | SMTP port (`465` for SSL) |
| `SMTP_SECURE` | Yes* | `true` for port 465 |
| `SMTP_USER` | Yes* | Gmail address |
| `SMTP_APP_PASSWORD` | Yes* | Gmail App Password |
| `BOOKING_NOTIFICATION_EMAIL` | No | Inbox for new booking alerts |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | No | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile secret |

\* Required for full production functionality (uploads and email).

Generate `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Install and setup

```bash
npm install
```

### Seed the database

Populates site settings, services, pricing packages, availability rules, sample portfolio projects, sample testimonials, and legal starter pages. Safe to run multiple times (idempotent upserts).

```bash
npm run seed
```

### Create the admin user

Reads `ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD` from `.env.local`, hashes the password with bcrypt, and upserts the admin account. The password is **never** printed to the console.

```bash
npm run create-admin
```

Then sign in at `/admin/login` with your admin credentials.

---

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

---

## Production build

```bash
npm run build
npm run start
```

Set `NEXT_PUBLIC_SITE_URL` to your production domain before building so sitemaps, metadata, and email links resolve correctly.

---

## Deployment notes

- **Hosting:** Deploy to Vercel, Railway, or any Node.js host that supports Next.js 16.
- **Environment:** Add all `.env.local` variables to your hosting provider's environment settings.
- **MongoDB:** Whitelist your deployment region's egress IPs in Atlas Network Access.
- **SMTP:** Gmail works for low volume; consider SendGrid or Resend for higher volume.
- **Secrets:** Never commit `.env.local`. Rotate `AUTH_SECRET` and `ADMIN_INITIAL_PASSWORD` if exposed.
- **Health check:** `GET /api/health` returns service status for uptime monitoring.

---

## Remove sample content before launch

The seed script marks demo portfolio projects and testimonials with `isSample: true`. Before going live:

1. **Admin panel:** Delete or unpublish sample portfolio projects and testimonials from the CMS.
2. **Database (optional bulk cleanup):**

   ```javascript
   // In MongoDB shell or Compass
   db.portfolio_projects.deleteMany({ isSample: true })
   db.testimonials.deleteMany({ isSample: true })
   ```

3. Replace seeded **services**, **pricing**, and **site settings** copy with your final production content.
4. Upload your real **logo**, **favicon**, and **OG image** via admin settings (replacing any placeholders).
5. Re-run `npm run create-admin` only if you need to reset the admin password — it will update the existing admin email record.

Sample testimonials include `[SAMPLE TESTIMONIAL]` in the quote text for easy identification.

---

## Legal copy review

The seed script includes starter **Privacy Policy** and **Terms of Service** content in site settings. This is generic placeholder text intended as a starting point only.

**Before launch, have a qualified attorney review and customize** the privacy policy, terms of service, cookie notices, and any consent language to match your jurisdiction, data practices, and business model.

---

## Project scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Production build |
| `start` | `npm run start` | Run production server |
| `lint` | `npm run lint` | ESLint |
| `test` | `npm test` | Run Vitest test suite |
| `seed` | `npm run seed` | Seed database with default content |
| `create-admin` | `npm run create-admin` | Create or update admin user |

---

## Support

**ZN Design** — Zafreen Nihmathullah  
Email: zafreennihmathullah@gmail.com  
Phone: (508) 851-7086
