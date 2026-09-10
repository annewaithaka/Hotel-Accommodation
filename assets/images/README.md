# Photography drop-in guide

Every photograph on the site is a **labelled slot**. If the file is not there
yet, the layout shows an on-brand placeholder naming the slot and the exact
filename it expects — instead of a broken image or an unrelated stock photo.

> **Handing this to someone who does not code?** Start them on
> [`ADDING-PHOTOS.md`](../../ADDING-PHOTOS.md) — a plain-language walkthrough —
> and give them `PHOTO-CHECKLIST.md` in this folder, which lists every slot with
> a tick box. Regenerate it any time with `node tools/photo-checklist.mjs`.

Nothing is invented. Drop the real photograph in at the path below and it appears
immediately. No code changes, no rebuild.

## How it works

```html
<figure class="photo photo--landscape" data-slot="Stay — cottage interior">
  <img src="assets/images/malewa/accommodation/malewa-cottage-interior.jpg" alt="…" loading="lazy" />
</figure>
```

* If the file exists it is shown, cropped to the layout's aspect ratio with
  `object-fit: cover` — never squashed.
* If it does not exist, the wrapper shows a quiet branded slot with the label and
  filename.

## Folder structure

```text
assets/images/
    malewa/
        hero/  exterior/  accommodation/  restaurant/
        conference/  team-building/  riverside/  experiences/  gallery/
    clavina/
        hero/  exterior/  accommodation/  dining/  events/  gallery/
    clavina-pax/
        hero/  dining/  events/  gallery/
    branding/
```

## Filename rules

* Filenames describe **what the photograph shows**. If a supplied photograph
  shows something different from its filename, rename the file and update the
  `src` and the `alt` text — never leave a misleading name in place.
* Lowercase, hyphenated, no spaces, and no numbered files where the subject is
  already known.
* Replace, never add a near-duplicate.

## Format and size guidance

| Use | Target size | Notes |
|---|---|---|
| Full-bleed hero | 2400 × 1600 px or larger | Heroes crop hard on mobile — keep the subject centre or right |
| Section feature photos | 1600 × 1200 px, landscape | Also displayed at 3:2 and 16:9 |
| Portrait / tall slots | 1200 × 1600 px, portrait | Displayed at 3:4 and 4:5 |
| Square and gallery tiles | 1200 × 1200 px | Gallery tiles also crop to 4:3 |

Export JPEG at quality ~80, sRGB. Keep each file under about 600 KB so the
gallery stays quick on mobile data.

## Malewa — `assets/images/malewa/`

| Slot | File | What it should show |
|---|---|---|
| Home / Malewa hero | `hero/malewa-riverside-hero.jpg` | Strongest establishing image of the resort and the River Malewa |
| Riverside setting | `hero/malewa-riverside-setting.jpg` | Wide river or grounds view — used on Contact and Gallery |
| Resort grounds | `exterior/malewa-resort-grounds.jpg` | Grounds and buildings together — used on Properties and About |
| Cottages exterior | `exterior/malewa-cottages-exterior.jpg` | The cottage exteriors, ideally with grounds |
| Cottage interior | `accommodation/malewa-cottage-interior.jpg` | Inside a cottage |
| Ololeshwa Cottage | `accommodation/ololeshwa-cottage.jpg` | The Ololeshwa Cottage from outside |
| Ololeshwa living room | `accommodation/ololeshwa-cottage-living-room.jpg` | The comfortable living room |
| Ololeshwa kitchen & dining | `accommodation/ololeshwa-cottage-kitchen-dining.jpg` | The open kitchen and dining area |
| Ololeshwa fireplace | `accommodation/ololeshwa-cottage-outdoor-fireplace.jpg` | The outdoor fireplace |
| Main Restaurant | `restaurant/malewa-main-restaurant.jpg` | The restaurant itself |
| Restaurant table | `restaurant/malewa-restaurant-dining.jpg` | A set table or a meal in progress |
| Dining detail | `restaurant/malewa-dining-detail.jpg` | Food or table detail, wide crop |
| Skyline Coffee Bar | `restaurant/skyline-coffee-bar.jpg` | The coffee bar |
| Conference hall | `conference/malewa-conference-hall.jpg` | A conference hall — also the Conferences hero |
| Breakout room | `conference/malewa-executive-breakout-room.jpg` | The executive breakout room |
| Outdoor gazebo | `conference/malewa-outdoor-gazebo.jpg` | The gazebo, set up if possible |
| Delegates | `conference/malewa-conference-delegates.jpg` | A group in session, for the occasions grid |
| Team building grounds | `team-building/malewa-team-building-grounds.jpg` | The outdoor grounds — the Team Building hero |
| Team activities | `team-building/malewa-team-building-activities.jpg` | A group using the grounds |
| River | `riverside/malewa-river.jpg` | The River Malewa at the resort |
| Riverside meals | `riverside/malewa-riverside-meals.jpg` | Riverside dining, from the supplied media |
| Scenic hiking | `experiences/malewa-scenic-hiking.jpg` | The hiking area or a view from it |
| Bonfire | `experiences/malewa-bonfire.jpg` | The bonfire site |
| Table tennis | `experiences/malewa-table-tennis.jpg` | The table tennis table |
| Board games | `experiences/malewa-board-games.jpg` | Board games in use |
| Camping & tents | `experiences/malewa-camping-tents.jpg` | Tents pitched on the grounds |
| Outdoor spaces | `experiences/malewa-outdoor-spaces.jpg` | The Experiences hero |

