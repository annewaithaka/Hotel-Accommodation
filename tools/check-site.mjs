/**
 * Malewa Riverside Resort & Cottages — static site QA
 *
 *   node tools/check-site.mjs
 *
 * Hard failures (fictional content left behind, broken internal links,
 * missing SEO plumbing, inline styles, inconsistent nav/footer) exit non-zero.
 * Photographs that have not been supplied yet are reported as warnings,
 * because the design intentionally renders a labelled slot for them.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = [
  "index.html",
  "properties.html",
  "malewa.html",
  "stay.html",
  "dining.html",
  "conferences.html",
  "team-building.html",
  "experiences.html",
  "clavina.html",
  "clavina-pax.html",
  "gallery.html",
  "about.html",
  "contact.html",
  "book.html",
  "404.html",
];

const failures = [];
const warnings = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);

const read = (file) => readFileSync(join(ROOT, file), "utf8");

/* --- 1. Fictional brand and placeholder content -------------------- */

const FORBIDDEN = [
  ["old brand name", /\bbaraka\b/i],
  ["old property name", /\b(diani|naivasha|nairobi)\b/i],
  ["placeholder photography", /picsum/i],
  ["old room category", /\b(standard double|residence suite|acacia suite|beachfront suite)\b/i],
  ["old price / phone placeholder", /700[\s-]*000[\s-]*000/],
  ["lorem ipsum", /lorem ipsum/i],
  ["unfinished marker", /\b(TODO|FIXME|XXX)\b/],
];

function sourceFiles(dir = ROOT, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === ".git" || entry === "node_modules" || entry === "tools") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      sourceFiles(full, acc);
    } else if (/\.(html|css|js|txt|xml)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

for (const file of sourceFiles()) {
  const text = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  for (const [label, pattern] of FORBIDDEN) {
    const match = text.match(pattern);
    if (match) fail(`${rel}: contains ${label} — "${match[0]}"`);
  }
}

/* --- 2. Per-page checks -------------------------------------------- */

const REQUIRED_HEAD = [
  ["charset", /<meta charset="UTF-8"/],
  ["viewport", /name="viewport"/],
  ["title", /<title>[^<]{15,}<\/title>/],
  ["meta description", /name="description" content="[^"]{50,}"/],
  ["canonical", /rel="canonical" href="https:\/\/[^"]+"/],
  ["og:title", /property="og:title"/],
  ["og:description", /property="og:description"/],
  ["og:image", /property="og:image"/],
  ["og:url", /property="og:url"/],
  ["twitter card", /name="twitter:card"/],
  ["favicon", /rel="icon"/],
  ["apple touch icon", /rel="apple-touch-icon"/],
];

const missingImages = new Map();

for (const file of PAGES) {
  if (!existsSync(join(ROOT, file))) {
    fail(`${file}: page is listed but does not exist`);
    continue;
  }
  const html = read(file);

  if (!/<html lang="en">/.test(html)) fail(`${file}: <html lang="en"> missing`);
  for (const [label, pattern] of REQUIRED_HEAD) {
    if (!pattern.test(html)) fail(`${file}: ${label} missing from <head>`);
  }

  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count !== 1) fail(`${file}: expected exactly one <h1>, found ${h1Count}`);

  if (!/class="skip-link" href="#main"/.test(html)) fail(`${file}: skip link missing`);
  if (!/id="main"/.test(html)) fail(`${file}: <main id="main"> target missing`);
  if (!/<main[^>]*id="main"/.test(html)) fail(`${file}: skip link target is not a <main>`);

  if (/style="/.test(html)) fail(`${file}: inline style attribute present`);

  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt="[^"]*"/.test(tag)) fail(`${file}: <img> without alt — ${tag.slice(0, 90)}`);
  }

  for (const href of html.match(/href="([^"]+)"/g) || []) {
    const value = href.slice(6, -1);
    if (value.startsWith("#") || /^(https?:|mailto:|tel:)/.test(value)) continue;
    const [path] = value.split(/[?#]/);
    if (!path) continue;
    if (!existsSync(join(ROOT, path))) fail(`${file}: broken internal link → ${value}`);
  }

  for (const src of html.match(/src="([^"]+)"/g) || []) {
    const value = src.slice(5, -1);
    if (/^(https?:|data:)/.test(value)) continue;
    if (!existsSync(join(ROOT, value))) {
      missingImages.set(value, (missingImages.get(value) || 0) + 1);
    }
  }
}

