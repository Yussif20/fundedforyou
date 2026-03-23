# Server — Funded For You

Express 5 REST API with TypeScript, Prisma ORM, and PostgreSQL.

## Tech Stack

| Category     | Technology                                   |
| ------------ | -------------------------------------------- |
| Runtime      | Node.js 20+                                  |
| Language     | TypeScript 5.9.3 (strict mode)               |
| Framework    | Express 5.1.0                                |
| Database     | PostgreSQL 18 via Prisma 6.19                |
| Auth         | JWT (jsonwebtoken), bcrypt, OTP, Magic Links |
| Validation   | Zod 4.1                                      |
| Email        | Nodemailer + React Email components          |
| File Storage | DigitalOcean Spaces (AWS S3 SDK)             |
| Payments     | Stripe 19.3                                  |
| Security     | Helmet, CORS, express-rate-limit             |
| i18n         | i18next + i18next-express-middleware         |
| Logging      | Morgan + custom logger                       |

## Directory Structure

```
server/
├── src/
│   ├── server.ts               # Entry point — creates HTTP server, seeds admin
│   ├── app.ts                  # Express app config (middleware stack)
│   ├── routes.ts               # Route registry — all module routes
│   ├── env.ts                  # Env validation with Zod schema
│   │
│   ├── app/                    # Business modules (controller/service/route pattern)
│   │   ├── announcements/
│   │   │   ├── announcements.controller.ts
│   │   │   ├── announcements.service.ts
│   │   │   ├── announcements.route.ts
│   │   │   ├── announcements.validation.ts
│   │   │   └── announcements.interface.ts
│   │   ├── auth/               # Signup, login, refresh, password reset, email verify
│   │   ├── best-seller/
│   │   ├── broker/
│   │   ├── challenge/
│   │   ├── contact-us/
│   │   ├── faq/
│   │   ├── firm/               # Core firm module (+ firm.utils.ts)
│   │   ├── news/
│   │   ├── news-letter/
│   │   ├── offer/
│   │   ├── payment-method/
│   │   ├── platform/
│   │   ├── spread/             # Includes spreadSymbolValue and symbol services
│   │   ├── team-members/
│   │   └── users/
│   │
│   ├── constants/
│   │   ├── index.ts            # App-wide constants
│   │   ├── fileValidation.ts   # File upload rules
│   │   └── ResponseMessages/   # Standardized response messages
│   │
│   ├── helpers/
│   │   ├── errors/
│   │   │   ├── AppError.ts     # Custom error class
│   │   │   └── handleZodError.ts
│   │   └── prisma/
│   │       ├── query-builder.ts         # Dynamic query builder
│   │       ├── setNestedObject.ts       # Nested filter helper
│   │       └── setNestedObjectForSort.ts
│   │
│   ├── lib/
│   │   ├── db/
│   │   │   ├── db.ts           # PrismaClient singleton
│   │   │   └── seed.ts         # Super admin seeding
│   │   ├── email.ts            # Email sending utility
│   │   └── uploadFileToStorage.ts  # S3/Spaces upload handler
│   │
│   ├── middlewares/
│   │   ├── attachUser.middleware.ts     # JWT token → req.user
│   │   ├── authorize.middleware.ts      # Role-based access control
│   │   ├── error.middleware.ts          # Global error handler
│   │   ├── i18next.middleware.ts        # i18n initialization
│   │   ├── notFound.middleware.ts       # 404 handler
│   │   ├── rateLimiter.ts              # Rate limiting config
│   │   ├── requestLogger.middleware.ts  # Request logging
│   │   ├── rootMiddleware.ts           # Root route handler
│   │   ├── uploadFiles.middleware.ts    # Multer file upload
│   │   ├── validate-request.ts         # Zod request validation
│   │   └── index.ts                    # Barrel exports
│   │
│   ├── emails/                 # React Email templates
│   │   ├── ForgotPasswordEmail.tsx
│   │   └── SignupEmail.tsx
│   │
│   ├── locales/
│   │   └── en.json             # English translations
│   │
│   ├── types/
│   │   └── index.types.ts      # Shared TypeScript types
│   │
│   └── utils/
│       ├── catchAsync.ts       # Async error wrapper for controllers
│       ├── customConsole.ts    # Styled startup console output
│       ├── generateToken.ts    # JWT token generation
│       ├── jwt.ts              # JWT utilities
│       ├── logger.ts           # Logging utility
│       ├── otp.ts              # OTP generation
│       ├── prisma.mig.ts       # Prisma migration helper
│       ├── sendResponse.ts     # Standardized API response
│       └── utils.ts            # General utilities
│
├── prisma/
│   ├── schema/                 # Split Prisma schema files
│   │   ├── schema.prisma       # Generator + datasource config
│   │   ├── user.prisma         # User, UserOTP, MagicLink, RefreshToken, AccessTokens
│   │   ├── prop-firms.prisma   # Firm, Platform, Broker, PaymentMethod, Announcements
│   │   ├── challenge.prisma    # Challenge model
│   │   ├── offer.prisma        # Offer model
│   │   ├── spread.prisma       # Spread, SpreadSymbolValue, Symbol
│   │   ├── payment.prisma      # Payment model (Stripe)
│   │   ├── notification.prisma # Notification, NotificationUser
│   │   ├── cms.prisma          # ContactUs, NewsLetter
│   │   ├── faq.prisma          # FAQ model
│   │   ├── best-sellers.prisma # BestSeller model
│   │   ├── news.prisma         # News model
│   │   └── enum.prisma         # StepsEnum, PayoutReqEnum
│   └── ...
│
├── prisma.config.ts            # Prisma config (multi-schema)
├── scripts/gn-route.ts         # Module scaffolding generator
├── public/assets/flags/        # Country flag images (GIF)
├── docker-compose.yml          # PostgreSQL dev container
├── package.json
├── tsconfig.json
└── .env                        # Environment variables
```

