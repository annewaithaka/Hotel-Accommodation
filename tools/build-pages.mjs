/**
 * Malewa · Clavina · Clavina Pax — page builder
 *
 * The published site is plain static HTML. This script is the single source
 * of truth for the shared head, navigation and footer so those blocks can
 * never drift between pages.
 *
 *   node tools/build-pages.mjs
 *
 * Content rules:
 *   - Malewa facts come from the resort's trifold brochure.
 *   - Clavina and Clavina Pax detail is NOT invented. Where it is missing the
 *     page carries a .pending block instead of a made-up claim.
 *   - See MALEWA-CONTENT-AUDIT.md for the confirmed / to-confirm split.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* --- Site constants ------------------------------------------------
   ORIGIN is a placeholder — replace it with the confirmed domain before
   launch. It feeds the canonical tags, Open Graph URLs and the sitemap.
   The group name is deliberately neutral ("Our Properties") because no
   corporate name was supplied. */

const ORIGIN = "https://malewariversideresort.co.ke";
const GROUP_NAME = "Our Properties";
const GROUP_DESCRIPTOR = "Malewa · Clavina · Clavina Pax";

const PHONES = [
  { label: "+254 704 025 999", href: "tel:+254704025999" },
  { label: "+254 704 026 208", href: "tel:+254704026208" },
  { label: "+254 722 968 154", href: "tel:+254722968154" },
];
const EMAIL = "malewariversideresort@gmail.com";
const SOCIAL_IMAGE = `${ORIGIN}/assets/images/branding/malewa-riverside-social.jpg`;

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "index.html" },
  { key: "properties", label: "Properties", href: "properties.html" },
  { key: "stay", label: "Stay", href: "stay.html" },
  { key: "dining", label: "Dining", href: "dining.html" },
  { key: "experiences", label: "Experiences", href: "experiences.html" },
  { key: "gallery", label: "Gallery", href: "gallery.html" },
  { key: "about", label: "About", href: "about.html" },
  { key: "contact", label: "Contact", href: "contact.html" },
];

/* --- Helpers -------------------------------------------------------- */

const photo = (src, alt, { slot, ratio = "landscape", extra = "", lazy = true } = {}) =>
  `<figure class="photo photo--${ratio}${extra ? ` ${extra}` : ""}" data-slot="${slot}">
          <img src="${src}" alt="${alt}" loading="${lazy ? "lazy" : "eager"}" decoding="async" />
        </figure>`;

const coverPhoto = (src, alt, { slot, extra = "" }) =>
  `<div class="photo photo--cover${extra ? ` ${extra}` : ""}" data-slot="${slot}">
      <img src="${src}" alt="${alt}" fetchpriority="high" decoding="async" />
    </div>`;

const sectionHead = ({ eyebrow, title, lede, center = false, size = "lg" }) =>
  `<div class="section-head${center ? " section-head--center" : ""}">
        <span class="eyebrow">${eyebrow}</span>
        <h2 class="display-${size}">${title}</h2>
        ${lede ? `<p class="lede">${lede}</p>` : ""}
      </div>`;

const ruleItems = (items) =>
  items
    .map(
      (item) => `<div class="rule-item">
          <h3>${item.title}</h3>
          <p>${item.copy}</p>
        </div>`
    )
    .join("\n        ");

const facts = (items) =>
  `<dl class="facts__grid">
        ${items
          .map(
            (item) => `<div class="fact">
          <dt>${item.term}</dt>
          <dd>${item.detail}</dd>
        </div>`
          )
          .join("\n        ")}
      </dl>`;

const tickList = (items) =>
  `<ul class="tick-list">
          ${items.map((item) => `<li>${item}</li>`).join("\n          ")}
        </ul>`;

const contactBlocks = (items) =>
  items
    .map(
      (item) => `<div class="contact-block">
          <h3>${item.title}</h3>
          ${item.html}
        </div>`
    )
    .join("\n        ");

/* A production placeholder. Used only where a fact is genuinely unknown. */
const pending = ({ heading, copy, items }) =>
  `<div class="pending">
          <span class="pending__label">Awaiting client confirmation</span>
          <h3>${heading}</h3>
          <p>${copy}</p>
          ${
            items
              ? `<ul>
            ${items.map((item) => `<li>${item}</li>`).join("\n            ")}
          </ul>`
              : ""
          }
        </div>`;

const propertyCard = ({ accent, role, name, copy, href, linkLabel, src, alt, slot }) =>
  `<article class="property-card accent-${accent}">
          ${photo(src, alt, { slot })}
          <div class="property-card__body">
            <span class="property-card__role">${role}</span>
            <h3 class="property-card__name">${name}</h3>
            <p>${copy}</p>
            <a class="link-arrow" href="${href}">${linkLabel}</a>
          </div>
        </article>`;

/* --- Page shell ----------------------------------------------------- */

function head({ title, description, path, ogTitle, ogDescription, schema }) {
  const url = `${ORIGIN}/${path === "index.html" ? "" : path}`;
  const ogT = ogTitle || title;
  const ogD = ogDescription || description;

  return `<meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  <meta name="theme-color" content="#1F2A20" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${GROUP_NAME}" />
  <meta property="og:locale" content="en_KE" />
  <meta property="og:title" content="${ogT}" />
  <meta property="og:description" content="${ogD}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SOCIAL_IMAGE}" />
  <meta property="og:image:alt" content="Malewa Riverside Resort &amp; Cottages, Gilgil" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogT}" />
  <meta name="twitter:description" content="${ogD}" />
  <meta name="twitter:image" content="${SOCIAL_IMAGE}" />

  <link rel="icon" href="favicon.ico" sizes="any" />
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="apple-touch-icon.png" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="css/styles.css" />
${schema ? `  <script type="application/ld+json">\n${schema}\n  </script>\n` : ""}`;
}

function nav({ active, variant = "overlay" }) {
  const links = NAV_ITEMS.map(
    (item) =>
      `        <li><a href="${item.href}"${item.key === active ? ' aria-current="page"' : ""}>${item.label}</a></li>`
  ).join("\n");

  return `<nav class="site-nav site-nav--${variant}" aria-label="Main">
    <div class="site-nav__inner">
      <a class="site-nav__brand" href="index.html">
        ${GROUP_NAME}
        <small>${GROUP_DESCRIPTOR}</small>
      </a>
      <ul class="site-nav__links" id="site-menu">
${links}
      </ul>
      <a class="site-nav__cta" href="book.html">Book / Enquire</a>
      <button class="site-nav__toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Open menu"><span></span></button>
    </div>
  </nav>`;
}

function footer() {
  return `<footer class="site-footer">
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <p class="site-footer__brand">${GROUP_NAME}</p>
          <p class="site-footer__blurb">Malewa, Clavina and Clavina Pax — a riverside resort and cottages in Gilgil, a hotel, and the group's restaurant.</p>
        </div>
        <nav aria-labelledby="footer-properties">
          <h2 id="footer-properties">Properties</h2>
          <ul>
            <li><a href="malewa.html">Malewa Riverside Resort &amp; Cottages</a></li>
            <li><a href="clavina.html">Clavina</a></li>
            <li><a href="clavina-pax.html">Clavina Pax</a></li>
            <li><a href="properties.html">All properties</a></li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore">Explore</h2>
          <ul>
            <li><a href="stay.html">Accommodation</a></li>
            <li><a href="dining.html">Dining</a></li>
            <li><a href="conferences.html">Conferences &amp; Events</a></li>
            <li><a href="team-building.html">Team Building</a></li>
            <li><a href="experiences.html">Experiences</a></li>
            <li><a href="gallery.html">Gallery</a></li>
          </ul>
        </nav>
        <div>
          <h2>Visit &amp; contact</h2>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="contact.html">Contact &amp; directions</a></li>
            <li><a href="book.html">Book / make an enquiry</a></li>
          </ul>
          <h2 class="site-footer__subhead">Malewa Riverside</h2>
          <ul>
            <li>Malewa-Kimbo Area, Gilgil<br />On the shores of River Malewa<br />About 12 km from Gilgil town</li>
            ${PHONES.map((phone) => `<li><a href="${phone.href}">${phone.label}</a></li>`).join("\n            ")}
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <p>&copy; 2026 ${GROUP_NAME} — Malewa, Clavina &amp; Clavina Pax.</p>
        <p>Malewa-Kimbo Area, Gilgil, Kenya</p>
      </div>
    </div>
  </footer>`;
}

