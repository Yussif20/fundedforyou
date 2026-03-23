# Frontend — Funded For You

Next.js 16 application with React 19, TypeScript, Tailwind CSS 4, and Redux Toolkit.

## Tech Stack

| Category          | Technology                                              |
| ----------------- | ------------------------------------------------------- |
| Framework         | Next.js 16.0.10 (App Router)                            |
| Language          | TypeScript 5.9.3 (strict mode)                          |
| Styling           | Tailwind CSS 4, PostCSS                                 |
| UI Components     | shadcn/ui (Radix UI), Lucide icons                      |
| State Management  | Redux Toolkit 2.11 + RTK Query + redux-persist          |
| Forms             | React Hook Form 7.68 + Zod 4.1                          |
| i18n              | next-intl 4.5 (English + Arabic)                        |
| Rich Text Editors | Lexical 0.38, TipTap 3.15, Suneditor 3.6               |
| Auth              | JWT via cookies (jose, jwt-decode, js-cookie)            |
| Real-time         | Socket.io Client 4.8                                    |
| Animations        | Framer Motion 12                                        |
| Drag & Drop       | @dnd-kit                                                |

## Directory Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   └── [locale]/           # Locale-based routing (en, ar)
│   │       ├── (auth)/         # Auth pages (sign-in, sign-up, verify, reset)
│   │       ├── (commonLayout)/ # Public pages with shared layout
│   │       │   ├── (otherLayout)/   # Standard pages (about, contact, etc.)
│   │       │   └── (simpleLayout)/  # Firm detail pages, profile, FAQ
│   │       ├── (features)/     # Forex/Futures feature section
│   │       │   └── [type]/     # Dynamic: 'forex' or 'futures'
│   │       ├── (onboarding)/   # User onboarding flow
│   │       ├── (overview)/     # Admin dashboard
│   │       │   └── overview/   # Management pages
│   │       └── api/            # API routes (getCountry)
│   │
│   ├── components/
│   │   ├── Auth/               # Auth forms (SignIn, SignUp, etc.)
│   │   ├── Forex_Features/     # Business feature components
│   │   │   ├── Announcements/
│   │   │   ├── BestSellers/
│   │   │   ├── Challenges/     # Challenge tables, forms, drag-drop
│   │   │   ├── ExclusiveOffers/
│   │   │   ├── Firms/          # Firm listings and detail pages
│   │   │   ├── HighImpactNews/
│   │   │   ├── HowItWorks/
│   │   │   ├── Messages/
│   │   │   ├── Offers/
│   │   │   └── Spreads/
│   │   ├── editor/             # Lexical rich text editor (100+ files)
│   │   │   ├── plugins/        # Editor plugins (images, embeds, tables)
│   │   │   ├── nodes/          # Custom Lexical nodes
│   │   │   └── themes/         # Editor themes
│   │   ├── Forms/              # Reusable form components
│   │   ├── Global/             # Shared global components
│   │   └── ui/                 # shadcn/ui components
│   │
│   ├── redux/
│   │   ├── api/                # RTK Query API endpoints
│   │   │   ├── baseApi.ts      # Base config with auth refresh logic
│   │   │   ├── firms.api.ts
│   │   │   ├── challenge.ts
│   │   │   ├── offerApi.ts
│   │   │   ├── spreadApi.ts
│   │   │   ├── userApi.ts
│   │   │   └── ...             # 13 API endpoint files total
│   │   ├── authSlice.ts        # Auth state (user, token)
│   │   ├── gmtSlice.ts         # GMT/timezone state
│   │   └── store/index.ts      # Store config with persistence
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useIsArabic.ts
│   │   ├── useIsFutures.ts
│   │   ├── usePagination.ts
│   │   ├── useCopyToClipboard.ts
│   │   └── useIsActive.ts
│   │
│   ├── i18n/                   # Internationalization config
│   │   ├── routing.ts          # Locales: ['en', 'ar'], default: 'en'
│   │   ├── request.ts
│   │   └── navigation.ts
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── utils.ts            # cn() helper, search params
│   │   ├── socket.ts           # Socket.io client setup
│   │   ├── serverAxios.ts      # Server-side axios instance
│   │   └── lexicalToHtml.ts    # Editor serialization
│   │
│   ├── data/                   # Static data constants
│   ├── schema/                 # Zod validation schemas
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── styles/globals.css      # Global styles
│   ├── config.ts               # App config (backend URL)
│   └── proxy.ts                # Proxy config
│
├── messages/                   # Translation files
│   ├── en.json                 # English
│   └── ar.json                 # Arabic
│
├── package.json
├── tsconfig.json
├── next.config.ts              # Image remotes + next-intl plugin
├── components.json             # shadcn/ui config (new-york style)
├── postcss.config.mjs
├── eslint.config.mjs
└── .env                        # Environment variables
```

## Environment Variables

| Variable                          | Description                    |
| --------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_BASE_SERVER_URL_DEV` | Backend URL for development    |
| `NEXT_PUBLIC_BASE_SERVER_URL`     | Backend URL for production     |

## Key Architecture Decisions

### Routing
- **App Router** with `[locale]` dynamic segment for i18n
- **Route groups** using parentheses: `(auth)`, `(commonLayout)`, `(features)`, `(overview)`
- **Firm type** handled by `[type]` segment (`forex` or `futures`)
- **Firm detail** pages under `firms/[slug]/`

### State Management
- **RTK Query** for all API calls with automatic caching and tag-based invalidation
- **redux-persist** persists `auth` and `gmt` slices to localStorage
- **Auth flow**: JWT stored in cookies, auto-refresh on 401 via `baseQueryWithReauth`

### Tag Types (Cache Invalidation)
`User`, `Firm`, `Firms`, `Challenge`, `Offer`, `Offers`, `Spread`, `Spreads`, `Symbol`, `Platform`, `Broker`, `PaymentMethod`, `BestSeller`, `Announcement`, `News`, `Faq`, `ContactUs`, `Message`, `Subscribe`, `Payment`

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json)

### shadcn/ui Config
- Style: `new-york`
- Base color: `slate`
- CSS variables: enabled
- Icon library: `lucide`
- Import alias: `@/components/ui`

## Commands

```bash
npm run dev     # Start dev server (http://localhost:3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Image Remote Patterns

Configured in `next.config.ts`:
- `sfo3.digitaloceanspaces.com` (file storage)
- `nyc3.digitaloceanspaces.com` (file storage)
- `www.worldometers.info` (flags)
- `upload.wikimedia.org` (flags)
- `api.zenexcloud.com`
- `31.220.111.98` (production server)

## Notes

- Three rich text editors are installed (Lexical, TipTap, Suneditor) — Lexical is the primary one with 100+ plugin files
- The admin dashboard is under `(overview)/overview/` with management pages for brokers, platforms, payment methods, and users
- Socket.io is used for real-time messaging features
- Drag-and-drop (dnd-kit) is used for reordering challenges
