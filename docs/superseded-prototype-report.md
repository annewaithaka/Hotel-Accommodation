# Superseded: the original three-property prototype report

> **Archive only — not a description of this website.**
>
> This report describes the fictional "Baraka Collection" prototype that this
> repository started as. That prototype no longer exists: its three fictional
> properties, its placeholder imagery and its architecture have all been removed
> and replaced by the Malewa · Clavina · Clavina Pax group site.
>
> It is kept because it is a useful record of the starting point. Nothing in it
> should be treated as current. For the live site, see `README.md`; for what is
> confirmed versus still to confirm, see `MALEWA-CONTENT-AUDIT.md`.

---

**Purpose of this document:** a complete, self-contained description of the existing website so another person or model can understand the codebase and rebuild an equivalent site under a different brand name with different photography.

**Repo:** `/home/remington/Projects/2026-projects/Hotel-Accommodation`

**Git:** 3 commits, HEAD `9a1a9e8` ("Fix mobile overflow, smaller display type on small screens"), working tree clean.

**Date inspected:** 2026-09-10

---

## 1. What this project is

A hand-written static marketing site for a three-property Kenyan hotel group called **"Baraka Collection"**. It is a *prototype* built to show a client the shape and feel of the site before real content, real photography, and a real form endpoint are dropped in.

| Property | Location | Positioning | Rooms |
|---|---|---|---|
| Baraka Diani | Ukunda, Kwale County (coast) | beachfront | 12 |
| Baraka Naivasha | Lake Naivasha, Nakuru County (lake) | lakeside lodge | 8 suites |
| Baraka Nairobi | Riverside, Nairobi (city) | small city residence | 14 |

The brand voice is warm, understated, owner-operated — "small on purpose". Copy is written as if by the owners, with KES pricing throughout. Everything is placeholder: brand name, contact details, prices and images.

---

## 2. Technology

| Layer | Choice |
|---|---|
| Markup | Plain static HTML5, one file per page, no templating |
| Styling | One hand-written stylesheet, `css/styles.css` (569 lines, 22 KB) |
| Scripting | One vanilla JS file, `js/main.js` (103 lines, 3.6 KB), no dependencies |
| Build step | **None.** No npm, no package.json, no bundler, no framework |
| Runtime deps | Google Fonts only (loaded over CDN) |
| Serving | Open `index.html` directly, or any static server (`python -m http.server`) |
| Intended deploy | Render Static Site (build command blank, publish directory `.`) |

Modern-baseline CSS is used without polyfills: `grid`, `clamp()`, `aspect-ratio`, `inset`, `100svh`/`100dvh`, `backdrop-filter`. JavaScript uses `URLSearchParams`, arrow functions, `const`/`let`, and `Array.from(...).find(...)`. Nothing is transpiled.

Page inventory:

| File | Lines | Page |
|---|---|---|
| `index.html` | 194 | Home |
| `diani.html` | 181 | Property — coast |
| `naivasha.html` | 181 | Property — lake |
| `nairobi.html` | 181 | Property — city |
| `about.html` | 136 | Brand story |
| `book.html` | 207 | Booking request form + FAQ |
| `contact.html` | 116 | Property contact cards |
| `404.html` | 46 | Custom not-found page |
| `css/styles.css` | 569 | Entire design system |
| `js/main.js` | 103 | All behaviour |
| `README.md` | — | Build/launch notes and post-approval checklist |

### Note on the README's "unflatten" instructions

The README describes renaming downloaded files from `css__styles.css` to `css/styles.css` and `js__main.js` to `js/main.js` (a carry-over from a flat-file download workflow). **This is stale** — the repo is already in the correct `css/` and `js/` layout. Ignore that section when rebuilding.

---

## 3. Design system

### 3.1 Colour tokens — all in `:root` in `css/styles.css`

| Token | Value | Role |
|---|---|---|
| `--ivory` | `#F5EFE4` | default page background |
| `--ivory-warm` | `#EDE5D3` | CTA band background |
| `--ivory-soft` | `#FAF6EE` | alternating section background, cards, form panel |
| `--forest` | `#2F3E30` | primary button, link accents |
| `--forest-deep` | `#1F2A20` | headings, dark bands (promises, footer, location facts, dark nav) |
| `--forest-mute` | `#5A6A5B` | lede and secondary body text |
| `--brass` | `#A6822E` | eyebrow labels, prices, link underlines |
| `--brass-warm` | `#C99E3B` | accent text on dark backgrounds |
| `--charcoal` | `#1A1A1A` | body text |
| `--slate` | `#6B6B6B` | muted small print |
| `--line` | `rgba(31,42,32,0.14)` | borders on light backgrounds |
| `--line-soft` | `rgba(31,42,32,0.08)` | hairline dividers |