function page({ head: headData, nav: navData, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${head(headData)}
</head>
<body>

  <a class="skip-link" href="#main">Skip to content</a>

  ${nav(navData)}

${body}

  ${footer()}

  <script src="js/main.js"></script>
</body>
</html>
`;
}

function write(file, html) {
  writeFileSync(join(ROOT, file), html, "utf8");
  console.log(`  ${file}`);
}

/* --- Imagery --------------------------------------------------------
   Every photograph is a labelled local slot. Filenames describe the
   subject the photograph should show. See assets/images/README.md. */

const M = "assets/images/malewa";
const C = "assets/images/clavina";
const P = "assets/images/clavina-pax";

const IMG = {
  /* Malewa */
  mHero: `${M}/hero/malewa-riverside-hero.jpg`,
  mSetting: `${M}/hero/malewa-riverside-setting.jpg`,
  mGrounds: `${M}/exterior/malewa-resort-grounds.jpg`,
  mCottages: `${M}/exterior/malewa-cottages-exterior.jpg`,
  mCottageInterior: `${M}/accommodation/malewa-cottage-interior.jpg`,
  mOloleshwa: `${M}/accommodation/ololeshwa-cottage.jpg`,
  mOloleshwaLiving: `${M}/accommodation/ololeshwa-cottage-living-room.jpg`,
  mOloleshwaKitchen: `${M}/accommodation/ololeshwa-cottage-kitchen-dining.jpg`,
  mOloleshwaFireplace: `${M}/accommodation/ololeshwa-cottage-outdoor-fireplace.jpg`,
  mRestaurant: `${M}/restaurant/malewa-main-restaurant.jpg`,
  mRestaurantTable: `${M}/restaurant/malewa-restaurant-dining.jpg`,
  mCoffeeBar: `${M}/restaurant/skyline-coffee-bar.jpg`,
  mDiningDetail: `${M}/restaurant/malewa-dining-detail.jpg`,
  mConference: `${M}/conference/malewa-conference-hall.jpg`,
  mBreakout: `${M}/conference/malewa-executive-breakout-room.jpg`,
  mGazebo: `${M}/conference/malewa-outdoor-gazebo.jpg`,
  mDelegates: `${M}/conference/malewa-conference-delegates.jpg`,
  mTeamGrounds: `${M}/team-building/malewa-team-building-grounds.jpg`,
  mTeamActivities: `${M}/team-building/malewa-team-building-activities.jpg`,
  mRiver: `${M}/riverside/malewa-river.jpg`,
  mRiversideMeals: `${M}/riverside/malewa-riverside-meals.jpg`,
  mHiking: `${M}/experiences/malewa-scenic-hiking.jpg`,
  mBonfire: `${M}/experiences/malewa-bonfire.jpg`,
  mTableTennis: `${M}/experiences/malewa-table-tennis.jpg`,
  mBoardGames: `${M}/experiences/malewa-board-games.jpg`,
  mCamping: `${M}/experiences/malewa-camping-tents.jpg`,
  mOutdoors: `${M}/experiences/malewa-outdoor-spaces.jpg`,

  /* Clavina */
  cHero: `${C}/hero/clavina-hero.jpg`,
  cExterior: `${C}/exterior/clavina-exterior.jpg`,
  cAccommodation: `${C}/accommodation/clavina-accommodation.jpg`,
  cDining: `${C}/dining/clavina-dining.jpg`,

  /* Clavina Pax */
  pHero: `${P}/hero/clavina-pax-hero.jpg`,
  pDiningRoom: `${P}/dining/clavina-pax-dining-room.jpg`,
  pTable: `${P}/dining/clavina-pax-table.jpg`,
  pFood: `${P}/dining/clavina-pax-food.jpg`,
  pEvents: `${P}/events/clavina-pax-events.jpg`,
};

/* --- Gallery --------------------------------------------------------- */

const MALEWA_GALLERY = [
  { src: `${M}/gallery/malewa-river-bend.jpg`, alt: "The River Malewa flowing past the resort grounds at Gilgil", caption: "The River Malewa", ratio: "wide" },
  { src: `${M}/gallery/malewa-cottage-veranda.jpg`, alt: "Veranda of one of the cottages at Malewa Riverside Resort", caption: "Cottage veranda", ratio: "tall" },
  { src: `${M}/gallery/malewa-restaurant-interior.jpg`, alt: "Inside the Main Restaurant at Malewa Riverside Resort", caption: "Main Restaurant", ratio: "square" },
  { src: `${M}/gallery/skyline-coffee-bar-counter.jpg`, alt: "The Skyline Coffee Bar at Malewa Riverside Resort", caption: "Skyline Coffee Bar", ratio: "square" },
  { src: `${M}/gallery/malewa-gazebo-lunch.jpg`, alt: "The outdoor gazebo set up for a group at the resort", caption: "The outdoor gazebo", ratio: "wide" },
  { src: `${M}/gallery/malewa-garden-path.jpg`, alt: "A garden path through the resort grounds", caption: "Gardens and grounds", ratio: "tall" },
  { src: `${M}/gallery/malewa-hiking-view.jpg`, alt: "View from the scenic hiking area at the resort", caption: "Scenic hiking", ratio: "wide" },
  { src: `${M}/gallery/malewa-bonfire-night.jpg`, alt: "The bonfire site lit in the evening at Malewa Riverside Resort", caption: "The bonfire site", ratio: "square" },
  { src: `${M}/gallery/malewa-conference-hall-in-session.jpg`, alt: "A conference session under way in one of the resort halls", caption: "Conference hall", ratio: "wide" },
  { src: `${M}/gallery/malewa-table-tennis-lawn.jpg`, alt: "Table tennis on the lawns at Malewa Riverside Resort", caption: "Table tennis", ratio: "tall" },
  { src: `${M}/gallery/malewa-camping-tents-riverside.jpg`, alt: "Camping tents pitched near the river at the resort", caption: "Camping and tents", ratio: "wide" },
  { src: `${M}/gallery/malewa-riverside-meal.jpg`, alt: "A meal served beside the River Malewa", caption: "Riverside meals", ratio: "tall" },
];

const CLAVINA_GALLERY = [
  { src: `${C}/gallery/clavina-exterior-view.jpg`, alt: "Clavina — exterior photograph to be supplied", caption: "Clavina", ratio: "wide" },
  { src: `${C}/gallery/clavina-interior-view.jpg`, alt: "Clavina — interior photograph to be supplied", caption: "Clavina", ratio: "tall" },
  { src: `${C}/gallery/clavina-detail-view.jpg`, alt: "Clavina — detail photograph to be supplied", caption: "Clavina", ratio: "square" },
];

const PAX_GALLERY = [
  { src: `${P}/gallery/clavina-pax-interior.jpg`, alt: "Clavina Pax — dining room photograph to be supplied", caption: "Clavina Pax", ratio: "wide" },
  { src: `${P}/gallery/clavina-pax-table-set.jpg`, alt: "Clavina Pax — table setting photograph to be supplied", caption: "At the table", ratio: "tall" },
  { src: `${P}/gallery/clavina-pax-plate.jpg`, alt: "Clavina Pax — food photograph to be supplied", caption: "From the kitchen", ratio: "square" },
];

const galleryMarkup = (items) =>
  `<div class="gallery-mosaic">
        ${items
          .map(
            (item) => `<button class="gallery-item" type="button"
          data-lightbox-src="${item.src}"
          data-lightbox-alt="${item.alt}"
          data-lightbox-caption="${item.caption}">
          ${photo(item.src, item.alt, { slot: `Gallery — ${item.caption}`, ratio: item.ratio })}
          <span class="gallery-item__caption">${item.caption}</span>
        </button>`
          )
          .join("\n        ")}
      </div>`;

/* --- Structured data (confirmed information only) -------------------- */

const resortSchema = JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Resort",
    name: "Malewa Riverside Resort & Cottages",
    description:
      "A peaceful riverside retreat for leisure, business and celebrations, on the shores of the River Malewa in the Malewa-Kimbo area of Gilgil, Kenya.",
    url: `${ORIGIN}/malewa.html`,
    email: EMAIL,
    telephone: ["+254-704025999", "+254-704026208", "+254-722968154"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Malewa-Kimbo Area",
      addressLocality: "Gilgil",
      addressCountry: "KE",
    },
    amenityFeature: [
      "Luxury cottages",
      "Main Restaurant",
      "Skyline Coffee Bar",
      "Conference halls",
      "Executive breakout room",
      "Outdoor gazebo",
      "High-speed Wi-Fi",
      "Team building grounds",
      "Bonfire site",
      "Scenic hiking area",
      "Table tennis",
      "Board games",
      "Camping and tents",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
  },
  null,
  2
);

/* =========================================================
   HOME — the group
   ========================================================= */

const homeBody = `  <header class="hero">
    ${coverPhoto(IMG.mHero, "Malewa Riverside Resort & Cottages seen from across the River Malewa at Gilgil", {
      slot: "Home hero",
      extra: "hero__media",
    })}
    <div class="container">
      <div class="hero__inner">
        <p class="hero__wordmark">Malewa &middot; Clavina &middot; Clavina Pax</p>
        <h1 class="hero__title display-xl">Stay. Gather. Dine. Experience.</h1>
        <p class="hero__sub">A riverside resort and cottages in Gilgil, a hotel, and a restaurant — three destinations looked after by one team, for holidays, working retreats and celebrations.</p>
        <div class="hero__actions btn-row">
          <a href="properties.html" class="btn btn--primary">Explore the properties</a>
          <a href="book.html" class="btn btn--outline-light">Book / make an enquiry</a>
        </div>
        <ul class="hero__facts">
          <li>Riverside resort &amp; cottages in Gilgil</li>
          <li>A hotel in the group</li>
          <li>Clavina Pax for dining</li>
          <li>Conferences, events &amp; team building</li>
        </ul>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section section--tight facts" aria-label="The group at a glance">
    <div class="container">
      ${facts([
        { term: "Malewa", detail: "Riverside resort &amp; cottages — Malewa-Kimbo Area, Gilgil" },
        { term: "Clavina", detail: "A hotel in the group" },
        { term: "Clavina Pax", detail: "The group's restaurant and dining" },
        { term: "Enquiries", detail: "One form covers all three properties" },
      ])}
    </div>
  </section>

  <section class="section" id="properties">
    <div class="container">
      ${sectionHead({
        eyebrow: "The properties",
        title: "Three destinations, one team.",
        lede: "Malewa is where you stay by the river. Clavina is the group's hotel. Clavina Pax is where the group dines. Each has its own character — the welcome runs through all three.",
      })}
      <div class="grid-3">
        ${propertyCard({
          accent: "malewa",
          role: "Hotel &middot; Resort &middot; Cottages",
          name: "Malewa",
          copy: "Riverside cottages, the Ololeshwa Cottage, a main restaurant and coffee bar, conference halls and open grounds — on the shores of the River Malewa in Gilgil.",
          href: "malewa.html",
          linkLabel: "Explore Malewa",
          src: IMG.mCottages,
          alt: "Cottages at Malewa Riverside Resort in Gilgil",
          slot: "Properties — Malewa",
        })}
        ${propertyCard({
          accent: "clavina",
          role: "Hotel",
          name: "Clavina",
          copy: "Clavina is the group's hotel. Its room types, rates and facilities are being confirmed — ask us and we will tell you what is available.",
          href: "clavina.html",
          linkLabel: "About Clavina",
          src: IMG.cHero,
          alt: "Clavina — photograph to be supplied",
          slot: "Properties — Clavina",
        })}
        ${propertyCard({
          accent: "pax",
          role: "Restaurant &middot; Dining",
          name: "Clavina Pax",
          copy: "The group's restaurant — the dining destination for guests and visitors, and for gatherings around a table.",
          href: "clavina-pax.html",
          linkLabel: "Discover Clavina Pax",
          src: IMG.pHero,
          alt: "Clavina Pax — restaurant photograph to be supplied",
          slot: "Properties — Clavina Pax",
        })}
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      <div class="feature">
        <div class="feature__media">
          ${photo(IMG.mRiver, "The River Malewa at the edge of the resort grounds", {
            slot: "Home — riverside",
          })}
        </div>
        <div class="feature__body">
          <span class="eyebrow">Malewa Riverside Resort &amp; Cottages</span>
          <h2 class="display-md">A riverside retreat in Gilgil.</h2>
          <p class="lede">On the shores of the River Malewa in the Malewa-Kimbo area, about 12 km from Gilgil town — a peaceful setting for leisure, business and celebrations.</p>
          <p>Cottages and the private four-room Ololeshwa Cottage, the Main Restaurant and the Skyline Coffee Bar, conference halls with an executive breakout room, an outdoor gazebo and expansive grounds for team building.</p>
          <div class="btn-row">
            <a href="malewa.html" class="btn btn--outline-light">Explore Malewa</a>
            <a href="stay.html" class="btn btn--outline-light">See accommodation</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Stay with us",
        title: "Cottages on the river.",
        lede: "Two ways to stay at Malewa: our luxury cottages, or the private four-room Ololeshwa Cottage with its own kitchen, living room and outdoor fireplace.",
      })}
      <div class="grid-2">
        <article class="card">
          <div class="card__media">
            ${photo(IMG.mCottages, "Cottages at Malewa Riverside Resort in Gilgil", {
              slot: "Stay — cottages",
            })}
          </div>
          <div class="card__body">
            <h3>Cottages</h3>
            <p class="card__meta">Single or double occupancy · 1–6 rooms</p>
            <p>Booked on bed &amp; breakfast, half board or full board, priced per room, per night, with rates banded by the number of rooms your booking takes.</p>
            <p class="card__price">From KES 6,000 per room, per night</p>
            <a class="link-arrow" href="stay.html">Explore accommodation</a>
          </div>
        </article>
        <article class="card">
          <div class="card__media">
            ${photo(IMG.mOloleshwa, "The Ololeshwa Cottage at Malewa Riverside Resort", {
              slot: "Stay — Ololeshwa Cottage",
            })}
          </div>
          <div class="card__body">
            <h3>Ololeshwa Cottage</h3>
            <p class="card__meta">A private four-room ensuite cottage</p>
            <p>Four ensuite rooms with an open kitchen and dining area, a comfortable living room and an outdoor fireplace — bed &amp; breakfast, or self-catering.</p>
            <p class="card__price">From KES 5,000 per room, per night</p>
            <a class="link-arrow" href="stay.html#ololeshwa">See the Ololeshwa Cottage</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Dine with us",
        title: "Clavina Pax, and dining at Malewa.",
        lede: "Clavina Pax is the group's restaurant. At Malewa, the Main Restaurant and the Skyline Coffee Bar look after guests staying at the resort.",
      })}
      <div class="feature accent-pax">
        <div class="feature__media">
          ${photo(IMG.pDiningRoom, "Clavina Pax — dining room photograph to be supplied", {
            slot: "Dining — Clavina Pax dining room",
          })}
        </div>
        <div class="feature__body">
          <span class="eyebrow">Clavina Pax</span>
          <h2 class="display-md">The group's restaurant.</h2>
          <p>A dining destination in its own right — for guests of the group, for visitors, and for gatherings arranged around a table.</p>
          <p>Menus, service times and reservations are confirmed directly with the restaurant.</p>
          <div class="btn-row">
            <a href="clavina-pax.html" class="btn btn--primary">Discover Clavina Pax</a>
          </div>
        </div>
      </div>
      <div class="grid-2 space-top-lg">
        <article class="card">
          <div class="card__media">
            ${photo(IMG.mRestaurant, "The Main Restaurant at Malewa Riverside Resort", {
              slot: "Dining — Main Restaurant",
            })}
          </div>
          <div class="card__body">
            <h3>Main Restaurant <span class="card__meta">· Malewa</span></h3>
            <p>The main dining room for resident guests and day visitors, and where conference and retreat groups are hosted.</p>
            <a class="link-arrow" href="dining.html#malewa">Dining at Malewa</a>
          </div>
        </article>
        <article class="card">
          <div class="card__media">
            ${photo(IMG.mCoffeeBar, "The Skyline Coffee Bar at Malewa Riverside Resort", {
              slot: "Dining — Skyline Coffee Bar",
            })}
          </div>
          <div class="card__body">
            <h3>Skyline Coffee Bar <span class="card__meta">· Malewa</span></h3>
            <p>The resort's coffee bar — somewhere to settle in with a cup between meetings, in the afternoon, or as the evening starts.</p>
            <a class="link-arrow" href="dining.html#skyline">See the Skyline Coffee Bar</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      ${sectionHead({
        eyebrow: "Gather &amp; connect",
        title: "Meet. Gather. Retreat.",
        lede: "Conference halls, an executive breakout room, an outdoor gazebo and accommodation for delegates — close enough to Gilgil for an easy arrival, far enough for a working retreat to feel like time away.",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "Conference halls", copy: "Indoor halls for seminars, presentations and church conferences." },
          { title: "Executive breakout room", copy: "A quieter room for small sessions, committees and planning." },
          { title: "Outdoor gazebo", copy: "Sheltered outdoor space for informal sessions and group meals." },
          { title: "Accommodation for delegates", copy: "Cottages at the resort so your group can stay on site." },
        ])}
      </div>
      <div class="btn-row space-top-lg">
        <a href="conferences.html" class="btn btn--outline-light">Conferences &amp; events</a>
        <a href="team-building.html" class="btn btn--outline-light">Team building</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Experience Malewa",
        title: "Riverside days and wide-open grounds.",
        lede: "The setting does a lot of the work here. These are the experiences the resort is set up for.",
      })}
      <div class="rule-list">
        ${ruleItems([
          { title: "Riverside setting", copy: "The River Malewa runs along the edge of the grounds." },
          { title: "Scenic hiking", copy: "A hiking area for guests who want to walk out and look around." },
          { title: "Bonfire site", copy: "An evening fire for groups and quiet nights alike." },
          { title: "Table tennis", copy: "A quick game between sessions or after lunch." },
          { title: "Board games", copy: "Something to do together when the day slows down." },
          { title: "Camping &amp; tents", copy: "Pitch a tent and stay closer to the river." },
          { title: "Outdoor spaces", copy: "Open grounds for groups, games and team building." },
          { title: "High-speed Wi-Fi", copy: "Available across the resort for working guests." },
          { title: "Riverside meals", copy: "Meals and coffee without leaving the grounds." },
        ])}
      </div>
      <div class="btn-row space-top-lg">
        <a href="experiences.html" class="btn btn--outline-dark">Explore experiences</a>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Gallery",
        title: "A look around.",
        lede: "Malewa first, with Clavina and Clavina Pax frames to follow as their photography is confirmed.",
      })}
      ${galleryMarkup([MALEWA_GALLERY[0], MALEWA_GALLERY[2], MALEWA_GALLERY[5], MALEWA_GALLERY[1], MALEWA_GALLERY[10]])}
      <div class="btn-row space-top-lg">
        <a href="gallery.html" class="btn btn--outline-dark">Explore the gallery</a>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      <div class="feature">
        <div class="feature__media">
          <div class="map-slot">
            <span class="map-slot__label">Map</span>
            <p>Malewa-Kimbo Area, Gilgil — on the shores of the River Malewa, about 12 km from Gilgil town.</p>
            <a class="link-arrow" href="https://www.google.com/maps/search/?api=1&amp;query=Malewa%20Riverside%20Resort%20Gilgil" target="_blank" rel="noopener noreferrer">Get directions</a>
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">Find us</span>
          <h2 class="display-md">About 12 km from Gilgil town.</h2>
          <p class="lede">Malewa Riverside Resort &amp; Cottages is in the Malewa-Kimbo area of Gilgil, on the shores of the River Malewa. Call ahead and we will help you with the last stretch of the journey.</p>
          <ul class="tick-list">
            ${PHONES.map((phone) => `<li><a href="${phone.href}">${phone.label}</a></li>`).join("\n            ")}
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          </ul>
          <div class="btn-row">
            <a href="contact.html" class="btn btn--outline-light">Contact us</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--warm cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Plan your stay</span>
      <h2 class="display-lg">Tell us what you are planning.</h2>
      <p class="lede">A stay, a table, a conference or a team retreat — send us the outline and we will come back with what is available.</p>
      <div class="btn-row">
        <a href="book.html" class="btn btn--primary">Book / make an enquiry</a>
        <a href="tel:+254704025999" class="btn btn--outline-dark">Call +254 704 025 999</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   PROPERTIES
   ========================================================= */