### Malewa gallery — twelve frames, in display order

| # | File | Caption shown |
|---|---|---|
| 1 | `gallery/malewa-river-bend.jpg` | The River Malewa |
| 2 | `gallery/malewa-cottage-veranda.jpg` | Cottage veranda |
| 3 | `gallery/malewa-restaurant-interior.jpg` | Main Restaurant |
| 4 | `gallery/skyline-coffee-bar-counter.jpg` | Skyline Coffee Bar |
| 5 | `gallery/malewa-gazebo-lunch.jpg` | The outdoor gazebo |
| 6 | `gallery/malewa-garden-path.jpg` | Gardens and grounds |
| 7 | `gallery/malewa-hiking-view.jpg` | Scenic hiking |
| 8 | `gallery/malewa-bonfire-night.jpg` | The bonfire site |
| 9 | `gallery/malewa-conference-hall-in-session.jpg` | Conference hall |
| 10 | `gallery/malewa-table-tennis-lawn.jpg` | Table tennis |
| 11 | `gallery/malewa-camping-tents-riverside.jpg` | Camping and tents |
| 12 | `gallery/malewa-riverside-meal.jpg` | Riverside meals |

## Clavina — `assets/images/clavina/`

Clavina's photography has not been supplied. These slots hold the page together
until it is — rename them once the actual subjects are known.

| Slot | File | What it should show |
|---|---|---|
| Hero | `hero/clavina-hero.jpg` | The property's strongest establishing image |
| Exterior | `exterior/clavina-exterior.jpg` | The building and its setting |
| Accommodation | `accommodation/clavina-accommodation.jpg` | A room, once room types are confirmed |
| Dining | `dining/clavina-dining.jpg` | Dining at the property, if it is offered |

Gallery frames: `gallery/clavina-exterior-view.jpg`,
`gallery/clavina-interior-view.jpg`, `gallery/clavina-detail-view.jpg`.

## Clavina Pax — `assets/images/clavina-pax/`

| Slot | File | What it should show |
|---|---|---|
| Hero | `hero/clavina-pax-hero.jpg` | The restaurant's strongest image |
| Dining room | `dining/clavina-pax-dining-room.jpg` | The room itself |
| Table setting | `dining/clavina-pax-table.jpg` | A set table |
| Food | `dining/clavina-pax-food.jpg` | A dish or dishes from the menu |
| Events | `events/clavina-pax-events.jpg` | Group dining or an event in the space |

Gallery frames: `gallery/clavina-pax-interior.jpg`,
`gallery/clavina-pax-table-set.jpg`, `gallery/clavina-pax-plate.jpg`.

## Branding — `assets/images/branding/`

| File | Purpose |
|---|---|
| `branding/malewa-riverside-social.jpg` | Open Graph / social share image, 1200 × 630 px. Referenced by every page's meta tags. |
| `branding/river-reeds.svg` | The decorative placeholder motif. Not a photograph — leave as is. |

## Checking your work

```bash
node tools/check-site.mjs
```

Lists every slot still waiting for a file, alongside the site's other QA checks.

## A note on sourcing

Photographs must come from the client. The Pixieset gallery supplied for this
project is a client gallery behind Cloudflare protection and is not licensed for
redistribution as site assets, so nothing was downloaded from it. Export the
final selection from the original files, or ask the photographer for a
web-licensed set. No stock or AI-generated imagery has been substituted.