/* --- 3. Shared nav and footer must not drift ----------------------- */

const normalise = (block) => block.replace(/\s+aria-current="page"/g, "").replace(/\s+/g, " ").trim();

const navs = new Map();
const footers = new Map();

for (const file of PAGES) {
  if (!existsSync(join(ROOT, file))) continue;
  const html = read(file);
  const nav = html.match(/<nav class="site-nav[\s\S]*?<\/nav>/);
  const footer = html.match(/<footer class="site-footer"[\s\S]*?<\/footer>/);
  if (nav) navs.set(file, normalise(nav[0]));
  if (footer) footers.set(file, normalise(footer[0]));
}

for (const [label, map] of [
  ["nav", navs],
  ["footer", footers],
]) {
  const variants = new Map();
  for (const [file, block] of map) {
    if (!variants.has(block)) variants.set(block, []);
    variants.get(block).push(file);
  }
  const overlay = [...variants.values()].filter((files) =>
    files.some((file) => !["book.html", "404.html"].includes(file))
  );
  if (overlay.length > 1) {
    fail(`${label} markup differs across pages: ${overlay.map((f) => f.join("/")).join(" | ")}`);
  }
}

/* --- 4. Plumbing ---------------------------------------------------- */

for (const file of ["robots.txt", "sitemap.xml", "favicon.svg", "favicon.ico", "apple-touch-icon.png"]) {
  if (!existsSync(join(ROOT, file))) fail(`${file} is missing`);
}

if (existsSync(join(ROOT, "sitemap.xml"))) {
  const sitemap = read("sitemap.xml");
  for (const page of PAGES.filter((p) => p !== "404.html")) {
    const path = page === "index.html" ? "" : page;
    if (!sitemap.includes(`/${path}<`)) fail(`sitemap.xml: ${page} is not listed`);
  }
  if (sitemap.includes("404.html")) fail("sitemap.xml: 404 page should not be listed");
}

for (const legacy of ["diani.html", "naivasha.html", "nairobi.html"]) {
  if (existsSync(join(ROOT, legacy))) fail(`${legacy}: fictional property page still present`);
}

/* --- 5. Photographs -------------------------------------------------- */

const used = [...missingImages.keys()];
if (used.length) {
  warn(
    "Photographs have not been supplied yet — each slot renders a labelled placeholder rather than a stock image."
  );
}

/* --- Report --------------------------------------------------------- */

console.log("\nMalewa · Clavina · Clavina Pax — site check\n");

if (failures.length) {
  console.log(`FAILURES (${failures.length})`);
  failures.forEach((message) => console.log(`  ✗ ${message}`));
} else {
  console.log("PASS — no fictional content, broken links, inline styles or SEO gaps");
}

if (used.length) {
  console.log(`\nPHOTOGRAPHY SLOTS WAITING FOR FILES (${used.length})`);
  used.sort().forEach((src) => console.log(`  · ${src}`));
  console.log("  → see assets/images/README.md for the drop-in manifest");
}

if (warnings.length) {
  console.log(`\nWARNINGS (${warnings.length})`);
  warnings.forEach((message) => console.log(`  ! ${message}`));
}

console.log(
  `\n${PAGES.length} pages checked · ${failures.length} failure(s) · ${used.length} photography slot(s) outstanding\n`
);

process.exit(failures.length ? 1 : 0);
