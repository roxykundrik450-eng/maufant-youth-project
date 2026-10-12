# Maufant Youth Project website

A static, deployable website for **Maufant Youth Project** — a volunteer-run youth
charity based at the Maufant Variety Youth Centre, St Saviour, Jersey
(Registered Charity No. 340, AJC member AJC505).

This site was adapted from the open-source
[Charitize — Charity / NGO HTML Template](https://github.com/uiuxlabz/charity-html-template)
(MIT-style licence, free for personal and commercial use, attribution appreciated).
The design system, section architecture and interaction code were re-skinned and
rewritten around a **Jersey maritime** palette and locally-specific content.

## Stack

Plain HTML5, CSS3 custom properties and vanilla JavaScript. **No build step, no
framework, no dependencies.** Open `index.html` in any modern browser and it works.

```
maufant-youth-project/
  index.html          Home — mission, what we do, sessions, donation CTA
  about.html          About — charitable objects, history, governance
  sessions.html       Sessions — weekly timetable, holiday programme, first visit
  contact.html        Contact — venue details, form, safeguarding note
  assets/
    css/base.css      Design tokens + full component library
    js/main.js        Nav, reveal animations, progress bar, counters
    img/              SVG illustrations and logos (all self-hosted, zero external images)
```

### Open-source components

The site stays dependency-free at build time — no bundler, no `npm install` — but it is
enriched by six small, permissively-licensed open-source libraries loaded from a CDN.
Every integration is guarded in `assets/js/main.js`, so if a CDN is unreachable the page
still works and simply drops that enhancement.

| Library | Licence | Used for | Where |
|---|---|---|---|
| [Leaflet](https://leafletjs.com) + [OpenStreetMap](https://www.openstreetmap.org) | BSD-2 / ODbL | Interactive location map — no API key, no Google | `sessions.html`, `contact.html` |
| [GLightbox](https://biati-digital.github.io/glightbox/) | MIT | Photo lightbox for the gallery | `index.html` |
| [Swiper](https://swiperjs.com) | MIT | Testimonials carousel | `index.html` |
| [Chart.js](https://www.chartjs.org) | MIT | "Where your money goes" donation chart | `index.html` |
| [Lucide](https://lucide.dev) | ISC | Icon system (replaces the old emoji glyphs) | all pages |
| [Just-validate](https://just-validate.dev) | MIT | Contact-form validation | `contact.html` |

To self-host instead of using the CDN, download each library into `assets/vendor/` and
swap the `<script>`/`<link>` URLs in the page `<head>` and before `</body>`.

## Local preview

Double-click `index.html`, or serve the folder:

```bash
cd maufant-youth-project
python -m http.server 8080
# then open http://localhost:8080
```

## Design

| Token | Value | Role |
|---|---|---|
| `--channel` | `#0E2A3F` | Deep sea — footers, dark bands |
| `--tide` | `#12708C` | Primary action — buttons, links |
| `--seaglass` | `#3FA9BF` | Shallow surf — accents |
| `--sandstone` | `#E8A33D` | Jersey granite / sunset — highlights, CTA |
| `--mist` | `#F2F7F8` | Sea foam — page canvas |

Typefaces: Bricolage Grotesque (display), Inter (body), IBM Plex Mono (data).
All sizes use `clamp()` so the layout is fluid from 320px up.

Colours, spacing, radii and motion are all CSS custom properties in
`assets/css/base.css`, so re-branding the whole site means editing the `:root` block.

## Before going live

The content below is written from the charity's public register entry and is
accurate, but is not the charity's own copy. Please confirm with the trustees
before launch:

1. **Donation button** — currently links to the contact page. Point it at a real
   payment provider (e.g. Jersey-friendly `Charities Aid Foundation` bank transfer
   details, `PayPal` or `Give A Little`) before launch.
2. **Contact form** — a static demo. Wire `contact.html`'s form to a mail service
   (Formspree, Basin, Netlify Forms, or an Island-based host) — see the footnote
   under the submit button.
3. **Session times** — verify the Tue/Wed/Thu/Fri timetable and age groups
   against the current term's rota.
4. **Photos** — the images are self-contained SVG illustrations, shown in the
   "Life at the Centre" gallery. Swap in real photographs of the Centre and its
   members (with consents in place) and the GLightbox gallery will pick them up.
5. **Social links** — the footer Facebook/Instagram icons are placeholders (`#`).
6. **Safeguarding statement** — the note on the contact page should be reviewed
   or replaced with the charity's own approved wording.
7. **Terms/privacy** — small charities collecting email addresses should publish
   a short privacy notice describing what is done with them.
8. **Map coordinates** — the Leaflet map marker uses approximate coordinates for
   Maufant (`49.2098, -2.0632`) in `assets/js/main.js`. Replace `CENTRE` with the
   Centre's exact latitude/longitude before launch.

## Deploy

The repo is ready for **GitHub Pages** (a workflow is included), Netlify, Vercel,
Cloudflare Pages, or any static host. Enable Pages with "deploy from branch",
root directory, and the site will go live.

```bash
# e.g. Netlify
npx netlify deploy --dir=. --prod
```

## Accessibility

Semantic landmarks, `aria-label` on interactive elements, keyboard-navigable
mobile menu (with Escape to close), visible focus styles, and
`prefers-reduced-motion` support that disables reveals and counters.

## Licence

Content is written for Maufant Youth Project. Code and design derive from the
Charitize charity template, which is free for personal and commercial use with
attribution appreciated (not required). Attribution retained in this README.
