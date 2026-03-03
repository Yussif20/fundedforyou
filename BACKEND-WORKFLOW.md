# Backend Workflow Guide

## About the Developer

The main developer on this project is a **frontend developer** with basic backend knowledge. All backend changes should be made with this in mind:

- Prefer minimal, targeted server changes
- Follow the existing module pattern exactly — don't introduce new patterns
- Explain what each backend change does in plain language
- Always test locally before pushing to production

---

## Current Tech Stack (Server)

- **Runtime**: Node.js 20+ with TypeScript (strict mode)
- **Framework**: Express 5
- **ORM**: Prisma 6.19 with PostgreSQL 18
- **Schema**: Split files in `server/prisma/schema/` (one file per domain)
- **Deployment**: VPS managed with PM2, deployed via GitHub Actions

---

## Local Development Setup

### Prerequisites
- Docker Desktop installed and running
- `server/.env` configured (see below)

### Start Local Database
```bash
cd server
docker compose up -d
# PostgreSQL starts on port 3500
# Connection: postgresql://postgres:postgres@localhost:3500/mydb
```

### Local `.env` Settings (critical)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:3500/mydb
NODE_ENV=development
```
`FRONTEND_URL` always uses `BASE_URL_CLIENT` for email links.

### Restore Backup to Local DB
```bash
# Find the running container name first:
docker ps

# Then restore (replace path and container name):
docker exec -i <container-name> pg_restore -U postgres -d mydb < "path/to/mydatabase.backup"
```

### Generate Prisma Client + Sync Schema Locally
```bash
cd server
npm run prisma:gen   # runs: prisma generate && prisma db push
```

### Run the Server Locally
```bash
cd server
npm run dev   # starts on port 5000
```

---

## Deployment Workflow

### How Deploys Work (GitHub Actions)
Every push to `main` triggers `server/.github/workflows/deploy.yml`:

1. **Install dependencies** — `npm ci`
2. **Generate Prisma client** — `prisma generate` only (no DB connection, uses dummy URL)
3. **Build TypeScript** — `tsc && tsc-alias` → outputs to `dist/`
4. **Upload dist to VPS** — via SCP
5. **Apply schema to production DB** — `prisma db push` runs in CI with `DATABASE_URL` from GitHub Secrets
6. **Restart PM2** — `pm2 restart backend` via SSH

### Important: Schema Changes in Production
The `prisma db push` step (step 5) runs against the real production database using the `DATABASE_URL` GitHub Secret. This means:

- **Safe schema changes** (OK to push): making a field nullable (`String` → `String?`), adding a new optional field, adding a new model, adding an enum value
- **Risky schema changes** (discuss first): renaming a field, changing a field type, removing a field, making a nullable field required

When in doubt, **test the schema change locally first** with `npm run prisma:gen` before pushing.

---

## Safe Approach for Adding Features

### Step-by-step checklist

1. **Understand what needs to change**
   - Does it need a new API endpoint? → server code change
   - Does it need a new field or model? → Prisma schema change
   - Does it only need a new page/component? → frontend only, no risk

2. **Make and test changes locally first**
   - Start Docker DB: `docker compose up -d` in `server/`
   - Run server: `npm run dev` in `server/`
   - If schema changed: run `npm run prisma:gen` to sync local DB
   - Test the API with the frontend running locally (`npm run dev` in `frontend/`)

3. **Push only when it works locally**
   - The deploy workflow will handle schema + build + restart automatically

4. **After pushing, verify on production**
   - Check that the server restarted cleanly (check PM2 logs if you have SSH access)
   - Test the feature on the live site

---

## Server Module Pattern

Every feature on the server follows this exact structure. When adding a new endpoint, always follow this pattern:

```
server/src/app/<module-name>/
├── <module>.route.ts        # Express router — defines which URL does what
├── <module>.controller.ts   # Handles the HTTP request/response
├── <module>.service.ts      # Business logic + Prisma database queries
├── <module>.validation.ts   # Zod schemas that validate incoming data
└── <module>.interface.ts    # TypeScript types for this module
```

Use `npm run gn-route` in `server/` to auto-scaffold a new module.

All routes are registered in `server/src/routes.ts` and prefixed with `/api/v1`.

### Key Utilities (always use these, don't reinvent)
- `catchAsync(fn)` — wraps async controller functions, auto-catches errors
- `sendResponse(res, { statusCode, message, data })` — standard API response format
- `new AppError(httpStatus.XXX, "message")` — throw a handled error
- `validateRequest(zodSchema)` — middleware to validate req.body/params/query

---

## Prisma Schema Rules

- Schema files are in `server/prisma/schema/` (one per domain)
- Always use `isDeleted Boolean @default(false)` for soft deletes — never hard delete
- Bilingual content uses paired fields: `title String` + `titleArabic String`
- Primary keys: `id String @id @default(uuid())`
- Every model needs `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt`

### After any schema change:
```bash
# Locally:
npm run prisma:gen

# On push: the deploy workflow handles production automatically
```

---

## Environment Variables

### Server `.env` key variables
| Variable | Dev value | Prod value |
|----------|-----------|------------|
| `NODE_ENV` | `development` | `production` |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:3500/mydb` | (VPS connection string) |
| `BASE_URL_CLIENT` | `https://fundedforyou.netlify.app/en` | same |
| `BASE_URL_SERVER_DEV` | `http://localhost:5000` | same |
| `BASE_URL_SERVER` | `https://your-vps-domain` | same |

`FRONTEND_URL` always uses `BASE_URL_CLIENT`. `SERVER_URL` uses `BASE_URL_SERVER_DEV` in dev and `BASE_URL_SERVER` in production.

### Frontend `.env` key variables
| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_BASE_SERVER_URL_DEV` | `http://localhost:5000/api/v1` |
| `NEXT_PUBLIC_BASE_SERVER_URL` | production API URL |

---

## Email Links — Locale Prefix

The frontend uses Next.js with `[locale]` routing. All email links **must include `/en`** in the path, e.g.:

```
https://fundedforyou.netlify.app/en/auth/verify-email?token=...
https://fundedforyou.netlify.app/en/auth/reset-password?token=...
```

Without `/en`, the link will 404 on the live site.
The email templates construct these URLs using `env.FRONTEND_URL` + `/en/` + path.

---

## Known Safe Changes (Low Risk)

These can be made and pushed with confidence:
- Adding new API endpoints following the existing module pattern
- Adding new optional fields to a Prisma model (`field String?`)
- Adding new enum values
- Adding new models
- Changing email templates
- Adding new environment variables (add to `env.ts` Zod schema too)
- Any frontend-only change

## Changes That Need Extra Care (Higher Risk)

Always test locally first and double-check before pushing:
- Making an optional field required (will fail if existing rows have null values)
- Renaming a field (Prisma will drop the old column and create a new one — data loss)
- Changing a field's type
- Removing a field
- Changes to the auth flow (tokens, cookies, refresh logic)
