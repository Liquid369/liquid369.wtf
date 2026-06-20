# liquid369.wtf

Personal site. Validator clients, the gossip layer, shielded payments, and the tooling around them. Solana, PIVX, and a long tail of other chains.

Static HTML, CSS, and JavaScript. No build step. Hosted on Cloudflare Pages.

## Structure

- `index.html` — the page
- `css/styles.css` — styles and the design system
- `js/projects.js` — showcase data and the full project registry
- `js/mesh.js` — the gossip-network canvas background
- `js/main.js` — rendering and interactions
- `assets/` — favicons and the social card image
- `_redirects`, `_headers` — Cloudflare Pages config
- `llms.txt`, `robots.txt`, `sitemap.xml`

## Run locally

Open `index.html`, or serve it:

```
python3 -m http.server
```
