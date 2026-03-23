# Funded For You - Frontend

A modern Next.js 16 application for prop firm comparison and trading platform management, featuring bilingual support (English/Arabic), real-time messaging, and comprehensive admin dashboard.

## Tech Stack

| Category         | Technology                                    |
| ---------------- | --------------------------------------------- |
| Framework        | Next.js 16 (App Router)                       |
| Language         | TypeScript 5 (strict mode)                    |
| Styling          | Tailwind CSS 4, PostCSS                       |
| UI Components    | shadcn/ui (Radix UI), Lucide icons            |
| State Management | Redux Toolkit + RTK Query + redux-persist     |
| Forms            | React Hook Form + Zod validation              |
| i18n             | next-intl (English + Arabic)                  |
| Rich Text Editor | Lexical                                       |
| Auth             | JWT via cookies (jose, jwt-decode, js-cookie) |
| Real-time        | Socket.io Client                              |
| Animations       | Framer Motion                                 |
| Drag & Drop      | @dnd-kit                                      |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
```

### Environment Variables

Create a `.env` file with:

```env
NEXT_PUBLIC_BASE_SERVER_URL_DEV=http://localhost:5000
NEXT_PUBLIC_BASE_SERVER_URL=http://localhost:5000
```

### Development

```bash
npm run dev     # Start dev server at http://localhost:3000
```

### Production

```bash
npm run build   # Create production build
npm run start   # Start production server
```

### Linting

```bash
npm run lint    # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── [locale]/           # Locale-based routing (en, ar)
│       ├── (auth)/         # Auth pages (sign-in, sign-up, verify, reset)
│       ├── (commonLayout)/ # Public pages with shared layout
│       ├── (features)/     # Forex/Futures feature section
│       │   └── [type]/     # Dynamic: 'forex' or 'futures'
│       ├── (onboarding)/   # User onboarding flow
│       └── (overview)/     # Admin dashboard
│
├── components/
│   ├── Auth/               # Auth forms
│   ├── Forex_Features/     # Business feature components
│   │   ├── Announcements/
│   │   ├── BestSellers/
│   │   ├── Challenges/
│   │   ├── Firms/
│   │   ├── HighImpactNews/
│   │   ├── Offers/
│   │   └── Spreads/
│   ├── editor/             # Lexical rich text editor
│   ├── Forms/              # Reusable form components
│   ├── Global/             # Shared global components
│   └── ui/                 # shadcn/ui components
│
├── redux/
│   ├── api/                # RTK Query API endpoints
│   ├── authSlice.ts        # Auth state
│   ├── gmtSlice.ts         # Timezone state
│   └── store/              # Store configuration
│
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization config
├── lib/                    # Utility libraries
├── schema/                 # Zod validation schemas
├── types/                  # TypeScript types
└── utils/                  # Utility functions

messages/                   # Translation files (en.json, ar.json)
```

## Features

- **Multilingual**: Full English and Arabic support with RTL layout
- **Prop Firm Comparison**: Browse and compare forex/futures trading firms
- **Challenge Tracking**: View and manage trading challenges
- **Real-time Messaging**: Socket.io powered chat system
- **Admin Dashboard**: Manage firms, challenges, offers, users, and content
- **Rich Text Editing**: Lexical-based content editor
- **Responsive Design**: Mobile-first, works on all devices

## Key Architecture

- **App Router** with locale-based routing (`/en`, `/ar`)
- **RTK Query** for API calls with automatic caching
- **JWT Authentication** with auto-refresh on 401
- **Path alias**: `@/*` maps to `./src/*`

## License

Private - All rights reserved
