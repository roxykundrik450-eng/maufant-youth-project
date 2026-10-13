# Maufant Youth Project website

A static, deployable website for **Maufant Youth Project** — a volunteer-run youth
charity based at the Maufant Variety Youth Centre, St Saviour, Jersey
(Registered Charity No. 340, AJC member AJC505).

**Live: <https://maufantyouth.org>** · Contact: `chat@maufantyouth.org`

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
  index.html          Home — mission, what we do, gallery, sessions, donation CTA
  about.html          About — charitable objects, history, governance
  sessions.html       Sessions — weekly timetable, holiday programme, first visit
  contact.html        Contact — venue details, map, email button, safeguarding note
  credits.html        Photo credits and licences
  assets/
    css/base.css      Design tokens + full component library
    js/main.js        Nav, reveals, counters, and all library integrations
    img/              Logo, favicon and Jersey island outline (original SVG)
    img/photos/       Freely-licensed photographs (credited in credits.html)
```

### Photography

Photographs come from openly licensed collections, mostly
[Wikimedia Commons](https://commons.wikimedia.org); each one is credited with its author
and licence on [`credits.html`](credits.html). They cover two things: Jersey itself — the
coastline, Gorey, Saint Brélade, St Helier — and the activities that fill a week at the
Centre: table tennis, the kitchen, clay and craft, the music room, the games hall, trips
outdoors.

Every file is used under a licence that permits reuse and adaptation (CC0, public domain,
CC BY or CC BY-SA), and images have been cropped, resized and re-compressed for the web.
When the Centre has its own photography of members and premises, the same layout will take
it: drop new files into `assets/img/photos/` and update the credits page. The BaguetteBox
gallery picks up new files automatically.

### Open-source components

The site stays dependency-free at build time — no bundler, no `npm install` — but it is
enriched by a set of deliberately **niche, permissively-licensed** open-source libraries.
Five are loaded from a CDN and one (Iconoir) is inlined as SVG. Every integration is
guarded in `assets/js/main.js`, so if a CDN is unreachable the page still works and simply
drops that enhancement.

| Library | Licence | Used for | Where |
|---|---|---|---|
| [MapLibre GL JS](https://maplibre.org) + [OpenFreeMap](https://openfreemap.org) | BSD-3 | Vector location map — no API key, no Google | `sessions.html`, `contact.html` |
| [BaguetteBox.js](https://feimosi.github.io/baguetteBox.js/) | MIT | Photo lightbox for the gallery | `index.html` |
| [Keen Slider](https://keen-slider.io) | MIT | Testimonials carousel | `index.html` |
| [Frappe Charts](https://frappe.io/charts) | MIT | "Where your money goes" donation donut | `index.html` |
| [Iconoir](https://iconoir.com) | MIT | Icon system (SVG, inlined) — replaces the emoji glyphs | all pages |

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
2. **Contact** — the page uses a `mailto:` button rather than a form, so there is no
   backend to maintain and nothing to break. If the charity would rather collect
   enquiries server-side (or wants a newsletter signup), that needs a form service
   plus the DNS records to send from `maufantyouth.org`.
3. **Session times** — verify the Tue/Wed/Thu/Fri timetable and age groups
   against the current term's rota.
4. **Photos** — the site uses openly licensed photography (see
   [`credits.html`](credits.html)). Add the Centre's own photographs of members and
   premises when they are available, with the appropriate consents, and update the
   credits page. The BaguetteBox gallery picks up new files automatically.
5. **Figures** — the public record (AJC member page, Jersey Charity Commissioner register)
   carries the charity number, objects, address and contacts, but **no financial data at all**:
   GiveRadar's Jersey dataset reports a financial return for 0% of the 381 registered charities.
   The following are therefore illustrative and must be replaced with the trustees' own numbers:
   the hero fundraising total and percentage, the "where your money goes" breakdown,
   the per-place holiday cost, and the claim about core funding and reserves.
   Either supply the real figures or remove those blocks.
6. **Social links** — the footer carries an email icon only. Add real Facebook/Instagram
   accounts if the charity has them; do not restore placeholder `#` links.
7. **Safeguarding statement** — the note on the contact page should be reviewed
   or replaced with the charity's own approved wording.
8. **Terms/privacy** — small charities collecting email addresses should publish
   a short privacy notice describing what is done with them.
9. **Map coordinates** — the MapLibre marker uses approximate coordinates for Maufant
   (`-2.0632, 49.2098`) in `assets/js/main.js`. Replace `CENTRE` with the Centre's exact
   longitude/latitude before launch.

## Deploy

**Live at <https://maufantyouth.org>** — hosted on **Cloudflare Pages**
(project `maufant-youth-project`, fallback URL `maufant-youth-project.pages.dev`).

To publish an update:

```bash
# from the repo root, upload a clean copy of the site
node --use-env-proxy "$(npm root -g)/wrangler/bin/wrangler.js" pages deploy <dir> \
  --project-name=maufant-youth-project --branch=main --commit-dirty=true
```

`--use-env-proxy` is required when a local HTTP proxy is configured — Node's `fetch`
does not read `HTTP_PROXY`/`HTTPS_PROXY` without it.

A GitHub Actions workflow for GitHub Pages is also included (`.github/workflows/deploy.yml`)
if you ever want a second host; the Cloudflare Pages deployment is the production one.

### Email

Mail for **maufantyouth.org** is handled by **Cloudflare Email Routing**, which forwards
everything to the `cloud-mail` Worker. Active rules:

| Address | Purpose |
|---|---|
| `chat@` | **General enquiries — the address published on the site** |
| `info@`, `enquiries@`, `sayhello@` | Conventional aliases for formal correspondence (grant forms, Charity Commissioner, bank) |
| `safeguarding@` | Safeguarding matters |
| `volunteers@` | Volunteer enquiries |
| `donate@` | Donations and fundraising |
| `thedoor@`, `thecentre@`, `hello@` | Extra aliases |

A catch-all rule forwards anything unmatched, so no address is silently lost. Rules are
edited in the Cloudflare dashboard under the zone's **Email** tab.

## Accessibility

Semantic landmarks, `aria-label` on interactive elements, keyboard-navigable
mobile menu (with Escape to close), visible focus styles, and
`prefers-reduced-motion` support that disables reveals and counters.

## Licence

Content is written for Maufant Youth Project. Code and design derive from the
Charitize charity template, which is free for personal and commercial use with
attribution appreciated (not required). Attribution retained in this README.