const propertiesBody = `  <header class="page-hero">
    ${coverPhoto(IMG.mGrounds, "The grounds at Malewa Riverside Resort", {
      slot: "Properties — group hero",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">The properties</span>
        <h1 class="display-xl">Three destinations, one team.</h1>
        <p class="lede">Malewa, Clavina and Clavina Pax belong to the same group. Each has its own purpose and its own character, and one enquiry reaches all three.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section">
    <div class="container">
      <div class="grid-3">
        ${propertyCard({
          accent: "malewa",
          role: "Hotel &middot; Resort &middot; Cottages",
          name: "Malewa",
          copy: "Malewa Riverside Resort &amp; Cottages sits on the shores of the River Malewa in the Malewa-Kimbo area of Gilgil, about 12 km from Gilgil town.",
          href: "malewa.html",
          linkLabel: "Explore Malewa",
          src: IMG.mCottages,
          alt: "Cottages at Malewa Riverside Resort in Gilgil",
          slot: "Properties — Malewa",
        })}
        ${propertyCard({
          accent: "clavina",
          role: "Hotel",
          name: "Clavina",
          copy: "The group's hotel. Room types, rates, facilities and photography are being confirmed before publication.",
          href: "clavina.html",
          linkLabel: "About Clavina",
          src: IMG.cHero,
          alt: "Clavina — photograph to be supplied",
          slot: "Properties — Clavina",
        })}
        ${propertyCard({
          accent: "pax",
          role: "Restaurant &middot; Dining",
          name: "Clavina Pax",
          copy: "The group's restaurant — dining for guests and visitors, and a setting for gatherings and events.",
          href: "clavina-pax.html",
          linkLabel: "Discover Clavina Pax",
          src: IMG.pHero,
          alt: "Clavina Pax — restaurant photograph to be supplied",
          slot: "Properties — Clavina Pax",
        })}
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      <div class="intro-grid">
        <p class="intro-grid__label">How the group fits together</p>
        <div class="intro-grid__body">
          <h2 class="display-lg">Stay, dine, gather — or all three.</h2>
          <p class="lede">The three properties cover the different reasons people come: somewhere to stay, somewhere to eat, and somewhere to hold a programme that needs both.</p>
          <div class="group-tree space-top-md">
            <p class="group-tree__root">Our properties</p>
            <div class="group-tree__list">
              <div class="group-tree__item accent-malewa">
                <span class="group-tree__name">Malewa</span>
                <span class="group-tree__role">Hotel, resort and cottages — riverside setting in Gilgil, with conference and team building facilities.</span>
              </div>
              <div class="group-tree__item accent-clavina">
                <span class="group-tree__name">Clavina</span>
                <span class="group-tree__role">Hotel — property details awaiting confirmation.</span>
              </div>
              <div class="group-tree__item accent-pax">
                <span class="group-tree__name">Clavina Pax</span>
                <span class="group-tree__role">Restaurant and dining — menu, service times and reservations confirmed by the restaurant.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Malewa",
        title: "The riverside property.",
        lede: "Malewa is where the group's confirmed material is strongest: accommodation, dining, conference facilities and outdoor experiences in one place.",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "Luxury cottages", copy: "Single or double occupancy, on bed &amp; breakfast, half board or full board." },
          { title: "Ololeshwa Cottage", copy: "A private four-room ensuite cottage with its own kitchen and living room." },
          { title: "Main Restaurant &amp; Skyline Coffee Bar", copy: "Dining for guests, day visitors and groups." },
          { title: "Conference &amp; events", copy: "Halls, an executive breakout room, an outdoor gazebo and delegate accommodation." },
          { title: "Team building grounds", copy: "Expansive outdoor spaces designed for team bonding." },
          { title: "High-speed Wi-Fi", copy: "Available across the resort." },
          { title: "Bonfire, hiking &amp; camping", copy: "A bonfire site, a scenic hiking area and room for tents." },
          { title: "Table tennis &amp; board games", copy: "Games for the quieter hours." },
        ])}
      </div>
      <div class="btn-row space-top-lg">
        <a href="malewa.html" class="btn btn--primary">Explore Malewa</a>
        <a href="stay.html" class="btn btn--outline-dark">See accommodation</a>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina &amp; Clavina Pax",
        title: "Two properties still being written.",
        lede: "We would rather show you an honest blank than a made-up page. These are the details we are waiting on before Clavina and Clavina Pax go live in full.",
      })}
      <div class="grid-2">
        ${pending({
          heading: "Clavina — property details",
          copy: "Clavina is part of the group. The following are needed from the client before the page can be completed.",
          items: [
            "Location and directions",
            "Room types and occupancy",
            "Rates and meal plans",
            "Facilities and services",
            "Photography",
            "Contact details for the property",
          ],
        })}
        ${pending({
          heading: "Clavina Pax — restaurant details",
          copy: "Clavina Pax is the group's restaurant. The following are needed from the client before the page can be completed.",
          items: [
            "Menus and cuisine",
            "Opening hours and service times",
            "Reservation process",
            "Seating capacity and private dining",
            "Events and group dining",
            "Photography",
          ],
        })}
      </div>
    </div>
  </section>

  <section class="section section--warm cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Enquire</span>
      <h2 class="display-lg">One enquiry, three properties.</h2>
      <p class="lede">Tell us which property you are asking about and what you have in mind. We will route it to the right team.</p>
      <div class="btn-row">
        <a href="book.html" class="btn btn--primary">Book / make an enquiry</a>
        <a href="contact.html" class="btn btn--outline-dark">Contact us</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   MALEWA — property page
   ========================================================= */

const malewaBody = `  <header class="page-hero">
    ${coverPhoto(IMG.mHero, "Malewa Riverside Resort & Cottages at Gilgil", {
      slot: "Malewa — hero",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Malewa</span>
        <h1 class="display-xl">Malewa Riverside Resort &amp; Cottages.</h1>
        <p class="lede">A peaceful riverside retreat in Gilgil for leisure, business and celebrations — on the shores of the River Malewa, about 12 km from Gilgil town.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section section--tight facts" aria-label="Malewa at a glance">
    <div class="container">
      ${facts([
        { term: "Where", detail: "Malewa-Kimbo Area, Gilgil, Kenya" },
        { term: "Setting", detail: "On the shores of the River Malewa" },
        { term: "Stay", detail: "Luxury cottages and the Ololeshwa Cottage" },
        { term: "Gather", detail: "Conference halls, outdoor gazebo, breakout room" },
      ])}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="intro-grid">
        <p class="intro-grid__label">The resort</p>
        <div class="intro-grid__body">
          <h2 class="display-lg">One riverside address for rest, business and celebrations.</h2>
          <p class="lede">Malewa Riverside Resort &amp; Cottages sits in the Malewa-Kimbo area of Gilgil, on the shores of the River Malewa and about 12 km from Gilgil town. Guests come for a quiet weekend, for a conference that gets real work done, or for a celebration with room to breathe.</p>
          <p>There is a main restaurant and the Skyline Coffee Bar, conference halls and an executive breakout room, an outdoor gazebo, a bonfire site and grounds that open out towards the river. Everything is in one place, in the same calm setting — with high-speed Wi-Fi through the resort for guests who need it.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "What is here",
        title: "Stay, dine, gather and explore.",
        lede: "Four ways to use the resort — each with its own page.",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "Stay", copy: "Luxury cottages on bed &amp; breakfast, half board or full board, plus the private Ololeshwa Cottage." },
          { title: "Dine", copy: "The Main Restaurant and the Skyline Coffee Bar, for guests and day visitors." },
          { title: "Gather", copy: "Conference halls, an executive breakout room, an outdoor gazebo and delegate accommodation." },
          { title: "Explore", copy: "Riverside grounds, scenic hiking, a bonfire site, camping and games." },
        ])}
      </div>
      <div class="btn-row space-top-lg">
        <a href="stay.html" class="btn btn--primary">See accommodation</a>
        <a href="dining.html#malewa" class="btn btn--outline-dark">See dining</a>
        <a href="conferences.html" class="btn btn--outline-dark">Conferences &amp; events</a>
        <a href="experiences.html" class="btn btn--outline-dark">Experiences</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="feature">
        <div class="feature__media">
          <div class="media-collage media-collage--split">
            ${photo(IMG.mCottageInterior, "Inside a cottage at Malewa Riverside Resort", {
              slot: "Malewa — cottage interior",
              ratio: "tall",
            })}
            ${photo(IMG.mOloleshwaLiving, "The living room of the Ololeshwa Cottage", {
              slot: "Malewa — Ololeshwa living room",
              ratio: "tall",
            })}
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">Accommodation</span>
          <h2 class="display-md">Cottages and the Ololeshwa Cottage.</h2>
          <p>Our cottages are booked per room, per night, on bed &amp; breakfast, half board or full board — for single or double occupancy, with rates banded by the number of rooms your booking takes.</p>
          <p>The Ololeshwa Cottage is a private four-room ensuite cottage with an open kitchen and dining area, a comfortable living room and an outdoor fireplace.</p>
          <a class="link-arrow" href="stay.html">Accommodation and rates</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      ${sectionHead({
        eyebrow: "Gather",
        title: "Conferences, events and team building.",
        lede: "Conference halls, an executive breakout room, an outdoor gazebo and accommodation for delegates — with expansive grounds designed for team bonding.",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "Conference halls", copy: "Indoor halls for seminars, presentations and church conferences." },
          { title: "Executive breakout room", copy: "A quieter room for small sessions, committees and planning." },
          { title: "Outdoor gazebo", copy: "Sheltered outdoor space for informal sessions and group meals." },
          { title: "Team building grounds", copy: "Expansive outdoor spaces designed for team bonding." },
        ])}
      </div>
      <div class="btn-row space-top-lg">
        <a href="conferences.html" class="btn btn--outline-light">Conferences &amp; events</a>
        <a href="team-building.html" class="btn btn--outline-light">Team building</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Dine",
        title: "The Main Restaurant and the Skyline Coffee Bar.",
        lede: "Meals are part of the stay here — whether you are on holiday, on retreat or between conference sessions.",
      })}
      <div class="grid-2">
        <article class="card">
          <div class="card__media">
            ${photo(IMG.mRestaurant, "The Main Restaurant at Malewa Riverside Resort", {
              slot: "Malewa — Main Restaurant",
            })}
          </div>
          <div class="card__body">
            <h3>Main Restaurant</h3>
            <p>The main dining room for resident guests and day visitors, and where conference and retreat groups are hosted.</p>
            <a class="link-arrow" href="dining.html#malewa">Explore dining</a>
          </div>
        </article>
        <article class="card">
          <div class="card__media">
            ${photo(IMG.mCoffeeBar, "The Skyline Coffee Bar at Malewa Riverside Resort", {
              slot: "Malewa — Skyline Coffee Bar",
            })}
          </div>
          <div class="card__body">
            <h3>Skyline Coffee Bar</h3>
            <p>The resort's coffee bar — a place to settle in with a cup between meetings, in the afternoon, or as the evening starts.</p>
            <a class="link-arrow" href="dining.html#skyline">See the Skyline Coffee Bar</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Gallery",
        title: "Malewa, in pictures.",
      })}
      ${galleryMarkup([MALEWA_GALLERY[0], MALEWA_GALLERY[1], MALEWA_GALLERY[5], MALEWA_GALLERY[6], MALEWA_GALLERY[9], MALEWA_GALLERY[10]])}
      <div class="btn-row space-top-lg">
        <a href="gallery.html" class="btn btn--outline-dark">Explore the gallery</a>
      </div>
    </div>
  </section>

  <section class="section section--warm cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Plan your stay</span>
      <h2 class="display-lg">Tell us your dates.</h2>
      <p class="lede">Send an enquiry with your dates and the accommodation you would like. We will come back to you with availability and the applicable rate.</p>
      <div class="btn-row">
        <a href="book.html?property=malewa" class="btn btn--primary">Book / make an enquiry</a>
        <a href="tel:+254704025999" class="btn btn--outline-dark">Call +254 704 025 999</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   STAY — accommodation
   ========================================================= */

