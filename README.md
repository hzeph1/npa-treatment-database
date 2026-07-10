# NPA Treatment Database — Demo Web App

An interactive prototype of the Neuroplasticity Alliance treatment database.
Explore by symptom, by neurological challenge, or across all treatment types.
Stroke and TBI are fully built out; the other conditions are scaffolded and
ready to fill in.

This runs entirely on built-in preview data — **no backend or setup required**
to demo it.

---

## Easiest way to put it online (about 3 minutes)

### Option A — Netlify drag-and-drop (no accounts to wire up, no command line)

1. On your computer, open a terminal in this folder and run:
   ```
   npm install
   npm run build
   ```
   This creates a `dist/` folder.
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder onto the page.
4. Netlify gives you a public link instantly. That's the link to send Izzy.

### Option B — Vercel

1. Push this folder to a GitHub repo (or use the Vercel CLI).
2. Import it at https://vercel.com/new — it auto-detects Vite.
3. Click Deploy. You get a public link.

### Option C — A subpage of the NPA website

Run `npm install && npm run build`, then upload the contents of the `dist/`
folder to wherever the NPA site is hosted (e.g. a `/treatments/` folder). The
build uses relative paths, so it works from a subfolder.

---

## Running it locally first (optional preview on your own machine)

```
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

---

## Connecting the real database later

Right now the app runs on built-in sample data. When you're ready to go live
with Supabase:

1. Create the tables using the SQL schema in the footer comment of
   `src/App.jsx`.
2. Load the data with `npa-seed-data.sql`.
3. Paste your Supabase project URL and anon key into the config block near the
   top of `src/App.jsx` (look for `SUPABASE_URL`).
4. Rebuild and redeploy.

The badge in the top-right corner shows whether it's running on "preview" data
or the "live database."
