# HOPEPITOME — EXPERIMENTAL 3D DIGITAL STUDIO

> **"We build digital systems for businesses and distinctive professional identities for people."**

Hopepitome is an independent digital studio combining enterprise software architecture (**Nexora**) with executive career identity craftsmanship (**Elevora**).

---

## 1. Brand Architecture

### Parent Brand: HOPEPITOME
A hybrid digital atelier operating at the intersection of business technology and personal career branding.

### Division 01: NEXORA — Digital Engineering
- **Focus**: High-concurrency web applications, ERP integrations (Frappe / ERPNext), custom enterprise software, commerce engines, and API modernization.
- **Visual Identity**: Dark technical composition, architectural geometric schematics, fine hairline grid markers, and brushed metallic surfaces.

### Division 02: ELEVORA — Career Studio
- **Focus**: Executive CV/resume craftsmanship, bespoke personal portfolio development, LinkedIn profile authority, and ATS calibration.
- **Visual Identity**: Refined editorial composition, warm paper textures, curatorial typography, and high-contrast craftsmanship.

---

## 2. Creative Direction & Art Direction

- **Palette**:
  - Primary Background: Near-black graphite (`#0a0b0d`, `#0c0d0e`)
  - Primary Typography: Warm white (`#f5f5f3`)
  - Secondary Typography: Muted stone grey (`#8e9299`)
  - Accent: Precise cobalt blue (`#1f51ff`)
  - Secondary Neutral: Brushed-metal silver (`#c8cbd0`)
- **Typography**:
  - Display: `Syne` (Bold, architectural, asymmetric editorial headlines)
  - Body: `Plus Jakarta Sans` (Clean, balanced modern grotesque)
  - Technical / Metadata: `JetBrains Mono` (Hairline monospace metrics & coordinate tags)
- **3D Sculpture**:
  - Live Three.js / React Three Fiber physical simulation combining smoked glass slabs (`MeshPhysicalMaterial`), brushed titanium orbital rings, hairline datum pins, and an illuminated cobalt octahedron core.
  - Directional studio lighting with key white cast, graphite fill, and cobalt rim silhouette.
  - Zero-blocking event architecture (`pointer-events-none` on canvas) ensuring uninterrupted UI and navigation access.
  - Automatic graceful fallback (`FallbackSculpture.tsx`) for non-WebGL environments and reduced-motion preferences.

---

## 3. Site Architecture & Sections

1. **Navigation**: Minimal editorial header with live status telemetry, division direct links, and mobile drawer.
2. **Hero Section**: Asymmetric composition, grid-aligned typography, division navigation actions (`01 / EXPLORE NEXORA`, `02 / DISCOVER ELEVORA`), and live 3D sculpture.
3. **Studio Statement**: Large editorial manifesto (*"TECHNOLOGY FOR BUSINESS. DESIGN FOR PEOPLE."*).
4. **Two Divisions**: High-contrast side-by-side presentation of Nexora and Elevora.
5. **Service Index**: Numbered editorial list (01 to 07) with expandable deliverable drawers.
6. **Selected Work**: Authentic concept studies and lab prototypes with honest ethical labeling.
7. **How We Work**: 5-stage sequential methodology (01 Discover → 02 Define → 03 Build → 04 Refine → 05 Deliver).
8. **Client Project Portal**: Structured communication of future client portal and roadmap.
9. **Final CTA**: Bold typographic statement (*"LET'S MAKE SOMETHING MATTER."*) with multi-division project intake.
10. **Footer**: Brand architecture, division indexes, and direct studio communications.

---

## 4. Development & Production Build

### Running Locally
```bash
# Start Next.js development server
npm run dev

# Or run on a specific port
npm run dev -- -p 3005
```

### Production Build & Verification
```bash
# Compile and optimize production bundle
npm run build

# Serve production build locally
npm run start -p 3005
```

---

## 5. Deployment Guidelines (Cloudflare Pages / OpenNext)

The application is built with the Next.js App Router and utilizes zero-cost static optimization for core routes:
- Compatible with Cloudflare Pages via `@opennextjs/cloudflare` or standard static export.
- Pre-rendered static HTML routes ensure sub-50ms edge delivery worldwide.