const stayBody = `  <header class="page-hero">
    ${coverPhoto(IMG.mCottages, "Cottages at Malewa Riverside Resort, Gilgil", {
      slot: "Stay — cottages exterior",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Stay</span>
        <h1 class="display-xl">Cottages and the Ololeshwa Cottage.</h1>
        <p class="lede">Two ways to stay at Malewa Riverside: our luxury cottages, or the private four-room Ololeshwa Cottage with its own kitchen, living room and outdoor fireplace. Clavina's accommodation is being confirmed.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section section--tight facts" aria-label="Accommodation at a glance">
    <div class="container">
      ${facts([
        { term: "Accommodation", detail: "Luxury cottages and the Ololeshwa Cottage" },
        { term: "Meal plans", detail: "Bed &amp; breakfast · Half board · Full board" },
        { term: "Rates from", detail: "KES 5,000 per room, per night" },
        { term: "Self catering", detail: "Available at the Ololeshwa Cottage" },
      ])}
    </div>
  </section>

  <section class="section" id="cottages">
    <div class="container">
      <div class="feature">
        <div class="feature__media">
          <div class="media-collage media-collage--split">
            ${photo(IMG.mCottageInterior, "Inside a cottage at Malewa Riverside Resort", {
              slot: "Stay — cottage interior",
              ratio: "tall",
            })}
            ${photo(IMG.mCottages, "Cottages and grounds at Malewa Riverside Resort", {
              slot: "Stay — cottages and grounds",
              ratio: "tall",
            })}
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">Cottages</span>
          <h2 class="display-md">Luxury cottages by the river.</h2>
          <p>Our cottages are the heart of the resort. Each is booked per room, per night, on bed &amp; breakfast, half board or full board — for single or double occupancy.</p>
          <p>Rates are banded by how many rooms your booking takes: 1–4 rooms, or 5–6 rooms. Larger group bookings are quoted at the higher band.</p>
        </div>
      </div>

      <div class="rate-panel space-top-xl">
        <div class="rate-panel__head">
          <h3>Cottage rates</h3>
          <p>Per room, per night, in Kenyan shillings.</p>
        </div>
        <div class="rate-tables">
          <table class="rate-table">
            <caption>Single occupancy</caption>
            <thead>
              <tr>
                <th scope="col">Meal plan</th>
                <th scope="col">1–4 rooms</th>
                <th scope="col">5–6 rooms</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Bed &amp; breakfast</th>
                <td>KES 6,000</td>
                <td>KES 6,500</td>
              </tr>
              <tr>
                <th scope="row">Half board</th>
                <td>KES 7,500</td>
                <td>KES 8,000</td>
              </tr>
              <tr>
                <th scope="row">Full board</th>
                <td>KES 9,000</td>
                <td>KES 9,500</td>
              </tr>
            </tbody>
          </table>
          <table class="rate-table">
            <caption>Double occupancy</caption>
            <thead>
              <tr>
                <th scope="col">Meal plan</th>
                <th scope="col">1–4 rooms</th>
                <th scope="col">5–6 rooms</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Bed &amp; breakfast</th>
                <td>KES 6,500</td>
                <td>KES 7,500</td>
              </tr>
              <tr>
                <th scope="row">Half board</th>
                <td>KES 9,500</td>
                <td>KES 10,000</td>
              </tr>
              <tr>
                <th scope="row">Full board</th>
                <td>KES 12,500</td>
                <td>KES 13,500</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rate-legend">
          <p><strong>BB</strong> — Bed &amp; Breakfast. <strong>HB</strong> — Half Board. <strong>FB</strong> — Full Board.</p>
          <p>Meal inclusions for half board and full board are confirmed with your booking. Children and extra-bed arrangements are quoted on enquiry.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest" id="ololeshwa">
    <div class="container">
      <div class="feature feature--reverse">
        <div class="feature__media">
          <div class="media-collage">
            ${photo(IMG.mOloleshwaLiving, "The living room of the Ololeshwa Cottage", {
              slot: "Ololeshwa — living room",
            })}
            <div class="media-collage media-collage--split">
              ${photo(IMG.mOloleshwaKitchen, "The open kitchen and dining area of the Ololeshwa Cottage", {
                slot: "Ololeshwa — kitchen and dining",
                ratio: "square",
              })}
              ${photo(IMG.mOloleshwaFireplace, "The outdoor fireplace at the Ololeshwa Cottage", {
                slot: "Ololeshwa — outdoor fireplace",
                ratio: "square",
              })}
            </div>
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">Ololeshwa Cottage</span>
          <h2 class="display-md">A private four-room ensuite cottage.</h2>
          <p class="lede">Book the whole cottage for your group, or take it room by room. Ololeshwa is the resort's private four-room cottage — self-contained, and set up for both short stays and longer, slower ones.</p>
          ${tickList([
            "Four ensuite rooms",
            "Open, spacious kitchen and dining area",
            "Comfortable living room",
            "Outdoor fireplace",
            "High-speed internet",
          ])}
        </div>
      </div>

      <div class="rate-panel rate-panel--forest space-top-xl">
        <div class="rate-panel__head">
          <h3>Ololeshwa Cottage rates</h3>
          <p>Per room, per night, in Kenyan shillings.</p>
        </div>
        <div class="rate-cards">
          <div class="rate-card">
            <span class="rate-card__label">Bed &amp; breakfast · Single occupancy</span>
            <p class="rate-card__amount">KES 5,000</p>
            <p class="rate-card__unit">per room, per night</p>
          </div>
          <div class="rate-card">
            <span class="rate-card__label">Bed &amp; breakfast · Double occupancy</span>
            <p class="rate-card__amount">KES 6,500</p>
            <p class="rate-card__unit">per room, per night</p>
          </div>
        </div>
        <div class="rate-legend">
          <p><strong>Self catering</strong> — 30% off the applicable bed &amp; breakfast rate. Self-catering guests have full use of the cottage kitchen, and meals are not provided by the resort.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Before you book",
        title: "Rates and meal plans, explained.",
        size: "md",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "BB — Bed &amp; Breakfast", copy: "Your room with breakfast at the resort." },
          { title: "HB — Half Board", copy: "Your room on a half-board meal plan." },
          { title: "FB — Full Board", copy: "Your room on a full-board meal plan." },
          { title: "Self catering", copy: "Ololeshwa Cottage only — 30% off the applicable bed &amp; breakfast rate." },
        ])}
      </div>
      <div class="notice space-top-lg">
        <strong>Please note</strong>
        <span>Rates are quoted per room, per night. Meal inclusions for half board and full board, check-in and check-out times, and payment arrangements are confirmed with your booking.</span>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina",
        title: "Accommodation at Clavina.",
        size: "md",
        lede: "Clavina is part of the group. Its accommodation is not yet published here — we will not describe rooms or rates we cannot confirm.",
      })}
      ${pending({
        heading: "Clavina accommodation",
        copy: "The following are needed before Clavina's stay page can be completed.",
        items: [
          "Room types and occupancy",
          "Rates and meal plans",
          "In-room facilities",
          "Check-in and check-out times",
          "Photography",
        ],
      })}
      <div class="btn-row space-top-lg">
        <a href="book.html?property=clavina" class="btn btn--primary">Enquire about Clavina</a>
        <a href="clavina.html" class="btn btn--outline-dark">About Clavina</a>
      </div>
    </div>
  </section>

  <section class="section section--warm cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Reserve your dates</span>
      <h2 class="display-lg">Check availability.</h2>
      <p class="lede">Tell us when you would like to come and whether you are booking a cottage or the Ololeshwa Cottage. We will confirm availability and your rate.</p>
      <div class="btn-row">
        <a href="book.html?property=malewa" class="btn btn--primary">Book / make an enquiry</a>
        <a href="contact.html" class="btn btn--outline-dark">Contact the resort</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   DINING — Clavina Pax first, then Malewa
   ========================================================= */

const diningBody = `  <header class="page-hero">
    ${coverPhoto(IMG.pHero, "Clavina Pax — restaurant photograph to be supplied", {
      slot: "Dining — Clavina Pax hero",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Dining</span>
        <h1 class="display-xl">Clavina Pax, and dining at Malewa.</h1>
        <p class="lede">Clavina Pax is the group's restaurant. At Malewa Riverside, the Main Restaurant and the Skyline Coffee Bar look after guests staying at the resort.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section">
    <div class="container">
      <div class="feature feature--reverse accent-pax">
        <div class="feature__media">
          <div class="media-collage">
            ${photo(IMG.pDiningRoom, "Clavina Pax — dining room photograph to be supplied", {
              slot: "Clavina Pax — dining room",
            })}
            <div class="media-collage media-collage--split">
              ${photo(IMG.pTable, "Clavina Pax — table setting photograph to be supplied", {
                slot: "Clavina Pax — table setting",
                ratio: "square",
              })}
              ${photo(IMG.pFood, "Clavina Pax — food photograph to be supplied", {
                slot: "Clavina Pax — food",
                ratio: "square",
              })}
            </div>
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">Clavina Pax</span>
          <h2 class="display-md">The group's restaurant.</h2>
          <p class="lede">A dining destination in its own right — for guests of the group, for visitors, and for gatherings arranged around a table.</p>
          <p>Menus, service times and reservations are handled by the restaurant. Tell us what you are planning and we will put you in touch.</p>
          <div class="btn-row">
            <a href="clavina-pax.html" class="btn btn--primary">Discover Clavina Pax</a>
            <a href="book.html?property=clavina-pax" class="btn btn--outline-dark">Enquire about a table</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina Pax",
        title: "What we are confirming before publishing.",
        size: "md",
        lede: "We would rather show a blank than invent a menu. These are the details awaited from the client.",
      })}
      ${pending({
        heading: "Menu, service and reservations",
        copy: "To be supplied by the restaurant before the Clavina Pax pages are complete.",
        items: [
          "Menus and cuisine",
          "Opening hours and service times",
          "Reservation process and contact number",
          "Seating capacity and private dining",
          "Events and group dining",
          "Photography of the room, the table and the food",
        ],
      })}
    </div>
  </section>

  <section class="section" id="malewa">
    <div class="container">
      ${sectionHead({
        eyebrow: "Malewa Riverside",
        title: "The Main Restaurant and the Skyline Coffee Bar.",
        lede: "Meals are part of the stay at Malewa — for holiday guests, for retreats, and for conference groups who need a proper break between sessions.",
      })}
      <div class="feature">
        <div class="feature__media">
          <div class="media-collage">
            ${photo(IMG.mRestaurantTable, "A table in the Main Restaurant at Malewa Riverside Resort", {
              slot: "Dining — restaurant table",
            })}
            ${photo(IMG.mDiningDetail, "Dining detail at Malewa Riverside Resort", {
              slot: "Dining — dining detail",
              ratio: "wide",
            })}
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">Main Restaurant</span>
          <h2 class="display-md">The main dining room.</h2>
          <p>The Main Restaurant is the resort's dining room — where resident guests take their meals, and where conference, church and team-building groups are hosted.</p>
          <p>Overnight stays can be booked on bed &amp; breakfast, half board or full board, so meals can be arranged around your programme rather than the other way round.</p>
        </div>
      </div>

      <div class="feature feature--reverse" id="skyline">
        <div class="feature__media">
          ${photo(IMG.mCoffeeBar, "The Skyline Coffee Bar at Malewa Riverside Resort", {
            slot: "Dining — Skyline Coffee Bar",
          })}
        </div>
        <div class="feature__body">
          <span class="eyebrow">Skyline Coffee Bar</span>
          <h2 class="display-md">Coffee, conversation and a change of scene.</h2>
          <p>The Skyline Coffee Bar is the resort's coffee bar — somewhere to settle in with a cup between meetings, in the afternoon, or as the evening begins.</p>
          <p>It is one of the shared spaces that makes a stay here work for both a quiet weekend and a full conference programme.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      ${sectionHead({
        eyebrow: "Groups &amp; retreats",
        title: "Dining for conferences, retreats and celebrations.",
        lede: "Because the restaurant, the coffee bar and the accommodation are all on site, meal plans can be arranged around the reason you are here.",
      })}
      <div class="rule-list">
        ${ruleItems([
          { title: "Conference groups", copy: "Meals between sessions for delegates staying at the resort." },
          { title: "Retreats", copy: "Half board and full board stays for retreats and away-days." },
          { title: "Celebrations", copy: "Get-togethers on the grounds and in the outdoor gazebo." },
          { title: "Church conferences", copy: "Dining for church groups and seminars held at the resort." },
          { title: "Team building days", copy: "Lunch and refreshments around an outdoor programme." },
          { title: "Day visitors", copy: "The Main Restaurant also serves guests visiting for the day." },
        ])}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <div class="notice">
        <strong>Menus and serving times</strong>
        <span>Menus, service times and any dietary requirements are confirmed directly with the restaurant. Ask us when you enquire and we will tell you what is available for your dates.</span>
      </div>
      <div class="btn-row space-top-md">
        <a href="book.html?property=malewa" class="btn btn--primary">Enquire about dining</a>
        <a href="tel:+254704025999" class="btn btn--outline-dark">Call the resort</a>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Gallery",
        title: "Around the table.",
      })}
      ${galleryMarkup([PAX_GALLERY[0], MALEWA_GALLERY[2], PAX_GALLERY[1], MALEWA_GALLERY[3], PAX_GALLERY[2], MALEWA_GALLERY[11]])}
    </div>
  </section>

  </main>`;

/* =========================================================
   EXPERIENCES
   ========================================================= */

const experiencesBody = `  <header class="page-hero">
    ${coverPhoto(IMG.mOutdoors, "Open outdoor spaces at Malewa Riverside Resort", {
      slot: "Experiences — outdoor spaces",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Experiences</span>
        <h1 class="display-xl">Riverside days and wide-open grounds.</h1>
        <p class="lede">The River Malewa runs along the edge of the resort. Around it: a hiking area, a bonfire site, camping space, games and grounds that open out in every direction.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "At Malewa",
        title: "Things to do at the resort.",
        lede: "Everything below is part of Malewa Riverside — for guests staying over, for day visitors and for groups.",
      })}
      <div class="grid-3">
        <article class="card">
          ${photo(IMG.mRiver, "The River Malewa at the edge of the resort grounds", {
            slot: "Experiences — river",
          })}
          <div class="card__body">
            <h3 class="display-sm">Riverside setting</h3>
            <p>The resort sits on the shores of the River Malewa — the reason the setting feels the way it does.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mHiking, "The scenic hiking area at Malewa Riverside Resort", {
            slot: "Experiences — hiking",
          })}
          <div class="card__body">
            <h3 class="display-sm">Scenic hiking</h3>
            <p>A hiking area for guests who want to walk out and take in the landscape around Gilgil.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mBonfire, "The bonfire site at Malewa Riverside Resort", {
            slot: "Experiences — bonfire",
          })}
          <div class="card__body">
            <h3 class="display-sm">Bonfire site</h3>
            <p>An evening fire for groups, for stories, and for the part of the day when nobody is in a hurry.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mCamping, "Camping tents pitched at Malewa Riverside Resort", {
            slot: "Experiences — camping",
          })}
          <div class="card__body">
            <h3 class="display-sm">Camping &amp; tents</h3>
            <p>Pitch a tent on the grounds and stay closer to the river — bring your own, or ask us what is available.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mTableTennis, "Table tennis on the grounds at Malewa Riverside Resort", {
            slot: "Experiences — table tennis",
          })}
          <div class="card__body">
            <h3 class="display-sm">Table tennis</h3>
            <p>A quick game between sessions, after lunch, or while the rest of the group is getting ready.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mBoardGames, "Board games at Malewa Riverside Resort", {
            slot: "Experiences — board games",
          })}
          <div class="card__body">
            <h3 class="display-sm">Board games</h3>
            <p>For slow afternoons, rainy hours and groups who would rather sit around a table.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      <div class="feature">
        <div class="feature__media">
          ${photo(IMG.mGazebo, "The outdoor gazebo at Malewa Riverside Resort", {
            slot: "Experiences — outdoor gazebo",
          })}
        </div>
        <div class="feature__body">
          <span class="eyebrow">Outdoor spaces</span>
          <h2 class="display-md">Gazebo, lawns and grounds.</h2>
          <p>The outdoor gazebo gives groups a sheltered base outside, whether that is a briefing, a meal or simply somewhere to sit out of the sun.</p>
          <p>Around it, the lawns and grounds are open for games, team building and everything that does not need a room.</p>
          <div class="btn-row">
            <a href="team-building.html" class="btn btn--outline-dark">Team building at Malewa</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Also in the group</span>
      <h2 class="display-lg">Stay, dine and gather.</h2>
      <p class="lede">Accommodation at Malewa, dining with Clavina Pax, and conference or team building programmes on the grounds.</p>
      <div class="btn-row">
        <a href="stay.html" class="btn btn--outline-light">Accommodation</a>
        <a href="clavina-pax.html" class="btn btn--outline-light">Clavina Pax</a>
        <a href="conferences.html" class="btn btn--outline-light">Conferences &amp; events</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   CONFERENCES & EVENTS
   ========================================================= */

