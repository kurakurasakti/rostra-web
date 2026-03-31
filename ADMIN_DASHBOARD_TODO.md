# Admin Dashboard Implementation TODO

## Overview
Building a complete admin dashboard for Rostra coffee e-commerce site with Supabase, Jotai, React Query, and Cloudinary.

## Legend
- [x] **Completed**
- [ ] **Not Started**
- [~] **In Progress**
- [!] **Blocked/Issue**

---

## Phase 1: Setup & Configuration ✅ **COMPLETED**

### Tasks
- [x] Install dependencies:
  - [x] `@supabase/supabase-js`
  - [x] `@supabase/ssr`
  - [x] `jotai`
  - [x] `@tanstack/react-query`
  - [x] `cloudinary`
- [x] Add shadcn UI components:
  - [x] table
  - [x] select
  - [x] dropdown-menu
  - [x] toast
  - [x] form
  - [x] avatar
  - [x] badge
  - [x] skeleton
  - [x] alert-dialog
- [x] Install Radix UI dependencies:
  - [x] `@radix-ui/react-table`
  - [x] `@radix-ui/react-select`
  - [x] `@radix-ui/react-dropdown-menu`
  - [x] `@radix-ui/react-toast`
  - [x] `@radix-ui/react-avatar`
  - [x] `@radix-ui/react-alert-dialog`
- [x] Configure environment variables (.env.local)
- [x] Update components.json with new components
- [x] Update package.json with dependencies

---

## Phase 2: Supabase Client & Providers Setup ✅ **COMPLETED**

### Tasks
- [x] Create Supabase client utilities:
  - [x] `src/lib/supabase/client.ts` (browser client)
  - [x] `src/lib/supabase/server.ts` (server client with service role)
  - [x] `src/lib/supabase/middleware.ts` (session refresh)
- [x] Create React Query provider:
  - [x] `src/lib/providers.tsx`
- [x] Update root layout to wrap with Providers
- [x] Create placeholder database types:
  - [x] `src/types/database.types.ts`

---

## Phase 3: Database Schema & Setup ✅ **COMPLETED**

### Tasks
- [x] Design database schema (products, variants, sizes, orders, admin_users)
- [x] Create migration file:
  - [x] `supabase/migrations/001_initial_schema.sql`
- [x] Implement Row Level Security (RLS) policies
- [x] Create admin role checking function (`is_admin()`)
- [x] Add database triggers for `updated_at` and `order_number`
- [x] Add indexes for performance
- [x] Create seed data script

**Note:** Database needs to be actually created in Supabase dashboard by running the migration SQL.

---

## Phase 4: Product Types Refactoring ✅ **COMPLETED**

### Tasks
- [x] Update `src/types/index.ts`:
  - [x] Remove old ProductVariantType (espresso/latte/cappuccino/coldbrew)
  - [x] Remove old ProductSizeType (cup/bottle)
  - [x] Add new database-aligned types (Product, ProductVariant, ProductSize)
  - [x] Add UI types (UIProduct, UIVariant, UISize)
  - [x] Add Admin form types (ProductFormData, VariantFormData)
  - [x] Create adapter functions (adaptProductToUI, adaptLegacyProductToUI)
  - [x] Add STANDARD_GRIND_SIZES constants (Coarse, Medium, Medium Fine, Fine)
  - [x] Add STANDARD_WEIGHTS constants (100g, 200g, 500g)
  - [x] Keep legacy data for backward compatibility
  - [x] Add DisplayVariant and DisplaySize types for mock data

---

## Phase 5: Authentication System ⚠️ **IN PROGRESS** (Issues)

### Tasks
- [~] Create Jotai auth atoms:
  - [x] `src/lib/jotai/atoms/adminAuth.ts` (adminUserAtom, adminLoadingAtom, etc.)
  - [x] `src/lib/jotai/atoms/adminUI.ts` (UI state atoms)
  - [x] `src/lib/jotai/index.ts` (exports)
- [~] Create admin login page:
  - [x] `src/app/admin/login/page.tsx` (with Supabase auth + admin check)
  - [!] **ISSUE:** Need to set up email/password auth in Supabase dashboard first
- [~] Create admin guard component:
  - [x] `src/components/admin/AdminGuard.tsx` (redirects unauthenticated users)