## Environment Variables

| Variable                 | Description                        |
| ------------------------ | ---------------------------------- |
| `NODE_ENV`               | `development` / `production`       |
| `PORT`                   | Server port (default: 5000)        |
| `PROJECT_NAME`           | Project identifier                 |
| `DATABASE_URL`           | PostgreSQL connection string       |
| `SUPER_ADMIN_PASSWORD`   | Auto-seeded admin password         |
| `BCRYPT_SALT_ROUNDS`     | bcrypt hashing rounds              |
| `JWT_ACCESS_SECRET`      | JWT signing secret (access token)  |
| `JWT_REFRESH_SECRET`     | JWT signing secret (refresh token) |
| `JWT_ACCESS_EXPIRES_IN`  | Access token TTL (e.g., `20m`)     |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (e.g., `10d`)    |
| `MAIL_HOST`              | SMTP host                          |
| `MAIL_PORT`              | SMTP port                          |
| `MAIL_USER`              | SMTP username                      |
| `MAIL_PASS`              | SMTP password                      |
| `DO_SPACE_ENDPOINT`      | DigitalOcean Spaces endpoint       |
| `DO_SPACE_ACCESS_KEY`    | Spaces access key                  |
| `DO_SPACE_SECRET_KEY`    | Spaces secret key                  |
| `DO_SPACE_BUCKET`        | Spaces bucket name                 |
| `BASE_URL_SERVER_DEV`    | Backend URL (dev)                  |
| `BASE_URL_CLIENT`        | Frontend URL (always used)         |
| `BASE_URL_SERVER`        | Backend URL (production)           |

All env vars are validated at startup via Zod in `src/env.ts`. The server will exit with clear error messages if any required variable is missing.

## API Routes

All routes are prefixed with `/api/v1`.

| Route                     | Module             |
| ------------------------- | ------------------ |
| `/api/v1/auth`            | Authentication     |
| `/api/v1/users`           | User management    |
| `/api/v1/firms`           | Prop trading firms |
| `/api/v1/challenges`      | Trading challenges |
| `/api/v1/offers`          | Promotional offers |
| `/api/v1/spreads`         | Market spreads     |
| `/api/v1/brokers`         | Brokers            |
| `/api/v1/platforms`       | Trading platforms  |
| `/api/v1/payment-methods` | Payment methods    |
| `/api/v1/announcements`   | Firm announcements |
| `/api/v1/best-sellers`    | Popular firms      |
| `/api/v1/news`            | Financial news     |
| `/api/v1/faqs`            | FAQ                |
| `/api/v1/contact-us`      | Contact forms      |
| `/api/v1/news-letter`     | Newsletter         |

## Module Pattern

Each business module follows a consistent pattern:

