# Cinevault — Implementation Plan

Personal/family movie & series tracking web app.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Convex (DB + Auth) + Convex Auth (Password provider) + Cloudinary (images) + Vercel (deploy)

**Core rules for every step below:**
- No hardcoded colors anywhere in `.tsx`/`.ts` files. Every color is a CSS variable in `globals.css`, consumed via Tailwind classes that map to those variables (e.g. `bg-background`, `text-foreground`, `bg-primary`).
- Feature-based folder structure. No "one giant components folder." Each feature owns its components, hooks, and types.
- Components stay small. If a component nears ~150–200 lines, split it into subcomponents. Hard ceiling: no component file over 300 lines.
- Every Convex function lives inside the feature's own folder under `convex/`.
- Use shadcn/ui primitives everywhere possible instead of custom-built basics (buttons, dialogs, dropdowns, tooltips, toasts/sonner, etc.)

---

## Step 1 — Initialize the Project

### Part 1: Create the Next.js app

```bash
npx create-next-app@latest cinevault
```

When prompted, choose:
- TypeScript → **Yes**
- ESLint → **Yes**
- Tailwind CSS → **Yes**
- `src/` directory → **Yes**
- App Router → **Yes**
- Turbopack → Yes (default is fine)
- Import alias (`@/*`) → **Yes**, keep default `@/*`

```bash
cd cinevault
```

### Part 2: Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Prompts to select:
- Style → **New York** (cleaner, more professional — matches the "Netflix-like premium" feel better than Default)
- Base color → **Neutral** (we override actual colors in globals.css ourselves, Neutral gives the cleanest starting variable set to override)
- CSS variables → **Yes** (mandatory — this is how we keep zero hardcoded colors)

### Part 3: Install all shadcn components we'll need up front

```bash
npx shadcn@latest add button input label card table badge dialog alert-dialog dropdown-menu tooltip select sonner tabs form separator skeleton avatar switch textarea pagination
```

Note: shadcn renamed "toast" to **sonner** — we use `sonner` for all toast notifications (delete confirmations, save success, errors, etc.) as you requested.

### Part 4: Install additional dependencies

```bash
npm install convex @convex-dev/auth
npm install lucide-react
npm install next-themes
npm install cloudinary
```

- `lucide-react` → icon picker for categories/subcategories (comes bundled with shadcn anyway, but pin it explicitly)
- `next-themes` → handles system/light/dark theme toggle
- `cloudinary` → server-side helper for signed uploads

---

## Step 2 — Set Up Convex

### Part 1: Initialize Convex

```bash
npx convex dev
```

- This opens a browser login (you already have an account, so just authorize).
- Choose **Create a new project** → name it `cinevault`.
- This generates a `convex/` folder at project root and a `.env.local` with `NEXT_PUBLIC_CONVEX_URL`.
- Keep this command running in its own terminal tab throughout development — it live-syncs your `convex/` folder to the cloud.

### Part 2: Install Convex Auth

```bash
npm install @convex-dev/auth @auth/core
npx @convex-dev/auth
```

This CLI will:
- Add `convex/auth.ts` and `convex/auth.config.ts`
- Add an `authTables` import into your schema
- Add necessary environment variables (`JWT_PRIVATE_KEY`, `JWKS`) to Convex automatically

### Part 3: Configure Password-only auth

Open `convex/auth.ts` and confirm it's configured for **Password provider only** (no OAuth/social):

```typescript
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
```

No email verification, no password reset — matches your requirements exactly (v1 scope).

### Part 4: Wrap the app with the Convex + Auth provider

We'll build `src/app/providers.tsx` in Step 4 once the folder structure exists.

---

## Step 3 — Feature-Based Folder Structure

