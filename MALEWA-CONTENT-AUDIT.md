# Content audit — Malewa · Clavina · Clavina Pax

_Last updated: 10 September 2026_

This document separates what is **confirmed and published** from what still needs
the client's confirmation. It is the reference for anyone editing the site: if a
fact is not in the Confirmed section, it does not go on a page.

Three tiers are used throughout the build:

* **Tier 1 — Confirmed.** Supplied brochure, supplied project content, or
  supplied client media. Published as-is.
* **Tier 2 — Structural.** Interface and navigation language that makes no
  factual claim ("Explore Malewa", "Enquire about your stay"). Published.
* **Tier 3 — Unconfirmed.** Anything else. Not invented. Where a page needs it,
  the page carries an `.pending` block, and the item appears below.

---

## 1. Confirmed information (published)

### Group structure

| Item | Confirmed |
|---|---|
| Properties in the group | Malewa, Clavina, Clavina Pax |
| Malewa | Hotel, resort and cottages |
| Clavina | Hotel |
| Clavina Pax | Restaurant and dining |
| Group corporate name | **Not supplied** — the site uses the neutral "Our Properties" |

### Malewa Riverside Resort & Cottages

| Item | Confirmed |
|---|---|
| Property name | Malewa Riverside Resort & Cottages |
| Location | Malewa-Kimbo Area, Gilgil |
| Setting | On the shores of River Malewa |
| Distance | Approximately 12 km from Gilgil town |
| Positioning | A peaceful retreat for leisure, business and celebrations |
| Email | malewariversideresort@gmail.com |
| Phones | +254-704025999 · +254-704026208 · +254-722968154 |

**Facilities and experiences (brochure):** Luxury Cottages · Main Restaurant ·
Skyline Coffee Bar · Conference Halls · High-Speed Wi-Fi · Team Building Grounds ·
Bonfire Site · Scenic Hiking Area · Table Tennis · Board Games · Camping / Tents ·
Conference & Events accommodation · Outdoor gazebo · Executive breakout room.

**Event use cases (brochure):** corporate retreats · church conferences ·
seminars · celebrations.

**Media categories supplied:** accommodation · restaurant · conference hall ·
team building area · hotel exterior · riverside meals.

### Cottage rates (per room, per night, KES)

| Meal plan | Single 1–4 rooms | Single 5–6 rooms | Double 1–4 rooms | Double 5–6 rooms |
|---|---|---|---|---|
| Bed & Breakfast (BB) | 6,000 | 6,500 | 6,500 | 7,500 |
| Half Board (HB) | 7,500 | 8,000 | 9,500 | 10,000 |
| Full Board (FB) | 9,000 | 9,500 | 12,500 | 13,500 |

### OLOLESHWA COTTAGE

| Item | Confirmed |
|---|---|
| Type | Private four-room ensuite cottage |
| Features | Open, spacious kitchen and dining area · comfortable living room · outdoor fireplace · high-speed internet |
| B&B single occupancy | KES 5,000 per room, per night |
| B&B double occupancy | KES 6,500 per room, per night |
| Self catering | 30% off the applicable B&B rate; guests have full use of the cottage kitchen and meals are not provided by the resort |

### Deliberately excluded

The brochure does not support these, so they appear nowhere on the site:
swimming pool · spa · gym · sauna · beach · airport shuttle · wedding venue
capacity · specific room amenities · room service · 24-hour reception · laundry ·
children's play area · conference capacities · restaurant menus · opening hours ·
check-in / check-out times · cancellation and payment policy · social media.

---

## 2. Needs client confirmation

### Clavina — nothing beyond "a hotel in the group" is supplied

- [ ] Location, address and directions
- [ ] Property description and any history worth telling
- [ ] Room types and occupancy
- [ ] Rates and meal plans
- [ ] In-room facilities and services
- [ ] Check-in and check-out times
- [ ] Dining at the property
- [ ] Meeting or event space
- [ ] Wi-Fi, workspace, parking and access
- [ ] Property phone number and email
- [ ] Photography (exterior, interior, rooms)
- [ ] Any social media accounts

### Clavina Pax — nothing beyond "the group's restaurant" is supplied

- [ ] Menus or sample dishes, and a cuisine description
- [ ] Signature dishes or house specialities, and dietary options
- [ ] Price range
- [ ] Opening hours and service times
- [ ] Reservation process and phone number
- [ ] Seating, table sizes, private dining
- [ ] Events and group dining capability
- [ ] Location — same site as Clavina, or separate?
- [ ] Photography (room, table, food, events)