Feel: warm ivory paper, deep botanical green, small brass accents. No pure white, no pure black, no bright blue. Dark sections use `--forest-deep` with ivory text at 75–90% opacity.

### 3.2 Typography

- `--font-display`: `"Fraunces", Georgia, "Times New Roman", serif` — headings, brand wordmark, room names.
- `--font-body`: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Google Fonts request, identical in every page `<head>`: `family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500` plus `Inter:wght@400;500;600`, with `preconnect` to `fonts.googleapis.com` and `fonts.gstatic.com` (the latter `crossorigin`).
- Body `16px`, `line-height 1.6`.
- `h1`–`h3`: display serif, weight 400, `line-height 1.1`, colour `--forest-deep`, `letter-spacing -0.01em`.
- `h4`–`h6`: Inter, weight 600.
- Fluid display sizes via `clamp()`:
  - `.display-xl` → `clamp(2rem, 8vw, 5.5rem)` — hero titles
  - `.display-lg` → `clamp(1.75rem, 6vw, 3.75rem)` — section headings
  - `.display-md` → `clamp(1.375rem, 4vw, 2.5rem)` — sub-sections, FAQ
- `.lede`: `1.0625rem` (→ `1rem` under 480px), `--forest-mute`, max-width 60ch.
- `.eyebrow`: 0.85rem, weight 500, `--brass`, letter-spacing 0.02em — the small label above every heading.
- Paragraphs capped at `62ch`.

### 3.3 Layout and motion

- `--max-width: 1240px`; `--nav-height: 76px`.
- `.container` = 1240 max, 24px side padding. `.container-narrow` = 780 max, 24px side padding.
- `.section` = 96px vertical padding; `.section-tight` = 64px.
- `border-radius: 2px` on buttons and form inputs; everything else is square-cornered.
- Transitions: 160ms colour/background, 200ms hamburger, 240ms nav background and shadow. All `ease`.
- The only box-shadow in the stylesheet is on the open mobile menu panel.
- `html { scroll-behavior: smooth }`, disabled under `prefers-reduced-motion`.
- Reset: `* { box-sizing: border-box; margin: 0; padding: 0 }`; images `max-width: 100%; height: auto; display: block`.

### 3.4 Breakpoints

Breakpoints are ad hoc rather than systematised — there is no single "tablet" variable. Values used: **860px** (primary mobile switch), **720px**, **520px**, **480px**, **400px**, plus `min-width: 861px` and `prefers-reduced-motion`.

| Element | Desktop | Collapses at |
|---|---|---|
| Nav → hamburger | links + CTA inline | ≤ 860px (also closes on resize past 860) |
| `.location-row` (home preview) | 2 columns, alternating order | ≤ 860px → 1 column, order reset |
| `.intro-grid` (home) | `1fr 1.4fr` | ≤ 860px → 1 column |
| `.promises-grid` | 3 columns | ≤ 860px → 1 column |
| `.rooms-grid` | 3 columns | ≤ 860px → 1 column |
| `.amenities-grid` | 4 columns | ≤ 860px → 2 columns; ≤ 480px → 1 column |
| `.gallery-grid` | 3 columns, first image spans 2×2 | ≤ 720px → 2 columns, first spans 2 wide |
| `.location-facts-grid` | 4 columns | ≤ 720px → 2 columns; ≤ 400px → 1 column |
| `.footer-grid` | 4 columns (`1.4fr 1fr 1fr 1fr`) | ≤ 860px → 2 columns; ≤ 520px → 1 column |
| `.faq-grid` | 2 columns | ≤ 720px → 1 column |
| `.contact-grid` | 3 columns | ≤ 860px → 1 column |
| `.about-story-grid` | `1fr 1.2fr` | ≤ 860px → 1 column |
| `.form-row` / `.form-row.triple` | 2 / 3 columns | ≤ 720px → 1 column, full-width button |

---

