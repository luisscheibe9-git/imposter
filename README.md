# Imposter

A free, pass-and-play Imposter / Spyfall-style party game. No app store, no backend,
no account — just a website you can install to your phone's home screen.

Everyone gets the secret word except the imposter(s), who has to bluff through the
discussion without getting caught. Pass one phone around the group to see roles,
then vote.

## Features

- Configurable players (3–20), imposter count, and discussion timer
- 10 built-in word categories (~180 words), plus your own custom categories
- Optional "imposter sees the category" hint mode
- Imposter steal: if caught, they get one shot at guessing the word to steal the win
- Tie votes = no elimination = imposters win (classic rule)
- Running scoreboard (crew vs. imposters), stored on your device
- Installable as a home-screen app (PWA) on iPhone and Android, works offline
- No sign-up, no server, no data leaves your phone

## Run it locally

You need [Node.js](https://nodejs.org) installed (just for a static file server).

```bash
npx serve .
```

Then open the printed `http://localhost:3000` address in your browser.

(Any static file server works — Python's `http.server`, VS Code's Live Server, etc.
The only requirement is serving over `http://` or `https://`, not opening the HTML
file directly, so the service worker and install prompt work.)

## Put it on your phone — free, no App Store

### Option A: Deploy it (recommended, so friends can use it too)

Free static hosts that work with zero config — just point them at this folder:

- **[Vercel](https://vercel.com)** – `npx vercel` from this folder, or drag-and-drop the folder at vercel.com
- **[Netlify](https://app.netlify.com/drop)** – drag-and-drop this folder in the browser
- **[GitHub Pages](https://pages.github.com/)** – push this folder to a repo, enable Pages in settings

Any of these gives you a free `https://...` URL.

### Option B: Just run it on your own phone over your home Wi-Fi

Run `npx serve .` on your computer, then visit `http://<your-computer's-LAN-IP>:3000`
from your phone's browser (same Wi-Fi network).

### Install to home screen

Once you've opened the deployed URL (or LAN URL) on your phone:

- **iPhone (Safari):** tap the Share icon → "Add to Home Screen"
- **Android (Chrome):** tap the ⋮ menu → "Add to Home Screen" / "Install app"

It'll appear as a normal app icon, open full-screen with no browser bar, and keep
working even with no signal once it's been loaded once.

## Project structure

```
index.html          All screens (markup)
css/style.css        Styling (dark theme, mobile-first)
js/words.js          Built-in word categories
js/app.js            Game logic / state machine
manifest.json         PWA manifest
sw.js                 Service worker (offline caching)
icons/                App icons
```

Word lists and custom categories are plain data — edit `js/words.js` to add/remove
built-in categories, or use the in-app "Manage custom words" screen (saved to your
browser's local storage, per device).