### Group and brand

- [ ] The official group or company name (the site currently says "Our Properties")
- [ ] Legal and trading names for each property
- [ ] Whether the group story should be told, and if so, the facts
- [ ] Ownership, founding and heritage details
- [ ] Final logo assets for the group and each property
- [ ] Final brand colours, if they differ from the current palette

### Contact and booking

- [ ] Confirmed contact details for Clavina and Clavina Pax
- [ ] A WhatsApp number, if one is used
- [ ] Social media accounts for each property
- [ ] Who receives enquiries, and through which inbox
- [ ] Booking workflow: enquiry-only, or an online booking engine?
- [ ] Formspree / CRM / booking endpoint to replace prototype mode
- [ ] Payment methods, deposit and cancellation policy

### Malewa policies not covered by the brochure

- [ ] Check-in and check-out times
- [ ] Exact meal inclusions for half board and full board
- [ ] Children's policy, extra beds and cots
- [ ] Pet policy
- [ ] Wi-Fi availability by accommodation type
- [ ] Exact room count for the non-Ololeshwa cottages
- [ ] Conference capacities and equipment specifications
- [ ] Children's rates and group booking terms
- [ ] Wedding and event packages

### Technical

- [ ] Final domain (canonical URLs, Open Graph URLs and the sitemap currently use the placeholder `https://malewariversideresort.co.ke`)
- [ ] Whether each property needs its own domain or subdomain
- [ ] Hosting and deployment target
- [ ] Analytics or consent requirements
- [ ] Final legal pages: privacy policy, terms, cookies

---

## 3. Photography mapping

No client photograph has been published yet. The Pixieset gallery supplied for
this project sits behind Cloudflare protection and is a client gallery, so it was
not downloaded and nothing was substituted for it — no stock imagery and no
AI-generated images. Each slot below renders a labelled placeholder until the
real file is dropped in at the given path.

**Source** for every row: _client photography — to be supplied_.