## 4. Page-by-page structure

Every page shares the same skeleton: `<head>` (charset, viewport, title, description, font links, stylesheet) → nav → page-specific `<main>` or `<header>` → footer → `<script src="js/main.js">`. Nothing is templated; the nav and footer are copy-pasted into all eight files.

### 4.1 The nav (identical markup on all 8 pages)

```html
<nav class="nav on-dark | on-light">
  <div class="nav-inner">
    <a href="index.html" class="brand">Baraka Collection</a>
    <ul class="nav-links"> Home / Diani / Naivasha / Nairobi / About / Contact </ul>
    <a href="book.html" class="nav-cta">Book a stay</a>
    <button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span></button>
  </div>
</nav>
```

- `.nav` is `position: fixed` at the top, `z-index: 100`, 76px tall, transparent over hero images.
- `.on-dark` → ivory links over a dark hero (index, three property pages, about). Scrolling past 40px adds `.scrolled`, which turns the bar into a frosted ivory background with dark text.
- `.on-light` → dark links on ivory from the start (book, contact, 404). No scroll effect.
- The current page's link carries `class="current"`, which renders a brass underline via `::after`.
- Property pages change the CTA to `book.html?location=<slug>` with label "Book Diani" etc.

### 4.2 Footer (identical markup on 7 pages; absent from 404)

Four columns: brand + blurb / Properties / Visit / Get in touch. `--forest-deep` background, hairline top border on the bottom bar, `© 2026 Baraka Collection` and "Made in Kenya."

### 4.3 Home — `index.html`

| Order | Block | Content |
|---|---|---|
| 1 | `.hero` | Full-viewport (100vh/100svh) background photo with dark gradient overlay. `.display-xl` headline "Three Kenyan retreats. One warm welcome.", `.hero-sub`, two CTAs (`.btn-primary` "Book a stay", `.btn-outline-light` "Explore the properties" → `#locations`) |
| 2 | `.section.intro` | Two-column: small `.label` "A note from the owners" with a top rule, plus `.display-lg` statement and one `.lede` paragraph |
| 3 | `hr.divider` | Hairline rule |
| 4 | `.section.locations-preview` (`id="locations"`) | Centred section head "Choose your Kenya." then **three `.location-row` blocks** (Diani, Naivasha, Nairobi). Each row: 4:5 photo with a small `.locator` badge ("The coast" / "The lake" / "The city") + `h3`, `.meta` location line, paragraph, `.btn-text` link. The middle row carries `.reverse` to alternate sides |
| 5 | `.section.promises` | Dark band. Eyebrow + "Small. Careful. Kenyan." + 3 `.promise` cards: "Under fifteen rooms." / "Cooked from where we are." / "Local, first." |
| 6 | `.section.cta-band` | Warm ivory band, "Reserve a room in about two minutes.", `.btn-primary` |
| 7 | `.footer` | — |

### 4.4 Property pages — `diani.html`, `naivasha.html`, `nairobi.html`

All three are structurally identical; only copy, prices and image seeds differ.

| Order | Block | Content |
|---|---|---|
| 1 | `.page-hero` | Full-bleed image with gradient. `.eyebrow` ("The coast · Ukunda" / "The lake · Rift Valley" / "The city · Riverside"), `.display-xl` "Baraka Diani." etc., `.lede` |
| 2 | `.section-tight.location-facts` | Dark strip, 4 `.fact` cells: Address, Rooms, From (price), Best for |
| 3 | `.section.rooms` | Section head + `.rooms-grid` of **3 `.room-card`**: image (3:2), `h4` name, `.price` line, description |
| 4 | `.section.amenities` | Ivory-soft band + `.amenities-grid` of **8 `.amenity`** (top-ruled cells, `h5` + short paragraph) |
| 5 | `.section.gallery` | `.gallery-grid` of **5 images** — the first spans 2×2, the rest are 1×1 |
| 6 | `.section.cta-band` | Location-specific headline and `.btn-primary` with `?location=<slug>` |
| 7 | `.footer` | — |

### 4.5 About — `about.html`

`.page-hero` (eyebrow "About us", "One family. Three houses.") → `.section.about-story` (4:5 founder portrait beside four story paragraphs, 2012 → 2019 → 2023 timeline in prose) → `.section.promises` (dark, 3 cards: "Small on purpose." / "Hired locally." / "Owned, not managed.") → `.cta-band` → footer.

