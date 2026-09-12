# Adding photos to the website

A guide for whoever is helping with the photography — no coding needed.

---

## The short version

Every photo on the site is a **labelled slot** waiting for a file. If the file
isn't there yet, the page shows a tidy placeholder that tells you the exact
filename it wants.

To fill a slot:

1. Take the photo.
2. Rename the file to match the slot exactly.
3. Drop it in the right folder under `assets/images/`.
4. Refresh the page. It appears.

That's it. No editing, no code, nothing to install.

You cannot break the site by adding the wrong file — a slot with no file simply
keeps showing its placeholder. The only visible mistake is a photo appearing in
the wrong place, and that is fixed by renaming one file.

---

## The checklist is your work list

Open this file and work down it:

```
assets/images/PHOTO-CHECKLIST.md
```

It lists all 50 photographs the site wants, grouped by property. Each row tells
you:

- the **exact filename and folder** to use
- **what the photo should show**
- the **best size** to export it at
- **which pages** it appears on

There is also `assets/images/photo-shot-list.csv` if you would rather open it in
Excel or Google Sheets, or send it to a photographer.

If the pages change, the checklist can be regenerated so it never goes stale:

```
node tools/photo-checklist.mjs
```

---

## The five rules

**1. Filenames must match exactly.** Copy and paste from the checklist rather
than typing. `ololeshwa-cottage-living-room.jpg` is not the same as
`ololeshwa-cottage-living-room-1.jpg`.

**2. All lowercase, hyphens instead of spaces, and `.jpg` at the end.**
Filenames are case-sensitive on the web — `Malewa-Hero.JPG` will not appear
where `malewa-hero.jpg` is expected.

**3. Send originals, not WhatsApp images.** Messaging apps shrink photos and
strip the quality out. Send full-size files through Google Drive, Dropbox or
WeTransfer.

**4. Keep the subject in the middle.** The site crops photos to fill their
space, so anything near the very edge may be cut off — especially on phones. For
the big banner images the text sits over the bottom-left corner, so keep the
interesting part of the photo centre or slightly right.

**5. Photographs must be the client's own.** Do not lift images from the
internet, from the Pixieset gallery, or from another hotel. See "About the
Pixieset gallery" below for how to get the real files.

---

## Step by step

### 1. Find out what is needed

Open `assets/images/PHOTO-CHECKLIST.md` in any text editor, or open
`assets/images/photo-shot-list.csv` in a spreadsheet. Start with the Malewa
section — that is the property with the most photography and the most pages.

### 2. Gather the photos

Work with the client or their photographer to collect the originals. Copy them
into a working folder on your computer, and leave the originals untouched.

### 3. Rename each file to match its slot

Right-click then Rename on Windows, or click the name and press Enter on a Mac.
Rename it to exactly what the checklist says.

If you have several similar photos, pick the best one and rename that. Keep the
rest in your working folder in case the client changes their mind later.

### 4. Drop the file into the right folder

The checklist path tells you where it goes. For example:

```
assets/images/malewa/accommodation/ololeshwa-cottage-living-room.jpg
          └─ property ─┘ └─ section ─┘ └───── filename ─────┘
```

The folders already exist. If a folder looks empty, that is fine — it is waiting
for its first photo.

### 5. Look at the page

Open `index.html` in your browser and refresh. The placeholder should be gone
and your photo in its place. The pages listed in the checklist are:

- `index.html` — Home
- `properties.html` — the three properties
- `malewa.html` — Malewa Riverside
- `stay.html` — accommodation and the Ololeshwa Cottage
- `dining.html` — Clavina Pax and dining at Malewa
- `clavina.html` and `clavina-pax.html`
- `conferences.html`, `team-building.html`, `experiences.html`
- `gallery.html`, `about.html`, `contact.html`

### 6. Tick it off

Tick the box in the checklist and move to the next row.

---

## Checking your progress

Two commands, both run from the project folder. If you would rather not use a
terminal, skip this — the site itself shows you what is still missing.

**See how many photos are outstanding:**

```
node tools/photo-checklist.mjs
```

It rewrites the checklist and prints a count, for example `12/50 in place`.

**Run the full site check:**

```
node tools/check-site.mjs
```

