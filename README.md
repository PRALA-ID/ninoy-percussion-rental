# Percussion Rental

Production-ready static website with three routes:

- `/index.html` — main landing page
- `/koleksi/index.html` — full percussion catalog
- `/project/index.html` — projects & performances

## Preview locally

Open `index.html` directly, or serve the folder locally:

```bash
python -m http.server 8000
```
Then open `http://localhost:8000/`.

## Implementation

- Vanilla HTML/CSS/JS.
- Responsive layouts validated from 320px through 1440px.
- The landing hero uses an edge-to-edge section image while its raised overlay copy
  remains aligned to the centered desktop content guide.
- Homepage collaborations use a fixed four-column, two-row desktop grid with equal-height cards;
  the project page uses the same compact 16:9 card treatment.
- Project service labels are standardized to Rental and Performance.
- The instrument catalog (`/koleksi`) mirrors the *Ninoy Percussion Rental Instrument E-Catalogue* PDF,
  which is the single source of truth: names, brands, prices, categories (Pitched, Unpitched,
  Auxiliary, Latin) and order all come from the PDF. Update the PDF first, then mirror it here;
  homepage category cards link to the same four categories.
- Instrument photos are the real studio shots used in the PDF, cropped to 4:3 and served as
  `assets/images/instruments/<slug>-640.webp` (cards) and `-1280.webp` (detail dialog) via `srcset`.
- Catalog filtering is intentionally simplified to instrument category; old `?category=mallet|drums|cymbals`
  links are mapped to the new categories.
- Long catalog metadata uses single-line ellipsis truncation to preserve the inline price.
- Testimonial cards use transparent placeholders until approved client quotes are supplied.