### 4.6 Book — `book.html`

No hero. `main.book-page` with inline `padding-top: calc(var(--nav-height) + 64px)`.

1. Centred intro: eyebrow "Reservation request", `.display-lg` "Book a stay.", `.lede` explaining that payment happens only after confirmation.
2. `#booking-success` — a `.form-success` panel (dark green, centred) that is `display: none` until JS adds `.show`.
3. `#booking-form` — a `.book-form` panel with `novalidate`:
   - Row 1: `full_name` (text), `email` (email)
   - Row 2: `phone` (tel, placeholder "+254…"), `location` (select: empty / diani / naivasha / nairobi)
   - Row 3 (`.triple`): `check_in` (date), `check_out` (date), `room_type` (select: standard / premium / suite / family / not_sure)
   - Row 4: `adults` (select 1–5+), `children` (select none–4+)
   - Row 5 (`.single`): `notes` (textarea, placeholder mentions special occasions, dietary needs, arrival time, transfers)
   - Actions: submit button "Send booking request" + `.form-note` "No payment is taken now…"
4. `.faq-grid` — 4 items: Check-in & check-out, Payment, Cancellation, Children.
5. Footer.

Note: the `room_type` options are **generic** ("Standard double", "Premium / ocean or lake view", "Suite", "Family") and do not match the named room types on the property pages. This is a known inconsistency to fix in a rebuild.

### 4.7 Contact — `contact.html`

No hero. Intro block (eyebrow "Get in touch", "We answer within the day.", `.btn-outline-dark` to the booking form) → `.contact-grid` of **3 `.contact-card`**, each with h4 name, Address, Phone, Email → a general enquiries panel (inline-styled, `--ivory-soft` background, 1px `--line` border) with `hello@…` and the main phone number → footer.

### 4.8 404 — `404.html`

Nav (no current link) → `.error-page`, a flex-centred full-height block with a huge serif "404" in `--forest`, "This page has wandered off.", a sentence of copy, and two buttons (Home, Book a stay). No footer.

---

## 5. Component reference

| Class | Renders |
|---|---|
| `.nav`, `.nav-inner`, `.nav-links`, `.nav-cta`, `.nav-toggle` | Fixed header bar; variants `.on-dark`, `.on-light`, `.scrolled`, `.menu-open` |
| `.brand` | Wordmark text link; `.brand-block` is the larger footer version |
| `.hero`, `.hero-media`, `.hero-inner`, `.hero-sub`, `.hero-cta` | Home full-viewport hero |
| `.page-hero`, `.page-hero-media` | Interior-page hero (same image treatment, shorter) |
| `.container` / `.container-narrow` | Width wrappers |
| `.section` / `.section-tight` | Vertical rhythm wrappers |
| `.display-xl` / `.display-lg` / `.display-md` | Serif heading scale |
| `.lede`, `.eyebrow`, `.label`, `.meta` | Text roles |
| `.btn`, `.btn-primary`, `.btn-outline-light`, `.btn-outline-dark`, `.btn-text` | Button set — filled forest, light outline, dark outline, brass-underlined text link |
| `.divider` | 1px hairline rule |
| `.intro-grid` | Home statement two-column |
| `.locations-preview`, `.section-head`, `.location-row`, `.location-row.reverse`, `.location-row-media`, `.locator` | Home property preview rows |
| `.promises`, `.promises-head`, `.promises-grid`, `.promise` | Dark three-up value band (colour inherited from section, so it works on home and about) |
| `.cta-band` | Warm-ivory centred call to action |
| `.footer`, `.footer-grid`, `.brand-block`, `.footer-blurb`, `.footer-bottom` | Site footer |
| `.rooms`, `.rooms-grid`, `.room-card`, `.room-card-body`, `.price` | Room category cards |
| `.amenities`, `.amenities-head`, `.amenities-grid`, `.amenity` | Amenity grid |
| `.gallery`, `.gallery-grid` | Mosaic gallery (first child spans 2×2) |
| `.location-facts`, `.location-facts-grid`, `.fact` | Dark quick-facts strip |
| `.book-page`, `.book-form`, `.form-row` (+ `.single` / `.triple`), `.form-field`, `.form-actions`, `.form-note` | Booking form |
| `.form-success` / `.form-success.show` | Hidden-until-submit confirmation panel |
| `.faq-grid` | Two-column FAQ |
| `.contact-grid`, `.contact-card` | Contact cards |
| `.about-story`, `.about-story-grid`, `.about-story-body` | About layout |
| `.error-page`, `.error-page .code` | 404 layout |
| `.text-center`, `.mb-0` | Two utility classes only |