const conferencesBody = `  <header class="page-hero">
    ${coverPhoto(IMG.mConference, "A conference hall at Malewa Riverside Resort", {
      slot: "Conferences — hall",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Conferences &amp; Events</span>
        <h1 class="display-xl">Meet. Gather. Retreat.</h1>
        <p class="lede">Conference halls, an executive breakout room, an outdoor gazebo and accommodation for delegates — in a riverside setting about 12 km from Gilgil town.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section section--tight facts" aria-label="Conferences at a glance">
    <div class="container">
      ${facts([
        { term: "Setting", detail: "Riverside grounds in the Malewa-Kimbo area of Gilgil" },
        { term: "Facilities", detail: "Conference halls · Executive breakout room · Outdoor gazebo" },
        { term: "Occasions", detail: "Corporate retreats · Church conferences · Seminars" },
        { term: "Accommodation", detail: "Cottages at the resort for delegates" },
      ])}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="intro-grid">
        <p class="intro-grid__label">For business and church groups</p>
        <div class="intro-grid__body">
          <h2 class="display-lg">A working retreat that feels like time away.</h2>
          <p class="lede">Malewa Riverside is about 12 km from Gilgil town, on the shores of the River Malewa. Close enough for delegates to arrive without a long journey, far enough that the day slows down — which is usually the point of getting a group out of the city.</p>
          <p>Conference halls, an executive breakout room and an outdoor gazebo cover indoor sessions, small-group work and time outside. High-speed Wi-Fi runs through the resort, the Main Restaurant and the Skyline Coffee Bar handle meals and breaks, and the cottages on site mean your group can stay over rather than travel back each evening.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      ${sectionHead({
        eyebrow: "Facilities",
        title: "Room for the whole programme.",
        lede: "Indoor, outdoor and in between — the facilities that make a multi-day programme work.",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "Conference halls", copy: "For seminars, presentations and church conferences." },
          { title: "Executive breakout room", copy: "A smaller room for committees and planning sessions." },
          { title: "Outdoor gazebo", copy: "Sheltered outdoor space for informal sessions and meals." },
          { title: "Main Restaurant &amp; Skyline Coffee Bar", copy: "Meals, coffee and breaks without leaving the grounds." },
          { title: "Accommodation for delegates", copy: "Cottages at the resort, so your group stays on site." },
          { title: "High-speed Wi-Fi", copy: "Available for working sessions and presentations." },
          { title: "Team building grounds", copy: "Expansive outdoor spaces designed for team bonding." },
          { title: "Riverside grounds", copy: "Open space to step out into between sessions." },
        ])}
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Occasions",
        title: "What groups come here for.",
        lede: "The resort is set up for working programmes, and for the celebrations that sit alongside them.",
      })}
      <div class="grid-4">
        <article class="card">
          ${photo(IMG.mBreakout, "An executive breakout room at Malewa Riverside Resort", {
            slot: "Conferences — breakout room",
          })}
          <div class="card__body">
            <h3 class="display-sm">Corporate retreats</h3>
            <p>Bring the team out of the city for planning days, strategy sessions and time together on the grounds.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mDelegates, "A church conference at Malewa Riverside Resort", {
            slot: "Conferences — church conference",
          })}
          <div class="card__body">
            <h3 class="display-sm">Church conferences</h3>
            <p>Hall space, meals and accommodation in one place, with room for a multi-day programme.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mConference, "A seminar in session at Malewa Riverside Resort", {
            slot: "Conferences — seminar",
          })}
          <div class="card__body">
            <h3 class="display-sm">Seminars</h3>
            <p>A quiet setting for teaching, training, workshops and executive breakout sessions.</p>
          </div>
        </article>
        <article class="card">
          ${photo(IMG.mGazebo, "The outdoor gazebo at Malewa Riverside Resort", {
            slot: "Conferences — outdoor gazebo",
          })}
          <div class="card__body">
            <h3 class="display-sm">Celebrations</h3>
            <p>Gatherings on the grounds and under the gazebo, for the moments worth marking.</p>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="feature">
        <div class="feature__media">
          ${photo(IMG.mTeamGrounds, "The team building grounds at Malewa Riverside Resort", {
            slot: "Conferences — team building grounds",
          })}
        </div>
        <div class="feature__body">
          <span class="eyebrow">Team building</span>
          <h2 class="display-md">Expansive outdoor spaces, built for teams.</h2>
          <p>Beyond the meeting rooms there are open grounds designed for team bonding — with table tennis, board games, a bonfire site, scenic hiking, camping and the riverside itself.</p>
          <p>Tell us what you want the day to achieve and we will shape it around the group.</p>
          <div class="btn-row">
            <a href="team-building.html" class="btn btn--primary">Explore team building</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--warm cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Enquire</span>
      <h2 class="display-lg">Plan your conference or retreat.</h2>
      <p class="lede">Send us your dates, your group size and what you need from the programme. We will come back with what the resort can offer for your stay.</p>
      <div class="btn-row">
        <a href="book.html?property=malewa&amp;purpose=conference" class="btn btn--primary">Enquire about conferences</a>
        <a href="tel:+254704025999" class="btn btn--outline-dark">Call the resort</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   TEAM BUILDING
   ========================================================= */

const teamBuildingBody = `  <header class="page-hero">
    ${coverPhoto(IMG.mTeamGrounds, "The team building grounds at Malewa Riverside Resort", {
      slot: "Team building — grounds",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Team Building</span>
        <h1 class="display-xl">Expansive outdoor spaces, designed for team bonding.</h1>
        <p class="lede">Open grounds beside the River Malewa, with activities and shared spaces that suit groups who need to work together — and then stop working and be together.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section">
    <div class="container">
      <div class="intro-grid">
        <p class="intro-grid__label">Team building at Malewa</p>
        <div class="intro-grid__body">
          <h2 class="display-lg">Room to move, and room to think.</h2>
          <p class="lede">Team building works best when the setting changes. At Malewa Riverside the grounds open out towards the river, with a bonfire site, a scenic hiking area, camping space and quiet corners for the parts of the day that need less noise.</p>
          <p>Groups can pair outdoor time with the conference halls and the executive breakout room, stay in the cottages on site, and take meals through the Main Restaurant and the Skyline Coffee Bar.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "On the grounds",
        title: "What your group can use.",
        lede: "Everything here is part of the resort — no travelling between venues.",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "Team building grounds", copy: "Expansive outdoor spaces designed for team bonding." },
          { title: "Outdoor gazebo", copy: "Sheltered space for briefings and group meals." },
          { title: "Bonfire site", copy: "An evening fire to close the day together." },
          { title: "Scenic hiking area", copy: "A walk out for groups who want to move." },
          { title: "Table tennis", copy: "Fast, easy competition for breaks." },
          { title: "Board games", copy: "Something for the quieter hours." },
          { title: "Camping &amp; tents", copy: "For groups who want to stay closer to the river." },
          { title: "Conference halls &amp; breakout room", copy: "Indoor space when the programme moves inside." },
        ])}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="feature feature--reverse">
        <div class="feature__media">
          ${photo(IMG.mTeamActivities, "Team activities on the grounds at Malewa Riverside Resort", {
            slot: "Team building — activities",
          })}
        </div>
        <div class="feature__body">
          <span class="eyebrow">How it works</span>
          <h2 class="display-md">Tell us about your group.</h2>
          <p>We do not sell fixed team-building packages. Groups arrive with different numbers, different amounts of time and different reasons for being here, so the day is planned around yours.</p>
          ${tickList([
            "Send an enquiry with your dates and group size",
            "We confirm the facilities and dates available",
            "We agree the shape of the day before you arrive",
          ])}
          <div class="btn-row">
            <a href="book.html?property=malewa&amp;purpose=team-building" class="btn btn--primary">Plan your retreat</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      ${sectionHead({
        eyebrow: "Stay and eat",
        title: "Keep the group on site.",
        lede: "Cottages for overnight stays, the Ololeshwa Cottage for a smaller group, and meals arranged around your programme.",
      })}
      <div class="btn-row">
        <a href="stay.html" class="btn btn--outline-light">See accommodation</a>
        <a href="dining.html#malewa" class="btn btn--outline-light">See dining</a>
        <a href="conferences.html" class="btn btn--outline-light">See conference facilities</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   CLAVINA — hotel (details await client confirmation)
   ========================================================= */