| Section | Image slot (file) | What the image should show |
|---|---|---|
| Home hero | `malewa/hero/malewa-riverside-hero.jpg` | Strongest establishing shot of the resort and the River Malewa |
| Home — riverside feature | `malewa/riverside/malewa-river.jpg` | The river at the edge of the grounds |
| Home / Malewa — cottages | `malewa/exterior/malewa-cottages-exterior.jpg` | Cottages and grounds |
| Home / Malewa — Ololeshwa | `malewa/accommodation/ololeshwa-cottage.jpg` | The Ololeshwa Cottage |
| Home — Clavina card | `clavina/hero/clavina-hero.jpg` | Clavina establishing image |
| Home — Clavina Pax card | `clavina-pax/hero/clavina-pax-hero.jpg` | The restaurant |
| Home / Dining — Clavina Pax | `clavina-pax/dining/clavina-pax-dining-room.jpg` | The dining room |
| Home / Malewa — Main Restaurant | `malewa/restaurant/malewa-main-restaurant.jpg` | The restaurant interior |
| Home / Malewa — Skyline Coffee Bar | `malewa/restaurant/skyline-coffee-bar.jpg` | The coffee bar |
| Home — gallery preview | `malewa/gallery/*` | Five Malewa frames |
| Properties hero | `malewa/exterior/malewa-resort-grounds.jpg` | Grounds and buildings |
| Malewa hero | `malewa/hero/malewa-riverside-hero.jpg` | Resort and river |
| Malewa — accommodation | `malewa/accommodation/malewa-cottage-interior.jpg`, `ololeshwa-cottage-living-room.jpg` | Cottage interior; Ololeshwa living room |
| Malewa / Dining | `malewa/restaurant/malewa-main-restaurant.jpg`, `skyline-coffee-bar.jpg` | Restaurant; coffee bar |
| Stay hero | `malewa/exterior/malewa-cottages-exterior.jpg` | Cottages |
| Stay — cottage section | `malewa/accommodation/malewa-cottage-interior.jpg`, `malewa/exterior/malewa-cottages-exterior.jpg` | Interior; exterior and grounds |
| Stay — Ololeshwa | `malewa/accommodation/ololeshwa-cottage-living-room.jpg`, `ololeshwa-cottage-kitchen-dining.jpg`, `ololeshwa-cottage-outdoor-fireplace.jpg` | Living room; kitchen and dining; outdoor fireplace |
| Dining hero | `clavina-pax/hero/clavina-pax-hero.jpg` | The restaurant |
| Dining — Clavina Pax | `clavina-pax/dining/clavina-pax-dining-room.jpg`, `clavina-pax-table.jpg`, `clavina-pax-food.jpg` | Room; table; food |
| Dining — Malewa | `malewa/restaurant/malewa-restaurant-dining.jpg`, `malewa-dining-detail.jpg`, `skyline-coffee-bar.jpg` | Table; dining detail; coffee bar |
| Conferences hero | `malewa/conference/malewa-conference-hall.jpg` | A conference hall |
| Conferences — occasions | `malewa/conference/malewa-executive-breakout-room.jpg`, `malewa-conference-delegates.jpg`, `malewa-outdoor-gazebo.jpg` | Breakout room; delegates; gazebo |
| Team building hero | `malewa/team-building/malewa-team-building-grounds.jpg` | The team building grounds |
| Team building — activities | `malewa/team-building/malewa-team-building-activities.jpg` | A group on the grounds |
| Experiences hero | `malewa/experiences/malewa-outdoor-spaces.jpg` | Open outdoor spaces |
| Experiences grid | `malewa/riverside/malewa-river.jpg`, `experiences/malewa-scenic-hiking.jpg`, `malewa-bonfire.jpg`, `malewa-camping-tents.jpg`, `malewa-table-tennis.jpg`, `malewa-board-games.jpg` | River; hiking; bonfire; camping; table tennis; board games |
| Experiences — outdoor spaces | `malewa/conference/malewa-outdoor-gazebo.jpg` | The gazebo |
| Gallery — Malewa | `malewa/gallery/*` (12 frames) | See `assets/images/README.md` for the frame list |
| Gallery — Clavina | `clavina/gallery/*` (3 frames) | Exterior, interior, detail |
| Gallery — Clavina Pax | `clavina-pax/gallery/*` (3 frames) | Interior, table setting, plate |
| About hero | `malewa/exterior/malewa-resort-grounds.jpg` | The grounds |
| About — riverside | `malewa/hero/malewa-riverside-setting.jpg` | Riverside setting |
| Clavina page | `clavina/hero/*`, `exterior/*`, `accommodation/*`, `dining/*` | Property, exterior, accommodation, dining |
| Clavina Pax page | `clavina-pax/hero/*`, `dining/*`, `events/*` | Restaurant, room, table, food, events |
| Contact — directions | _map placeholder on the page_ | A Google Maps embed or pin, once the exact location is confirmed |
| Social sharing | `branding/malewa-riverside-social.jpg` | 1200 × 630 px Open Graph image |

**Alt text.** Every image carries descriptive alt text written against the
intended subject. If a supplied photograph shows something different, update the
alt text as well as the filename.

---

## 4. Remaining placeholder items

### Content

* Clavina: all property detail (see §2) — the page carries four `.pending` blocks
* Clavina Pax: menu, cuisine, hours, reservations, events — four `.pending` blocks
* Group: official name, story, legal naming — `.pending` block on About
* Contact: Clavina and Clavina Pax contact details — `.pending` block on Contact
* Stay: Clavina accommodation — `.pending` block on Stay
* Properties: both Clavina and Clavina Pax — `.pending` blocks on Properties

### Media

* 50 image slots awaiting client photography (run the check below for the live list)
* Open Graph social image, 1200 × 630 px

### Technical

* Booking endpoint: the form runs in **prototype mode**. It validates, shows an
  indicative Malewa rate, and then states plainly that the enquiry has not been
  sent, offering a pre-filled email and the phone numbers as fallbacks. Set
  `data-endpoint` on `#enquiry-form` in `book.html` (or in the builder) to a real
  Formspree / CRM endpoint to go live.
* Domain: `ORIGIN` in `tools/build-pages.mjs` is a placeholder and feeds every
  canonical URL, Open Graph URL and the sitemap.
* Analytics: none installed.
* Legal pages: privacy policy and terms not yet written.
* Apple touch icon set: `apple-touch-icon.png` is generated; additional sizes can
  be added when the final logo arrives.

---

## 5. Running the checks

```bash
node tools/build-pages.mjs   # regenerate the static HTML from the shared shell
node tools/check-site.mjs    # QA: fictional content, links, SEO, a11y basics, image slots
```

The site check fails the build if any Baraka / Diani / Naivasha / Nairobi
reference, Picsum URL, old room category, inline style, broken internal link or
missing SEO tag reappears.