---

## 6. JavaScript reference (`js/main.js`)

Single `DOMContentLoaded` listener calls four functions in order. No modules, no dependencies, no error handling.

| Function | Behaviour |
|---|---|
| `initNav()` | Wires `.nav-toggle` to toggle `.menu-open` on both `.nav` and `<body>`, updates `aria-expanded` and `aria-label`, closes on nav-link click, on `.nav-cta` click, on `Escape`, and on resize past 860px. Returns early if the nav/toggle/links are missing (so 404 works fine). |
| `initScroll()` | Only runs when the nav has `.on-dark`. Adds/removes `.scrolled` at `window.scrollY > 40`, listening with `{ passive: true }`. |
| `initBookingForm()` | Finds `#booking-form` and `#booking-success`. Sets `check_in.min` to today (via `new Date().toISOString().split("T")[0]`), keeps `check_out.min` ≥ check-in, clears an invalid check-out. On submit it calls `e.preventDefault()`, hides the form, adds `.show` to the success panel, and smooth-scrolls to it. **No data is sent anywhere.** |
| `prefillLocationFromQuery()` | Reads `?location=` and selects the matching option in the booking form's location dropdown (case-insensitive). |

The Formspree hook is a comment inside `initBookingForm()`:

```js
// Wire to Formspree here: form.action = "https://formspree.io/f/YOUR_ID"; form.method = "POST";
```

There is no other commented-out code and no TODOs in the JS.

---

## 7. Placeholder business data (all must be replaced)

| Item | Current placeholder |
|---|---|
| Brand name | "Baraka Collection" (wordmark, titles, footer, copyright) |
| Property names | Baraka Diani / Baraka Naivasha / Baraka Nairobi |
| General email | `hello@barakacollection.co.ke` |
| Property emails | `diani@`, `naivasha@`, `nairobi@barakacollection.co.ke` |
| General phone | `+254 700 000 000` (footer + booking success message) |
| Property phones | `+254 700 000 001` / `002` / `003` |
| Addresses | Off Diani Beach Road, Ukunda, Kwale County · Moi South Lake Road, Naivasha, Nakuru County · Riverside Drive, Nairobi |
| Diani rooms | Garden Room KES 12,500 · Ocean View Room KES 18,000 · Beachfront Suite KES 28,000 (from KES 12,500, B&B, 12 rooms) |
| Naivasha rooms | Acacia Suite KES 15,000 · Lake View Suite KES 22,000 · Family Cottage KES 32,000 (from KES 15,000, half-board, 8 suites) |
| Nairobi rooms | Courtyard Room KES 9,500 · Garden Room KES 13,500 · Residence Suite KES 22,000 (from KES 9,500, B&B, 14 rooms) |
| Booking FAQs | Check-in 2pm / check-out 11am; 50% deposit on confirmation, balance on arrival, M-Pesa/bank/card; free cancellation up to 14 days; children welcome, cots and high chairs on request |
| Story dates | Diani 2012, Naivasha 2019, Nairobi 2023 |
| Copyright | `© 2026 Baraka Collection` |
| Form endpoint | Not wired — fake success state only |

**Find-and-replace targets for a rebrand:** `Baraka Collection`, `Baraka Diani`, `Baraka Naivasha`, `Baraka Nairobi`, `barakacollection.co.ke`, `+254 700 000 000`, `hello@`, and the `<title>` / `<meta name="description">` of all eight pages.

---

## 8. Imagery

**33 `<img>` elements across the site, all pointing at `https://picsum.photos/seed/...`.** These are random stock photographs chosen by seed — they are not hotel photos, not coastal or lakeside scenery in most cases, and they change subject per seed. This is the single biggest reason the site does not read as a real hotel.

