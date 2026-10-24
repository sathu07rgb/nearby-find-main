# FindIt Nearby 🔍📍

> **Lost something? Let's find it.**
> An AI-assisted community lost-and-found platform built for college campuses, hostels, offices, public spaces, and local communities.

---

## 🌟 Overview & Key Features

FindIt Nearby connects people who lost items with people who found them. Rather than relying on static message boards or manual scrolling, FindIt Nearby utilizes an **explainable multi-factor AI similarity engine** to score, rank, and explain potential matches between lost and found reports.

### Core Capabilities
* **Intelligent AI-Assisted Matching:** Evaluates text tokens, categories, geographical proximity, and time windows into a normalized 0–100 similarity score with clear explanatory factors.
* **Privacy & Safe Verification:** Private verification details (distinct engravings, contents) are hidden from public searches and only revealed to authorized users during the structured claim review workflow.
* **End-to-End Responsive Design:** Tailored for screen widths from 320px mobile viewports up to large desktop monitors (touch targets, safe areas, collapsible menus, bottom mobile nav).
* **Authenticated In-App Messaging:** Secure communication between report owners and finders without exposing personal phone numbers or email addresses.
* **Interactive Demo Mode:** Instant exploration out of the box with zero required external credentials, featuring realistic seeded records and a dynamic local report store.
* **Production-Ready PostgreSQL & RLS:** Complete SQL schema and Supabase Row Level Security policies ensuring data isolation and privacy protection.
* **PWA Enabled:** Includes web app manifest, offline service worker caching for static assets, and mobile installability.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS (Navy `#0B1F4D`, Blue `#1769FF`, Pale `#F3F7FF`) |
| **Routing & Navigation** | React Router DOM v6 |
| **Icons & UI** | Lucide React, Custom SVG Pin + Search branding |
| **Forms & Validation** | React Hook Form, Zod schema validation |
| **Backend & Database** | Supabase, PostgreSQL, Supabase Storage, Row Level Security (RLS) |
| **Testing** | Vitest, React Testing Library, JSDOM |
| **Deployment** | Vercel, Netlify, or static hosting |

---

## 📁 Project Structure

```
findit-nearby/
├── public/
│   ├── favicon.svg          # Custom pin + search SVG icon
│   ├── manifest.json        # PWA web manifest
│   ├── sw.js                # Lightweight offline service worker
│   └── icons/               # PWA app icons
├── src/
│   ├── components/
│   │   ├── items/           # ItemCard, MatchCard, ImageUpload
│   │   ├── layout/          # Navbar, Sidebar, DashboardLayout, Footer, MobileBottomNav
│   │   └── ui/              # Button, Input, Select, Textarea, Card, Modal, Logo
│   ├── context/
│   │   ├── AuthContext.tsx    # Supabase Auth + Demo login fallback
│   │   ├── ReportsContext.tsx # Central reports store + search + dynamic matching
│   │   └── ToastContext.tsx   # Accessible toast notifications
│   ├── lib/
│   │   ├── demo-data.ts     # Realistic seeded test reports & users
│   │   ├── matching.ts      # Multi-factor AI matching algorithm
│   │   ├── supabase.ts      # Supabase client initializer & demo detector
│   │   └── utils.ts         # Formatting, dates, categories, badges
│   ├── pages/
│   │   ├── auth/            # SignIn, SignUp, ForgotPassword, PhoneSignIn
│   │   ├── AdminPage.tsx    # Moderation & flagged report console
│   │   ├── BrowsePage.tsx   # Filterable search catalogue
│   │   ├── DashboardPage.tsx# Authenticated user dashboard
│   │   ├── ItemDetailsPage.tsx # Detailed view, claim workflow, abuse report
│   │   ├── LandingPage.tsx  # Public landing page with hero & quick search
│   │   ├── MatchDetailsPage.tsx # Side-by-side comparison & score breakdown
│   │   ├── MatchesPage.tsx  # Ranked list of AI matches with filters
│   │   ├── MessagesPage.tsx # In-app messaging thread
│   │   ├── MyReportsPage.tsx# User reports & status lifecycle controls
│   │   ├── ProfilePage.tsx  # User profile & recovery statistics
│   │   ├── SetupPage.tsx    # Integration guide & environment diagnostics
│   │   └── SettingsPage.tsx # Notifications & demo cache reset
│   ├── test/                # Vitest unit test suites
│   ├── App.tsx              # Application route definitions
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind directives & design system tokens
├── supabase/
│   └── schema.sql           # Complete PostgreSQL schema & RLS policies
├── .env.example             # Environment variable documentation
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.0.0 or later
* **npm** or **pnpm**

### 2. Installation
```bash
# Clone or navigate to the project directory
cd findit-nearby

# Install dependencies
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`. The application will launch in **Demo Mode** by default, allowing full functional testing without needing Supabase credentials.

### 4. Run the Test Suite
```bash
npm run test
```
Runs 10 unit tests covering:
* Positive and negative matching scenarios
* Category, location, and time weight distributions
* Data validation and formatting utilities
* Button and Logo UI components

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# ------------------------------------------------------------------------------
# Frontend Client Variables (Public)
# ------------------------------------------------------------------------------
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Google Maps JavaScript API
VITE_GOOGLE_MAPS_API_KEY=

# ------------------------------------------------------------------------------
# Server-Side Secrets (NEVER expose to client with VITE_)
# ------------------------------------------------------------------------------
SUPABASE_SERVICE_ROLE_KEY=
AI_API_KEY=
```

> **Note:** If `VITE_SUPABASE_URL` is omitted or left as placeholder, the application automatically runs in **Demo Mode** with persistent in-memory session handling.

---

## 🗄️ Database Setup (Supabase)

1. Create a new project on [supabase.com](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run the entire script.
4. Go to **Storage** and create a public bucket called `item-photos`.
5. (Optional) In **Authentication > Providers**, enable Google and input your Google Cloud OAuth Client ID and Secret.

### Row Level Security (RLS) Summary
* `profiles`: Publicly readable; editable only by the authenticated owner (`auth.uid() = id`).
* `item_reports`: Publicly readable (excluding closed items); insertions and updates restricted to the verified reporter.
* `private_item_details`: Completely restricted from public read; only accessible to the authorized report owner.
* `claims`: Only visible to the claimant and the corresponding item's reporter.
* `conversations` & `messages`: Restricted strictly to verified conversation participants.
* `notifications`: Isolated so each user can read and mark read only their own alerts.

---

## 🧠 AI-Assisted Matching Engine

The core matching algorithm (`src/lib/matching.ts`) implements an explainable, deterministic scoring model:

$$Score = (Text \times 0.40) + (Location \times 0.25) + (Category \times 0.20) + (Time \times 0.15)$$

* **Text Similarity (40%):** Tokenized word analysis (Jaccard token overlap) comparing item names, brand keywords, and descriptions.
* **Location Proximity (25%):** Hierarchical matching evaluating city agreement, campus affiliation, and landmark text overlap.
* **Category Match (20%):** Binary match checking if both reports belong to the same category (`electronics`, `wallets_bags`, `keys`, `id_cards`, etc.).
* **Time Proximity (15%):** Exponential decay scoring based on the day difference between when the item was lost and when it was found.

> **Crucial Safety Note:** A similarity score is a visual/metadata correlation indicator. FindIt Nearby displays explicit warnings that a score is never proof of ownership.

---

## 🌐 Deployment on Vercel

1. Push your repository to GitHub or GitLab.
2. In the Vercel dashboard, click **Add New Project** and import the repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
7. Click **Deploy**.

---

## 📄 License
MIT License. Built for university communities and student hackathons.
