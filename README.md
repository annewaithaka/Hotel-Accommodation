# Malewa · Clavina · Clavina Pax — hospitality group website

A static marketing site for a group of three Kenyan hospitality businesses:

* **Malewa** — Malewa Riverside Resort & Cottages, Gilgil (resort and cottages)
* **Clavina** — hotel
* **Clavina Pax** — restaurant and dining

Plain HTML, CSS and vanilla JavaScript. No framework, no bundler, no runtime
dependencies beyond Google Fonts. A small zero-dependency Node script generates
the shared header and footer so they cannot drift between pages.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Working on the site

```bash
node tools/build-pages.mjs    # regenerates every .html file from the shared shell
node tools/check-site.mjs     # QA: fictional content, links, SEO, a11y basics, image slots
```

The published pages are plain HTML and work without any build step.
`build-pages.mjs` is the single source of truth for the shared `<head>`,
navigation and footer, plus the page bodies — edit it and re-run rather than
editing fifteen files by hand.

## Files

```text
index.html              Home — the group
properties.html         The three properties and how they relate
malewa.html             Malewa Riverside Resort & Cottages
stay.html               Accommodation — cottages and the Ololeshwa Cottage
dining.html             Dining — Clavina Pax, plus dining at Malewa
experiences.html        Riverside, hiking, bonfire, camping, games
conferences.html        Conferences and events at Malewa
team-building.html      Team building at Malewa
clavina.html            Clavina (details awaiting confirmation)
clavina-pax.html        Clavina Pax (details awaiting confirmation)
gallery.html            Photography, grouped by property
about.html              The group
contact.html            Contact and directions
book.html               Enquiry form
404.html                Not found

css/styles.css          Design system and all site styles
js/main.js              Navigation, lightbox, photo slots, enquiry form
assets/images/          Client photography, by property — see assets/images/README.md
tools/build-pages.mjs   Page builder (shared shell + page content)
tools/check-site.mjs    Static QA checks
MALEWA-CONTENT-AUDIT.md Confirmed facts vs. what still needs client confirmation
robots.txt, sitemap.xml SEO plumbing
```

## Design system

Colour, spacing, type and breakpoints are all tokens at the top of
`css/styles.css`.

* **Palette** — ivory `#F5EFE4` / `#EDE5D3` / `#FAF6EE`, forest `#2F3E30` /
  `#1F2A20` / `#5A6A5B`, brass `#A6822E` / `#C99E3B`, plus one restrained accent
  per property: Malewa `--river`, Clavina `--clavina`, Clavina Pax `--pax`.
* **Type** — Fraunces for display, Inter for body and interface, on a fluid scale.
* **Spacing** — a 4px-based scale (`--space-1` … `--space-11`) plus fluid section
  rhythm tokens. No arbitrary margins in the markup.
* **Breakpoints** — 420 / 560 / 720 / 860, with the navigation collapsing to the
  menu at 1080px.

## Content rules

Malewa facts come from the client's trifold brochure. **Clavina and Clavina Pax
detail has not been supplied, so it has not been invented.** Where a page needs
that detail it carries an "Awaiting client confirmation" block instead.

Before publishing anything new, check it against `MALEWA-CONTENT-AUDIT.md`. If a
claim is not in the Confirmed section, it does not go on a page.

## Photography

Every photograph is a labelled local slot under `assets/images/`. Missing files
render a quiet, on-brand placeholder naming the slot — never a broken image, and
never stock or AI-generated imagery standing in for the real property.

Drop the client's photographs in at the paths in `assets/images/README.md` and
they appear immediately.

## Going live

1. Set the real domain in `ORIGIN` at the top of `tools/build-pages.mjs`, then
   re-run the builder — this updates canonical URLs, Open Graph and the sitemap.
2. Connect the enquiry form: set `data-endpoint` on `#enquiry-form` to a
   Formspree or CRM endpoint. Until then the form runs in clearly-labelled
   prototype mode.
3. Add the client photography (see `assets/images/README.md`).
4. Work through the "Needs client confirmation" list in
   `MALEWA-CONTENT-AUDIT.md`.
5. Deploy the folder as a static site (Render, Netlify, GitHub Pages, any static
   host). Build command: none. Publish directory: `.`