| Page | Count | Seeds (width×height) |
|---|---|---|
| `index.html` | 4 | `baraka-hero` 1800×1200 (hero), `diani-preview` / `naivasha-preview` / `nairobi-preview` 900×1100 (4:5 rows) |
| `diani.html` | 9 | `diani-hero` 1800×1000, 3 room cards 900×600 (`diani-garden`, `diani-oceanview`, `diani-suite`), gallery `diani-g1` 1200×1200 + `diani-g2…g5` 600×600 |
| `naivasha.html` | 9 | `naivasha-hero` 1800×1000, rooms (`naivasha-acacia`, `naivasha-lakeview`, `naivasha-family`), gallery `naivasha-g1…g5` |
| `nairobi.html` | 9 | `nairobi-hero` 1800×1000, rooms (`nairobi-courtyard`, `nairobi-garden`, `nairobi-suite`), gallery `nairobi-g1…g5` |
| `about.html` | 2 | `about-hero` 1800×1000, `about-portrait` 900×1100 (4:5) |
| `book.html`, `contact.html`, `404.html` | 0 | — |

Every image has descriptive `alt` text. Aspect ratios are enforced in CSS (`4/5` for preview rows and the about portrait, `3/2` for room cards, `1/1` for gallery tiles) with `object-fit: cover`, so replacement photos can be any reasonable size.

To swap in real photography: create `/images/` and replace each `src` with a relative path, e.g. `images/diani-hero.jpg`. Suggested shot list is already dictated by the seeds — hero, three room types, and five gallery shots per property, plus a portrait and a hero for About.

**No favicon, no `apple-touch-icon`, no Open Graph or Twitter card tags, no canonical URLs, no `robots.txt`, and no `sitemap.xml` exist anywhere in the repo.**

---

## 9. Known issues and gaps to fix in a rebuild

1. **Booking form does not validate or submit.** The `<form>` has `novalidate` and JS always calls `preventDefault()`. Submitting an entirely empty form shows "Thank you — request received." Either wire Formspree (see README step 6) and remove `novalidate`, or add real client-side validation.
2. **`.gitignore` is malformed.** The file literally begins with `@"` and ends with `"@ | Out-File -Encoding utf8 .gitignore` — a PowerShell here-string pasted directly into the file. The patterns in the middle do still work, but the first and last lines are junk.
3. **Heavy duplication.** Nav, footer and `<head>` font links are copy-pasted across eight files; nothing is templated. A rebrand means editing all eight.
4. **Inline styles.** 54 `style="…"` attributes across the HTML (16 in `book.html`, 15 in `contact.html`, 5–6 in each other page) — spacing, colours and a whole panel's styling bypass the stylesheet.
5. **Room type mismatch** between the property pages' named rooms and the booking form's generic dropdown.
6. **README drift** — the unflatten section describes a state the repo is no longer in.
7. **Inconsistent breakpoints** (400/480/520/720/860) rather than a defined scale.
8. **No SEO plumbing**: no favicon, no OG tags, no canonical, no sitemap, no robots.txt. Meta descriptions do exist on all pages except `404.html`, which has no description.
9. **Accessibility**: images and form labels are handled well (`<label for>`, alt text, `aria-expanded`), but there is no skip link, no visible focus styling override beyond the default form focus state, and the mobile menu does not trap focus or lock background scrolling beyond `body.menu-open { overflow: hidden }`.
10. **No `lang`-level or hreflang variants**, no analytics, and no 404 routing config — the custom `404.html` only works if the host serves it (Render static sites support this; opening files locally will not).

---

## 10. Checklist to rebuild under a new name

1. Copy the eight HTML files, `css/styles.css` and `js/main.js` into the new project (or clone the repo and rename).
2. Replace `Baraka Collection` and the three property names everywhere, including `<title>` tags, meta descriptions, footer `brand-block`, and the copyright line.
3. Replace all contact details: `hello@…`, three property emails, four phone numbers, three addresses.
4. Swap all 33 image `src` values (see the section 8 table for the exact slots and intended subject).
5. If keeping the design system, edit only the `:root` block in `css/styles.css` to re-theme; every colour and font flows from those twelve tokens and two font variables.
6. Rewrite the copy that is brand-specific: hero headline, "A note from the owners", the promises, the About story dates, room names and prices.
7. Wire the booking form to a real endpoint, or keep the prototype success state and label it as such.
8. Add a favicon set, OG tags and canonical URLs per page.

Deliberately left alone: layout, section order, responsive behaviour, nav logic, gallery mosaic, and the form field set — these are the parts that already work and do not depend on the brand.
