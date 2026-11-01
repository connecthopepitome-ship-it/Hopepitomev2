# HOPEPITOME / ADMIN DASHBOARD UI/UX REFINEMENT BRIEF

**Admin Dashboard only - preserve all other portals and public pages**

## ANTIGRAVITY IMPLEMENTATION DOCUMENT

### Hopepitome Admin Dashboard UI/UX Refinement Brief
A consolidated, implementation-ready prompt for improving typography, alignment, spacing, responsive layouts and mobile usability across the authenticated Admin Dashboard.

> **SCOPE LOCK**: Redesign and refine the authenticated Admin Dashboard only. Do not change the public Hopepitome website, public landing pages, Client Portal, Employee Portal, authentication flows or backend integrations.

---

### What this document contains
- A consolidated Antigravity prompt covering the complete Admin Dashboard UI/UX refinement.
- Specific typography, alignment, spacing, colour and component standards.
- Desktop, tablet and mobile responsive requirements.
- Instructions for using the supplied HTML file as a companion design reference.
- Functional preservation, regression testing and acceptance criteria.

---

## 01 / SUPPLIED HTML REFERENCE

The supplied HTML reference contains four Admin Dashboard screen concepts. Antigravity should inspect and use them to understand the current visual language and screen structure:
- Project Management & Execution Hub
- Staff Operations & Resource Board
- Customer 360 & Account Intelligence
- Service Catalogue & Solutions Matrix

### Observed design baseline
- **Fonts**: Plus Jakarta Sans for headings; Manrope for body and labels. Retain this pairing as the starting point; standardise sizes, weights and line heights across every admin screen.
- **Palette**: Deep navy/blue, cool neutral surfaces and green/teal accents. Refine contrast and semantic status colours; avoid excessive saturated surfaces.
- **Shell**: Fixed 56px header, fixed 256px sidebar and a permanent left content offset. Make the shell responsive; remove desktop-only offsets on narrow screens and add mobile navigation.
- **Text**: Body and label styles include 12px and 11px sizes. Increase ordinary content readability; reserve small type for secondary metadata only.
- **Tables**: Wide data tables with multiple operational columns. Keep full tables on desktop; turn rows into readable cards or lists on mobile.
- **Components**: KPI cards, filters, view switchers, drawers, modals and task boards. Unify dimensions, spacing, alignment, responsive behaviour and interaction states.

---

## 02 / IMPLEMENTATION SPECIFICATIONS

### ROLE AND OBJECTIVE
Refine and optimise the complete Hopepitome authenticated Admin Dashboard into a polished, premium, modern enterprise SaaS interface. Focus on typography, font sizing, text alignment, spacing, responsive layouts, component consistency, readability and usability. Apply the improvements consistently across every Admin Dashboard module, not just the Project Management page.

### STRICT SCOPE - ADMIN DASHBOARD ONLY
- Modify only the authenticated Admin Dashboard and its admin-only components, layouts and styles.
- Do not modify the public website, homepage, marketing pages or public career-services landing page.
- Do not modify the Client Portal or Employee Portal.
- Do not change client or employee login, authentication, role logic, Firebase configuration, Firestore data, Cloudflare Worker APIs, Google Apps Script or Google Drive integration.
- Preserve all existing admin routes, data bindings, event handlers, permissions and business workflows.

### TYPOGRAPHY SYSTEM
- Use the existing font pairing as the starting point: Plus Jakarta Sans for page and section headings and prominent numeric metrics; Manrope for body copy, labels, navigation, forms and tables. Standardise the typography scale across all admin modules.
- **Page title**: 26–30px desktop, 22–24px mobile. One clear title per screen; wrap naturally.
- **Section heading**: 19–21px desktop, 18–20px mobile. Separate major content groups.
- **Card heading**: 16–17px desktop, 15–16px mobile. Consistent within all dashboard cards.
- **Body text**: 14–15px desktop, 14px mobile. Comfortable default reading size.
- **Table content**: 13–14px desktop, 14px mobile. Never shrink dense tables to illegibility.
- **Form labels**: 13–14px desktop, 13–14px mobile. Clear and readable above controls.
- **Supporting text**: 12–13px desktop, 12–13px mobile. Secondary metadata only.
- **KPI values**: 30–34px desktop, 26–30px mobile. Use tabular numerals for stable alignment.

### TEXT ALIGNMENT AND SPACING
- Page titles, descriptions, card headings and form labels should be left aligned.
- Table headings must align with their data columns. Monetary values and numeric columns should be right aligned where appropriate.
- Dates, status badges, icons and action buttons must have consistent vertical alignment.
- 4px: micro separation; 8px: closely related elements; 12px: compact component gaps; 16px: standard internal spacing.
- 20px: card content spacing; 24px: section gaps; 32px: major layout separation; 40–48px: large section separation when needed.
- Page gutters: 16px mobile, 20–24px tablet, 28–32px desktop.
- Card padding: 14–16px mobile and 18–22px desktop.

### COLOUR AND STATUS SYSTEM
- Primary navy/deep blue: main actions, active navigation and key emphasis.
- White and light cool grey: page and card surfaces.
- Muted grey: secondary labels, borders and supporting information.
- Green/teal: success and completed states.
- Amber: pending and warning states.
- Red: errors, overdue and critical states.

### RESPONSIVE LAYOUT AND NAVIGATION
- **Desktop**: Retain a clean header and appropriately sized sidebar. Use a well-proportioned content area with balanced KPI grids and aligned tables. Keep navigation spacing and active states consistent.
- **Tablet**: Use a collapsible sidebar or compact navigation. Allow content to expand when navigation is collapsed. Use two-column KPI layouts where appropriate and stack controls when needed.
- **Mobile**: Hide the permanent desktop sidebar and remove the fixed 256px content offset. Use a compact top bar, hamburger menu and slide-out navigation drawer. Provide a mobile bottom navigation for frequent admin destinations: Home, CRM, Projects, Team and More. Ensure fixed headers, drawers and bottom navigation never cover page content or actions. Respect safe-area insets and browser address-bar behaviour.

### RESPONSIVE DATA TABLES
- Desktop: retain a structured table with sufficient column width and readable cells.
- Mobile: transform each row into a clean project card or compact list. Show primary data and place secondary details in an expandable area.
- Do not shrink a multi-column table until it becomes unreadable.
- Apply the same approach to CRM leads, employees, customers, quotations, tasks and other admin tables.

### REQUIRED VIEWPORT TESTING
- **320px, 360px, 375px, 390px, 430px (Narrow mobile)**: No clipped headings, overlapping actions, unreadable tables or unintended horizontal page scroll.
- **768px (Tablet)**: Navigation adapts, cards and forms reflow, no fixed-width overflow.
- **1024px, 1280px, 1440px, 1920px (Desktop)**: Proper content widths, balanced columns, consistent sidebars and readable data density.

