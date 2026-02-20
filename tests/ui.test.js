/**
 * FFY (Funded For You) — Puppeteer UI Test Suite
 *
 * Run:
 *   node ui.test.js            (headless)
 *   node ui.test.js --headed   (see the browser)
 *
 * Requires the frontend dev server to be running on http://localhost:3000
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3000";
const HEADED = process.argv.includes("--headed");
const TIMEOUT = 15_000;
const SCREENSHOT_DIR = path.join(__dirname, "screenshots");
const SLOW_MO = HEADED ? 80 : 0;

// Ensure screenshots folder exists
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

// ─── Test Runner ─────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;
const failures = [];

async function test(name, fn) {
  process.stdout.write(`  • ${name} ... `);
  try {
    await fn();
    console.log("\x1b[32m✓\x1b[0m");
    passed++;
  } catch (err) {
    console.log("\x1b[31m✗\x1b[0m");
    console.log(`    \x1b[31m${err.message}\x1b[0m`);
    failed++;
    failures.push({ name, error: err.message });
  }
}

function group(name) {
  console.log(`\n\x1b[36m${name}\x1b[0m`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function goto(page, path) {
  const url = `${BASE_URL}${path}`;
  const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: TIMEOUT });
  return res;
}

async function screenshot(page, name) {
  try {
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${name}.png`),
      fullPage: true,
    });
  } catch {
    // Non-fatal: screenshot may fail during page transitions
  }
}

async function waitForSelector(page, selector, timeout = TIMEOUT) {
  return page.waitForSelector(selector, { timeout });
}

async function elementExists(page, selector) {
  return page.$(selector).then((el) => el !== null);
}

async function getTextContent(page, selector) {
  return page.$eval(selector, (el) => el.textContent.trim());
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log("\n\x1b[1m🧪 FFY UI Test Suite\x1b[0m");
  console.log(`   Base URL : ${BASE_URL}`);
  console.log(`   Mode     : ${HEADED ? "headed" : "headless"}`);
  console.log("─".repeat(50));

  const browser = await puppeteer.launch({
    headless: !HEADED,
    slowMo: SLOW_MO,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1280, height: 800 },
  });

  const page = await browser.newPage();

  // Suppress console noise from the app
  page.on("console", () => {});
  page.on("pageerror", () => {});

  try {
    // ── 1. Smoke: Pages Load ──────────────────────────────────────────────────
    group("1. Page Load (Smoke Tests)");

    const pages = [
      { path: "/", name: "Home" },
      { path: "/offers", name: "Offers" },
      { path: "/challenges", name: "Challenges" },
      { path: "/best-sellers", name: "Best Sellers" },
      { path: "/about", name: "About" },
      { path: "/contact", name: "Contact" },
      { path: "/faq", name: "FAQ" },
      { path: "/high-impact-news", name: "High Impact News" },
      { path: "/auth/sign-in", name: "Sign In" },
      { path: "/auth/sign-up", name: "Sign Up" },
    ];

    for (const { path: p, name } of pages) {
      await test(`${name} page loads (${p})`, async () => {
        const res = await goto(page, p);
        const status = res.status();
        if (status >= 400) throw new Error(`HTTP ${status}`);
        await screenshot(page, `smoke-${name.toLowerCase().replace(/ /g, "-")}`);
      });
    }

    // ── 2. Navbar ─────────────────────────────────────────────────────────────
    group("2. Navbar");

    await test("Navbar is visible", async () => {
      await goto(page, "/");
      await waitForSelector(page, "nav, header");
    });

    await test("Logo is present", async () => {
      await goto(page, "/");
      // Logo img exists somewhere in the nav (link href is /en/forex with locale prefix)
      await waitForSelector(page, "nav img");
    });

    await test("Language switcher exists (EN/AR)", async () => {
      await goto(page, "/");
      // Language switcher is a globe SVG icon with aria-haspopup="menu" in the nav
      await waitForSelector(page, 'nav [aria-haspopup="menu"], nav [data-slot="dropdown-menu-trigger"]');
    });

    await test("Forex/Futures toggle exists", async () => {
      await goto(page, "/");
      // Wait for nav buttons then check for Forex/Futures
      await waitForSelector(page, "nav button");
      const toggleExists = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll("button"));
        return all.some((el) => {
          const t = el.textContent.trim().toLowerCase();
          return t.includes("forex") || t.includes("futures");
        });
      });
      if (!toggleExists) throw new Error("Forex/Futures toggle not found");
    });

    await test("Sign In link is visible when logged out", async () => {
      await goto(page, "/");
      // Sign In link uses locale prefix: /en/auth/sign-in
      await waitForSelector(page, 'a[href*="sign-in"]');
    });

    // ── 3. Home Page (Firms) ──────────────────────────────────────────────────
    group("3. Home Page — Firms");

    await test("Home nav items (tabs) are visible", async () => {
      await goto(page, "/");
      await page.waitForFunction(
        () => document.querySelectorAll("nav a, [role='tab'], [role='navigation'] a").length > 0,
        { timeout: TIMEOUT }
      );
    });

    await test("Firm cards/rows appear or empty state shown", async () => {
      await goto(page, "/");
      // Wait for loading to finish (spinner disappears or content appears)
      await page.waitForFunction(
        () => {
          const spinner = document.querySelector('[class*="spin"], [class*="loading"], [class*="skeleton"]');
          const content = document.querySelector('[class*="firm"], [class*="card"], [class*="table"], [class*="empty"]');
          return !spinner || content !== null;
        },
        { timeout: TIMEOUT }
      );
      await screenshot(page, "home-firms-loaded");
    });

    await test("Hero section renders", async () => {
      await goto(page, "/");
      // Hero section has id="top" (confirmed via DOM inspection)
      await waitForSelector(page, "#top");
    });

    // ── 4. Offers Page ────────────────────────────────────────────────────────
    group("4. Offers Page");

    await test("Offers page renders content or empty state", async () => {
      await goto(page, "/offers");
      await page.waitForFunction(
        () => {
          const spinner = document.querySelector('[class*="skeleton"]');
          const content = document.querySelector('[class*="offer"], [class*="card"], [class*="empty"]');
          return !spinner || content !== null;
        },
        { timeout: TIMEOUT }
      );
      await screenshot(page, "offers-loaded");
    });

    await test("Offers page has a filter control", async () => {
      await goto(page, "/offers");
      // Offers filter has buttons for "Exclusive Offers" and "All Current Offers"
      await page.waitForFunction(
        () => document.querySelectorAll("button").length > 0,
        { timeout: 10000 }
      );
      const filterExists = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll("button"));
        return all.some((el) => {
          const text = el.textContent.toLowerCase();
          return (
            text.includes("exclusive") ||
            text.includes("offer") ||
            text.includes("current") ||
            text.includes("filter")
          );
        });
      });
      if (!filterExists) throw new Error("Filter not found on offers page");
    });

    // ── 5. Challenges Page ────────────────────────────────────────────────────
    group("5. Challenges Page");

    await test("Challenges page renders content or empty state", async () => {
      await goto(page, "/challenges");
      await page.waitForFunction(
        () => {
          const spinner = document.querySelector('[class*="skeleton"]');
          const content = document.querySelector('[class*="challenge"], [class*="card"], [class*="empty"], table');
          return !spinner || content !== null;
        },
        { timeout: TIMEOUT }
      );
      await screenshot(page, "challenges-loaded");
    });

    await test("Challenges page has filter controls", async () => {
      await goto(page, "/challenges");
      await page.waitForFunction(
        () => document.querySelector("button, select, [role='combobox']") !== null,
        { timeout: TIMEOUT }
      );
    });

    // ── 6. Best Sellers Page ──────────────────────────────────────────────────
    group("6. Best Sellers Page");

    await test("Best Sellers page renders", async () => {
      await goto(page, "/best-sellers");
      // Best Sellers loads filter buttons (All, Crypto, Stock, Weekly, Monthly) once data loads
      await page.waitForFunction(
        () => {
          const btns = Array.from(document.querySelectorAll("button"));
          return btns.length > 0 && document.body.innerText.trim().length > 100;
        },
        { timeout: TIMEOUT }
      );
      await screenshot(page, "best-sellers-loaded");
    });

    // ── 7. Auth Pages ─────────────────────────────────────────────────────────
    group("7. Auth Pages");

    await test("Sign In page has email and password fields", async () => {
      await goto(page, "/auth/sign-in");
      await waitForSelector(page, 'input[type="email"], input[name="email"]');
      await waitForSelector(page, 'input[type="password"], input[name="password"]');
    });

    await test("Sign In has a submit button", async () => {
      await goto(page, "/auth/sign-in");
      // Submit button has type="submit" inside the form
      await waitForSelector(page, 'button[type="submit"], form button');
    });

    await test("Sign Up page has required fields", async () => {
      await goto(page, "/auth/sign-up");
      await waitForSelector(page, 'input[type="email"], input[name="email"]');
      await waitForSelector(page, 'input[type="password"], input[name="password"]');
    });

    await test("Sign Up has a link to Sign In", async () => {
      await goto(page, "/auth/sign-up");
      // Sign Up page has <a href="/en/auth/sign-in"> (locale-prefixed)
      await waitForSelector(page, 'a[href*="sign-in"]');
    });

    // ── 8. Navigation (clicking between pages) ────────────────────────────────
    group("8. In-App Navigation");

    await test("Clicking Offers nav link navigates to /offers", async () => {
      await goto(page, "/");
      await page.waitForSelector("a[href*='/offers'], a[href*='offers']", { timeout: TIMEOUT });
      await page.click("a[href*='/offers']");
      await page.waitForFunction(
        () => window.location.pathname.includes("offers"),
        { timeout: TIMEOUT }
      );
    });

    await test("Clicking Challenges nav link navigates to /challenges", async () => {
      await goto(page, "/");
      // Wait for challenges link (locale-prefixed href like /en/challenges)
      await page.waitForSelector('a[href*="challenges"]', { timeout: TIMEOUT });
      await page.click('a[href*="challenges"]');
      await page.waitForFunction(
        () => window.location.pathname.includes("challenges"),
        { timeout: TIMEOUT }
      );
    });

    // ── 9. Static Pages ───────────────────────────────────────────────────────
    group("9. Static/Info Pages");

    await test("About page has visible content", async () => {
      await goto(page, "/about");
      await page.waitForFunction(
        () => document.body.innerText.trim().length > 100,
        { timeout: TIMEOUT }
      );
      await screenshot(page, "about");
    });

    await test("Contact page has a form", async () => {
      await goto(page, "/contact");
      await page.waitForSelector("form, [class*='contact']", { timeout: TIMEOUT });
      await screenshot(page, "contact");
    });

    await test("FAQ page renders", async () => {
      await goto(page, "/faq");
      await page.waitForFunction(
        () => document.body.innerText.trim().length > 50,
        { timeout: TIMEOUT }
      );
      await screenshot(page, "faq");
    });

    // ── 10. Futures Mode ──────────────────────────────────────────────────────
    group("10. Futures Mode");

    await test("Futures pages load correctly", async () => {
      const res = await goto(page, "/futures/firms");
      const status = res.status();
      if (status >= 400 && status !== 404) throw new Error(`HTTP ${status}`);
      // 404 is acceptable if futures is not enabled; just check page doesn't crash
      await screenshot(page, "futures-firms");
    });

    // ── 11. Responsive / Mobile ───────────────────────────────────────────────
    group("11. Responsive — Mobile (390×844)");

    await test("Home page renders on mobile viewport", async () => {
      await page.setViewport({ width: 390, height: 844 });
      await goto(page, "/");
      await page.waitForFunction(
        () => document.body.innerText.trim().length > 50,
        { timeout: TIMEOUT }
      );
      await screenshot(page, "mobile-home");
    });

    await test("Mobile menu button is visible", async () => {
      await page.setViewport({ width: 390, height: 844 });
      await goto(page, "/");
      // On mobile, the hamburger is a visible button with an SVG icon in the nav
      await waitForSelector(page, "nav button");
      const menuExists = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("nav button")).some((btn) => {
          const rect = btn.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && btn.querySelector("svg") !== null;
        });
      });
      if (!menuExists) throw new Error("Mobile menu button not found");
    });

    // Reset to desktop
    await page.setViewport({ width: 1280, height: 800 });

    // ── 12. No JS Errors on Key Pages ─────────────────────────────────────────
    group("12. Console Error Check");

    const errorPages = ["/", "/offers", "/challenges", "/auth/sign-in"];
    for (const p of errorPages) {
      await test(`No critical JS errors on ${p}`, async () => {
        const errors = [];
        const handler = (msg) => {
          if (msg.type() === "error") {
            const text = msg.text();
            // Ignore known benign errors
            if (
              !text.includes("favicon") &&
              !text.includes("net::ERR") &&
              !text.includes("404") &&
              !text.includes("Warning:") &&
              !text.includes("CORS policy") // Expected when frontend points to prod API in dev
            ) {
              errors.push(text);
            }
          }
        };
        page.on("console", handler);
        await goto(page, p);
        await new Promise((r) => setTimeout(r, 2000)); // let async errors surface
        page.off("console", handler);
        if (errors.length > 0) {
          throw new Error(`JS errors: ${errors.slice(0, 3).join(" | ")}`);
        }
      });
    }
  } finally {
    await browser.close();
  }

  // ── Summary ─────────────────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(50));
  console.log(`\x1b[1mResults: \x1b[32m${passed} passed\x1b[0m\x1b[1m, \x1b[31m${failed} failed\x1b[0m`);

  if (failures.length > 0) {
    console.log("\n\x1b[31mFailed tests:\x1b[0m");
    failures.forEach((f) => {
      console.log(`  ✗ ${f.name}`);
      console.log(`    ${f.error}`);
    });
  }

  console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}`);
  console.log("");

  process.exit(failed > 0 ? 1 : 0);
})();
