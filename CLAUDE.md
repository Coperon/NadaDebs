# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nada Debs — a luxury brand website. Monorepo with two workspaces:
- `frontend/` — Nuxt 3 (Vue 3, TypeScript, SSR) — the public site
- `studio/` — Sanity CMS (React 19) — content management

## Commands

### Frontend (`cd frontend`)

```bash
npm run dev          # dev server with browser open
npm run build        # production build
npm run preview      # preview production build locally
npm run generate     # static site generation
```

### Studio (`cd studio`)

```bash
npm run dev          # Sanity studio at localhost:3333
npm run build        # build studio
npm run deploy       # deploy studio code to sanity.io
npm run deploy-graphql  # deploy GraphQL API
```

## Architecture

### Frontend Data Flow

Content comes from **Sanity** (CMS) via GROQ queries and from **Shopify** (e-commerce) via the Storefront API.

- `data/` — 49+ GROQ query files, one per page/content type. Fragment files (e.g. `_image.js`, `_link.js`, `_blockContent.js`) are composed into larger queries.
- `composables/` — `useShopify*` composables for cart, product, inventory. `useSanity*` helpers wrap GROQ fetching.
- `pages/` — File-based routing. Most pages call a GROQ query on `useAsyncData` and pass results to feature components.
- `components/` — Organized by feature: `home/`, `shop/`, `about/`, `icons/`, etc.

### Rendering Strategy

Production is deployed to Netlify as a **static site** (`npm run generate`). Preview mode (`NUXT_PUBLIC_ENV=preview`) switches to **SSR** (instead of static generation) so that editors can see live Sanity draft content without stale cached pages. There is a TODO in `nuxt.config.ts` to refactor this.

### Country / UAE Logic

The site has UAE-specific product and collection filtering. Country is set via a cookie on first visit (plugin: `plugins/country.ts`). UAE-only content is gated throughout queries and components — when editing UAE-gated features, trace the `onlyInUAE` / `country` flag through the GROQ query, composable, and component.

### PostCSS Pipeline

Tailwind CSS 4 output is passed through `postcss-pxtorem` (converts px → rem) and a viewport-unit-fallback plugin. Do not hardcode `rem` or `px` values directly — write values in px in Tailwind/CSS and let PostCSS convert them.

### Sanity Schema Patterns

- 30+ document types in `studio/schemaTypes/`.
- Rich content uses **Portable Text** with custom marks (e.g. internal/external links).
- Page-builder pattern: most pages have a `content[]` array of typed blocks (text, media, gallery, etc.) resolved in frontend via a `<BlockContent>` component.
- `orderedList` plugin controls manual sort order on collections.

### Email

Netlify Function at `netlify/functions/send` handles transactional email (Resend SDK). Newsletter signup goes to Mailchimp; marketing segments use Klaviyo. The `netlify.toml` redirect routes `/api/send` to the function.

## Environment Tiers

Three named tiers controlled by `NUXT_PUBLIC_ENV`:
- `development` — local dev, full SSR
- `preview` — draft/staging, CSR only (no cache)
- `production` — live site, full SSR

`validateEnv.js` (run post-build) asserts all required env vars are present.

## Shopify Integration

Products sync between Shopify and Sanity. The Sanity `product` schema has a Shopify tab (via the Shopify Assets plugin). On the frontend, product data (price, inventory, variants) is fetched live from the Shopify Storefront API — never from Sanity — to keep pricing and stock real-time.
