# Monorepo Migration — March 23, 2026

## What Changed

Previously the project used **3 separate GitHub repos**:

| Repo | Purpose |
|------|---------|
| `Yussif20/ffy` | Frontend (Next.js) |
| `Yussif20/ffy-backend` | Server (Express) |
| Root (local only) | Wrapper directory |

Now everything lives in a **single repo**: `Yussif20/fundedforyou`

```
fundedforyou/
├── .github/workflows/
│   ├── deploy-frontend.yml   # Deploys only on frontend/** changes
│   └── deploy-backend.yml    # Deploys only on server/** changes
├── frontend/                  # Next.js app
├── server/                    # Express API
├── CLAUDE.md
└── .gitignore                 # Combined gitignore
```

## How Deployments Work

Push to `main` → GitHub Actions auto-detects what changed:

| Files changed | What deploys |
|---------------|-------------|
| `frontend/**` only | Frontend only |
| `server/**` only | Backend only |
| Both | Both (in parallel) |
| Root files only | Nothing deploys |

## How to Deploy

```bash
git add .
git commit -m "your message"
git push
```

That's it. No extra steps needed.

## GitHub Secrets (on `Yussif20/fundedforyou`)

| Secret | Purpose |
|--------|---------|
| `VPS_HOST` | VPS IP address |
| `VPS_USER` | SSH username |
| `VPS_SSH_KEY` | SSH private key (ed25519) |
| `VPS_APP_PATH` | Frontend deploy path on VPS |
| `VPS_PATH` | Backend deploy path on VPS |
| `DATABASE_URL` | PostgreSQL connection string |
| `NODE_ENV` | `production` |
| `JWT_ACCESS_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | JWT refresh secret |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |

## Old Repos

- `Yussif20/ffy` — archived, no longer updated
- `Yussif20/ffy-backend` — archived, no longer updated

Do **not** push to the old repos. All work goes through `Yussif20/fundedforyou`.
