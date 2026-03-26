# Rostra - Premium Cold Brew Coffee Website

A premium cold brew coffee e-commerce website built with Next.js 16, featuring a moody, high-end aesthetic with smooth Framer Motion animations.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind CSS-4-06b6d4?style=flat-square&logo=tailwind-css)

## 🌟 Features

- **Premium Aesthetic** - Moody, dark-themed design with gold accents
- **Smooth Animations** - Framer Motion scroll reveal and transition animations
- **Shopping Cart** - Full-featured cart with React Context state management
- **Contact Form** - React Hook Form + Zod validation
- **Responsive Design** - Mobile-first approach with Tailwind CSS 4
- **Modern UI Components** - shadcn/ui with "New York" style
- **Accessible** - Built with Radix UI primitives for accessibility

## 🛠️ Tech Stack

| Category          | Technology                      |
| ----------------- | ------------------------------- |
| **Framework**     | Next.js 16.2.1 (App Router)     |
| **Language**      | TypeScript 5                    |
| **Styling**       | Tailwind CSS 4                  |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Animation**     | Framer Motion 12                |
| **Forms**         | React Hook Form + Zod           |
| **Icons**         | Lucide React                    |
| **Utilities**     | clsx, tailwind-merge            |

## 📁 Project Structure

```
rostra-web/
├── public/                         # Static assets (images, SVGs)
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── about/                  # About page
│   │   ├── contact/                # Contact page with form
│   │   ├── shop/                  # Shop page
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── page.tsx                # Home page
│   │   └── globals.css             # Global styles + Tailwind config
│   ├── assets/                     # Additional assets
│   ├── components/                 # React components
│   │   ├── cart/                   # Cart components (CartProvider, CartSheet, useCart)
│   │   ├── navigation/             # Header component
│   │   ├── sections/               # Section components (Footer)
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── sheet.tsx
│   │       └── textarea.tsx
│   ├── lib/                        # Utility functions (utils.ts)
│   └── types/                      # TypeScript type definitions
├── components.json                 # shadcn/ui configuration
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts (reference)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** (recommended), npm, or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rostra-web
```

2. Install dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 📝 Environment Variables

Create a `.env.local` file in the root directory. See [.env.local](./.env.local) for the complete list of available variables.

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Rostra
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration (optional)
# NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🎨 Design System

### Color Palette

| Color Name     | Hex Code  | Usage                 |
| -------------- | --------- | --------------------- |
| Primary Dark   | `#0D0D0D` | Main background       |
| Secondary Dark | `#1A1A1A` | Cards, sections       |
| Accent Dark    | `#262626` | Borders, dividers     |
| Gold           | `#C9A227` | Primary accents, CTAs |
| Gold Light     | `#D4B84A` | Hover states          |
| Gold Dark      | `#A88B1F` | Active states         |
| Off White      | `#F5F5F0` | Primary text          |
| Muted          | `#8A8A8A` | Secondary text        |

### Typography

| Element          | Font             | Weight  |
| ---------------- | ---------------- | ------- |
| Headings (h1-h6) | Playfair Display | 600     |
| Body text        | Inter            | 400     |
| UI elements      | Inter            | 400-500 |

### Component Styling

The project uses CSS variables mapped to Tailwind for consistent theming:

```css
--color-primary: var(--color-gold);
--color-background: var(--color-primary-dark);
--color-foreground: var(--color-off-white);
--color-card: var(--color-secondary-dark);
```

## 🔧 Available Scripts

| Command      | Description                           |
| ------------ | ------------------------------------- |
| `pnpm dev`   | Start development server on port 3000 |
| `pnpm build` | Build the application for production  |
| `pnpm start` | Start the production server           |
| `pnpm lint`  | Run ESLint to check for errors        |

## 📱 Pages

| Route      | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `/`        | Home page with hero section, featured products, and about preview |
| `/shop`    | Product listing page with categories                              |
| `/about`   | Company story, craft, philosophy, and sourcing information        |
| `/contact` | Contact form with validation                                      |

## 🧩 Components

### Core Components

- **Header** (`src/components/navigation/Header.tsx`) - Main navigation with logo, menu links, and cart icon
- **Footer** (`src/components/sections/Footer.tsx`) - Site footer with links and social icons

### Cart Components

- **CartProvider** (`src/components/cart/CartProvider.tsx`) - React Context provider for cart state
- **CartSheet** (`src/components/cart/CartSheet.tsx`) - Slide-out cart drawer
- **useCart** (`src/components/cart/useCart.ts`) - Custom hook for cart operations

### UI Components (shadcn/ui)

Located in `src/components/ui/`:

- **Button** - Customizable button with variants
- **Card** - Content container with header, content, and footer
- **Dialog** - Modal dialog component
- **Input** - Text input field
- **Label** - Form label
- **Sheet** - Slide-out panel (used for cart)
- **Textarea** - Multi-line text input

## 🔨 Adding New shadcn/ui Components

To add a new shadcn/ui component:

```bash
npx shadcn@latest add [component-name]
```

For example:

```bash
npx shadcn@latest add dropdown-menu
```

This will create the component in `src/components/ui/`.

## 📦 Dependencies

### Production Dependencies

| Package                         | Version | Purpose                |
| ------------------------------- | ------- | ---------------------- |
| next                            | 16.2.1  | React framework        |
| react                           | 19.2.4  | UI library             |
| react-dom                       | 19.2.4  | React DOM              |
| framer-motion                   | 12.38.0 | Animations             |
| react-hook-form                 | 7.72.0  | Form handling          |
| zod                             | 4.3.6   | Schema validation      |
| @hookform/resolvers             | 5.2.2   | Form resolvers         |
| class-variance-authority        | 0.7.1   | Component variants     |
| clsx                            | 2.1.1   | ClassName utility      |
| tailwind-merge                  | 3.5.0   | Tailwind merge utility |
| @radix-ui/react-visually-hidden | 1.2.4   | Accessibility          |

### Development Dependencies

| Package              | Version | Purpose               |
| -------------------- | ------- | --------------------- |
| typescript           | 5       | TypeScript support    |
| tailwindcss          | 4       | CSS framework         |
| @tailwindcss/postcss | 4       | PostCSS plugin        |
| eslint               | 9       | Linting               |
| eslint-config-next   | 16.2.1  | Next.js ESLint config |
| lucide-react         | 1.7.0   | Icons                 |
| @radix-ui/\*         | various | Radix UI primitives   |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and for internal use only.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Radix UI](https://www.radix-ui.com) - Accessible primitives
- [Lucide Icons](https://lucide.dev) - Icons

## 🆘 Troubleshooting

### Build Errors

If you encounter build errors, try:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### TypeScript Errors

Ensure your `tsconfig.json` is properly configured. The project uses path aliases defined in `components.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

Built with ❤️ using Next.js and Tailwind CSS
