# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Important: Next.js 16 Breaking Changes

This project uses a custom/modified version of Next.js 16 with breaking changes. See the note in `AGENTS.md`:

> This is NOT the Next.js you know. This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

When working with Next.js features, verify the behavior against the documentation in `node_modules/next/dist/docs/` rather than assuming standard Next.js patterns.

## 🚀 Common Development Commands

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Start development server on port 3000 |
| `pnpm build` | Build the application for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint to check for code quality |

### Running Tests
No test framework is currently configured. If adding tests, consider Vitest or Jest with React Testing Library.

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 16.2.1 (App Router) - custom build with breaking changes
- **Language:** TypeScript 5 with strict mode
- **Styling:** Tailwind CSS 4 with CSS variables for theming
- **UI Components:** shadcn/ui with "New York" style (Radix UI primitives)
- **Animation:** Framer Motion 12
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Utilities:** clsx, tailwind-merge

### Project Structure

```
rostra-web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── about/page.tsx            # About page
│   │   ├── contact/page.tsx          # Contact form with validation
│   │   ├── shop/page.tsx             # Product listing
│   │   ├── layout.tsx                # Root layout (fonts, metadata)
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles + Tailwind config
│   ├── components/
│   │   ├── cart/                     # Shopping cart state management
│   │   │   ├── CartProvider.tsx      # React Context provider
│   │   │   ├── CartSheet.tsx         # Slide-out cart drawer
│   │   │   └── useCart.ts            # Custom hook for cart operations
│   │   ├── navigation/               # Navigation components
│   │   │   └── Header.tsx            # Main header with cart icon
│   │   ├── sections/                 # Page sections
│   │   │   └── Footer.tsx            # Site footer
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── sheet.tsx
│   │       └── textarea.tsx
│   ├── lib/
│   │   └── utils.ts                  # Utility functions (cn helper)
│   └── types/
│       └── index.ts                  # TypeScript type definitions
├── public/                            # Static assets
├── components.json                   # shadcn/ui configuration
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration
└── package.json                      # Dependencies
```

### Key Patterns

#### State Management
- **Cart State:** React Context with `CartProvider` (client-side only)
- **Persistence:** Cart data stored in localStorage
- **Optimistic Updates:** Immediate UI updates with background sync
- **Type Safety:** All cart operations typed with interfaces from `@/types`

#### Styling
- **Approach:** Utility-first with Tailwind CSS 4
- **Theme:** Dark mode with gold accents; CSS variables for consistency
- **Component Variants:** Use `class-variance-authority` (cva) for component variants
- **Utility:** `cn()` helper combines `clsx` and `tailwind-merge`

#### Forms
- **Library:** React Hook Form with Zod for validation
- **Schema:** Define validation schemas with Zod
- **Components:** Use `@/components/ui/*` form components
- **Validation:** Client-side validation on submit and blur

#### Routing
- **Structure:** Next.js App Router with file-based routing
- **Layout:** Root layout in `app/layout.tsx` with font providers
- **Pages:** Each route is a directory with `page.tsx`

### Type Definitions
- Product variants: `espresso`, `latte`, `cappuccino`, `coldbrew`
- Product sizes: `cup`, `bottle`
- Order status: `pending`, `confirmed`, `preparing`, `ready`, `completed`, `cancelled`
- Located in `src/types/index.ts`

## 🔧 Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dropdown-menu
```

Components will be added to `src/components/ui/`.

## 📝 TypeScript Configuration

- **Strict mode enabled**
- **Path aliases:** `@/*` maps to `./src/*`
- **JSX:** `react-jsx` (React 19)
- **Module resolution:** `bundler` (for Next.js)

Configured in `tsconfig.json` and `components.json`.

## 🎨 Design System

### Colors
- Primary Dark: `#0D0D0D` (background)
- Secondary Dark: `#1A1A0A` (cards)
- Accent Dark: `#262626` (borders)
- Gold: `#C9A227` (primary accents, CTAs)
- Off White: `#F5F5F0` (text)

### Typography
- Headings: Playfair Display (600)
- Body: Inter (400-500)

### CSS Variables
Defined in `src/app/globals.css` with Tailwind configuration.

## 🔍 Code Quality

### ESLint
- Uses `eslint-config-next` with TypeScript and Core Web Vitals
- Configuration in `eslint.config.mjs`
- No additional custom rules beyond Next.js defaults

Run: `pnpm lint`

### Environment Variables
- `.env.local` exists with project configuration
- Variables prefixed with `NEXT_PUBLIC_` are exposed to browser
- See `.env.local` for available variables

## 🚨 Troubleshooting

### Build Errors
```bash
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

### TypeScript Errors
- Ensure `tsconfig.json` paths are correct
- Check that all imports use `@/` alias correctly
- Verify types from `@/types` are being used properly

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs) - verify against `node_modules/next/dist/docs/` due to custom build
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🔒 Important Notes

- **Do not commit sensitive data** (API keys, tokens) - check `.env.local`
- **Private project:** For internal use only
- **Next.js Custom Build:** Be cautious when importing Next.js modules; verify against provided docs
- **Client Components:** Components using `useState`, `useEffect`, hooks must have `"use client"` directive

---
Generated based on codebase analysis on 2026-03-30. This guide helps Claude Code operate effectively in this repository.