const clavinaBody = `  <header class="page-hero">
    ${coverPhoto(IMG.cHero, "Clavina — property photograph to be supplied", {
      slot: "Clavina — hero",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Clavina</span>
        <h1 class="display-xl">Clavina.</h1>
        <p class="lede">The group's hotel, alongside Malewa Riverside Resort &amp; Cottages and Clavina Pax. Room types, rates and facilities will be published here as they are confirmed.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section section--tight facts" aria-label="Clavina at a glance">
    <div class="container">
      ${facts([
        { term: "Property type", detail: "Hotel" },
        { term: "Part of", detail: "The same group as Malewa and Clavina Pax" },
        { term: "Details", detail: "Awaiting confirmation" },
        { term: "Enquiries", detail: "Through the group enquiry form" },
      ])}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="intro-grid">
        <p class="intro-grid__label">About Clavina</p>
        <div class="intro-grid__body accent-clavina">
          <h2 class="display-lg">The group's hotel.</h2>
          <p class="lede">Clavina sits in the same family as Malewa and Clavina Pax. Where Malewa is the riverside resort and cottages in Gilgil, and Clavina Pax is where the group dines, Clavina is the group's hotel.</p>
          <p>We have deliberately not filled this page with room categories, rates or facilities we cannot verify. Everything below is what the client still needs to supply — once it arrives, the page is a short job to finish.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina",
        title: "What is still needed.",
        size: "md",
        lede: "These are the details awaited from the client before Clavina can be presented in full.",
      })}
      <div class="grid-2">
        ${pending({
          heading: "Property and location",
          copy: "To be supplied before launch.",
          items: [
            "Location, address and directions",
            "Property description and story",
            "Year opened or any history worth telling",
            "Nearest town and travel notes",
          ],
        })}
        ${pending({
          heading: "Rooms and rates",
          copy: "To be supplied before launch.",
          items: [
            "Room types and occupancy",
            "Rates and meal plans",
            "In-room facilities",
            "Check-in and check-out times",
          ],
        })}
        ${pending({
          heading: "Facilities and services",
          copy: "To be supplied before launch.",
          items: [
            "Dining at the property",
            "Meeting or event space",
            "Wi-Fi and workspace",
            "Parking and access",
          ],
        })}
        ${pending({
          heading: "Photography and contact",
          copy: "To be supplied before launch.",
          items: [
            "Exterior and interior photography",
            "Room photography",
            "Property phone number and email",
            "Any social media accounts",
          ],
        })}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "While it is being confirmed",
        title: "You can still enquire.",
        lede: "Tell us what you need from Clavina and we will come back to you with what is available.",
      })}
      <div class="btn-row">
        <a href="book.html?property=clavina" class="btn btn--primary">Enquire about Clavina</a>
        <a href="properties.html" class="btn btn--outline-dark">See all properties</a>
      </div>
      <div class="grid-2 space-top-lg">
        ${propertyCard({
          accent: "malewa",
          role: "Hotel &middot; Resort &middot; Cottages",
          name: "Malewa",
          copy: "Riverside cottages, the Ololeshwa Cottage, dining, conference halls and open grounds in Gilgil.",
          href: "malewa.html",
          linkLabel: "Explore Malewa",
          src: IMG.mCottages,
          alt: "Cottages at Malewa Riverside Resort in Gilgil",
          slot: "Clavina — cross-link to Malewa",
        })}
        ${propertyCard({
          accent: "pax",
          role: "Restaurant &middot; Dining",
          name: "Clavina Pax",
          copy: "The group's restaurant — dining for guests and visitors, and a setting for gatherings.",
          href: "clavina-pax.html",
          linkLabel: "Discover Clavina Pax",
          src: IMG.pDiningRoom,
          alt: "Clavina Pax — restaurant photograph to be supplied",
          slot: "Clavina — cross-link to Clavina Pax",
        })}
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   CLAVINA PAX — restaurant (details await client confirmation)
   ========================================================= */

const clavinaPaxBody = `  <header class="page-hero">
    ${coverPhoto(IMG.pHero, "Clavina Pax — restaurant photograph to be supplied", {
      slot: "Clavina Pax — hero",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Clavina Pax</span>
        <h1 class="display-xl">Clavina Pax.</h1>
        <p class="lede">The group's restaurant — a dining destination for guests of the group, for visitors, and for gatherings arranged around a table.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section section--tight facts" aria-label="Clavina Pax at a glance">
    <div class="container">
      ${facts([
        { term: "Property type", detail: "Restaurant &amp; dining" },
        { term: "Part of", detail: "The same group as Malewa and Clavina" },
        { term: "Menus &amp; hours", detail: "Awaiting confirmation" },
        { term: "Reservations", detail: "By enquiry" },
      ])}
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="feature accent-pax">
        <div class="feature__media">
          <div class="media-collage">
            ${photo(IMG.pDiningRoom, "Clavina Pax — dining room photograph to be supplied", {
              slot: "Clavina Pax — dining room",
            })}
            <div class="media-collage media-collage--split">
              ${photo(IMG.pTable, "Clavina Pax — table setting photograph to be supplied", {
                slot: "Clavina Pax — table setting",
                ratio: "square",
              })}
              ${photo(IMG.pFood, "Clavina Pax — food photograph to be supplied", {
                slot: "Clavina Pax — food",
                ratio: "square",
              })}
            </div>
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">The restaurant</span>
          <h2 class="display-md">Dining with the group.</h2>
          <p class="lede">Clavina Pax is the restaurant of the group — and the place the group's dining identity lives.</p>
          <p>We are not publishing a menu, cuisine description or service times until they are confirmed by the restaurant. When they arrive, this page carries them alongside the room, the table and the food.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina Pax",
        title: "What is still needed.",
        size: "md",
        lede: "These are the details awaited from the client before Clavina Pax can be presented in full.",
      })}
      <div class="grid-2">
        ${pending({
          heading: "Menu and cuisine",
          copy: "To be supplied before launch.",
          items: [
            "Menus or sample dishes",
            "Cuisine description",
            "Signature dishes or house specialities",
            "Dietary options",
            "Price range",
          ],
        })}
        ${pending({
          heading: "Service and reservations",
          copy: "To be supplied before launch.",
          items: [
            "Opening hours and service times",
            "Reservation process and phone number",
            "Seating and table sizes",
            "Private dining or group bookings",
          ],
        })}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="feature feature--reverse">
        <div class="feature__media">
          ${photo(IMG.pEvents, "Clavina Pax — events photograph to be supplied", {
            slot: "Clavina Pax — events",
          })}
        </div>
        <div class="feature__body">
          <span class="eyebrow">Events &amp; group dining</span>
          <h2 class="display-md">Planning something around a table?</h2>
          <p>Tell us the date, the numbers and what you have in mind. We will come back with what Clavina Pax can offer for your occasion.</p>
          <p>For conferences and retreats at Malewa Riverside, dining for resident groups is arranged with the resort — see the dining page.</p>
          <div class="btn-row">
            <a href="book.html?property=clavina-pax" class="btn btn--primary">Enquire about an event</a>
            <a href="dining.html" class="btn btn--outline-dark">See all dining</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Gallery",
        title: "Clavina Pax, in pictures.",
        lede: "Frames ready for the restaurant's photography.",
      })}
      ${galleryMarkup(PAX_GALLERY)}
    </div>
  </section>

  </main>`;

/* =========================================================
   GALLERY
   ========================================================= */

const galleryBody = `  <header class="page-hero page-hero--short">
    ${coverPhoto(IMG.mSetting, "The riverside setting at Malewa Riverside Resort", {
      slot: "Gallery — riverside setting",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Gallery</span>
        <h1 class="display-xl">The group, in pictures.</h1>
        <p class="lede">Malewa Riverside photography first, with frames held open for Clavina and Clavina Pax.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Malewa Riverside Resort &amp; Cottages",
        title: "The river, the cottages and the grounds.",
        lede: "Select any frame to open it larger.",
      })}
      ${galleryMarkup(MALEWA_GALLERY)}
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina",
        title: "Clavina, in pictures.",
        lede: "Frames reserved for the hotel's photography.",
      })}
      ${galleryMarkup(CLAVINA_GALLERY)}
      <div class="notice space-top-lg">
        <strong>Photography awaited</strong>
        <span>Clavina's photography has not been supplied yet. These frames are held open so the images can be dropped straight in — see assets/images/README.md for the slot list.</span>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina Pax",
        title: "Clavina Pax, in pictures.",
        lede: "Frames reserved for the restaurant's photography.",
      })}
      ${galleryMarkup(PAX_GALLERY)}
      <div class="notice space-top-lg">
        <strong>Photography awaited</strong>
        <span>Clavina Pax's photography has not been supplied yet. The room, the table and the food will sit in these three frames.</span>
      </div>
    </div>
  </section>

  <section class="section section--warm cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Enquire</span>
      <h2 class="display-lg">Come and see it for yourself.</h2>
      <p class="lede">Malewa is in the Malewa-Kimbo area of Gilgil, on the shores of the River Malewa, about 12 km from Gilgil town.</p>
      <div class="btn-row">
        <a href="book.html" class="btn btn--primary">Book / make an enquiry</a>
        <a href="contact.html" class="btn btn--outline-dark">Get directions</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   ABOUT
   ========================================================= */

