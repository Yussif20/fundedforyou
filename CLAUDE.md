# Funded For You (FFY) - Project Reference

A **prop trading firm comparison and marketplace platform** that helps traders compare funding firms, challenges, spreads, and offers across Forex and Futures markets. Supports English and Arabic (RTL).

## Project Structure

```
fundedforyou/
├── frontend/          # Next.js 16 (React 19) client application
├── server/            # Express 5 + TypeScript REST API
└── CLAUDE.md          # This file
```

## Tech Stack Overview

| Layer        | Technology                                                      |
| ------------ | --------------------------------------------------------------- |
| **Frontend** | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, Redux Toolkit (RTK Query) |
| **Backend**  | Express 5, TypeScript 5.9, Prisma 6.19 ORM                     |
| **Database** | PostgreSQL 18                                                   |
| **Storage**  | DigitalOcean Spaces (S3-compatible)                             |
| **Payments** | Stripe                                                          |
| **Email**    | Nodemailer + React Email                                        |
| **Auth**     | JWT (access + refresh tokens), OTP, Magic Links                 |
| **i18n**     | next-intl (frontend), i18next (backend) — `en`, `ar`            |

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 18 (or use `docker-compose up` in server/)
- npm

### Setup

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:3000

# Server
cd server
npm install
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to DB
npm run dev          # http://localhost:5000
```

### Environment Variables

Both `frontend/.env` and `server/.env` must exist. See each subfolder's documentation for required variables.

**Important:** `.env` files contain secrets and must never be committed to git.

## API Base URL

- **Backend API**: `http://localhost:5000/api/v1`
- **Frontend dev**: `http://localhost:3000`

## Domain Modules

| Module           | Description                                      |
| ---------------- | ------------------------------------------------ |
| **Firms**        | Prop trading firms (Forex/Futures) with rules, drawdowns, policies |
| **Challenges**   | Trading challenges with account sizes, profit targets, loss limits |
| **Offers**       | Promotional offers and exclusive deals tied to firms |
| **Spreads**      | Market spread data (Forex, Crypto, Indices, Metals) per firm/platform |
| **Brokers**      | Broker entities linked to firms                  |
| **Platforms**    | Trading platforms (MT4, MT5, cTrader, etc.)      |
| **News**         | High-impact financial news/events                |
| **Announcements**| Firm-specific announcements                      |
| **Best Sellers** | Popular firm rankings                            |
| **Payments**     | Stripe checkout integration                      |
| **Auth**         | Signup, login, email verification, password reset |
| **Users**        | User profiles, onboarding survey                 |
| **FAQ**          | Frequently asked questions                       |
| **Contact Us**   | Customer inquiry forms                           |
| **Newsletter**   | Email subscription management                    |

## User Roles

- `USER` — Regular trader
- `SUPER_ADMIN` — Full admin access (seeded on startup)

## Key Patterns

- **Frontend path alias**: `@/*` → `./src/*`
- **Server path alias**: `@/*` → `./src/*`, `@/db` → `./src/lib/db/db`
- **API routes**: All prefixed with `/api/v1`
- **Bilingual content**: Many models have paired fields (e.g., `title` + `titleArabic`)
- **Soft deletes**: Most models use `isDeleted` flag instead of hard deletes
- **Validation**: Zod on both frontend (form schemas) and backend (request validation)
- **State management**: Redux Toolkit with RTK Query for API caching + redux-persist for auth/GMT
- **Rich text**: Lexical editor (primary), TipTap, and Suneditor are all installed

## Useful Commands

```bash
# Server
npm run dev                    # Dev server with hot reload
npm run build                  # Compile TypeScript
npm run prisma:gen             # Generate Prisma client + push schema
npm run gn-route               # Scaffold a new API module

# Frontend
npm run dev                    # Next.js dev server
npm run build                  # Production build
npm run lint                   # ESLint check
```

## Database

PostgreSQL via Prisma ORM. Schema split across multiple files in `server/prisma/schema/`.

Docker (for local development):
```bash
cd server && docker compose up -d   # PostgreSQL on port 3500
```

See `server/SERVER.md` and `frontend/FRONTEND.md` for detailed documentation.
