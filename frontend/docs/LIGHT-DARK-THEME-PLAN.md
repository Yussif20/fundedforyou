# Light/Dark Theme Implementation Plan

**Goal:** Add a light theme while keeping the current look as the dark theme. Use the existing `next-themes` setup and CSS variables for a minimal, maintainable change.

---

## Current State Summary

| Item | Status |
|------|--------|
| **next-themes** | Installed; `ThemeProvider` in root layout with `attribute="class"`, `defaultTheme="dark"` |
| **CSS variables** | In `globals.css`: `:root` and `.dark` both use the **same dark palette** (no light yet) |
| **Tailwind** | `@custom-variant dark (&:is(.dark *));` — `dark:` applies when ancestor has `.dark` |
| **Color scheme** | `html { color-scheme: dark !important; }` — forces dark only |
| **SetTheme** | Switches **green vs yellow** (forex/futures) by adding `yellow-theme` or `root` on `<html>`; does not control light/dark |
| **Theme toggle UI** | None yet; `useTheme()` from next-themes not used in UI |

When theme is "light", next-themes will **not** add the `dark` class on `<html>`. When "dark", it will add `class="dark"`. So we need:

- **Light theme** = variables defined on `:root` (or when `dark` is absent).
- **Dark theme** = variables defined under `.dark` (keep current values).

---

## Phase 1: CSS Variables (Light Palette + Structure)

**File:** `src/styles/globals.css`

### 1.1 Split `:root` vs `.dark`

- **`:root`**  
  Define a **light** palette (backgrounds light, text dark, same primary green family). This becomes the default when `html` has no `.dark` class.

- **`.dark`**  
  Keep the **current** values (what you have now on `:root` and `.dark`). Remove the duplicate block that currently sets the same as `:root`.

Suggested light values (consistent with your green primary `#059666`):

```css
:root {
  --radius: 0.65rem;
  --background: #f8fafc;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --popover: #ffffff;
  --popover-foreground: #0f172a;
  --primary: #059666;
  --primary1: #51a687;
  --primary2: #06402b;
  --success: #10b981;
  --primary-dark: #047857;
  --primary-foreground: #ffffff;
  --secondary: #f1f5f9;
  --secondary-foreground: #0f172a;
  --muted: #e2e8f0;
  --muted-foreground: #64748b;
  --accent: #e2e8f0;
  --accent-foreground: #0f172a;
  --destructive: #dc2626;
  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #059666;
  /* chart, sidebar: light equivalents */
}
.dark {
  /* Move here the current dark values (today's :root/.dark block) */
}
```

- **`.yellow-theme`**  
  Add a **light** yellow palette (for futures in light mode).

- **`.yellow-theme.dark`**  
  Keep existing dark yellow values (already present).

### 1.2 `color-scheme`

- Remove `color-scheme: dark !important` from `html`.
- Set theme-dependent scheme so native controls and scrollbars match:
  - `html { color-scheme: light; }`
  - `html.dark { color-scheme: dark; }`

### 1.3 Scrollbar and hardcoded colors

- Replace hardcoded `#18181b` in scrollbar track/corner and `scrollbar-color` with variables, e.g. `var(--card)` or a new `--scrollbar-track` if you prefer.
- This keeps scrollbar correct in both themes without extra classes.

### 1.4 Optional: danger-html and gradients

- **`.danger-html th, .danger-html td`**  
  Border currently `#e5e7eb` (light). Consider `var(--border)` so it adapts in dark mode.
- **`.gradient-text`**  
  Hardcoded gradient; fine to leave or later make theme-aware.
- **`.card-glow:hover`**  
  Uses `rgba(5, 150, 102, ...)`; works in both themes.

---

## Phase 2: Theme Provider Configuration

**File:** `src/components/Global/them-provider.tsx`

- **themes:** `["light", "dark"]` (optional: add `"system"` and set `enableSystem={true}` if you want OS preference).
- **defaultTheme:** `"dark"` (keep current behavior as default).
- **storageKey:** e.g. `"ffy-theme"` so the choice persists and doesn’t clash with other apps.
- **attribute:** `"class"` (already set).
- **enableSystem:** `true` only if you add a "System" option in the UI.

No need to change **SetTheme**: it should continue to only add/remove `yellow-theme` / `root`; light/dark is controlled by next-themes via the `dark` class.

---

## Phase 3: Theme Toggle Component and Placement

### 3.1 Create `ThemeToggle` (or `ThemeSwitcher`)

