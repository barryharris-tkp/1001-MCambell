# CLAUDE.md

## Project Overview

Campbell Tax Services PC - a professional CPA firm website built with **Astro 5** and **React 19**. The site is a statically generated multi-page website using Astro's Islands Architecture for selective client-side hydration of interactive components.

**Live site:** https://campbelltaxservices.com

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Astro | 5.16.x | Meta-framework, static site generation, file-based routing |
| React | 19.x | Interactive UI components (hydrated via Astro islands) |
| TypeScript | strict | Type safety (extends `astro/tsconfigs/strict`) |
| Tailwind CSS | 3.4.x | Utility-first styling |
| Framer Motion | 12.x | Animations and scroll effects |
| Radix UI | various | Accessible headless UI primitives (label, slider, toast, slot) |
| Lucide React | 0.562.x | Icon library |
| PostCSS + Autoprefixer | - | CSS post-processing |

## Project Structure

```
src/
├── assets/              # Images and logos (AICPA, CGMA, IMA, TSCPA, ARCPA, company logo)
│   └── logos/
├── components/
│   ├── astro/           # Static Astro components (Footer.astro)
│   ├── react/           # Interactive React components (hydrated client-side)
│   │   ├── Header.tsx          # Navigation with scroll-based styling
│   │   ├── Hero.tsx            # Video background hero with parallax
│   │   ├── ContactForm.tsx     # Contact form (Web3Forms integration)
│   │   ├── PortalAccessForm.tsx # Client portal access request form
│   │   ├── ServicesSection.tsx  # Service cards overview
│   │   ├── CredentialsSection.tsx # Certifications showcase
│   │   └── AmbientAudio.tsx    # Background audio player
│   └── ui/              # Reusable UI primitives (button, card, input, label, etc.)
├── hooks/               # Custom React hooks (use-mobile.ts, use-toast.ts)
├── layouts/             # BaseLayout.astro (wraps all pages)
├── lib/                 # Utilities (utils.ts - cn() helper for Tailwind class merging)
├── pages/               # File-based routing (each .astro file = a route)
│   ├── index.astro      # Home page (/)
│   ├── about.astro      # About & credentials (/about)
│   ├── services.astro   # Service offerings (/services)
│   ├── contact.astro    # Contact form (/contact)
│   ├── resources.astro  # FAQ, tax calendar (/resources)
│   ├── portal.astro     # Client portal access (/portal)
│   └── 404.astro        # Error page
└── styles/              # Global CSS (design tokens, glassmorphism utilities)

public/                  # Static assets served as-is
├── audio/               # Ambient audio files
├── videos/              # Hero background videos
└── [favicons, logos]
```

## Commands

```bash
npm run dev       # Start dev server at http://localhost:4321
npm run build     # Production build to ./dist/
npm run preview   # Preview production build locally
```

## Architecture Patterns

### Islands Architecture

Astro components (`.astro`) render as static HTML at build time. React components (`.tsx`) are selectively hydrated using client directives:

- `client:load` - Hydrate immediately on page load (Header, Hero, ContactForm)
- `client:idle` - Hydrate when the browser is idle (AmbientAudio)
- `client:visible` - Hydrate when scrolled into view (ServicesSection, CredentialsSection)

### Component Organization

- **`.astro` files** are for static, server-rendered content (layouts, pages, footer)
- **`.tsx` files** in `components/react/` are for interactive elements requiring JavaScript
- **`components/ui/`** contains reusable primitives built on Radix UI and CVA (Class Variance Authority)

### Path Aliases

Use `@/` to reference the `src/` directory:
```ts
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

This alias is configured in both `tsconfig.json` and `astro.config.mjs`.

## Styling Conventions

- **Tailwind CSS** for all styling; avoid custom CSS unless creating design tokens or glassmorphism utilities
- **Dark mode** supported via class-based toggling (`darkMode: 'class'` in Tailwind config)
- **Design tokens** use HSL custom properties defined in `src/styles/global.css`
- **Color palette** is nature/river-inspired (primary: teal/green at 160 hue, accent: gold at 38 hue)
- **Font stack:** Playfair Display & Cormorant Garamond (serif headings), Montserrat (sans-serif body)
- **`cn()` utility** from `@/lib/utils` merges Tailwind classes safely (uses `clsx` + `tailwind-merge`)
- **Glassmorphism** classes available: `.glass`, `.glass-dark`, `.glass-card`
- **Custom animations** defined in `tailwind.config.ts`: fade-in, slide, scale, float, glow-pulse, shimmer, mist-drift

## Environment Variables

| Variable | Description |
|---|---|
| `PUBLIC_WEB3FORMS_KEY` | API key for Web3Forms email service |

Astro requires the `PUBLIC_` prefix for variables accessible in client-side code. Store in `.env` locally (gitignored).

## External Services

- **Web3Forms** - Handles contact form and portal access form submissions
- **ClientAxcess** (https://www.clientaxcess.com) - Secure client portal for document exchange
- **Google Fonts** - Serves Cormorant Garamond, Montserrat, Playfair Display

## Key Conventions for AI Assistants

1. **Static-first approach:** Default to `.astro` components. Only use React (`.tsx`) when interactivity or client-side state is genuinely needed.
2. **Hydration directives matter:** Always choose the most lazy directive possible (`client:visible` > `client:idle` > `client:load`) to preserve performance.
3. **No testing framework:** There are no tests configured. If adding tests, Vitest is the recommended choice for Astro projects.
4. **No linter/formatter:** There is no ESLint or Prettier configured. Maintain consistency with existing code style.
5. **No CI/CD pipeline:** There are no GitHub Actions or other CI workflows.
6. **ES Modules:** The project uses `"type": "module"` - use `import`/`export` syntax, not `require`.
7. **Strict TypeScript:** The tsconfig extends `astro/tsconfigs/strict`. Ensure type safety.
8. **UI components follow shadcn/ui patterns:** The `components/ui/` directory uses CVA variants and Radix primitives, consistent with the shadcn/ui component library approach.
9. **Static output:** The site builds to static HTML in `./dist/` - no SSR, no server runtime. Deployable to any static host (Vercel, Netlify, AWS S3, etc.).
10. **Contact info is hardcoded:** Business email, phone numbers, and addresses are embedded directly in components, not pulled from config.

## Build Output

The production build generates static HTML/CSS/JS in `./dist/`. No server runtime is required for deployment.