const aboutBody = `  <header class="page-hero">
    ${coverPhoto(IMG.mGrounds, "The grounds at Malewa Riverside Resort", {
      slot: "About — resort grounds",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">About</span>
        <h1 class="display-xl">Three properties, one team.</h1>
        <p class="lede">Malewa, Clavina and Clavina Pax are looked after by the same group — a riverside resort and cottages, a hotel, and a restaurant.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section">
    <div class="container">
      <div class="intro-grid">
        <p class="intro-grid__label">The group</p>
        <div class="intro-grid__body">
          <h2 class="display-lg">Stay, dine and gather in one place.</h2>
          <p class="lede">The group covers the three reasons people come: somewhere to stay, somewhere to eat, and somewhere to hold a programme that needs both.</p>
          <p>Malewa Riverside Resort &amp; Cottages is the riverside property — in the Malewa-Kimbo area of Gilgil, on the shores of the River Malewa, about 12 km from Gilgil town. It is a peaceful retreat for leisure, business and celebrations, with cottages and the private Ololeshwa Cottage, the Main Restaurant and the Skyline Coffee Bar, conference facilities and open grounds.</p>
          <p>Clavina is the group's hotel, and Clavina Pax is the group's restaurant. Their pages are being completed as the client confirms the detail — we have not filled the gaps with guesses.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tight facts" aria-label="The group at a glance">
    <div class="container">
      ${facts([
        { term: "Properties", detail: "Malewa · Clavina · Clavina Pax" },
        { term: "Malewa", detail: "Malewa-Kimbo Area, Gilgil, Kenya" },
        { term: "Setting", detail: "On the shores of the River Malewa" },
        { term: "Enquiries", detail: "One form reaches the group" },
      ])}
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      <div class="intro-grid">
        <p class="intro-grid__label">How the group fits together</p>
        <div class="intro-grid__body">
          <h2 class="display-lg">Our properties</h2>
          <div class="group-tree space-top-md">
            <p class="group-tree__root">Our properties</p>
            <div class="group-tree__list">
              <div class="group-tree__item accent-malewa">
                <span class="group-tree__name">Malewa</span>
                <span class="group-tree__role">Hotel, resort and cottages — riverside setting in Gilgil, with conference and team building facilities.</span>
              </div>
              <div class="group-tree__item accent-clavina">
                <span class="group-tree__name">Clavina</span>
                <span class="group-tree__role">Hotel — property details awaiting confirmation.</span>
              </div>
              <div class="group-tree__item accent-pax">
                <span class="group-tree__name">Clavina Pax</span>
                <span class="group-tree__role">Restaurant and dining — menu, service times and reservations confirmed by the restaurant.</span>
              </div>
            </div>
          </div>
          <div class="btn-row space-top-lg">
            <a href="properties.html" class="btn btn--primary">Explore the properties</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "What you will find",
        title: "Stay, dine, gather, explore.",
      })}
      <div class="rule-list rule-list--four">
        ${ruleItems([
          { title: "Stay", copy: "Cottages and the private four-room Ololeshwa Cottage at Malewa, with Clavina's rooms to follow." },
          { title: "Dine", copy: "Clavina Pax, plus the Main Restaurant and the Skyline Coffee Bar at Malewa." },
          { title: "Gather", copy: "Conference halls, an executive breakout room, an outdoor gazebo and delegate accommodation." },
          { title: "Explore", copy: "Riverside grounds, scenic hiking, a bonfire site, camping, table tennis and board games." },
        ])}
      </div>
      <div class="btn-row space-top-lg">
        <a href="stay.html" class="btn btn--outline-dark">Accommodation</a>
        <a href="dining.html" class="btn btn--outline-dark">Dining</a>
        <a href="experiences.html" class="btn btn--outline-dark">Experiences</a>
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      ${sectionHead({
        eyebrow: "About the group",
        title: "What we are confirming before launch.",
        size: "md",
        lede: "No founding story, heritage or ownership detail has been supplied, so none has been written.",
      })}
      ${pending({
        heading: "Group information",
        copy: "To be supplied by the client before launch.",
        items: [
          "The official group or company name",
          "Legal and trading names for each property",
          "The story of the group, if it should be told",
          "Ownership, founding and any heritage details",
          "Social media accounts",
        ],
      })}
    </div>
  </section>

  <section class="section section--warm cta-band">
    <div class="container-narrow">
      <span class="eyebrow">Stay with us</span>
      <h2 class="display-lg">We would love to host you.</h2>
      <p class="lede">Send an enquiry with your dates and we will confirm availability and your rate.</p>
      <div class="btn-row">
        <a href="book.html" class="btn btn--primary">Book / make an enquiry</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   CONTACT
   ========================================================= */

const contactBody = `  <header class="page-hero page-hero--short">
    ${coverPhoto(IMG.mSetting, "The riverside setting at Malewa Riverside Resort, Gilgil", {
      slot: "Contact — riverside setting",
      extra: "page-hero__media",
    })}
    <div class="container">
      <div class="page-hero__inner">
        <span class="eyebrow">Contact</span>
        <h1 class="display-xl">Talk to us.</h1>
        <p class="lede">Call, email, or send an enquiry covering any of the group's properties — Malewa, Clavina or Clavina Pax.</p>
      </div>
    </div>
  </header>

  <main id="main">

  <section class="section">
    <div class="container">
      <div class="grid-4">
        ${contactBlocks([
          {
            title: "Malewa Riverside",
            html: `<p>Malewa Riverside Resort &amp; Cottages<br />Malewa-Kimbo Area<br />Gilgil, Kenya</p>
          <p>On the shores of the River Malewa, about 12 km from Gilgil town.</p>`,
          },
          {
            title: "Call",
            html: `<ul>
            ${PHONES.map((phone) => `<li><a href="${phone.href}">${phone.label}</a></li>`).join("\n            ")}
          </ul>`,
          },
          {
            title: "Email",
            html: `<ul>
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
          </ul>
          <p>For stays, conferences, team building, dining and group bookings.</p>`,
          },
          {
            title: "Enquiries",
            html: `<p>Use the enquiry form to tell us which property you are asking about, with your dates and what you need.</p>
          <p><a class="link-arrow" href="book.html">Make an enquiry</a></p>`,
          },
        ])}
      </div>
    </div>
  </section>

  <section class="section section--soft">
    <div class="container">
      <div class="feature">
        <div class="feature__media">
          <div class="map-slot">
            <span class="map-slot__label">Directions</span>
            <p>Malewa-Kimbo Area, Gilgil — on the shores of the River Malewa, about 12 km from Gilgil town.</p>
            <a class="link-arrow" href="https://www.google.com/maps/search/?api=1&amp;query=Malewa%20Riverside%20Resort%20Gilgil" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
          </div>
        </div>
        <div class="feature__body">
          <span class="eyebrow">Getting here</span>
          <h2 class="display-md">About 12 km from Gilgil town.</h2>
          <p>Malewa Riverside is in the Malewa-Kimbo area of Gilgil, on the shores of the River Malewa. Call ahead and we will help you with the last stretch of the journey.</p>
          <p>Check-in and check-out times, and any special arrangements for your arrival, are confirmed with your booking.</p>
          <div class="btn-row">
            <a href="tel:+254704025999" class="btn btn--primary">Call +254 704 025 999</a>
            <a href="mailto:${EMAIL}" class="btn btn--outline-dark">Email us</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      ${sectionHead({
        eyebrow: "Clavina &amp; Clavina Pax",
        title: "Contact details still to be confirmed.",
        size: "md",
        lede: "Only Malewa Riverside's contact details have been supplied. Until the others arrive, enquiries for all three properties come to the same inbox.",
      })}
      ${pending({
        heading: "Contact details awaited",
        copy: "To be supplied by the client before launch.",
        items: [
          "Clavina phone number, email and address",
          "Clavina Pax phone number and email",
          "A WhatsApp number, if the group uses one",
          "Social media accounts for each property",
          "Preferred escalation contact for group bookings",
        ],
      })}
    </div>
  </section>

  <section class="section section--forest on-forest">
    <div class="container">
      ${sectionHead({
        eyebrow: "Group bookings",
        title: "Conferences, retreats, dining and celebrations.",
        lede: "For groups, tell us the dates, the numbers and what the programme needs. We will confirm the facilities, accommodation and meal arrangements that fit.",
      })}
      <div class="btn-row">
        <a href="book.html?property=malewa&amp;purpose=conference" class="btn btn--outline-light">Enquire about conferences</a>
        <a href="book.html?property=malewa&amp;purpose=team-building" class="btn btn--outline-light">Enquire about team building</a>
        <a href="book.html?property=clavina-pax" class="btn btn--outline-light">Enquire about dining</a>
      </div>
    </div>
  </section>

  </main>`;

/* =========================================================
   BOOK / ENQUIRE
   ========================================================= */

const bookBody = `  <main id="main" class="section book-page">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Enquiry</span>
        <h1 class="display-lg">Book / make an enquiry.</h1>
        <p class="lede">Tell us which property you are asking about and what you have in mind. We will reply with availability and the applicable rate. Nothing is charged through this form, and no booking is confirmed until we come back to you.</p>
      </div>

      <div class="notice notice--status" id="enquiry-status" tabindex="-1" hidden></div>

      <div class="form-panel">
        <form id="enquiry-form" novalidate data-endpoint="">
          <fieldset class="form-fieldset">
            <legend class="form-legend">Your details</legend>
            <div class="form-row">
              <div class="field">
                <label for="full_name">Full name</label>
                <input type="text" id="full_name" name="full_name" autocomplete="name" required />
              </div>
              <div class="field">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="email" required />
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" name="phone" autocomplete="tel" placeholder="+254…" required />
              </div>
              <div class="field">
                <label for="purpose">Purpose of enquiry</label>
                <select id="purpose" name="purpose">
                  <option value="Leisure stay">Leisure stay</option>
                  <option value="Business travel">Business travel</option>
                  <option value="Conference">Conference</option>
                  <option value="Church conference">Church conference</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Team building">Team building</option>
                  <option value="Celebration">Celebration</option>
                  <option value="Dining">Dining</option>
                  <option value="Other">Other — I will explain below</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend class="form-legend">Which property?</legend>
            <div class="form-row form-row--one">
              <div class="field">
                <label for="property">Property</label>
                <select id="property" name="property" required>
                  <option value="malewa" selected>Malewa Riverside</option>
                  <option value="clavina">Clavina</option>
                  <option value="clavina-pax">Clavina Pax</option>
                </select>
                <span class="hint">One enquiry form covers all three properties — the fields below change to match your choice.</span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-fieldset" data-property="malewa clavina">
            <legend class="form-legend">Your stay</legend>
            <div class="form-row">
              <div class="field">
                <label for="check_in">Arrival</label>
                <input type="date" id="check_in" name="check_in" required />
              </div>
              <div class="field">
                <label for="check_out">Departure</label>
                <input type="date" id="check_out" name="check_out" required />
              </div>
            </div>
            <div class="form-row form-row--one">
              <div class="field">
                <label for="guests_stay">Number of guests</label>
                <select id="guests_stay" name="guests_stay" required>
                  <option value="">Choose guests</option>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5 guests</option>
                  <option value="6">6 guests</option>
                  <option value="7-10">7–10 guests</option>
                  <option value="11-20">11–20 guests</option>
                  <option value="20+">More than 20</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-fieldset" data-property="malewa">
            <legend class="form-legend">Malewa accommodation</legend>
            <div class="form-row">
              <div class="field">
                <label for="accommodation">Accommodation</label>
                <select id="accommodation" name="accommodation" required>
                  <option value="">Choose accommodation</option>
                  <option value="cottages">Cottage</option>
                  <option value="ololeshwa">Ololeshwa Cottage</option>
                  <option value="not_sure">Not sure — recommend for me</option>
                </select>
              </div>
              <div class="field">
                <label for="occupancy">Occupancy</label>
                <select id="occupancy" name="occupancy" required>
                  <option value="">Choose occupancy</option>
                  <option value="single">Single occupancy</option>
                  <option value="double">Double occupancy</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="meal_plan">Meal plan</label>
                <select id="meal_plan" name="meal_plan" required>
                  <option value="bb">Bed &amp; breakfast (BB)</option>
                  <option value="hb">Half board (HB)</option>
                  <option value="fb">Full board (FB)</option>
                  <option value="self_catering">Self catering — Ololeshwa Cottage</option>
                </select>
                <span class="hint">Meal plans differ by accommodation — this list updates to match your choice.</span>
              </div>
              <div class="field">
                <label for="rooms">Number of rooms</label>
                <select id="rooms" name="rooms" required>
                  <option value="">Choose rooms</option>
                  <option value="1">1 room</option>
                  <option value="2">2 rooms</option>
                  <option value="3">3 rooms</option>
                  <option value="4">4 rooms</option>
                  <option value="5">5 rooms</option>
                  <option value="6">6 rooms</option>
                </select>
                <span class="hint">Cottage rates are quoted for 1–4 rooms or 5–6 rooms. The Ololeshwa Cottage has four ensuite rooms.</span>
              </div>
            </div>

            <div class="estimator" id="rate-summary">
              <span class="estimator__label">Indicative rate</span>
              <p class="estimator__amount" id="rate-amount">Rate on request</p>
              <p class="estimator__detail" id="rate-detail">Tell us the accommodation, occupancy and meal plan you would like and we will confirm the applicable rate.</p>
              <p class="estimator__note">Indicative only. Rates are per room, per night, in Kenyan shillings, and are confirmed by the resort with your booking.</p>
            </div>
          </fieldset>

          <fieldset class="form-fieldset" data-property="clavina">
            <legend class="form-legend">Clavina accommodation</legend>
            <div class="notice">
              <strong>Clavina's rooms are being confirmed</strong>
              <span>We are not showing room types or rates for Clavina yet. Send your dates and we will come back with what is available.</span>
            </div>
          </fieldset>

          <fieldset class="form-fieldset" data-property="clavina-pax">
            <legend class="form-legend">Your table</legend>
            <div class="form-row form-row--three">
              <div class="field">
                <label for="dining_date">Date</label>
                <input type="date" id="dining_date" name="dining_date" required />
              </div>
              <div class="field">
                <label for="dining_time">Time</label>
                <input type="time" id="dining_time" name="dining_time" required />
              </div>
              <div class="field">
                <label for="guests_dining">Number of guests</label>
                <select id="guests_dining" name="guests_dining" required>
                  <option value="">Choose guests</option>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5-6">5–6 guests</option>
                  <option value="7-10">7–10 guests</option>
                  <option value="11-20">11–20 guests</option>
                  <option value="20+">More than 20</option>
                </select>
              </div>
            </div>
            <div class="form-row form-row--one">
              <div class="field">
                <label for="occasion">Occasion</label>
                <select id="occasion" name="occasion">
                  <option value="Dinner">Dinner</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Coffee or drinks">Coffee or drinks</option>
                  <option value="Celebration">Celebration</option>
                  <option value="Group or event dining">Group or event dining</option>
                  <option value="Other">Other — I will explain below</option>
                </select>
                <span class="hint">Menus, service times and reservations are confirmed by the restaurant.</span>
              </div>
            </div>
          </fieldset>

          <fieldset class="form-fieldset">
            <legend class="form-legend">Anything else</legend>
            <div class="form-row form-row--one">
              <div class="field">
                <label for="requests">Your message</label>
                <textarea id="requests" name="requests" placeholder="Group size, dietary needs, arrival time, conference requirements, celebration plans — anything we should know."></textarea>
              </div>
            </div>
          </fieldset>

          <div class="form-actions">
            <button type="submit" class="btn btn--primary">Send enquiry</button>
            <span class="form-note">This is an enquiry, not a confirmed booking. No payment is taken here.</span>
          </div>
        </form>
      </div>

      <div class="grid-3 space-top-xl">
        <div class="rule-item">
          <h3>1. Send your enquiry</h3>
          <p>Property, dates and what you have in mind — the more detail, the better the reply.</p>
        </div>
        <div class="rule-item">
          <h3>2. We confirm</h3>
          <p>We come back with availability, the applicable rate and anything else you asked about.</p>
        </div>
        <div class="rule-item">
          <h3>3. You confirm your booking</h3>
          <p>Check-in and check-out times, meal inclusions and payment arrangements are confirmed with your booking.</p>
        </div>
      </div>

      <div class="notice space-top-lg">
        <strong>Prefer to talk?</strong>
        <span>Call <a href="tel:+254704025999">+254 704 025 999</a>, <a href="tel:+254704026208">+254 704 026 208</a> or <a href="tel:+254722968154">+254 722 968 154</a>, or email <a href="mailto:${EMAIL}">${EMAIL}</a>.</span>
      </div>
    </div>
  </main>`;

/* =========================================================
   NOT FOUND
   ========================================================= */

const notFoundBody = `  <main id="main" class="error-page">
    <div class="container">
      <div class="error-page__inner">
        <p class="error-page__code">404</p>
        <h1 class="display-md">This page has wandered off.</h1>
        <p class="lede">The page you were looking for is not here. Head back to the front, or start an enquiry and we will take it from there.</p>
        <div class="btn-row">
          <a href="index.html" class="btn btn--primary">Back to home</a>
          <a href="book.html" class="btn btn--outline-dark">Book / make an enquiry</a>
        </div>
      </div>
    </div>
  </main>`;

/* =========================================================
   Render static pages
   ========================================================= */

console.log("Building pages:");

const PAGES = [
  {
    file: "index.html",
    nav: { active: "home", variant: "overlay" },
    body: homeBody,
    title: "Malewa, Clavina &amp; Clavina Pax | Kenyan Hospitality",
    description:
      "Malewa Riverside Resort & Cottages, Clavina and Clavina Pax — a riverside resort and cottages in Gilgil, a hotel, and the group's restaurant. Stay, gather, dine and experience.",
    ogTitle: "Malewa · Clavina · Clavina Pax",
    ogDescription:
      "Three destinations, one team: a riverside resort and cottages in Gilgil, a hotel, and a restaurant.",
    schema: resortSchema,
  },
  {
    file: "properties.html",
    nav: { active: "properties", variant: "overlay" },
    body: propertiesBody,
    title: "Our Properties | Malewa, Clavina &amp; Clavina Pax",
    description:
      "The three properties in the group: Malewa Riverside Resort & Cottages in Gilgil, Clavina hotel, and Clavina Pax restaurant. What each one is for, and how they fit together.",
    ogTitle: "Our Properties — Malewa, Clavina &amp; Clavina Pax",
    ogDescription: "Three destinations, one team: a riverside resort, a hotel, and a restaurant.",
  },
  {
    file: "malewa.html",
    nav: { active: "properties", variant: "overlay" },
    body: malewaBody,
    title: "Malewa Riverside Resort &amp; Cottages | Gilgil, Kenya",
    description:
      "Malewa Riverside Resort & Cottages in the Malewa-Kimbo area of Gilgil: luxury cottages, the Ololeshwa Cottage, the Main Restaurant and Skyline Coffee Bar, conference halls, team building grounds and riverside experiences.",
    ogTitle: "Malewa Riverside Resort &amp; Cottages",
    ogDescription:
      "A peaceful riverside retreat for leisure, business and celebrations — about 12 km from Gilgil town.",
    schema: resortSchema,
  },
  {
    file: "stay.html",
    nav: { active: "stay", variant: "overlay" },
    body: stayBody,
    title: "Accommodation | Cottages &amp; Ololeshwa Cottage — Malewa",
    description:
      "Stay at Malewa Riverside Resort & Cottages in Gilgil: luxury cottages on bed & breakfast, half board or full board, plus the private four-room Ololeshwa Cottage with self-catering rates.",
    ogTitle: "Accommodation at Malewa Riverside",
    ogDescription:
      "Cottages from KES 6,000 per room, per night, and the private four-room Ololeshwa Cottage from KES 5,000.",
  },
  {
    file: "dining.html",
    nav: { active: "dining", variant: "overlay" },
    body: diningBody,
    title: "Dining | Clavina Pax &amp; Malewa Riverside",
    description:
      "Clavina Pax, the group's restaurant, plus the Main Restaurant and the Skyline Coffee Bar at Malewa Riverside Resort in Gilgil — dining for guests, conference groups, retreats and celebrations.",
    ogTitle: "Dining — Clavina Pax &amp; Malewa Riverside",
    ogDescription:
      "The group's restaurant, and the Main Restaurant and Skyline Coffee Bar at Malewa Riverside in Gilgil.",
  },
  {
    file: "experiences.html",
    nav: { active: "experiences", variant: "overlay" },
    body: experiencesBody,
    title: "Experiences | Riverside, Hiking, Bonfire &amp; Camping — Malewa",
    description:
      "Riverside days at Malewa Riverside Resort in Gilgil: the River Malewa, a scenic hiking area, bonfire site, camping and tents, table tennis, board games and open grounds.",
    ogTitle: "Experiences at Malewa Riverside",
    ogDescription:
      "Riverside setting, scenic hiking, bonfire, camping and games on the shores of the River Malewa.",
  },
  {
    file: "conferences.html",
    nav: { active: "experiences", variant: "overlay" },
    body: conferencesBody,
    title: "Conferences &amp; Events | Malewa Riverside Resort, Gilgil",
    description:
      "Conference halls, an executive breakout room, an outdoor gazebo and accommodation for delegates at Malewa Riverside Resort & Cottages — for corporate retreats, church conferences and seminars.",
    ogTitle: "Conferences &amp; Events at Malewa Riverside",
    ogDescription:
      "Meet. Gather. Retreat. Conference facilities and delegate accommodation about 12 km from Gilgil town.",
  },
  {
    file: "team-building.html",
    nav: { active: "experiences", variant: "overlay" },
    body: teamBuildingBody,
    title: "Team Building | Malewa Riverside Resort &amp; Cottages, Gilgil",
    description:
      "Expansive outdoor spaces designed for team bonding at Malewa Riverside Resort in Gilgil — team building grounds, bonfire site, scenic hiking, camping, table tennis and board games.",
    ogTitle: "Team Building at Malewa Riverside",
    ogDescription:
      "Outdoor grounds, activities and on-site accommodation for team retreats beside the River Malewa.",
  },
  {
    file: "clavina.html",
    nav: { active: "properties", variant: "overlay" },
    body: clavinaBody,
    title: "Clavina | Hotel",
    description:
      "Clavina is the group's hotel, alongside Malewa Riverside Resort & Cottages and Clavina Pax. Room types, rates and facilities are being confirmed before publication.",
    ogTitle: "Clavina — the group's hotel",
    ogDescription:
      "Clavina is part of the same group as Malewa Riverside and Clavina Pax. Property details are being confirmed.",
  },
  {
    file: "clavina-pax.html",
    nav: { active: "dining", variant: "overlay" },
    body: clavinaPaxBody,
    title: "Clavina Pax | The Group's Restaurant",
    description:
      "Clavina Pax is the group's restaurant — a dining destination for guests and visitors. Menus, service times and reservations are confirmed by the restaurant.",
    ogTitle: "Clavina Pax — the group's restaurant",
    ogDescription:
      "Dining for guests of the group, for visitors, and for gatherings arranged around a table.",
  },
  {
    file: "gallery.html",
    nav: { active: "gallery", variant: "overlay" },
    body: galleryBody,
    title: "Gallery | Malewa, Clavina &amp; Clavina Pax",
    description:
      "Photographs of the group's properties — Malewa Riverside Resort & Cottages in Gilgil, with frames held open for Clavina and Clavina Pax photography.",
    ogTitle: "Gallery — Malewa, Clavina &amp; Clavina Pax",
    ogDescription: "The river, the cottages, the restaurant and the grounds.",
  },
  {
    file: "about.html",
    nav: { active: "about", variant: "overlay" },
    body: aboutBody,
    title: "About | Malewa, Clavina &amp; Clavina Pax",
    description:
      "Malewa, Clavina and Clavina Pax are looked after by the same group — a riverside resort and cottages in Gilgil, a hotel, and a restaurant.",
    ogTitle: "About the group",
    ogDescription:
      "Three properties, one team: Malewa Riverside Resort & Cottages, Clavina, and Clavina Pax.",
  },
  {
    file: "contact.html",
    nav: { active: "contact", variant: "overlay" },
    body: contactBody,
    title: "Contact &amp; Directions | Malewa Riverside Resort &amp; Cottages",
    description:
      "Contact Malewa Riverside Resort & Cottages: Malewa-Kimbo Area, Gilgil, on the shores of the River Malewa. Call +254 704 025 999, +254 704 026 208 or +254 722 968 154.",
    ogTitle: "Contact the group",
    ogDescription:
      "Malewa-Kimbo Area, Gilgil — about 12 km from Gilgil town, on the shores of the River Malewa.",
  },
  {
    file: "book.html",
    nav: { variant: "solid" },
    body: bookBody,
    title: "Book / Enquire | Malewa, Clavina &amp; Clavina Pax",
    description:
      "Send a booking or dining enquiry for Malewa Riverside Resort & Cottages, Clavina or Clavina Pax. Choose your property, dates and requirements — with an indicative rate for Malewa stays.",
    ogTitle: "Book / make an enquiry",
    ogDescription:
      "One enquiry form for the group's three properties: Malewa, Clavina and Clavina Pax.",
  },
  {
    file: "404.html",
    nav: { variant: "solid" },
    body: notFoundBody,
    title: "Page not found | Malewa, Clavina &amp; Clavina Pax",
    description:
      "The page you were looking for is not here. Return to the homepage or start a booking enquiry.",
    ogTitle: "Page not found",
    ogDescription: "Return to the homepage or start a booking enquiry.",
  },
];

for (const item of PAGES) {
  const { file, title, description, ogTitle, ogDescription, schema } = item;
  write(
    file,
    page({
      head: { title, description, path: file, ogTitle, ogDescription, schema },
      nav: item.nav,
      body: item.body,
    })
  );
}

/* =========================================================
   robots.txt + sitemap.xml
   ========================================================= */

const SITEMAP_PAGES = PAGES.map((item) => item.file).filter((file) => file !== "404.html");

writeFileSync(
  join(ROOT, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`,
  "utf8"
);

writeFileSync(
  join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_PAGES.map(
  (file) => `  <url>
    <loc>${ORIGIN}/${file === "index.html" ? "" : file}</loc>
    <changefreq>monthly</changefreq>
  </url>`
).join("\n")}
</urlset>
`,
  "utf8"
);

console.log("  robots.txt");
console.log("  sitemap.xml");