- **Client component** using `useTheme()` from `next-themes`.
- **Actions:** Toggle between `light` and `dark` (and optionally `system` if enabled).
- **UI:** Icon button or dropdown:
  - Sun icon for "switch to light" when current is dark.
  - Moon icon for "switch to dark" when current is light.
  - Optional: "System" option with Monitor icon.
- Use existing design tokens (e.g. `Button variant="ghost"`, or a small dropdown next to language).
- Avoid flash: next-themes already suppresses the `dark` class until after mount when using `attribute="class"`.

### 3.2 Where to render

- **Main app:** In `Navbar` right section, e.g. next to `NavLanguageChange` (before or after, your choice). Include the same toggle in the mobile sheet if the navbar is used there.
- **Overview (admin):** If there’s a shared header/topbar (e.g. `Overview/Topbar.tsx`), add the same toggle there so admins can switch theme without leaving the dashboard.

### 3.3 Accessibility and i18n

- `aria-label` or `title`: e.g. "Switch to light theme" / "Switch to dark theme" (or use translation keys from `messages/en.json` and `messages/ar.json`).
- Respect RTL in layout (icons only usually need no change).

---

## Phase 4: Audit and Fix Edge Cases

### 4.1 Hardcoded backgrounds/text

- **Messages pages:** `bg-[#F9FAFB]` → e.g. `bg-muted` or `bg-background` so it follows theme.
- **NextTopLoader:** `color="#fff"` is tuned for dark; consider a theme-aware color (e.g. primary or a CSS variable) or a neutral that works in both.

### 4.2 Components with `dark:` overrides

- Several shadcn/ui components use `dark:...` (e.g. input, select, textarea, button). These are for **when .dark is present**; with the new setup they will correctly style in dark mode. No change needed unless you see a specific contrast or visibility issue in light mode.

### 4.3 3D Hero (if used)

- Hero uses route-based colors (e.g. green/gold). No need to change for light/dark unless you want the 3D scene to dim/brighten; that can be a follow-up.

### 4.4 usePrimaryColor

- Hook reads `--primary` and `--primary-dark` from computed styles; it will automatically reflect the active theme (green or yellow, light or dark). No change required.

---

## Phase 5: Optional Enhancements

- **System theme:** Add `"system"` to themes and a third option in the toggle; set `enableSystem={true}` and optionally `defaultTheme="system"` for new users.
- **Transition:** If you want a short transition when switching, you can set `disableTransitionOnChange={false}` and add a small CSS transition on `background-color` and `color` for `body` (use with care to avoid layout thrash).
- **Yellow-theme light:** Tweak `.yellow-theme` light palette (contrast, muted tones) after you see it in the UI.

---

## Implementation Order (Recommended)

1. **Phase 1** — Add light variables to `:root`, move current dark to `.dark` only, add light `.yellow-theme`, fix `color-scheme` and scrollbar. Verify by manually removing/adding `class="dark"` on `<html>` in devtools.
2. **Phase 2** — Update ThemeProvider (storageKey, optional system).
3. **Phase 3** — Build ThemeToggle and add it to Navbar (and Overview topbar if applicable); add i18n keys.
4. **Phase 4** — Replace hardcoded colors and check NextTopLoader; fix any components that look wrong in light mode.
5. **Phase 5** — Add system option and polish if desired.

---

## Files to Touch (Summary)

| File | Action |
|------|--------|
| `src/styles/globals.css` | Add light `:root`, keep dark in `.dark`, light `.yellow-theme`, `color-scheme`, scrollbar vars |
| `src/components/Global/them-provider.tsx` | storageKey, optionally themes + enableSystem |
| **New:** `src/components/Global/ThemeToggle.tsx` | Theme switch UI using useTheme() |
| `src/components/Global/Navbar/Navbar.tsx` | Render ThemeToggle in right section (+ mobile sheet if applicable) |
| `src/components/Overview/Topbar.tsx` (or equivalent) | Add ThemeToggle if admin has its own header |
| `messages/en.json`, `messages/ar.json` | Keys for "Light theme", "Dark theme", "System" (if used) |
| Messages pages (2) | Replace `bg-[#F9FAFB]` with semantic token |
| Optional: NextTopLoader in layout | Theme-aware color |

This keeps the current design as the dark theme, adds a clean light theme via the same variable system, and uses one small toggle component and a few CSS/configuration changes for a professional, efficient implementation.
