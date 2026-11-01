# 🍳 KitchenOS — Your Kitchen, Your Rules

> **4th Edition Foodoscope ForkIT Challenge** (CoSy Lab, IIIT Delhi)  
> Computational Gastronomy Hackathon Project

---

## 💡 The Core Problem & Solution

Most recipe platforms assume the cook has a fully equipped professional kitchen. Students, hostelites, PG tenants, and budget home cooks often only have **an induction cooktop, a microwave, or a single frying pan**.

**KitchenOS** flips recipe discovery upside-down:
Instead of asking *"What do you want to cook?"*, it answers:  
👉 **"What can you actually cook with the tools and time you have right now?"**

---

## 🔬 Computational Gastronomy & API Integration

KitchenOS integrates the two flagship databases from **CoSy Lab, IIIT Delhi**:

1. **RecipeDB**:
   - Queries recipes across geo-cultural regions, preparation instructions, and nutritional profiles.
   - Extracts semantic tuples: `[Processes, Utensils, Ingredients, Cooking Times]`.
   - Maps equipment requirements using our ontological normalizer (`data/normalization-map.json` and `data/equipment-map.json`).

2. **FlavorDB**:
   - Analyzes volatile aroma molecules and taste compounds (e.g. Allicin, Eugenol, Lycopene, Pyrazines).
   - Validates that culinary equipment substitutions (e.g., covered stovetop pan instead of an oven) preserve Maillard reaction products and lipid-soluble flavor retention.
   - Provides on-the-fly molecular ingredient substitution chips (e.g., swapping fresh basil for dried oregano with 85% molecular overlap).

---

## 🚀 Key Features

- **Instant Kitchen Inventory Configurator**:
  - One-click presets: *Hostel / Dorm Setup*, *PG Studio*, *One-Pan Wonder*, *Fully Equipped Home*.
  - Visual selector across Heat Sources, Cookware, Appliances, and Prep Tools.
  - Interactive cooking time slider (5 to 120 minutes).
- **Compatibility Scoring Engine**:
  - 🟢 **100% Ready**: Zero adaptations needed; all tools already in your kitchen.
  - 🟡 **70%–95% Smartly Adapted**: Feasible with automated culinary substitutions (e.g. lid strainers, stovetop braising).
  - 🔴 **Incompatible**: Clearly flags missing critical tools.
- **Adaptive Step-by-Step Rewriter**:
  - Rewrites preparation instructions to use only your available cookware.
  - Side-by-side comparison with original RecipeDB instructions.
- **FlavorDB Molecular Insight Panel**:
  - Displays chemical compounds, PubChem CIDs, and scientific rationale for flavor preservation.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with local storage persistence)
- **Icons**: Lucide React
- **APIs**: RecipeDB + FlavorDB (with both remote REST client & offline computational gastronomy fallback)

---

## 🏃 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for live API keys)
Create a `.env.local` file:
```env
RECIPEDB_BASE_URL="https://cosylab.iiitd.edu.in/recipedb"
RECIPEDB_API_KEY="your_api_key_here"
FLAVORDB_BASE_URL="https://cosylab.iiitd.edu.in/flavordb"
FLAVORDB_API_KEY="your_api_key_here"
```
*(If keys are omitted, KitchenOS uses the built-in computational gastronomy corpus from CoSy Lab).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
