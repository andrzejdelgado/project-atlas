# Project Atlas

Personal site of Andrzej Delgado. Next.js 16 (App Router, Turbopack) +
Tailwind v4 + shadcn/ui. All content lives as MDX in `/content`.

## Run locally

```bash
npm install
npm run dev
```

The dev server starts at http://localhost:3000 with Turbopack.

## Add a case study

1. Create `content/case-studies/your-slug.mdx`.
2. Set frontmatter:

   ```mdx
   ---
   title: "Your Title"
   description: "One-sentence summary."
   date: "2026-05-01"
   cover: "/images/your-cover.jpg" # optional
   tags: ["design", "engineering"] # optional
   ---

   Body in MDX. Headings, lists, code, images all work.
   ```

3. Drop the cover into `public/images/`.
4. The page is generated at `/work/your-slug` automatically.

## Add a note

1. Create `content/notes/your-slug.mdx` with the same frontmatter shape
   (cover is rarely used here).
2. The note appears at `/notes/your-slug` and in the RSS feed at
   `/rss.xml`.

## Edit the about page

`content/about.mdx` — single MDX file, same frontmatter shape.

## Theming

Theme tokens live in `app/globals.css` under `:root` (light) and
`.dark`. The toggle in the header cycles **light → dark → system**;
preference is persisted via `next-themes`.

## Deploy on Vercel

1. Push the repo to GitHub.
2. From the Vercel dashboard, **New Project → Import Git Repository**.
3. Vercel auto-detects Next.js. Defaults are correct — no env vars
   required.
4. `@vercel/analytics` is wired in `app/layout.tsx`; analytics start
   reporting on first deploy.

To allow remote image hosts (e.g. Spotify cover art), add entries to
`images.remotePatterns` in `next.config.ts`.

## Conventions

- Run `npm run prettier -- --write` before committing.
- Commit messages: short imperative, blank line, `Co-Authored-By:` tag.
- Comments only when the _why_ is non-obvious. Identifiers explain
  _what_; the diff explains _what changed_.

## Scripts

| Command            | Purpose                            |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Dev server (Turbopack, port 3000)  |
| `npm run build`    | Production build                   |
| `npm run start`    | Run the production build locally   |
| `npm run lint`     | ESLint                             |
| `npm run prettier` | Prettier (add `-- --write` to fix) |

## Stack

- Next.js 16 (App Router, Turbopack) · React 19
- Tailwind v4 (CSS-first config in `app/globals.css`)
- shadcn/ui (Button, Card, Separator, Sheet) on top of `@base-ui/react`
- next-themes for theme switching
- @next/mdx + gray-matter + remark-gfm for MDX content
- Geist (sans + mono) via `next/font/google`
- @vercel/analytics