- [~] Create admin layout with navigation:
  - [x] `src/components/admin/AdminLayout.tsx` (sidebar, user menu, logout)
  - [x] `src/app/admin/layout.tsx` (wraps with AdminGuard + AdminLayout)
- [ ] Create auth API routes (optional if using client-side directly):
  - [ ] `src/app/api/auth/login/route.ts`
  - [ ] `src/app/api/auth/logout/route.ts`
- [ ] Implement brute force protection:
  - [ ] Track failed attempts (in Supabase table or Redis)
  - [ ] Add rate limiting (delays after failures)
  - [ ] Optional: CAPTCHA after 5 failures
- [ ] Test admin login flow
- [ ] Test unauthorized access denial

---

## Phase 6: Product Types Schema & Validation ✅ **COMPLETED**

### Tasks
- [x] Create validation schemas:
  - [x] `src/lib/schemas/product.schema.ts` (Zod validation for product form)
  - [x] `src/lib/schemas/order.schema.ts` (for orders)
  - [x] `src/lib/schemas/index.ts` (exports)

---

## Phase 7: API Routes ⚠️ **IN PROGRESS** (In Progress)

### Tasks
- [x] Create products API:
  - [x] `src/app/api/products/route.ts` (GET all, POST create)
  - [x] `src/app/api/products/[id]/route.ts` (GET one, PUT update, DELETE)
