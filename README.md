# Baraka Collection — Hotel Prototype

Static HTML/CSS/JS site for a three-location Kenyan hotel group. Built as a prototype for client approval before real content and Formspree wiring.

## Folder structure (unflatten after download)

The downloaded files have double-underscore prefixes to keep folder paths flat. Unflatten them into this structure:

```
Hotel-Accommodation/
├── index.html
├── about.html
├── diani.html
├── naivasha.html
├── nairobi.html
├── book.html
├── contact.html
├── 404.html
├── css/
│   └── styles.css      (from css__styles.css)
├── js/
│   └── main.js         (from js__main.js)
└── README.md
```

On PowerShell, from the folder where the files were downloaded:

```powershell
New-Item -ItemType Directory -Force -Path .\css, .\js
Move-Item .\css__styles.css .\css\styles.css
Move-Item .\js__main.js .\js\main.js
```

## Run it locally

Just open `index.html` in a browser. No build step, no server needed.

For live-reload while editing, run any static server from the project root — e.g. VS Code's Live Server extension, or:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## What's in the prototype

- **Home** — full hero, brand intro, three-location preview with alternating layout, "how we work" band, CTA
- **Diani / Naivasha / Nairobi** — one page per property with hero, quick facts strip, room categories, amenities, gallery, CTA
- **About** — story + three brand promises
- **Book** — full booking form with client-side validation, success state, FAQ
- **Contact** — three property cards + general enquiries
- **404** — custom not-found page

The booking form on `book.html` pre-fills the property when linked from `book.html?location=diani` etc. All "Book" CTAs on location pages already pass this.

## Design system (quick reference)

- **Colors:** ivory `#F5EFE4`, deep forest green `#2F3E30`, warm brass `#A6822E`, charcoal `#1A1A1A` — all as CSS variables in `styles.css`
- **Fonts:** Fraunces (display, serif) + Inter (body, sans) — loaded from Google Fonts
- **Layout:** 1240px max, 96px section padding on desktop, 64px on mobile

## Before showing the client

- Nothing to change — everything is prototype-labelled. Client sees shape and feel.
- Placeholder images are from picsum.photos (random per seed but always load). Client should assume every photo will be replaced.
- "Baraka Collection" is a working brand name — client to replace.

## After client approval — swap for real data

1. **Brand name & logo:** find-replace `Baraka Collection` and swap `.brand` styling if a real logo is provided.
2. **Property names, addresses, phone numbers, emails:** find in each location HTML + `contact.html` + `book.html` footer.
3. **Room categories, prices, descriptions:** in each location page's `.rooms-grid`.
4. **Amenities:** in each location page's `.amenities-grid`.
5. **Photos:** replace every `https://picsum.photos/seed/...` URL with a real image. Suggested: create `/images/` folder, name files by property + purpose (e.g. `diani-hero.jpg`, `nairobi-suite.jpg`), reference as `images/diani-hero.jpg`.
6. **Formspree — wire the booking form:**
   - Create a Formspree account (free tier = 50 submissions/month).
   - Get an endpoint ID.
   - In `js/main.js`, inside `initBookingForm()`, uncomment and set: `form.action = "https://formspree.io/f/YOUR_ID"; form.method = "POST";`
   - OR add `action="https://formspree.io/f/YOUR_ID" method="POST"` directly on the `<form>` in `book.html` and remove the fake-submit lines in `main.js`.
   - Add a hidden field `<input type="hidden" name="_subject" value="New booking request">` for cleaner admin emails.
7. **Meta descriptions:** update the `<meta name="description">` on each page for SEO.
8. **Favicon set:** add `favicon.ico`, `apple-touch-icon.png`, etc. in root and link from each `<head>`.
9. **Google Maps embed (optional):** add an `<iframe>` on each location page below the gallery, using Google Maps embed URL per address.

## Deploy to Render (like Mugunda)

1. Push to a GitHub repo (`hotel-accommodation` or similar).
2. In Render, create a new Static Site.
3. Build command: (leave blank)
4. Publish directory: `.` (or `/`)
5. Add a custom domain when ready.

## Admin experience (per scoping)

Bookings arrive by email to whoever owns the Formspree account. Admin logs into Formspree dashboard to view/export submissions as CSV. No admin UI on the site itself.

If bookings exceed 50/month, either upgrade Formspree (~$10/mo) or set up three separate free endpoints (one per property) and switch the form `action` based on the selected location.
