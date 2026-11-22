# Percussion Rental

Production-ready static website with three routes:

- `/` — main landing page
- `/koleksi/` — full percussion catalog
- `/project/` — projects & performances

Internal links use folder URLs (`koleksi/`, `../project/`), so preview the site through a web server.

## Preview locally

Serve the folder locally:

```bash
python -m http.server 8000
```
Then open `http://localhost:8000/`.

## Implementation

- Vanilla HTML/CSS/JS.
- Responsive layouts validated from 320px through 1440px.
- The landing hero uses an edge-to-edge section image while its raised overlay copy
  remains aligned to the centered desktop content guide. Screens up to 600px wide get a crop of the
  same photo (`smartfren-malam-100-cinta-2024-hero-mobile.webp`) so no event logo sits behind the headline.
- Homepage collaborations use a fixed four-column, two-row desktop grid with equal-height cards;
  the project page uses the same compact 16:9 card treatment. Card photos come in `-400`, `-600` and
  `-800.webp` versions plus the full-size file, chosen through `srcset`/`sizes`; the project popup picks
  from the same set at popup size, and the logo-strip popup uses the full-size file.
- Project service labels are Rental, Collaboration, or Rental & Collaboration.
- Every visible project has a photo. A card without one can show the client's logo on a dark tile
  (`project-card-media--logo`) or the client's name (`project-wordmark`); the hidden Pageant
  (Mānoa Valley Theatre logo) and Steel Pan (Rumah Perkusi name) cards use these.
- Hidden project cards (`hidden` attribute, project page only): BYU–Hawaii Salsa Orchestra & Street Band,
  Pageant Musical and Steel Pan. Remove `hidden` to show one again. The homepage numbers
  (15+ Performance, 5+ Rental Clients) are typed by hand; update them when projects are shown or hidden.
- Client logos in the homepage strip are stored at about 3× their display size.
- Project and instrument cards open their detail popup through an invisible button (`.card-open`) that
  covers the card, added by `project.js` / `catalog.js`.
- Project details live in three places that must be kept in sync: the homepage cards (`index.html`),
  the logo-strip dialog data (`assets/js/logo-projects.js`) and the project page (`project/index.html`).
- The instrument catalog (`/koleksi`) mirrors the *Ninoy Percussion Rental Instrument E-Catalogue* PDF,
  which is the single source of truth: names, brands, prices, categories (Pitched, Unpitched,
  Auxiliary, Latin) and order all come from the PDF. Update the PDF first, then mirror it here;
  homepage category cards link to the same four categories. Three spelling fixes are applied on the
  site but not yet in the PDF: Steve Weiss (PDF: "Steveweiss"), Black Swamp ("BlackSwamp") and
  Bar Bell ("Bar bell").
- Instrument photos are the real studio shots used in the PDF, cropped to 4:3 and served as
  `assets/images/instruments/<slug>-640.webp` (cards) and `-1280.webp` (detail dialog) via `srcset`.
- Catalog filtering is intentionally simplified to instrument category; old `?category=mallet|drums|cymbals`
  links are mapped to the new categories. Each instrument card has an id (its photo slug), so
  `/koleksi/#<slug>` opens that instrument directly.
- The instrument dialog has a WhatsApp button whose message names the item as the PDF does
  ("Brand - Name"), its price and a link to that exact card.
- Long catalog metadata uses single-line ellipsis truncation to preserve the inline price.
- The testimonials section is hidden (`hidden` attribute) until approved client quotes are supplied;
  its markup and styles are kept so it can be switched back on.
- Fonts (Inter, DM Serif Display) are self-hosted from `assets/fonts/` under the SIL Open Font License.
- Canonical, Open Graph, JSON-LD, `sitemap.xml` and `robots.txt` use
  `https://prala-id.github.io/ninoy-percussion-rental/` until `percussionrental.id` is connected.
  To switch: add a `CNAME` file with the domain, set it in the repository's Pages settings, and replace
  that base URL in the three pages, `sitemap.xml` and `robots.txt`.

## Photo sources

Keep this list up to date when adding third-party photos, so credits and permissions can be traced.

- Instrument photos: Ninoy Percussion Rental studio shoot (same shots as the e-catalogue PDF).
- Senja Teduh Pelita: internal photo.
- The Music of Studio Ghibli (AFAID 2025): official Anime Festival Asia Indonesia material.
- The Legends 10: Magic: TRUST Orchestra.
- Hammersonic Festival 2024: Hammersonic website.
- Kinderfield School Cinere: Kinderfield School website.
- Malam 100 Cinta 2025: XLSMART website.
- Festival Cahaya Kebaikan: Tehbotol Sosro official YouTube channel.
- Perak (album cover): Thee Marloes official YouTube channel.
- BYU–Hawaii Culture Night 2017 and the December 2017 music devotional (used for the Christmas Concert card):
  Ke Alaka'i, BYU–Hawaii's student news site.
- BYU–Hawaii Shaka Steel: BYU–Hawaii performing arts (CLPA) Shaka Steel page.
- Client logos: each organization's own website or brand materials.