- [ ] Create variants API:
  - [ ] `src/app/api/variants/route.ts` (GET list, POST create)
  - [ ] `src/app/api/variants/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Create sizes API:
  - [ ] `src/app/api/sizes/route.ts` (GET list, POST create)
  - [ ] `src/app/api/sizes/[id]/route.ts` (GET, PUT, DELETE)
- [ ] Add proper authentication middleware to all routes
- [ ] Add error handling and logging
- [ ] Add API rate limiting
- [ ] Test API endpoints with Postman/curl

**Issues to fix:**
- [~] Server client naming conflict (fixed: createSupabaseClient alias)
- [~] Missing Radix Toast component (installed)
- [~] Wrong AlertDialog import (fixed: from alert-dialog not dialog)

---

## Phase 8: Admin UI Components ⚠️ **IN PROGRESS** (Need fixes)

### Tasks
- [x] Create ProductTable:
  - [x] `src/components/admin/ProductTable.tsx`
  - [x] Display products in table with columns
  - [x] Add actions (Edit, Delete, View)
  - [x] Add pagination placeholder
  - [x] Add search/filter (basic)
  - [x] Add delete confirmation with AlertDialog
- [~] Create ProductForm:
  - [x] `src/components/admin/ProductForm.tsx`
  - [x] Basic product fields (name, description, category, availability)
  - [x] Image upload with Cloudinary
  - [x] Variants management (4 grind sizes)
  - [x] Sizes management (3 weights per variant)
  - [x] Multi-variant form with react-hook-form
  - [ ] ~~Make form responsive~~ (design is responsive but needs testing)
- [ ] Create DashboardStats:
  - [ ] `src/components/admin/DashboardStats.tsx`
  - [ ] Total products count
  - [ ] Total orders count
  - [ ] Revenue (last 30 days)
  - [ ] Low stock alerts
- [ ] Create OrderTable:
  - [ ] `src/components/admin/OrderTable.tsx`
  - [ ] Table with order details
  - [ ] Status badges (color-coded)
  - [ ] View details modal
- [x] Create AdminLayout & AdminNav:
  - [x] `src/components/admin/AdminLayout.tsx` (with sidebar, mobile toggle)
  - [x] Responsive design
  - [x] User profile dropdown
  - [x] Navigation links
  - [x] Logout functionality

**Issues to fix:**
- [x] STANDARD_GRIND_SIZES/STANDARD_WEIGHTS import → **FIXED:** Moved to types
- [x] Avatar fallback rendering → **FIXED:** Use Avatar's fallback prop
- [x] ProductForm metadata field → **FIXED:** Added missing field
- [x] CartProvider type issues → **FIXED:** Added variant/size types
- [x] form.tsx type issues → **FIXED:** Fixed FormMessage type

---

## Phase 9: Admin Pages ⚠️ **IN PROGRESS**

### Tasks
- [x] Create admin pages:
  - [x] `src/app/admin/login/page.tsx`
  - [x] `src/app/admin/layout.tsx`
  - [x] `src/app/admin/page.tsx` (dashboard overview)
  - [x] `src/app/admin/products/page.tsx`
  - [x] `src/app/admin/products/new/page.tsx`
  - [x] `src/app/admin/products/[id]/edit/page.tsx`
  - [ ] `src/app/admin/products/[id]/page.tsx` (optional read-only view)
  - [x] `src/app/admin/orders/page.tsx`
- [ ] Add loading skeletons to all pages
- [ ] Add error boundaries
- [ ] Test navigation flow
- [ ] Test page loads with real data

---

## Phase 10: Cloudinary Integration ⚠️ **IN PROGRESS**

### Tasks
- [x] Create Cloudinary utility:
  - [x] `src/lib/cloudinary.ts` (upload function)
- [x] Add Cloudinary upload to ProductForm
- [ ] Configure Cloudinary dashboard:
  - [ ] Create unsigned upload preset named "rostra-products"
  - [ ] Create "rostra" folder for organization
- [ ] Add image preview improvements
- [ ] Add responsive Cloudinary URLs (thumbnails, optimizations)
- [ ] Add image deletion on product delete (optional)

**Note:** Need Cloudinary account credentials in `.env.local`

---

## Phase 11: UI Polish & Testing 🚧 **NOT STARTED**

### Tasks
- [ ] Add Toast notifications for all CRUD operations:
  - [ ] Success: Product created/updated/deleted
  - [ ] Success: Order status updated
  - [ ] Error: API failures with user-friendly messages
- [ ] Add loading states:
  - [ ] Skeleton loaders for tables
  - [ ] Button loading states (spinner)
  - [ ] Page-level loading indicators
- [ ] Add confirm dialogs:
  - [ ] Delete product confirmation
  - [ ] Delete order confirmation (if allowed)
  - [ ] Bulk actions confirmations
- [ ] Form validation improvements:
  - [ ] Real-time validation (on blur/change)
  - [ ] Clear error messages
  - [ ] Success/submit states
- [ ] Responsive design testing:
  - [ ] Tablet breakpoints
  - [ ] Mobile sidebar functionality
  - [ ] Table scrolling on small screens
- [ ] Accessibility:
  - [ ] ARIA labels on interactive elements
  - [ ] Keyboard navigation
  - [ ] Focus management in modals/dialogs

---

## Phase 12: Migration & Integration 🚧 **NOT STARTED**

### Tasks
- [ ] Update shop page to fetch from API:
  - [ ] `src/app/shop/page.tsx` - Fetch products from `/api/products`
  - [ ] `src/app/page.tsx` - Fetch featured products
  - [ ] Keep legacy hardcoded data as fallback during transition
- [ ] Update CartProvider to work with new structure:
  - [ ] CartItem should store variantId and sizeId (not full objects)
  - [ ] Lazy load variant/size details when displaying cart
  - [ ] Update price calculations
- [ ] Create data migration script:
  - [ ] Convert existing types if needed
  - [ ] Backfill database with current hardcoded products
- [ ] Test full e-commerce flow:
  - [ ] Browse products (shop page)
  - [ ] Add to cart
  - [ ] Update cart quantities
  - [ ] Checkout (if implemented)
- [ ] Test admin CRUD:
  - [ ] Create product with image
  - [ ] Edit product prices
  - [ ] Update stock quantities
  - [ ] Delete product (cascade check)
  - [ ] View orders
- [ ] Test authentication:
  - [ ] Admin login
  - [ ] Admin logout
  - [ ] Unauthorized redirect
  - [ ] Brute force protection
  - [ ] Session persistence

---

## Phase 13: Deployment & Documentation 🚧 **NOT STARTED**

### Tasks
- [ ] Update `.env.local` with example values:
  - [ ] Supabase URL & keys
  - [ ] Cloudinary credentials
  - [ ] App URL
- [ ] Update `README.md`:
  - [ ] Add Admin Dashboard section
  - [ ] Setup instructions (Supabase, Cloudinary)
  - [ ] How to create admin user
  - [ ] How to manage products
- [ ] Update `CLAUDE.md`:
  - [ ] Admin commands and routes
  - [ ] Database schema reference
  - [ ] Environment variables list
- [ ] Create database seed script:
  - [ ] `supabase/seed.sql` with sample data
- [ ] Create admin user setup guide:
  - [ ] Step-by-step: create user in Supabase Auth
  - [ ] Add user to admin_users table
  - [ ] Assign admin role
- [ ] Test production build:
  - [ ] Run `pnpm build`
  - [ ] Fix any build errors
  - [ ] Check bundle size
- [ ] Verify no secrets exposed to client:
  - [ ] SUPABASE_SERVICE_ROLE_KEY only in server code
  - [ ] CLOUDINARY_API_SECRET only in server (if using unsigned preset, this is okay in client)
- [ ] Create rollback plan documentation

---

## Known Issues & Blockers

### Critical (Must Fix Before Deployment)
1. **Supabase Setup Required**:
   - Create Supabase project
   - Run migration SQL to create tables
   - Enable email/password auth
   - Create admin user and add to `admin_users` table
   - Configure CORS if needed

2. **Cloudinary Setup Required**:
   - Create Cloudinary account
   - Get cloud name, API key, API secret
   - Create unsigned upload preset "rostra-products"
   - Add credentials to `.env.local`

3. **Build Errors** ✅ **FIXED:**
   - [x] STANDARD_GRIND_SIZES/WEIGHTS not found in schemas → **Fixed:** Moved to types/index.ts
   - [x] AvatarFallback component issue → **Fixed:** Use Avatar's fallback prop
   - [x] Import path issues → **Fixed:** All imports verified
   - [x] Build now passes successfully ✅

### Important (Should Fix)
4. **Brute Force Protection Not Implemented**:
   - Need to either:
     - Create `failed_login_attempts` table
     - Use server-side rate limiting middleware
     - Implement exponential backoff delays

5. **API Authentication Middleware Missing**:
   - All API routes should verify admin role before allowing CRUD
   - Currently only checking user session, not admin status
   - Should centralize auth check

6. **Error Handling Inconsistent**:
   - Some catch blocks show toast, some just console.error
   - Need standard error response format from API
   - Client should handle 401/403/500 gracefully

7. **React Query Not Actually Used**:
   - Provider is set up but not using `useQuery`/`useMutation`
   - Should refactor API calls to use React Query for caching
   - Currently using raw fetch in components

### Nice to Have (Post-MVP)
8. Real-time updates with Supabase Realtime
9. Bulk operations (product import/export CSV)
10. Advanced search and filtering
11. Order status update workflow
12. Customer management
13. Analytics charts
14. Email notifications
15. Image management (crop, optimize, delete)

---

## Quick Start for Continuation

If you're continuing development:

1. **Build passes successfully**: ✅ `pnpm build` now works

2. **Set up environment**:
   - Create Supabase project
   - Run migration SQL
   - Add `.env.local` with credentials

3. **Create admin user**:
   - Sign up in Supabase Auth
   - Run: `INSERT INTO admin_users (id, role) VALUES ('user-uuid', 'admin');`

4. **Test login**: Navigate to `/admin/login`

5. **Create test product**: Use the form to create a product

6. **Continue with remaining phases**: Migration, testing, documentation

---

## Current Task Status Summary

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Setup & Configuration | ✅ Complete | 100% |
| Phase 2: Supabase Client & Providers | ✅ Complete | 100% |
| Phase 3: Database Schema | ✅ Complete | 100% |
| Phase 4: Types Refactoring | ✅ Complete | 100% |
| Phase 5: Authentication | ⚠️ In Progress | ~70% |
| Phase 6: Validation Schemas | ✅ Complete | 100% |
| Phase 7: API Routes | ⚠️ In Progress | ~70% |
| Phase 8: Admin Components | ⚠️ In Progress | ~70% |
| Phase 9: Admin Pages | ⚠️ In Progress | ~70% |
| Phase 10: Cloudinary | ⚠️ In Progress | ~50% |
| Phase 11: UI Polish | 🚧 Not Started | 0% |
| Phase 12: Migration | 🚧 Not Started | 0% |
| Phase 13: Documentation | 🚧 Not Started | 0% |

**Overall Estimated Completion: ~40%**

---

Last Updated: 2026-03-31