It lists every photo still needed, plus any broken links or missing details.
When it reports **0 photography slot(s) outstanding**, all the photography is in.

---

## Preparing the files

You do not need Photoshop. Any of these will do:

- **Mac** — open the photo in Preview, then Tools, then Adjust Size.
- **Windows** — open in Photos, then Edit, then Resize, or use Paint.
- **In a browser** — [squoosh.app](https://squoosh.app) is free and quick.

Targets from the checklist:

| Where it goes | Export at | Aim for |
|---|---|---|
| Big banner and hero images | 2400 × 1600 px or larger | under about 800 KB |
| Normal section photos | 1600 × 1200 px | under about 500 KB |
| Portrait photos | 1200 × 1600 px | under about 500 KB |
| Gallery and square tiles | 1200 × 1200 px | under about 400 KB |
| Social sharing image | 1200 × 630 px | under about 300 KB |

Save as **JPEG at about 80% quality**. Do not upscale a small photo to reach
these numbers — a sharp 1200 px photo looks far better than a blurry 2400 px one.
If the original is smaller than the target, use it as it is.

---

## Which photos matter most

If you can only get a few shots quickly, get these first — they carry the most
weight:

1. **The home banner** — the single strongest image of the resort and the river.
   `malewa/hero/malewa-riverside-hero.jpg`
2. **The cottages** — the exterior plus one interior. `malewa/exterior/` and
   `malewa/accommodation/`
3. **The Ololeshwa Cottage set** — outside, living room, kitchen and dining area,
   and the outdoor fireplace. This is the premium offering and has its own
   section on the site.
4. **The restaurant and the food** — `malewa/restaurant/` and
   `clavina-pax/dining/`
5. **A conference hall in use** — an empty room sells nothing.
   `malewa/conference/`
6. **The team building grounds** — wide shots that show how much space there is.
7. **The river** — the reason the place has its name.

These match the client's stated media categories: accommodation, restaurant,
conference hall, team building area, hotel exterior and riverside meals.

---

## Troubleshooting

| What you see | What it means | What to do |
|---|---|---|
| The placeholder is still there | The file is missing, in the wrong folder, or named slightly differently | Read the placeholder on the page — it prints the exact path it wants |
| A photo appears in two places | That is normal for photos used on more than one page | Nothing, unless it is the wrong subject in one of them |
| The top of someone's head is cut off | A tall photo being cropped into a wide space | Re-export with more room around the subject, or send a wider shot |
| The page feels slow | The photos are too large | Re-export at about 80% quality, using the sizes above |
| A photo looks soft in the lightbox | It is being enlarged beyond its real size | Use a larger original if you have one |
| Nothing changes after adding a file | The browser is showing a cached copy | Hard refresh: `Ctrl+Shift+R` on Windows, `Cmd+Shift+R` on Mac |
| You renamed a file and now it is gone from the site | The new name no longer matches the slot | Rename it back to exactly what the checklist says |

---

## About the Pixieset gallery

The client's photos currently live in a Pixieset gallery. That gallery is behind
Cloudflare protection and is a **private client gallery**, so images cannot be
downloaded from it directly, and they should not be scraped from it.

To use those photographs on the website, ask the client to either:

- download the originals from Pixieset and share them — Google Drive, Dropbox or
  WeTransfer all work — or
- ask their photographer for a set licensed for web use.

Then rename the files to match the checklist and drop them in as normal.

---

## What not to do

- **Do not use stock photos or AI-generated images.** The point of the site is
  that it shows the client's actual property. A beautiful photo of a different
  hotel is worse than an honest empty slot.
- **Do not rename the folders or move files between them.** Each page looks for
  its file at one exact path.
- **Do not edit the HTML pages to point at different filenames.** The pages are
  generated from one source file, so hand edits get overwritten. If a filename
  genuinely needs to change, ask the developer — it is a small change in a
  single place.
- **Do not delete `assets/images/README.md`.** It is the written reference for
  every slot on the site.

---

## When you are finished

1. Run `node tools/check-site.mjs` and confirm it reports **0 photography
   slot(s) outstanding**.
2. Tell the developer the photography is in. The enquiry form endpoint and the
   final domain are the last two things needed before launch.

Thanks — this is the step that turns the site from a strong structure into the
client's actual property.