```
module-name/
├── module-name.route.ts        # Express router with endpoint definitions
├── module-name.controller.ts   # Request handlers (uses catchAsync)
├── module-name.service.ts      # Business logic (Prisma queries)
├── module-name.validation.ts   # Zod schemas for request validation
└── module-name.interface.ts    # TypeScript interfaces
```

## Middleware Stack (Order)

1. `rateLimiterMiddleware` — Rate limiting
2. `helmet()` — Security headers
3. `cors()` — CORS with whitelisted origins
4. `express.json()` — JSON body parser (50MB limit)
5. `express.urlencoded()` — URL-encoded parser
6. `cookieParser()` — Cookie parser
7. Static file serving (`/public`, `/upload`)
8. `attachUser` — Extract user from JWT in Authorization header
9. `i18nextMiddleware` — Internationalization
10. Route handlers (`/api/v1/*`)
11. `notFoundMiddleware` — 404 handler
12. `errorMiddleware` — Global error handler

## Database Schema

### Core Models

**User** — Traders and admins

- Roles: `USER`, `SUPER_ADMIN`
- Auth types: `EMAIL`, `GOOGLE`, `OTP`, `OTHER`
- Status: `ACTIVE`, `INACTIVE`, `BLOCKED`, `DELETED`
- Includes onboarding fields (country, trading experience, assets traded)

**Firm** — Prop trading firms

- Types: `FOREX`, `FUTURES`
- Contains bilingual content (`field` + `fieldArabic`)
- Rules: drawdowns, leverage, commission, payout policies, trading restrictions
- Relations: brokers, platforms, payment methods, challenges, offers, spreads, announcements

**Challenge** — Trading challenges

- Linked to a Firm
- Steps: `STEP1` through `STEP4`, or `INSTANT`
- Parameters: account size, profit targets, daily loss, max loss, leverage, pricing
- Boolean flags: news trading, copy trading, EAs, weekend, overnight, stop loss, refundable

**Offer** — Promotional offers

- Code, percentage, exclusive flag, end date
- Bilingual text fields
- Gift text support

**Spread** — Market spread data

- Types: `POPULAR`, `FOREX`, `CRYPTO`, `INDICES`, `METALS`
- Linked to Firm + Platform
- Contains SpreadSymbolValue entries (min/max per symbol)

**Payment** — Stripe payment records

- Status: `PENDING`, `SUCCESS`, `FAILED`, `CANCELED`
- Stores Stripe session/payment/customer IDs

### Common Patterns

- **Soft deletes**: `isDeleted: Boolean @default(false)` on most models
- **Timestamps**: `createdAt` + `updatedAt` on all models
- **Bilingual fields**: `field` + `fieldArabic` pairs throughout Firm and related models
- **UUID primary keys**: Most models use `@default(uuid())`

## Authentication Flow

1. User signs up → email verification OTP sent
2. User logs in → receives `accessToken` + `refreshToken` (stored in cookies)
3. `attachUser` middleware extracts user from `Authorization` header on every request
4. `authorize` middleware checks role-based access (`USER`, `SUPER_ADMIN`)
5. On 401 → frontend auto-refreshes via `/auth/refresh-token` endpoint
6. Super admin is auto-seeded on server startup via `seedSuperAdmin()`

## Path Aliases

Configured in `tsconfig.json`:

- `@/*` → `src/*`
- `@/db` → `src/lib/db/db`
- `@/routes/*` → `src/routes/*`
- `@/ResponseMessages/*` → `src/ResponseMessages/*`

## Commands

```bash
npm run dev         # Dev server with hot reload (ts-node-dev)
npm run build       # Compile TypeScript (tsc + tsc-alias)
npm run start       # Run compiled production server
npm run prisma:gen  # Generate Prisma client + push schema to DB
npm run gn-route    # Scaffold a new module (controller/service/route/validation)
```

## CORS Allowed Origins

Configured in `src/app.ts`:

- `http://localhost:3000`, `http://localhost:3001`
- `http://31.220.111.98:3000`, `http://31.220.111.98:3001`
- `https://fundedforyou.com`, `https://www.fundedforyou.com`
- `https://fundedforyou.netlify.app`

## Docker (Development DB)

```bash
docker compose up -d   # PostgreSQL on port 3500
```

Connection: `postgresql://postgres:postgres@localhost:3500/mydb`
update