Create this exact structure under `src/`:

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── item/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── providers.tsx
│   └── page.tsx                  (redirects to /login or /dashboard)
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuthActions.ts
│   │   └── types.ts
│   │
│   ├── categories/
│   │   ├── components/
│   │   │   ├── CategoryList.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CategoryFormDialog.tsx
│   │   │   ├── SubcategoryList.tsx
│   │   │   ├── SubcategoryFormDialog.tsx
│   │   │   └── IconPicker.tsx
│   │   ├── hooks/
│   │   │   ├── useCategories.ts
│   │   │   └── useSubcategories.ts
│   │   └── types.ts
│   │
│   ├── media-items/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── MediaTable.tsx
│   │   │   │   ├── MediaTableRow.tsx
│   │   │   │   ├── MediaTableHeader.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SortDropdown.tsx
│   │   │   │   ├── PaginationBar.tsx
│   │   │   │   ├── TypeTabs.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── StorageBadges.tsx
│   │   │   ├── detail/
│   │   │   │   ├── ItemDetailHeader.tsx
│   │   │   │   ├── ItemPoster.tsx
│   │   │   │   ├── ItemMetaSection.tsx
│   │   │   │   ├── ProgressEditor.tsx
│   │   │   │   ├── StorageEditor.tsx
│   │   │   │   ├── RatingEditor.tsx
│   │   │   │   ├── ReviewEditor.tsx
│   │   │   │   └── DeleteItemDialog.tsx
│   │   │   └── form/
│   │   │       ├── MediaItemFormDialog.tsx
│   │   │       ├── MovieFormFields.tsx
│   │   │       ├── SeriesFormFields.tsx
│   │   │       ├── SeasonEpisodeInput.tsx
│   │   │       └── PosterUploadField.tsx
│   │   ├── hooks/
│   │   │   ├── useMediaItems.ts
│   │   │   ├── useMediaItem.ts
│   │   │   ├── useCreateMediaItem.ts
│   │   │   ├── useUpdateMediaItem.ts
│   │   │   └── useDeleteMediaItem.ts
│   │   ├── utils/
│   │   │   ├── calculateProgress.ts
│   │   │   ├── formatDuration.ts
│   │   │   └── ratingToStars.ts
│   │   └── types.ts
│   │
│   ├── ratings/
│   │   ├── components/
│   │   │   └── StarRatingInput.tsx
│   │   └── types.ts
│   │
│   └── theme/
│       ├── components/
│       │   └── ThemeToggle.tsx
│       └── ThemeProvider.tsx
│
├── shared/
│   ├── components/
│   │   ├── ui/                    (shadcn generated components live here)
│   │   ├── ConfirmDialog.tsx
│   │   ├── EmptyState.tsx
│   │   └── PageHeader.tsx
│   ├── lib/
│   │   ├── cloudinary.ts
│   │   └── utils.ts               (shadcn's cn() helper lives here)
│   └── hooks/
│       └── useDebounce.ts
│
convex/
├── schema.ts
├── auth.ts
├── auth.config.ts
├── categories.ts
├── subcategories.ts
├── mediaItems.ts
├── cloudinary.ts                  (action for signed upload URL)
└── _generated/                    (auto-generated, don't touch)
```

**Why this structure:** every feature (auth, categories, media-items, ratings, theme) is self-contained with its own components/hooks/types. `shared/` only holds truly cross-feature primitives (shadcn's raw ui components, generic dialogs, cn utility). Nothing in `features/` imports from another feature directly except through hooks — keeps things decoupled and each file small.

---

## Step 4 — globals.css: Netflix-Inspired Theme (Zero Hardcoded Colors)

### Part 1: Understand the rule

Every color used anywhere in the app — backgrounds, text, borders, accents, status colors — is defined **once** here as a CSS variable, in both a `:root` (light) block and `.dark` block. Components only ever reference Tailwind utility classes like `bg-background`, `text-muted-foreground`, `bg-primary`, `border-border` — never raw hex codes, never `bg-red-500` etc.

### Part 2: Define the palette

Open `src/app/globals.css` and replace the shadcn-generated variables with:

```css
@import "tailwindcss";

@layer base {
  :root {
    /* Light mode */
    --background: 0 0% 100%;
    --foreground: 240 10% 4%;

    --card: 0 0% 98%;
    --card-foreground: 240 10% 4%;

    --primary: 357 92% 47%;          /* Netflix red */
    --primary-foreground: 0 0% 100%;

    --secondary: 240 5% 92%;
    --secondary-foreground: 240 10% 10%;

    --muted: 240 5% 92%;
    --muted-foreground: 240 4% 40%;

    --accent: 240 5% 88%;
    --accent-foreground: 240 10% 10%;

    --destructive: 0 84% 55%;
    --destructive-foreground: 0 0% 100%;

    --border: 240 6% 85%;
    --input: 240 6% 85%;
    --ring: 357 92% 47%;

    /* Status colors — used only via semantic classes below */
    --status-not-started: 240 4% 55%;
    --status-in-progress: 38 92% 50%;
    --status-completed: 142 71% 40%;

    /* Storage badge colors */
    --storage-hard: 217 91% 55%;
    --storage-cloud: 199 89% 55%;
    --storage-inactive: 240 4% 75%;

    --radius: 0.6rem;
  }

  .dark {
    /* Dark mode — Netflix-like near-black */
    --background: 0 0% 8%;
    --foreground: 0 0% 95%;

    --card: 0 0% 11%;
    --card-foreground: 0 0% 95%;

    --primary: 357 92% 55%;
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 16%;
    --secondary-foreground: 0 0% 95%;

    --muted: 0 0% 16%;
    --muted-foreground: 0 0% 65%;

    --accent: 0 0% 20%;
    --accent-foreground: 0 0% 95%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 20%;
    --input: 0 0% 20%;
    --ring: 357 92% 55%;

    --status-not-started: 0 0% 45%;
    --status-in-progress: 38 92% 55%;
    --status-completed: 142 60% 45%;

    --storage-hard: 217 91% 60%;
    --storage-cloud: 199 89% 60%;
    --storage-inactive: 0 0% 30%;
  }
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}

/* Semantic utility classes for status/storage — used instead of inline color logic in components */
@layer utilities {
  .text-status-not-started { color: hsl(var(--status-not-started)); }
  .text-status-in-progress { color: hsl(var(--status-in-progress)); }
  .text-status-completed   { color: hsl(var(--status-completed)); }

  .bg-status-not-started { background-color: hsl(var(--status-not-started) / 0.15); }
  .bg-status-in-progress { background-color: hsl(var(--status-in-progress) / 0.15); }
  .bg-status-completed   { background-color: hsl(var(--status-completed) / 0.15); }

  .text-storage-hard  { color: hsl(var(--storage-hard)); }
  .text-storage-cloud { color: hsl(var(--storage-cloud)); }
  .text-storage-inactive { color: hsl(var(--storage-inactive)); }
}
```

### Part 3: Wire theme.css into `tailwind.config` (if using Tailwind v3-style config)

If your generated project uses a `tailwind.config.ts` (rather than pure CSS-first Tailwind v4), make sure the `theme.extend.colors` maps to these same variables:

```typescript
colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
  secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
  muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
  accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
  destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
},
```

(shadcn's init usually generates this for you already — just confirm it matches, don't duplicate.)

**Rule going forward:** if you ever need a new color anywhere in the app (e.g., a new badge type), add the variable here first, in both `:root` and `.dark`, then reference it via a utility class. Never write `#e50914` or `red-600` directly in a component.

---

## Step 5 — Theme Toggle (System / Light / Dark)

### Part 1: Install and configure `next-themes`

Already installed in Step 1. Create `src/features/theme/ThemeProvider.tsx`:

```typescript
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

`defaultTheme="system"` matches your requirement: respects OS setting by default, with manual toggle available.

### Part 2: Build the toggle component

`src/features/theme/components/ThemeToggle.tsx` — small button using `Sun`/`Moon` lucide icons and shadcn `DropdownMenu` with 3 options: Light, Dark, System. Keep this under 50 lines — it's a simple dropdown wrapping `setTheme()` from `useTheme()`.

### Part 3: Place it

Add `<ThemeToggle />` to the dashboard layout's top nav bar (built in Step 9).

---

## Step 6 — Root Providers & Layout

### Part 1: `src/app/providers.tsx`

Wraps the whole app in both Convex's client provider (with Auth) and our ThemeProvider:

```typescript
"use client";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { type ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <ThemeProvider>{children}</ThemeProvider>
    </ConvexAuthNextjsProvider>
  );
}
```

### Part 2: `src/app/layout.tsx`

Root layout imports `globals.css`, wraps `{children}` in `<Providers>`, and adds the shadcn `<Toaster />` (sonner) once at the root so toasts work anywhere in the app.

### Part 3: Middleware for route protection

Create `middleware.ts` at project root using `convexAuthNextjsMiddleware` (provided by `@convex-dev/auth/nextjs/server`) so that:
- Unauthenticated users hitting `/dashboard/*` or `/item/*` get redirected to `/login`.
- Authenticated users hitting `/login` or `/signup` get redirected to `/dashboard`.

---

## Step 7 — Convex Schema (Database Design)

Open `convex/schema.ts`. This is the backbone — read carefully.

### Part 1: Auth tables

```typescript
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  // custom tables below
```

### Part 2: Categories table

```typescript
  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),           // e.g. "Movies", "Series"
    icon: v.string(),           // lucide icon name, e.g. "Clapperboard"
  }).index("by_user", ["userId"]),
```

### Part 3: Subcategories table

```typescript
  subcategories: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    name: v.string(),           // e.g. "Punjabi", "Anime"
    icon: v.string(),
  }).index("by_category", ["categoryId"])
    .index("by_user", ["userId"]),
```

### Part 4: Media items table (movies & series both live here — differentiated by a `kind` field)

```typescript
  mediaItems: defineTable({
    userId: v.id("users"),
    categoryId: v.id("categories"),
    subcategoryIds: v.array(v.id("subcategories")),   // multi-subcategory support

    title: v.string(),
    kind: v.union(v.literal("movie"), v.literal("series")),
    posterUrl: v.optional(v.string()),                // Cloudinary secure_url
    posterPublicId: v.optional(v.string()),           // Cloudinary public_id, for deletion

    // --- Movie-only fields ---
    totalDurationSeconds: v.optional(v.number()),     // optional, enables % calc

    // --- Series-only fields ---
    seasons: v.optional(
      v.array(
        v.object({
          seasonNumber: v.number(),
          totalEpisodes: v.number(),
        })
      )
    ),

    // --- Status & progress (shared) ---
    status: v.union(
      v.literal("not_started"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    progressDescription: v.optional(v.string()),  // free text, e.g. "S2E4 - 20m2s" or "32m45s"
    progressSeconds: v.optional(v.number()),       // used with totalDurationSeconds for % (movies)
    progressSeason: v.optional(v.number()),        // used for series % calc
    progressEpisode: v.optional(v.number()),       // used for series % calc

    // --- Storage tracking ---
    hasHard: v.boolean(),
    hardDescription: v.optional(v.string()),   // free text, e.g. "samsung-hard-1tb in Hassan/series/GOT/all 8 seasons"
    hasCloud: v.boolean(),
    cloudDescription: v.optional(v.string()),

    // --- Rating & review ---
    rating: v.optional(v.number()),   // 0.5 - 10, in 0.5 steps
    review: v.optional(v.string()),

    // --- Dashboard preference ---
    hideDeleteFromDashboard: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "categoryId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId"],
    }),
});
```

**Why a search index:** Convex's `searchIndex` gives you fast full-text search on `title`, scoped per-user via `filterFields` — this powers the "search everything at once" requirement efficiently, far better than filtering client-side across 1000+ rows.

**Why % is separately stored, not computed live in schema:** Convex schema can't run functions — % completion is computed in a small pure utility function (`calculateProgress.ts`) at read-time from `progressSeconds`/`totalDurationSeconds` or `progressSeason`/`progressEpisode`/`seasons`, never stored redundantly.

---

## Step 8 — Convex Auth Pages (Signup / Login)

### Part 1: Signup page — `src/app/(auth)/signup/page.tsx`

Renders `<SignupForm />` centered on screen, dark-friendly card layout using shadcn `Card`.

### Part 2: `SignupForm.tsx` — `src/features/auth/components/SignupForm.tsx`

- Uses shadcn `Form` + `Input` + `Label` + `Button`.
- Fields: Name, Email, Password, Confirm Password.
- On submit, calls Convex Auth's `signIn("password", { email, password, flow: "signUp" })`.
- On success → redirect to `/dashboard`.
- On error → shadcn `sonner` toast with the error message.
- Keep this file under 120 lines — extract validation schema to `features/auth/types.ts` using a small Zod schema.

### Part 3: Login page & `LoginForm.tsx`

Same pattern, `flow: "signIn"` instead. Link at bottom: "Don't have an account? Sign up".

### Part 4: `useAuthActions.ts` hook

Small wrapper hook around Convex Auth's `useAuthActions()` so components don't import Convex Auth internals directly — keeps the auth feature self-contained.

### Part 5: Default categories on first signup (optional nicety)

In `convex/auth.ts`, hook into the `createOrUpdateUser` callback (or a first-login check) to seed **zero** default categories — per your spec, the user manually creates their own from scratch. No seeding needed; just confirm the dashboard shows a friendly `EmptyState` ("No categories yet — create one to get started") on first login.

---

## Step 9 — Categories & Subcategories Feature

### Part 1: Convex functions — `convex/categories.ts`

- `getCategories` (query, scoped to `ctx.auth` user via `by_user` index)
- `createCategory` (mutation: name + icon)
- `updateCategory` (mutation: id, name, icon)
- `deleteCategory` (mutation: id — first checks if any `mediaItems` reference it; if yes, proceeds anyway but sets those items' `categoryId` handling per your requirement — see Part 4 below)

### Part 2: Convex functions — `convex/subcategories.ts`

Same CRUD pattern, scoped `by_category` and `by_user`.

### Part 3: `IconPicker.tsx`

A shadcn `Dialog` + searchable grid of Lucide icons. Since Lucide ships hundreds of icons, hardcode a **curated list of ~60 relevant icons** (film, tv, popcorn, globe, flag, heart, star, etc.) in a small constants file `features/categories/constants/iconList.ts` rather than rendering all of Lucide (keeps bundle + UI usable).

### Part 4: Delete warning flow

`CategoryFormDialog` and `SubcategoryFormDialog` both use shadcn `AlertDialog` for deletion:
- Before deleting, a Convex query checks `mediaItems` count referencing this category/subcategory.
- If count > 0, `AlertDialog` shows: *"This will make N item(s) uncategorized. Continue?"*
- On confirm, `deleteCategory` mutation deletes the category AND updates affected `mediaItems` to remove the reference (set `categoryId` to a special "Uncategorized" placeholder — see Part 5).

### Part 5: Handling "Uncategorized" state

Rather than allowing `categoryId` to be null (which complicates the schema/index), auto-create a **hidden system category** named `"Uncategorized"` per user the first time it's ever needed (lazy-created in the `deleteCategory` mutation itself, not seeded upfront). This keeps the schema field non-optional and every item always has a valid `categoryId`.

### Part 6: `CategoryList.tsx` & `CategoryCard.tsx`

Simple grid of cards (icon + name + item count + edit/delete). Lives at `/categories` route (linked from dashboard nav). Each card under 80 lines.

---

## Step 10 — Cloudinary Integration

### Part 1: Get your Cloudinary keys

From your existing Cloudinary dashboard, grab:
- `Cloud Name`
- `API Key`
- `API Secret`

### Part 2: Add environment variables to Convex (both dev & prod)

Convex env vars are set via CLI, not `.env` files (since Convex functions run in Convex's cloud, not your Next.js server):

```bash
npx convex env set CLOUDINARY_CLOUD_NAME your_cloud_name
npx convex env set CLOUDINARY_API_KEY your_api_key
npx convex env set CLOUDINARY_API_SECRET your_api_secret
```

For production, repeat the same commands against your prod deployment:

```bash
npx convex env set CLOUDINARY_CLOUD_NAME your_cloud_name --prod
npx convex env set CLOUDINARY_API_KEY your_api_key --prod
npx convex env set CLOUDINARY_API_SECRET your_api_secret --prod
```

(You'll fully deploy to prod in Step 14 — set these ahead of time now so they're ready.)

### Part 3: Signed upload action — `convex/cloudinary.ts`

A Convex **action** (not a mutation — actions can call external APIs) named `generateUploadSignature` that:
- Uses the `cloudinary` npm package's `v2.utils.api_sign_request` to sign a timestamp + folder param server-side (keeps your API secret safe, never exposed to the browser).
- Returns `{ signature, timestamp, apiKey, cloudName }` to the client.

### Part 4: Client upload flow — `PosterUploadField.tsx`

- User picks a file → component calls the `generateUploadSignature` action → gets signed params → does a direct `fetch` POST to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload` with the file + signature (bypasses your server entirely, keeps things fast).
- On success, Cloudinary returns `secure_url` and `public_id` → these get saved into the `mediaItems` row via the create/update mutation.
- Show a shadcn `Skeleton` placeholder while uploading, and a preview thumbnail once done.

### Part 5: Deletion cleanup

When a media item is deleted, also call a small Convex action that hits Cloudinary's destroy endpoint with the stored `posterPublicId`, so orphaned images don't eat into your 2GB free tier over time.

---

## Step 11 — Media Items: Create/Edit Form

### Part 1: `MediaItemFormDialog.tsx`

A shadcn `Dialog` (large size) opened from a "+ Add New" button on the dashboard. Contains:
- Title input
- Category select (populated from `useCategories`)
- Subcategory multi-select (populated from `useSubcategories`, filtered by chosen category) — use shadcn's multi-select pattern via `Command` + `Popover` (checkable list)
- Kind toggle: Movie / Series (shadcn `Tabs` or `RadioGroup`)
- `PosterUploadField`
- Conditionally renders `MovieFormFields` or `SeriesFormFields` based on kind

### Part 2: `MovieFormFields.tsx`

- Optional "Total duration" input (hours + minutes, converted to `totalDurationSeconds`)
- Status dropdown (Not Started / In Progress / Completed)
- If "In Progress" selected → reveals a small textarea: "Progress description" (e.g., "32m 45s") AND, if total duration was provided, a duration input to compute `progressSeconds`

### Part 3: `SeriesFormFields.tsx`

- `SeasonEpisodeInput.tsx`: dynamic list where user adds rows: "Season N — Total Episodes". "+ Add Season" button appends a row (shadcn `Button` variant ghost + small `Input` pair).
- Status dropdown, same as movies.
- If "In Progress" → reveals: Current Season (select from entered seasons), Current Episode (number input, capped to that season's total), and optional time-in-episode text field. All combined into `progressDescription` for the tooltip, plus structured `progressSeason`/`progressEpisode` for % calc.

### Part 4: Storage fields (shared, shown for both kinds)

- Two `Switch` components: "Have on Hard Drive" / "Have on Cloud".
- Each switch, when ON, reveals a `Textarea` directly beneath it for the free-text description (e.g., "samsung-hard-1tb in Hassan/series/GOT/all 8 seasons all episodes").

### Part 5: Rating & Review fields

- `StarRatingInput.tsx` (from `features/ratings/`) — 5-star visual component supporting half-star clicks, internally stores as 0–10 (each star = 2 points).
- Simple `Textarea` for review — plain text, no rich formatting.

### Part 6: Submit handling

- `useCreateMediaItem` / `useUpdateMediaItem` hooks wrap the Convex mutations.
- On success: close dialog, `sonner` success toast, dashboard list auto-updates (Convex reactivity — no manual refetch needed).
- On error: `sonner` error toast, dialog stays open so user doesn't lose input.

---

## Step 12 — Dashboard Page

### Part 1: Layout shell — `src/app/(dashboard)/layout.tsx`

Top nav bar: Cinevault logo/name, `TypeTabs` (switch Movies/Series — actually switches by `categoryId` since categories are fully custom, so really this becomes a horizontal category switcher), search bar, `ThemeToggle`, user avatar dropdown (Logout).

### Part 2: `TypeTabs.tsx`

Since categories are fully user-defined (not hardcoded Movie/Series), this renders a horizontal shadcn `Tabs` populated dynamically from `useCategories()` — e.g. tabs might read "Movies", "Series", or whatever the user named them. Selecting a tab filters the table by `categoryId`.

### Part 3: `SearchBar.tsx`

- Single input, debounced (`useDebounce` shared hook, ~300ms) before triggering the Convex search query — avoids hammering the backend on every keystroke.
- Searches across the searchIndex regardless of the currently selected category tab (per your "search everything at once" requirement) — when a search term is active, temporarily ignore the category tab filter and show matches from everywhere, clearly indicated by a "Showing results for '...' across all categories" label above the table.

### Part 4: `SortDropdown.tsx`

Single shadcn `Select` with 3 options + direction:
- "Name (A–Z)" / "Name (Z–A)"
- "Rating (High–Low)" / "Rating (Low–High)"
- "Progress (Not Started → Completed)" / "Progress (Completed → Not Started)"

Only one active at a time, default = "Name (A–Z)". Sorting happens client-side on the currently loaded page of results (simplest, since Convex pagination + search already narrows the dataset reasonably).

### Part 5: `MediaTable.tsx` (the core dashboard table)

Columns, in order:
1. Poster thumbnail (small, ~40x56px, rounded)
2. Title
3. Storage (single column, `StorageBadges.tsx` — two small icons: `HardDrive` and `Cloud` from lucide, colored via `text-storage-hard` / `text-storage-cloud` when active, `text-storage-inactive` when not; wrapped individually in shadcn `Tooltip` showing the free-text description)
4. Status (`StatusBadge.tsx` — colored badge using `bg-status-*`/`text-status-*` utility classes; wrapped in `Tooltip` showing `progressDescription` when status is "in_progress")
5. Rating (small 5-star display, read-only, from `ratingToStars.ts` util)

No review column on the dashboard (keeps it clean — review is full text, only shown on detail page).

Row click → navigates to `/item/[id]`. Row hover → `hover:bg-accent/50 transition-colors` applied via Tailwind (no custom color, reuses `accent` variable already in globals.css).

**No horizontal scroll:** achieved by keeping only 5 columns, poster thumbnail small and fixed-width, title using `truncate` with `max-w-[...]` and a `Tooltip` showing full title on hover if truncated, and the two badge-heavy columns (Storage, Status) kept narrow/fixed-width with icons instead of long text.

### Part 6: `MediaTableRow.tsx`

Split out from `MediaTable.tsx` to keep both files small — this file only renders ONE row's worth of cells and hover logic (~80–100 lines max).

### Part 7: `PaginationBar.tsx`

shadcn `Pagination` component + a `Select` for page size (10/20/30/50/100/All), default 20, placed below the table. "All" option disables pagination and just renders everything (fine even at 1000+ rows since only 5 lightweight columns are rendered — consider virtualization only if it later feels slow, not needed for v1).

### Part 8: Convex query for the dashboard — `useMediaItems.ts`

Wraps a paginated Convex query (`usePaginatedQuery`) filtered by `categoryId` (or search term when active), scoped to the logged-in user automatically via `ctx.auth.getUserIdentity()` inside the Convex function itself — never trust a client-passed userId.

---

## Step 13 — Item Detail Page

### Part 1: Route — `src/app/(dashboard)/item/[id]/page.tsx`

Server component that reads the `id` param, passes to a client component tree. Uses `useMediaItem(id)` hook (a `useQuery` wrapper) to fetch the full item.

### Part 2: `ItemDetailHeader.tsx`

Back button, title, category/subcategory chips (with their icons), Edit button (opens the same `MediaItemFormDialog` used for creation, pre-filled), Delete button (opens `DeleteItemDialog`).

### Part 3: `ItemPoster.tsx`

Large poster image (e.g., `max-w-xs`, 2:3 aspect ratio via `aspect-[2/3]` Tailwind class), rounded corners, subtle shadow.

### Part 4: `ItemMetaSection.tsx`

Grid layout showing: Kind (Movie/Series), full season/episode breakdown (for series — a small readable list, e.g. "Season 1: 8 episodes", "Season 2: 10 episodes"), total duration (for movies, if provided).

### Part 5: `ProgressEditor.tsx`, `StorageEditor.tsx`, `RatingEditor.tsx`, `ReviewEditor.tsx`

Each is a self-contained small section on the detail page showing the current value with an inline "Edit" pencil icon button that opens a small shadcn `Dialog` scoped to just that field (rather than reopening the entire big form) — faster, more focused edits. Each of these calls `useUpdateMediaItem` with just the relevant partial fields.

### Part 6: `DeleteItemDialog.tsx`

shadcn `AlertDialog` — "Are you sure you want to delete '{title}'? This cannot be undone." Confirm → `useDeleteMediaItem` mutation (also triggers the Cloudinary cleanup action from Step 10 Part 5) → `sonner` toast → redirect back to `/dashboard`.

### Part 7: Dashboard delete visibility toggle

A per-user preference (simplest: store in `localStorage` via a tiny shared hook `useDashboardPreferences`, since it's a pure UI preference, not data — no need for a Convex table just for this) controlling whether `MediaTableRow` renders a small delete icon button (which also opens `DeleteItemDialog`) or hides it. Toggle lives in a small settings dropdown in the dashboard top nav.

---

## Step 14 — Polish Pass

### Part 1: Loading states

Every Convex query-driven component shows a shadcn `Skeleton` matching its final layout shape while `isLoading` — table rows, detail page sections, category cards.

### Part 2: Empty states

`shared/components/EmptyState.tsx` — reusable icon + message + optional CTA button. Used for: no categories yet, no items in a category yet, no search results found.

### Part 3: Accessibility & keyboard

Confirm all shadcn `Dialog`/`AlertDialog` trap focus correctly (default behavior), all interactive icons have `aria-label`, tooltips are also readable via keyboard focus (shadcn Tooltip handles this by default).

### Part 4: Error boundaries

Add a simple `error.tsx` in `(dashboard)` route group to gracefully catch unexpected Convex/render errors with a "Something went wrong — reload" message instead of a blank white screen.

---

## Step 15 — Deploy

### Part 1: Push Convex to production

```bash
npx convex deploy
```

This deploys your current `convex/` functions + schema to your production Convex deployment.

### Part 2: Confirm production env vars are set

Double check (from Step 10 Part 2) that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are set with `--prod` flag on the Convex production deployment.

### Part 3: Push code to GitHub

```bash
git init
git add .
git commit -m "Initial Cinevault implementation"
git remote add origin <your-repo-url>
git push -u origin main
```

### Part 4: Import project into Vercel

- Go to vercel.com → New Project → Import your GitHub repo.
- Framework preset: Next.js (auto-detected).
- Add environment variable: `NEXT_PUBLIC_CONVEX_URL` → paste your **production** Convex URL (found in Convex dashboard → Settings → URL & Deploy Key, production deployment).
- Deploy.

### Part 5: Post-deploy check

- Visit the deployed URL, sign up a fresh account, create a category, add a movie, upload a poster, mark progress, rate it, confirm everything reads/writes correctly against the production Convex + Cloudinary.
- Toggle light/dark/system theme to confirm it persists across reload.

---

## Appendix A — Utility Function Specs

- `calculateProgress.ts`: pure function, input `(kind, totalDurationSeconds?, progressSeconds?, seasons?, progressSeason?, progressEpisode?)` → returns `number | null` (percentage), null when insufficient data to calculate (e.g., no total duration provided).
- `formatDuration.ts`: converts seconds → "1h 32m" style string for display.
- `ratingToStars.ts`: converts a 0–10 number → `{ fullStars: number; hasHalfStar: boolean }` for the star display component.

## Appendix B — Environment Variables Checklist

| Variable | Where | Set via |
|---|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Next.js `.env.local` (dev) + Vercel env (prod) | Auto-generated by `npx convex dev` / copied from Convex dashboard for prod |
| `CLOUDINARY_CLOUD_NAME` | Convex dev + prod | `npx convex env set` |
| `CLOUDINARY_API_KEY` | Convex dev + prod | `npx convex env set` |
| `CLOUDINARY_API_SECRET` | Convex dev + prod | `npx convex env set` |
| `JWT_PRIVATE_KEY`, `JWKS` | Convex dev + prod | Auto-set by `npx @convex-dev/auth` CLI |

## Appendix C — Future Enhancements (explicitly out of v1 scope)

- Forgot-password flow (requires wiring an email provider like Resend + Convex Auth's email verification code flow)
- Mobile-responsive dashboard (would need a card-based mobile layout instead of a table)
- Server-side/global sorting across full dataset instead of current-page sorting, if dataset grows very large
