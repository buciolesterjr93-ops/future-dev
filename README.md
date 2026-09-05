# FUTURE DEV
Created by Lester P. Bucio Jr.

This is the real, runnable project — a Vite + React app. It matches the
folder shape (package.json, vite.config.js, src/, public/, index.html)
so you can extract it and run it in Termux the same way you already
planned.

## Folder contents
```
FUTURE-DEV/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx       ← the whole app (landing, auth, dashboard, courses, feed, admin)
│   └── index.css
└── public/
```

## Run it in Termux
1. Extract this zip with ZArchiver (long-press the zip → Extract here).
2. In Termux, `cd` into the extracted `FUTURE-DEV` folder.
3. Make sure Node.js is installed: `pkg install nodejs`
4. Install dependencies: `npm install`
5. Start the dev server: `npm run dev`
6. Open the printed local URL (usually `http://localhost:5173`) in your browser.

## To publish it for real
This front end alone is enough to deploy as a static site (e.g. Vercel,
Netlify, GitHub Pages) — run `npm run build`, then upload the generated
`dist/` folder. What it does NOT include yet is a real backend: user
accounts, the database, and file uploads all currently run on mock data
in `App.jsx`. Publishing this gives people a working *demo* they can
click through, not real accounts or saved data — that needs the
Node/Express/MongoDB backend built and hosted separately.

© 2026 FUTURE DEV by Lester P. Bucio Jr. All rights reserved
