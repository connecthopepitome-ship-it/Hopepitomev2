---
title: "Hopepitome Admin Dashboard UI/UX Refinement"
status: "Implementation brief"
scope: "Authenticated Admin Dashboard only"
reference_code: "Four supplied HTML dashboard concepts embedded below"
---

# Hopepitome Admin Dashboard – UI/UX Refinement & Implementation Brief

> **Purpose:** Use this committed Markdown file as the single implementation brief for Antigravity. It contains the design requirements and the four original HTML reference screens supplied with the project.

## 1. Antigravity task – read this first

Read this entire Markdown file before changing any code. Inspect the existing Hopepitome repository, identify the actual Admin Dashboard routes, React components, layout shells, styles and shared design tokens, then implement the UI/UX refinement across the **authenticated Admin Dashboard only**.

Treat the four HTML documents in [Section 14](#14-original-html-design-references) as visual and structural references. They are reference concepts, not production-ready replacement pages. Do not paste the complete HTML into the live application and do not rebuild the app as static HTML. Adapt the relevant patterns into the existing component architecture.

### Required outcome

Create a polished, premium, minimalist, professional and responsive Admin Dashboard with consistent typography, alignment, spacing, layout, navigation, tables, cards, forms, filters, drawers and mobile behaviour. The desktop experience must remain professional, while the mobile layout must be genuinely usable—not a compressed desktop page.

## 2. Strict scope boundary – Admin Dashboard only

**Modify only the authenticated Admin Dashboard and its admin-only shared components/styles.**

Do not modify or redesign:

- Public Hopepitome homepage or public marketing website.
- Public header, footer, public navigation or landing pages.
- Career Services public landing page.
- Client Portal or its layouts and components.
- Employee Portal or its layouts and components.
- Client registration, client login or employee login screens.
- Firebase Authentication configuration, Firestore schema or security rules.
- Cloudflare Worker APIs or backend logic.
- Google Apps Script, Google Drive integration or upload behaviour.
- Existing business workflows, routes, permissions or data contracts.

Before editing, map the route/component boundary between the Admin Dashboard and the public, client and employee experiences. If a shared component is also used outside the Admin Dashboard, do not change it globally. Create an admin-scoped variant or scoped styles instead.

## 3. First inspect, then implement

Before changing files:

1. Inspect the repository structure and framework.
2. Identify the Admin Dashboard entry route and all admin module routes.
3. Identify the current header, sidebar, page shell, cards, tables, forms, modals, drawers and responsive styles.
4. Identify which files are shared with public, client or employee experiences.
5. Compare the existing implementation with the four HTML references below.
6. Record existing interactions, route names, API calls, data bindings and permission checks that must be preserved.
7. Create a short implementation checklist and proceed without waiting for another approval.

Do not assume the attached HTML is the production application's source code. The repository is the source of truth for current functionality.

## 4. Design direction

Design language:

- Premium enterprise SaaS.
- Modern minimalist and professional.
- Calm, restrained and confident.
- Strong information hierarchy.
- Generous but efficient whitespace.
- Consistent alignment and rhythm.
- Clear data presentation.
- Subtle borders and restrained shadows.
- Functional iconography with text labels where needed.

Retain the existing navy/blue, cool-neutral and green-accent direction as the starting point. Refine its use consistently rather than introducing a completely unrelated brand palette.

Suggested application of colour:

- Deep navy/blue: primary navigation, selected states and primary actions.
- White: main cards and elevated content surfaces.
- Cool near-white/light grey: page background and secondary surfaces.
- Dark charcoal: main text.
- Muted slate: supporting text and metadata.
- Green: success, completed and healthy states.
- Amber: warning, pending and attention states.
- Red: errors, critical risks and destructive actions.

Avoid excessive gradients, highly saturated decoration, strong shadows, random accent colours and decorative elements that compete with the information.

## 5. Typography system

Use the current font pairing as the starting point:

- **Plus Jakarta Sans:** page headings, section headings, card titles and prominent KPI values.
- **Manrope:** body text, navigation, labels, tables, form controls, descriptions and metadata.

Create central, reusable typography tokens. Do not rely on inconsistent one-off font sizes.

| Element | Desktop | Mobile |
|---|---:|---:|
| Page title | 26–30px | 22–24px |
| Section heading | 19–21px | 18–20px |
| Card heading | 16–17px | 15–16px |
| Body text | 14–15px | 14px |
| Table content | 13–14px | 14px in card/list view |
| Form label | 13–14px | 13–14px |
| Supporting metadata | 12–13px | 12–13px |
| KPI value | 30–34px | 26–30px |
| Navigation label | 13–14px | 12–14px |

Typography rules:

- Use consistent font weights and line heights.
- Avoid overusing bold text and uppercase labels.
- Use restrained letter spacing; do not use wide tracking on ordinary text.
- Avoid tightly compressed text and excessively small labels.
- Use tabular numerals for currency, counts, percentages and dates.
- Maintain readable contrast for secondary text.
- Prevent headings from colliding with action buttons.
- Allow long names and project titles to wrap sensibly or truncate with an accessible way to view the full value.
- Do not use 10–11px text for ordinary labels or essential information.

## 6. Alignment and spacing system

Use a consistent 4px/8px spacing rhythm and define reusable tokens:

- 4px: micro separation.
- 8px: tightly related items.
- 12px: compact component spacing.
- 16px: standard control/card spacing.
- 20px: card content spacing.
- 24px: section spacing.
- 32px: major page spacing.
- 40–48px: large section separation where justified.

Page gutters:

- Mobile: 16px.
- Tablet: 20–24px.
- Desktop: 28–32px.

Card padding:

- Mobile: 14–16px.
- Desktop: 18–22px.

Alignment rules:

- Page titles, descriptions and section headings: left aligned.
- Form labels: left aligned above fields.
- Navigation labels: consistent baseline with icons.
- Table headers: aligned with their data cells.
- Currency and numeric columns: right aligned.
- Status badges: vertically centred and consistently sized.
- Action groups: aligned consistently and never overlap content.
- Use consistent spacing between headings, descriptions, controls and content sections.

Do not force unrelated cards to equal fixed heights if that causes clipping or excess blank space.

## 7. Shared admin components to standardise

Create or refine reusable admin-scoped components/tokens for:

- Page header and breadcrumb.
- Page title, subtitle and action area.
- Top navigation/header.
- Desktop sidebar and mobile navigation drawer.
- Mobile bottom navigation, if used for admin primary areas.
- KPI/stat cards.
- Content cards and section headers.
- Primary, secondary, tertiary and destructive buttons.
- Search inputs and filters.
- Text inputs, selects, textareas and validation messages.
- Status badges and priority indicators.
- Tables and mobile record cards.
- Pagination.
- Tabs and segmented controls.
- Modals, drawers and bottom sheets.
- Empty, loading, error and success states.
- Activity timelines and progress indicators.

Keep border radii, control heights, icon sizes, shadows, borders and spacing consistent. Prefer subtle borders over heavy shadows.

## 8. Admin navigation and responsive shell

### Desktop

- Preserve a clear top header and organised sidebar.
- Use a consistent sidebar width and navigation row height.
- Group navigation items by business function.
- Provide a clear active route state.
- Ensure the content area uses available width without awkward compression.

### Tablet

- Allow the sidebar to collapse.
- Reflow page actions and KPI cards.
- Avoid overlap between navigation, content and fixed controls.

### Mobile

- Do not display a permanently fixed 256px desktop sidebar.
- Remove any permanent `pl-64`/equivalent main-content offset at mobile widths.
- Use a compact top bar and a hamburger-triggered slide-out navigation drawer.
- If a bottom navigation is appropriate for admin's most frequent destinations, limit it to a small set such as Home, CRM, Projects, Team and More.
- Place secondary modules in the navigation drawer or More area.
- Keep labels readable and the active route obvious.
- Respect safe-area insets and do not let fixed navigation cover page content.

Do not show every admin module in the bottom navigation.

## 9. Responsive page and component behaviour

Design mobile-first, then adapt upward. Required viewport tests:

- 320px
- 360px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

### KPI cards

- Desktop: balanced multi-column grid.
- Tablet: two columns where appropriate.
- Mobile: one or two columns only when the content remains readable.
- Keep title, value and secondary context visually distinct.
- Do not use fabricated values or trends; use actual data or explicit empty states.

### Tables

On desktop, retain structured tables with readable cell padding, clear headers, aligned values and accessible row actions.

On mobile, do not shrink wide tables until text becomes unreadable. Convert rows into responsive cards or a prioritised list. Keep primary information visible and move secondary fields into an expandable detail area. Provide clear row actions. A horizontal scroll can be used only where it is genuinely appropriate and obvious to the user.

Apply this consistently to projects, tasks, leads, customers, employees, quotations, invoices and other admin tables.

### Forms, modals and drawers

- Desktop: use centred modals or right-side drawers where appropriate.
- Mobile: use full-screen panels for complex forms and bottom sheets for simple filters/selections.
- Forms should be single-column on phones.
- Keep close/back controls visible.
- Prevent keyboard overlap.
- Respect safe areas.
- Keep primary actions accessible without covering content.

### Search and filters

- Keep search easy to locate.
- On mobile, move dense filters into a filter sheet.
- Show active filters and provide a clear reset action.
- Do not let filter controls overflow the screen.

## 10. Specific audit points from the supplied HTML references

The original HTML references contain four complete standalone dashboard concepts:

1. Project Management & Execution Hub.
2. Staff Operations & Task Board.
3. Customer 360 & Client Directory.
4. Service Catalogue Engine.

Review all four before choosing shared patterns. Specific issues/patterns to assess:

- The fixed desktop header and fixed 256px sidebar.
- The main content's permanent left offset.
- Small 11px/12px text styles used for some labels and supporting content.
- Wide multi-column project and directory tables.
- Dense navigation groups.
- KPI labels and values that need consistent hierarchy.
- Header action groups that may wrap awkwardly.
- Drawers and modals that need narrow-screen behaviour.
- Filter rows and category pills that may overflow.
- Globally hidden scrollbars that can obscure scroll affordances.
- Sample names, dates, monetary values, avatars and statistics that are design placeholders, not real production data.

Use these references to understand intended module structure and visual patterns. Do not copy unrealistic sample data into production. Do not claim that example KPI numbers, storage capacities, delivery values, SLA results, customer scores or staff records are genuine.

## 11. Colour, contrast and accessibility

- Meet WCAG AA contrast expectations where applicable.
- Ensure secondary text remains readable.
- Use semantic colour plus text/icon labels; never convey status by colour alone.
- Provide visible keyboard focus states.
- Give icon-only controls accessible names.
- Use comfortable touch targets of at least approximately 44×44 CSS pixels.
- Do not depend on hover for essential mobile interactions.
- Respect reduced-motion preferences.
- Support browser zoom without clipping or loss of access.

## 12. Performance and implementation quality

- Avoid unnecessary animation and heavy visual effects.
- Avoid duplicate/conflicting CSS rules.
- Prefer reusable tokens and components over scattered inline styles.
- Keep responsive styles scoped to the Admin Dashboard.
- Preserve existing component architecture and routing.
- Do not load entire datasets to render a page.
- Preserve existing pagination and backend query behaviour.
- Ensure long pages and drawers scroll correctly.
- Do not globally hide scrollbars if doing so removes useful scroll cues.

## 13. Functionality preservation and QA

This is primarily a UI/UX refinement. Preserve all existing admin functionality, including:

- Firebase connections and authentication.
- Firestore queries and data bindings.
- Cloudflare Worker API calls.
- CRM and lead operations.
- Sales pipeline and follow-ups.
- Project creation and management.
- Task board and assignments.
- Customer 360 directory.
- Service catalogue.
- Employee directory and permissions.
- Quotations and finance operations.
- Document and Google Drive operations.
- Search, filters, sorting and pagination.
- Existing route links and event handlers.

Do not replace real data with static examples. Add proper loading, empty, error and success states. Do not claim an action is functional unless its existing/new backend operation works.

QA checklist:

- [ ] Admin dashboard pages use one consistent typography scale.
- [ ] Headings, labels, values and icons align consistently.
- [ ] Spacing is consistent across modules.
- [ ] Desktop header/sidebar work correctly.
- [ ] Mobile navigation works and does not cover content.
- [ ] Tables become usable mobile cards/lists where needed.
- [ ] KPI cards reflow without clipping.
- [ ] Forms and dialogs fit mobile screens.
- [ ] Search and filters remain usable on mobile.
- [ ] All required viewport sizes are tested.
- [ ] No unintended horizontal overflow.
- [ ] No clipped text or overlapping controls.
- [ ] Keyboard focus and contrast are acceptable.
- [ ] Existing backend actions and routes still work.
- [ ] Public website is unchanged.
- [ ] Client Portal is unchanged.
- [ ] Employee Portal is unchanged.

## 14. Original HTML design references

The four complete HTML reference documents are embedded below as code. They are supplied for design inspection and adaptation. Keep them as reference material; do not use them as a replacement application shell.


### 14.1. Project Management & Execution Hub

```html
<!DOCTYPE html>

<html class="h-full" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base { html, body { margin: 0; padding: 0; } body { overscroll-behavior: none; } main > :first-child { margin-top: 0 !important; } main > :last-child { margin-bottom: 0 !important; } } ::-webkit-scrollbar { display: none; }</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "secondary-fixed-dim": "#bec6e0", "on-tertiary-fixed": "#002113", "surface-tint": "#4059aa", "on-error-container": "#93000a", "secondary": "#565e74", "tertiary": "#00311f", "surface-bright": "#f7f9fb", "on-surface-variant": "#444651", "surface-container-low": "#f2f4f6", "on-tertiary-fixed-variant": "#005236", "inverse-surface": "#2d3133", "on-primary-fixed": "#00164e", "on-error": "#ffffff", "on-secondary-fixed": "#131b2e", "surface": "#f7f9fb", "on-primary-fixed-variant": "#264191", "background": "#f7f9fb", "on-secondary": "#ffffff", "error-container": "#ffdad6", "primary": "#00236f", "tertiary-fixed-dim": "#4edea3", "outline": "#757682", "primary-container": "#1e3a8a", "primary-fixed": "#dce1ff", "on-primary": "#ffffff", "inverse-on-surface": "#eff1f3", "on-secondary-fixed-variant": "#3f465c", "on-surface": "#191c1e", "inverse-primary": "b6c4ff", "surface-container-highest": "#e0e3e5", "on-secondary-container": "#5c647a", "on-tertiary": "#ffffff", "tertiary-fixed": "#6ffbbe", "outline-variant": "#c5c5d3", "secondary-container": "#dae2fd", "tertiary-container": "#004a31", "on-background": "#191c1e", "surface-container": "#eceef0", "surface-container-high": "#e6e8ea", "primary-fixed-dim": "#b6c4ff", "surface-dim": "#d8dadc", "on-primary-container": "#90a8ff", "on-tertiary-container": "#27c38a", "secondary-fixed": "#dae2fd", "error": "#ba1a1a", "surface-container-lowest": "#ffffff", "surface-variant": "#e0e3e5" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "space-md": "0.75rem", "margin-md": "1.5rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter": "1rem", "margin-lg": "2rem", "gutter-lg": "1.5rem", "space-lg": "1rem", "margin": "1rem", "space-xl": "1.5rem" }, "fontFamily": { "headline-lg": [ "Plus Jakarta Sans" ], "label-md": [ "Manrope" ], "headline-xl-mobile": [ "Plus Jakarta Sans" ], "headline-xl": [ "Plus Jakarta Sans" ], "body-lg": [ "Manrope" ], "kpi-display": [ "Plus Jakarta Sans" ], "label-lg": [ "Manrope" ], "headline-md": [ "Plus Jakarta Sans" ], "headline-sm": [ "Plus Jakarta Sans" ], "body-sm": [ "Manrope" ], "body-md": [ "Manrope" ], "label-sm": [ "Manrope" ] }, "fontSize": { "headline-lg": [ "1.5rem", { "lineHeight": "2rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "label-md": [ "0.75rem", { "lineHeight": "1rem", "letterSpacing": "0.02em", "fontWeight": "600" } ], "headline-xl-mobile": [ "1.625rem", { "lineHeight": "2.125rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "headline-xl": [ "2rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.025em", "fontWeight": "700" } ], "body-lg": [ "1rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "400" } ], "kpi-display": [ "2.25rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.03em", "fontWeight": "700" } ], "label-lg": [ "0.875rem", { "lineHeight": "1.25rem", "letterSpacing": "0em", "fontWeight": "600" } ], "headline-md": [ "1.25rem", { "lineHeight": "1.75rem", "letterSpacing": "-0.015em", "fontWeight": "600" } ], "headline-sm": [ "1.125rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "body-sm": [ "0.75rem", { "lineHeight": "1.125rem", "letterSpacing": "0em", "fontWeight": "400" } ], "body-md": [ "0.875rem", { "lineHeight": "1.375rem", "letterSpacing": "-0.005em", "fontWeight": "400" } ], "label-sm": [ "0.6875rem", { "lineHeight": "0.875rem", "letterSpacing": "0.05em", "fontWeight": "700" } ] } } } };</script></head><body class="bg-background font-body-md text-body-md text-on-surface min-h-screen selection:bg-secondary-container selection:text-on-secondary-fixed"><header class="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant/30 z-50 flex items-center justify-between px-gutter lg:px-gutter-lg"><div class="flex items-center gap-space-lg"><div class="flex items-center gap-space-sm"><img alt="Hopepitome Enterprise Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1W5FyD-T-ETGrZeAB0rljmlF7OY6fBThr1Ap9xh8GGHTcmh8-wWpWMifJciY6zVEzisaMKsUZnvmpkKbeBcNIq1ZsngZQnEZQ_T1JvixPdKYnUXCMlGN92vsMcbzAGxYjR92GAQZcVLM81J5ZjXgzkuneudDCzLF-uc3wbixBLleDFADK0rnvKrTjvoIIyfofPk_jFx9eoE3rDwYM4v-f3AfL6pLkUZc9Qij1WxXUG3"/><span class="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">Hopepitome</span></div><span class="hidden xl:inline-flex items-center px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">OPERATIONS SUITE v2.4</span><div class="h-5 w-[1px] bg-outline-variant/40 hidden md:block"></div><nav class="hidden lg:flex items-center gap-space-md h-14" data-active-classes="text-primary font-semibold border-b-2 border-primary"><a aria-current="page" class="transition-colors px-space-xs py-4 flex items-center text-primary font-semibold border-b-2 border-primary" data-path="project-hub" href="#">Project Hub</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="customer-360" href="#">Customer 360 &amp; CRM</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="service-catalog-engine" href="#">Service Catalog</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="employee-directory" href="#">Employee &amp; Teams</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="commercial-quotations" href="#">Finance &amp; Billing</a></nav></div><div class="flex items-center gap-space-md"><div class="relative hidden sm:flex items-center"><span class="material-symbols-outlined absolute left-2.5 text-secondary text-[18px] pointer-events-none">search</span><input class="w-56 md:w-72 h-8.5 pl-8 pr-12 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all" placeholder="Search operations, projects, entities..." type="text"/><span class="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-[10px] border border-outline-variant/40 font-semibold">⌘K</span></div><div class="hidden md:flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-low border border-outline-variant/30"><span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span><span class="font-label-sm text-label-sm text-tertiary-container uppercase tracking-wider font-bold">PROD-LIVE</span></div><button class="relative p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span></button><div class="flex items-center gap-space-xs px-space-sm py-1 rounded border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors"><span class="font-label-md text-label-md font-semibold text-primary">Super Admin</span><span class="material-symbols-outlined text-[16px] text-secondary">arrow_drop_down</span></div><div class="flex items-center pl-space-xs"><img alt="Profile" class="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6rQP5t0iQXNKmdqrkeUcpH0hED2b4H64XZpZiX8msqz4UzuKMrIudPxiAv4ISfLNnbNYhaT_qC8XA6tFKp2_Hy_yWvTRTppPTOF-yoa6OBnCmTp8t-YPbaf91nwuf3w9xg9Q7Jw9vIs2rlDYjfNjKePwevFgm7YwHBhbEWCItEqNumsCZAEKOGLgtVh0Xses4RbYKd4aeo5PDcz7uQRJ_rJlxatuqFINqrkHkHg0"/></div></div></header><aside class="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-40 flex flex-col justify-between overflow-y-auto"><div class="p-space-md"><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">DELIVERY &amp; PROJECTS</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a aria-current="page" class="flex items-center gap-space-sm px-space-sm py-1.5 rounded transition-colors bg-primary-container text-on-primary font-semibold" data-path="project-hub" href="#"><span class="material-symbols-outlined text-[18px]">view_kanban</span><span>Project Management &amp; Board</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="service-catalog-engine" href="#"><span class="material-symbols-outlined text-[18px]">category</span><span>Service Catalogue Engine</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="customer-360" href="#"><span class="material-symbols-outlined text-[18px]">contact_page</span><span>Customer 360 Directory</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="staff-task-board" href="#"><span class="material-symbols-outlined text-[18px]">assignment_ind</span><span>Staff Task Board</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="deliverables-vault" href="#"><span class="material-symbols-outlined text-[18px]">inventory_2</span><span>Deliverables Vault</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="career-work-orders" href="#"><span class="material-symbols-outlined text-[18px]">engineering</span><span>Career Work Orders</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sla-support" href="#"><span class="material-symbols-outlined text-[18px]">verified</span><span>SLA Support &amp; Maintenance</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="audit-trail" href="#"><span class="material-symbols-outlined text-[18px]">policy</span><span>Audit Trail &amp; Logs</span></a></nav></div><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">CRM &amp; SALES</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="crm-overview" href="#"><span class="material-symbols-outlined text-[18px]">query_stats</span><span>CRM Overview</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="leads-inbox" href="#"><span class="material-symbols-outlined text-[18px]">move_to_inbox</span><span>Leads Inbox</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-pipeline" href="#"><span class="material-symbols-outlined text-[18px]">timeline</span><span>Sales Pipeline</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="commercial-quotations" href="#"><span class="material-symbols-outlined text-[18px]">request_quote</span><span>Commercial Quotations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="consultations" href="#"><span class="material-symbols-outlined text-[18px]">forum</span><span>Consultations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-analytics" href="#"><span class="material-symbols-outlined text-[18px]">bar_chart</span><span>Sales Analytics</span></a></nav></div><div class="mb-space-md"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">TEAM &amp; ORG</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="employee-directory" href="#"><span class="material-symbols-outlined text-[18px]">badge</span><span>Employee Directory</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="roles-permissions" href="#"><span class="material-symbols-outlined text-[18px]">admin_panel_settings</span><span>Roles &amp; Permissions</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="departments" href="#"><span class="material-symbols-outlined text-[18px]">corporate_fare</span><span>Departments</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="activity-logs" href="#"><span class="material-symbols-outlined text-[18px]">history</span><span>Activity Logs</span></a></nav></div></div><div class="p-space-md border-t border-outline-variant/30 bg-surface-container-low/40"><div class="mb-space-sm"><div class="flex justify-between items-center mb-1"><span class="font-label-sm text-label-sm text-secondary">Enterprise Cluster</span><span class="font-label-sm text-label-sm font-semibold text-primary">92.4%</span></div><div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden"><div class="bg-primary-container h-full rounded-full" style="width: 92.4%"></div></div><div class="flex justify-between text-[11px] text-secondary mt-1 font-body-sm"><span>Storage: 4.6TB / 5.0TB</span><span class="text-tertiary-container font-semibold">Optimal</span></div></div><a class="flex items-center justify-between px-space-sm py-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#"><span class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">help_outline</span>Documentation &amp; Support</span><span class="material-symbols-outlined text-[16px]">north_east</span></a></div></aside><div class="pl-64"><main class="w-full pt-14 bg-background min-h-screen"><div class="flex flex-col w-full">
<!-- Top Ambient Banner & Header Ribbon -->
<div class="px-gutter lg:px-gutter-lg pt-6 pb-4 bg-surface-container-lowest shadow-sm">
<div class="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
<div class="space-y-1.5 max-w-4xl">
<div class="flex items-center gap-space-sm flex-wrap">
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-sm">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
            DELIVERY ENGINE
          </span>
<span class="text-secondary font-label-md text-label-md tracking-normal">•</span>
<span class="text-secondary font-label-sm text-label-sm uppercase tracking-wider font-medium">Enterprise Multi-Division Operations</span>
</div>
<h1 class="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">Project Management &amp; Execution Hub</h1>
<p class="font-body-md text-body-md text-on-surface-variant max-w-3xl leading-relaxed">
          Track multi-division IT solutions, enterprise deliverables, real-time milestone progress, resource allocations, and critical path UAT sign-offs with precision observability.
        </p>
</div>
<!-- Action Group -->
<div class="flex items-center gap-space-sm self-start xl:self-center flex-wrap">
<!-- View Switcher -->
<div class="inline-flex p-1 bg-surface-container rounded-lg shadow-sm">
<button class="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container-lowest text-primary font-label-md text-label-md font-bold shadow-sm" type="button">
<span class="material-symbols-outlined text-[16px]">view_list</span>
<span>Table View</span>
</button>
<button class="flex items-center gap-1 px-3 py-1.5 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">
<span class="material-symbols-outlined text-[16px]">view_kanban</span>
<span>Board</span>
</button>
<button class="flex items-center gap-1 px-3 py-1.5 rounded text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">
<span class="material-symbols-outlined text-[16px]">waterfall_chart</span>
<span>Gantt</span>
</button>
</div>
<button class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all shadow-sm" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary">download</span>
<span>Export Report</span>
</button>
<button class="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:bg-primary transition-all shadow-md" onclick="document.getElementById('createProjectModal').classList.toggle('hidden')" type="button">
<span class="material-symbols-outlined text-[18px]">add</span>
<span>Create Project</span>
</button>
</div>
</div>
</div>
<!-- KPI Metric Band -->
<div class="px-gutter lg:px-gutter-lg py-6">
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
<!-- Card 1 -->
<div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Total Active Projects</span>
<span class="w-2 h-2 rounded-full bg-primary-container"></span>
</div>
<div class="flex items-baseline justify-between">
<span class="font-kpi-display text-kpi-display text-on-surface font-bold">28</span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[14px]">trending_up</span>
            +4 this mo
          </span>
</div>
<div class="mt-4 flex items-center justify-between text-body-sm font-body-sm text-secondary">
<span>Capacity Threshold</span>
<span class="text-on-surface font-semibold">100% Optimized</span>
</div>
<div class="mt-1.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 100%"></div>
</div>
</div>
<!-- Card 2 -->
<div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">In Active Delivery</span>
<span class="inline-flex items-center px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">Live Sprint</span>
</div>
<div class="flex items-baseline justify-between">
<span class="font-kpi-display text-kpi-display text-on-surface font-bold">19</span>
<div class="flex items-center gap-1 text-on-secondary-container text-body-sm font-body-sm">
<span class="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<span>4 in Critical Path</span>
</div>
</div>
<!-- Sparkline Vector -->
<div class="mt-4 flex items-center justify-between">
<svg class="w-28 h-6 text-primary-container" fill="none" viewbox="0 0 100 24">
<path d="M0 20 L20 16 L40 19 L60 8 L80 12 L100 4" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></path>
</svg>
<span class="font-label-sm text-label-sm text-tertiary-container font-bold">92% On-Target</span>
</div>
</div>
<!-- Card 3 -->
<div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Handed Over &amp; UAT</span>
<span class="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
</div>
<div class="flex items-baseline justify-between">
<span class="font-kpi-display text-kpi-display text-on-surface font-bold">8</span>
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[14px]">check_circle</span>
            Sign-Off Complete
          </span>
</div>
<div class="mt-4 flex items-center justify-between text-body-sm font-body-sm text-secondary">
<span>Client CSAT Score</span>
<span class="text-tertiary-container font-bold">99.4% CSAT</span>
</div>
<div class="mt-1.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-tertiary-container h-full rounded-full" style="width: 99.4%"></div>
</div>
</div>
<!-- Card 4 -->
<div class="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div class="flex items-center justify-between mb-2">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Total Delivery Value</span>
<span class="material-symbols-outlined text-[18px] text-tertiary-container">payments</span>
</div>
<div class="flex items-baseline justify-between">
<span class="font-kpi-display text-kpi-display text-primary font-bold">$1.42M</span>
<span class="font-label-sm text-label-sm text-tertiary-container font-bold">+18.2% QoQ</span>
</div>
<div class="mt-4 flex items-center justify-between text-body-sm font-body-sm text-secondary">
<span>Pipeline In-Flight</span>
<span class="text-on-surface font-medium">$840k Scheduled Q4</span>
</div>
<div class="mt-1.5 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 74%"></div>
</div>
</div>
</div>
</div>
<!-- Main Workstation Canvas -->
<div class="px-gutter lg:px-gutter-lg pb-12 flex flex-col gap-space-lg">
<!-- Division Segmentation & Instant Filter Bar -->
<div class="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<!-- Division Switch Pills -->
<div class="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
<button class="px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold shrink-0 shadow-sm" type="button">
          All Divisions (28)
        </button>
<button class="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md shrink-0 transition-colors" type="button">
          IT Services &amp; Cloud (14)
        </button>
<button class="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md shrink-0 transition-colors" type="button">
          Enterprise Software (9)
        </button>
<button class="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-label-md text-label-md shrink-0 transition-colors" type="button">
          Career Services (5)
        </button>
</div>
<!-- Search & Filters -->
<div class="flex items-center gap-space-sm flex-wrap">
<div class="relative flex items-center min-w-[240px]">
<span class="material-symbols-outlined absolute left-3 text-secondary text-[18px]">search</span>
<input class="w-full h-9 pl-9 pr-8 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest transition-all" id="projectSearchInput" placeholder="Filter by project, client, or lead..." type="text"/>
<button class="absolute right-2 text-secondary hover:text-on-surface" onclick="document.getElementById('projectSearchInput').value=''" type="button">
<span class="material-symbols-outlined text-[16px]">close</span>
</button>
</div>
<div class="flex items-center gap-1">
<button class="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1" type="button">
<span>Status</span>
<span class="material-symbols-outlined text-[14px]">expand_more</span>
</button>
<button class="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1" type="button">
<span>Risk Level</span>
<span class="material-symbols-outlined text-[14px]">expand_more</span>
</button>
</div>
<!-- Quick Tags -->
<div class="hidden sm:flex items-center gap-1.5 pl-2">
<span class="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold cursor-pointer hover:opacity-85">Blocked</span>
<span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-semibold cursor-pointer hover:opacity-85">High Priority</span>
</div>
</div>
</div>
<!-- Enterprise Project Data Table -->
<div class="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden">
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-3 px-4 font-bold">Project Name &amp; Client</th>
<th class="py-3 px-4 font-bold">Lead &amp; Team</th>
<th class="py-3 px-4 font-bold min-w-[200px]">Milestone &amp; Completion</th>
<th class="py-3 px-4 font-bold">Health Status</th>
<th class="py-3 px-4 font-bold">SLA Due Date</th>
<th class="py-3 px-4 font-bold">Value (USD)</th>
<th class="py-3 px-4 font-bold text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-low font-body-md text-body-md text-on-surface">
<!-- Row 1: CloudScale Hybrid Migration -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-headline-sm shadow-sm">
                    C
                  </div>
<div>
<div class="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-primary-container transition-colors flex items-center gap-1.5">
<span>CloudScale Hybrid Migration</span>
<span class="material-symbols-outlined text-[16px] text-tertiary-container">verified</span>
</div>
<div class="flex items-center gap-2 mt-0.5 text-body-sm font-body-sm text-secondary">
<span class="font-semibold text-on-surface">Apex Global Corp</span>
<span>•</span>
<span class="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">IT Services &amp; Cloud</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover shadow-sm" data-alt="Headshot of Sarah Jenkins in professional attire smiling in an executive corporate office setting with natural soft cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASUzB43dliXRkK1JmACv3bbWX05IbfdKhbb_9LbqPevn0m3Ut3KngDLn8eSHiJ1b5muImR_qivSQ8cIVQeoywgjrfpu-byrPZWF3bUsKsjeGZzIkrI2g5aCQ4sQopTicbiZxwP9qGJS4t4-RbpdJvi-rB-VSIuswCnYzTFrawsBskpYpzzn0ebkl74k4YCQ5eh4FFP3UJ2OlUw_zUXMb-LRny7vWPOxE2XpmXDIhg"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Sarah Jenkins</div>
<div class="text-body-sm font-body-sm text-secondary">Cloud Architect (3 devs)</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="space-y-1">
<div class="flex items-center justify-between text-body-sm font-body-sm">
<span class="font-semibold text-primary">Phase 4: Data Validation</span>
<span class="font-bold text-on-surface">82%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-tertiary-container h-full rounded-full transition-all duration-500" style="width: 82%"></div>
</div>
<div class="text-label-sm font-label-sm text-secondary flex items-center gap-1">
<span class="material-symbols-outlined text-[13px] text-tertiary-container">check</span>
<span>14 of 17 sprints completed</span>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm font-bold shadow-sm">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
                  On Track
                </span>
</td>
<td class="py-3.5 px-4 font-body-sm text-body-sm">
<div class="font-semibold text-on-surface">Nov 28, 2025</div>
<div class="text-secondary text-[11px]">In 22 days</div>
</td>
<td class="py-3.5 px-4">
<span class="font-headline-sm text-headline-sm font-bold text-primary">$340,000</span>
</td>
<td class="py-3.5 px-4 text-right">
<div class="flex items-center justify-end gap-1">
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" onclick="document.getElementById('quickPreviewDrawer').classList.remove('translate-x-full')" title="Inspect Deliverables" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" title="Manage Config" type="button">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>
<!-- Row 2: NextGen FinTech Core Banking API -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-lg bg-surface-container-highest text-primary font-bold text-headline-sm flex items-center justify-center shadow-sm">
                    M
                  </div>
<div>
<div class="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-primary-container transition-colors">
                      NextGen FinTech Core Banking API
                    </div>
<div class="flex items-center gap-2 mt-0.5 text-body-sm font-body-sm text-secondary">
<span class="font-semibold text-on-surface">Moneta Financial Ltd</span>
<span>•</span>
<span class="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Enterprise Software</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover shadow-sm" data-alt="Corporate portrait of David Chen, lead systems engineer in dark blue collared shirt with tech headquarters background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT7f11KIXBatxNoYvY1hwXz-GNp-Avq_zpMsoIGlt_Sx3CCasNOLdx-Fe9tOxwiq1sBW6gXcFRC574POVdS8VJ9HJB6JEd8Q48e4itX21xaMAj0iCGhut3IUCdeIDmZHbkYyHo0V2yE-_kbIJIcvFbcOhJWvUrGAxxtIn0KPUx6D7PPQJDXoJjDTaQf41NX0kduMlij64IX0U09YFv78GRhKCkgXxgM2HysEQwZg8"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">David Chen</div>
<div class="text-body-sm font-body-sm text-secondary">Principal Dev (6 devs)</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="space-y-1">
<div class="flex items-center justify-between text-body-sm font-body-sm">
<span class="font-semibold text-on-surface">Phase 3: Integration Tests</span>
<span class="font-bold text-on-surface">64%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full transition-all duration-500" style="width: 64%"></div>
</div>
<div class="text-label-sm font-label-sm text-secondary flex items-center gap-1">
<span class="material-symbols-outlined text-[13px] text-primary-container">sync</span>
<span>18 of 28 endpoints verified</span>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-bold shadow-sm">
<span class="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                  In Review
                </span>
</td>
<td class="py-3.5 px-4 font-body-sm text-body-sm">
<div class="font-semibold text-on-surface">Dec 15, 2025</div>
<div class="text-secondary text-[11px]">In 39 days</div>
</td>
<td class="py-3.5 px-4">
<span class="font-headline-sm text-headline-sm font-bold text-primary">$520,000</span>
</td>
<td class="py-3.5 px-4 text-right">
<div class="flex items-center justify-end gap-1">
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" onclick="document.getElementById('quickPreviewDrawer').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>
<!-- Row 3: AI Workforce Upskilling & Talent Pipeline -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-lg bg-surface-container text-primary font-bold text-headline-sm flex items-center justify-center shadow-sm">
                    H
                  </div>
<div>
<div class="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-primary-container transition-colors">
                      AI Workforce Upskilling &amp; Talent Pipeline
                    </div>
<div class="flex items-center gap-2 mt-0.5 text-body-sm font-body-sm text-secondary">
<span class="font-semibold text-on-surface">Horizon Media</span>
<span>•</span>
<span class="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Career Services</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover shadow-sm" data-alt="Elena Rostova smiling confident professional female executive portrait against modern minimalist architectural glass backdrop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVc-8YUX-PzJHJ5tdY0saORluys-QEJKho7zA0QcYRmFVBq4IRYKEBszywlEKNQaQIrGavzLSZ22IFdQtdgAaPEv6-n3Q02I3U5EKz3qNGKywl-aTKel1ZLE7ZFuqvlmHkFjIqxGSjzrawonJggu6VTAHEkCUyBGntafKxlH0QCY-3rv3_T_ZXrozJR0sVRWwWy-dZ-xM-b0lOiduhChvwz6wcN0VH7AE3YUjbRNs"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Elena Rostova</div>
<div class="text-body-sm font-body-sm text-secondary">Lead Educator (2 leads)</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="space-y-1">
<div class="flex items-center justify-between text-body-sm font-body-sm">
<span class="font-semibold text-tertiary-container">Phase 5: Final Graduation</span>
<span class="font-bold text-tertiary-container">95%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-tertiary-container h-full rounded-full transition-all duration-500" style="width: 95%"></div>
</div>
<div class="text-label-sm font-label-sm text-secondary flex items-center gap-1">
<span class="material-symbols-outlined text-[13px] text-tertiary-container">done_all</span>
<span>140 of 145 engineers placed</span>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold shadow-sm">
<span class="material-symbols-outlined text-[13px]">assignment_turned_in</span>
                  UAT Sign-Off
                </span>
</td>
<td class="py-3.5 px-4 font-body-sm text-body-sm">
<div class="font-semibold text-on-surface">Nov 10, 2025</div>
<div class="text-tertiary-container text-[11px] font-bold">In 4 days (Urgent)</div>
</td>
<td class="py-3.5 px-4">
<span class="font-headline-sm text-headline-sm font-bold text-primary">$185,000</span>
</td>
<td class="py-3.5 px-4 text-right">
<div class="flex items-center justify-end gap-1">
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" onclick="document.getElementById('quickPreviewDrawer').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>
<!-- Row 4: Zero-Trust Security & Compliance Audit -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-lg bg-surface-container-highest text-primary font-bold text-headline-sm flex items-center justify-center shadow-sm">
                    V
                  </div>
<div>
<div class="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-primary-container transition-colors flex items-center gap-1.5">
<span>Zero-Trust Security &amp; Compliance Audit</span>
<span class="px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-label-sm text-[10px] font-extrabold uppercase">Audit Priority</span>
</div>
<div class="flex items-center gap-2 mt-0.5 text-body-sm font-body-sm text-secondary">
<span class="font-semibold text-on-surface">Vantage Health System</span>
<span>•</span>
<span class="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">IT Services &amp; Cloud</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover shadow-sm" data-alt="Marcus Vance, senior cybersecurity compliance manager, professional studio portrait, sharp rim lighting and charcoal suit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhbd95eaxzNZqO8-jJsoR8mpkjBETnwxk3Vs_2yKdwjJXwmrb0jOX-YHz9_Mspqp5AOg7mGy4WI2lw0XdQEiqmHkQNdkQegO0CqmSJToLf8OnHZWaonj0oW8epymw4vMp8IIlQE_Il6ZpC4v5qLaYhsd4lY1IBAfF8tjnzVc8mPFwuhF9zgr-pLgUbbT8bAwSqzF1PzdFc9JercPrHLsOFTu0YTztAYggtXGcAoxw"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Marcus Vance</div>
<div class="text-body-sm font-body-sm text-secondary">SecOps Lead (4 analysts)</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="space-y-1">
<div class="flex items-center justify-between text-body-sm font-body-sm">
<span class="font-semibold text-error">Phase 2: HIPAA Remediation</span>
<span class="font-bold text-error">41%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-error h-full rounded-full transition-all duration-500" style="width: 41%"></div>
</div>
<div class="text-label-sm font-label-sm text-error flex items-center gap-1">
<span class="material-symbols-outlined text-[13px]">warning</span>
<span>3 critical vulnerabilities flagged</span>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold shadow-sm">
<span class="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
                  At Risk
                </span>
</td>
<td class="py-3.5 px-4 font-body-sm text-body-sm">
<div class="font-semibold text-on-surface">Dec 04, 2025</div>
<div class="text-error text-[11px] font-semibold">12 days delay flagged</div>
</td>
<td class="py-3.5 px-4">
<span class="font-headline-sm text-headline-sm font-bold text-primary">$210,000</span>
</td>
<td class="py-3.5 px-4 text-right">
<div class="flex items-center justify-end gap-1">
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" onclick="document.getElementById('quickPreviewDrawer').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>
<!-- Row 5: Omnichannel Logistics Portal v2 -->
<tr class="hover:bg-surface-container-low/50 transition-colors group">
<td class="py-3.5 px-4">
<div class="flex items-center gap-3">
<div class="w-9 h-9 rounded-lg bg-surface-container-highest text-primary font-bold text-headline-sm flex items-center justify-center shadow-sm">
                    S
                  </div>
<div>
<div class="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-primary-container transition-colors">
                      Omnichannel Logistics Portal v2
                    </div>
<div class="flex items-center gap-2 mt-0.5 text-body-sm font-body-sm text-secondary">
<span class="font-semibold text-on-surface">SwiftFreight Ltd</span>
<span>•</span>
<span class="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Enterprise Software</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover shadow-sm" data-alt="Rachel Adams, technical project manager with architectural blue plans background, sharp executive corporate portrait lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx9QCSfP7Cd9FkZHp-QdapIR3pnZqhzRUDt5y9NzAJFecyS2JwgdQ2w7wX4hyA0djq4PyeGSHYF-G0Mhi6AG7uobXCJdOGtK9cRhJchAvSZoTCpzp8Ikbs23pq12y_0KAQODrR19yDUsdaY2WQZeeTZsAnNMj07MRMkdgOrLRTGGd56vn2ylFyIRmYaSfIaMRRYpES8mGG9es1-lWf_swq7GWP0BOdHsfloFeIqfM"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Rachel Adams</div>
<div class="text-body-sm font-body-sm text-secondary">Sprint Lead (5 devs)</div>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<div class="space-y-1">
<div class="flex items-center justify-between text-body-sm font-body-sm">
<span class="font-semibold text-on-surface">Phase 1: Architecture Blueprint</span>
<span class="font-bold text-on-surface">30%</span>
</div>
<div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full transition-all duration-500" style="width: 30%"></div>
</div>
<div class="text-label-sm font-label-sm text-secondary flex items-center gap-1">
<span class="material-symbols-outlined text-[13px] text-tertiary-container">schedule</span>
<span>Sprint 2 of 12 underway</span>
</div>
</div>
</td>
<td class="py-3.5 px-4">
<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm font-bold shadow-sm">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
                  On Track
                </span>
</td>
<td class="py-3.5 px-4 font-body-sm text-body-sm">
<div class="font-semibold text-on-surface">Jan 22, 2026</div>
<div class="text-secondary text-[11px]">Q1 Kickoff</div>
</td>
<td class="py-3.5 px-4">
<span class="font-headline-sm text-headline-sm font-bold text-primary">$165,000</span>
</td>
<td class="py-3.5 px-4 text-right">
<div class="flex items-center justify-end gap-1">
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" onclick="document.getElementById('quickPreviewDrawer').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">visibility</span>
</button>
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-primary transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination & Table Footer -->
<div class="p-space-md bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-space-md">
<div class="flex items-center gap-space-md text-body-sm font-body-sm text-secondary">
<span>Showing <strong class="text-on-surface">1 - 5</strong> of <strong class="text-on-surface">28</strong> active enterprise deliveries</span>
<div class="hidden sm:flex items-center gap-2">
<span>Rows per page:</span>
<select class="h-7 px-2 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none">
<option>5</option>
<option>10</option>
<option>25</option>
<option>50</option>
</select>
</div>
</div>
<div class="flex items-center gap-1">
<button class="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors disabled:opacity-40" disabled="" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button class="w-7 h-7 rounded bg-primary-container text-on-primary font-label-md text-label-md font-bold" type="button">1</button>
<button class="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant font-label-md text-label-md transition-colors" type="button">2</button>
<button class="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant font-label-md text-label-md transition-colors" type="button">3</button>
<span class="px-1 text-secondary">...</span>
<button class="w-7 h-7 rounded hover:bg-surface-container text-on-surface-variant font-label-md text-label-md transition-colors" type="button">6</button>
<button class="p-1.5 rounded bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
<!-- Interactive Slide-over Drawer for Project Preview (Level 3 Context) -->
<div class="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-surface-container-lowest shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col" id="quickPreviewDrawer">
<div class="p-space-lg bg-surface-container-low flex items-center justify-between">
<div class="space-y-0.5">
<span class="px-2 py-0.5 rounded bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">PROJECT INSPECTOR</span>
<h3 class="font-headline-md text-headline-md text-primary font-bold">CloudScale Hybrid Migration</h3>
</div>
<button class="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface" onclick="document.getElementById('quickPreviewDrawer').classList.add('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<div class="p-space-lg overflow-y-auto flex-1 space-y-space-lg">
<!-- Client Card -->
<div class="p-space-md rounded-xl bg-surface-container-low space-y-2">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Client Overview</span>
<span class="font-label-sm text-label-sm text-primary font-bold">Apex Global Corp</span>
</div>
<p class="font-body-sm text-body-sm text-on-surface-variant">Multi-region financial infrastructure transition onto AWS &amp; Azure hybrid sovereign clouds.</p>
<div class="flex items-center gap-2 pt-1">
<span class="px-2 py-0.5 rounded bg-surface-container-lowest font-label-sm text-label-sm text-secondary font-medium">SLA Class: Tier 1 Mission Critical</span>
</div>
</div>
<!-- Milestone Deliverables Breakdown -->
<div class="space-y-space-sm">
<h4 class="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Active Sprints &amp; Deliverables</h4>
<div class="p-3 rounded-lg bg-surface-container-lowest shadow-sm space-y-2">
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md font-bold text-on-surface">1. VPC Peering &amp; DirectConnect</span>
<span class="px-2 py-0.5 rounded bg-tertiary-container text-tertiary-fixed font-label-sm text-label-sm font-bold">Completed</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-tertiary-container h-full rounded-full" style="width: 100%"></div>
</div>
</div>
<div class="p-3 rounded-lg bg-surface-container-lowest shadow-sm space-y-2">
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md font-bold text-on-surface">2. Oracle DB Zero-Downtime Replication</span>
<span class="px-2 py-0.5 rounded bg-secondary-container text-primary font-label-sm text-label-sm font-bold">90% UAT</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 90%"></div>
</div>
</div>
<div class="p-3 rounded-lg bg-surface-container-lowest shadow-sm space-y-2">
<div class="flex items-center justify-between">
<span class="font-body-md text-body-md font-bold text-on-surface">3. ISO 27001 Security Hardening</span>
<span class="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold">Scheduled Nov 18</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-secondary h-full rounded-full" style="width: 25%"></div>
</div>
</div>
</div>
<!-- Allocated Personnel -->
<div class="space-y-space-sm">
<h4 class="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">Assigned Engineers</h4>
<div class="flex items-center gap-3">
<div class="flex -space-x-2 overflow-hidden">
<img class="inline-block h-8 w-8 rounded-full shadow-sm" data-alt="Staff software architect headshot in office lighting with navy sweater" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBckXC3Oc-ScHOmr-yBCv1ZVlRsbPg3SNxlsSb8JDdJ8XwnqjbEF9GXSEqvX_f7qvfkdlvtQFXPbI2LolR-L3t9NqdMY7yicfOiMeaUW9MwcxS2eijoHFF6y-9thQmWep1ByPUN4v7ZtJk0zSBh-21WwrsU5cUUYYLK5DWjgwx-cFTl9BwkDBuN78Mbm3WkmggUpcn2dgmmhCEgPSrZIfKE7PIS9SxiY-nCtyyt9ZQ"/>
<img class="inline-block h-8 w-8 rounded-full shadow-sm" data-alt="Database administrator engineer smiling in modern enterprise datacenter hallway" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARtfq95_gTpp1Wtyg7KZ-gEXcmYiW3PDVC5GNNiJum0UC8AZgAnc7kUc1MCXCJMRnR1xn1q88PbHjAJ_g1WQLvtm5PiDS2CKAvG5LyhAke7BFVaOdHztL_nw88rBhDRsgonLxP5gDljtyYV35EVmdCzuWtHxcSawV3NVPhHI6c6mhsHc7SzYIeM9xqhCds3f_MZ3qapj-mYx-FPHphJ9U7OntYmoHJ_dFD8qP4C4I"/>
<img class="inline-block h-8 w-8 rounded-full shadow-sm" data-alt="Female cloud DevOps engineer working at terminal desk with natural rim lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHjjjcMDzVsKXPlAyBxn51UKMMUmn6RZuiYVxSkEayF0sh4ItIgJ7eo67OPgB-69nJ3g5mqdCBHVTqA9ph_UQ0xDtRHnygqLRfkH8tBrg6GMUqHIauiteMOnTDPxiibE8EmexCS2ft0ufPWgSu7ljbP799OYr6oIc_p8Gi2-WS5DQH_C313nTX7tkvnWMIWBQZlCtDOHMwOBLWYSzmnRUzyVE8Pp4SnaOW2ATPUwY"/>
</div>
<span class="text-body-sm font-body-sm text-secondary font-medium">+2 External Contractors Assigned</span>
</div>
</div>
</div>
<div class="p-space-md bg-surface-container-low flex items-center justify-between gap-2">
<button class="w-1/2 py-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md font-bold shadow-sm transition-colors" type="button">
        Full Audit Logs
      </button>
<button class="w-1/2 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:bg-primary shadow-sm transition-colors" type="button">
        Launch Project Board
      </button>
</div>
</div>
<!-- Create Project Modal Dialog (Level 3 Context) -->
<div class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm" id="createProjectModal">
<div class="w-full max-w-xl bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
<div class="p-space-lg bg-surface-container-low flex items-center justify-between">
<div>
<span class="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">NEW DELIVERY INITIATIVE</span>
<h2 class="font-headline-md text-headline-md text-primary font-bold">Create Enterprise Project</h2>
</div>
<button class="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface" onclick="document.getElementById('createProjectModal').classList.add('hidden')" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<form class="p-space-lg space-y-space-md" onsubmit="event.preventDefault(); document.getElementById('createProjectModal').classList.add('hidden');">
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Project Title</label>
<input class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" placeholder="e.g. Sovereign AI Infrastructure Rollout" required="" type="text"/>
</div>
<div class="grid grid-cols-2 gap-space-md">
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Operating Division</label>
<select class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none">
<option>IT Services &amp; Cloud</option>
<option>Enterprise Software</option>
<option>Career Services</option>
</select>
</div>
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Client Entity</label>
<input class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" placeholder="e.g. Apex Global Corp" required="" type="text"/>
</div>
</div>
<div class="grid grid-cols-2 gap-space-md">
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Contract Valuation ($)</label>
<input class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" placeholder="250000" type="number"/>
</div>
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Target SLA Date</label>
<input class="w-full h-9 px-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none" type="date"/>
</div>
</div>
<div class="pt-2 flex items-center justify-end gap-space-sm">
<button class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onclick="document.getElementById('createProjectModal').classList.add('hidden')" type="button">
            Cancel
          </button>
<button class="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold hover:bg-primary transition-colors shadow-md" type="submit">
            Initialize Project
          </button>
</div>
</form>
</div>
</div>
</div></main></div></body></html>
```


### 14.2. Staff Operations & Task Board

```html
<!DOCTYPE html>

<html class="h-full" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base { html, body { margin: 0; padding: 0; } body { overscroll-behavior: none; } main > :first-child { margin-top: 0 !important; } main > :last-child { margin-bottom: 0 !important; } } ::-webkit-scrollbar { display: none; }</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "secondary-fixed-dim": "#bec6e0", "on-tertiary-fixed": "#002113", "surface-tint": "#4059aa", "on-error-container": "#93000a", "secondary": "#565e74", "tertiary": "#00311f", "surface-bright": "#f7f9fb", "on-surface-variant": "#444651", "surface-container-low": "#f2f4f6", "on-tertiary-fixed-variant": "#005236", "inverse-surface": "#2d3133", "on-primary-fixed": "#00164e", "on-error": "#ffffff", "on-secondary-fixed": "#131b2e", "surface": "#f7f9fb", "on-primary-fixed-variant": "#264191", "background": "#f7f9fb", "on-secondary": "#ffffff", "error-container": "#ffdad6", "primary": "#00236f", "tertiary-fixed-dim": "#4edea3", "outline": "#757682", "primary-container": "#1e3a8a", "primary-fixed": "#dce1ff", "on-primary": "#ffffff", "inverse-on-surface": "#eff1f3", "on-secondary-fixed-variant": "#3f465c", "on-surface": "#191c1e", "inverse-primary": "b6c4ff", "surface-container-highest": "#e0e3e5", "on-secondary-container": "#5c647a", "on-tertiary": "#ffffff", "tertiary-fixed": "#6ffbbe", "outline-variant": "#c5c5d3", "secondary-container": "#dae2fd", "tertiary-container": "#004a31", "on-background": "#191c1e", "surface-container": "#eceef0", "surface-container-high": "#e6e8ea", "primary-fixed-dim": "#b6c4ff", "surface-dim": "#d8dadc", "on-primary-container": "#90a8ff", "on-tertiary-container": "#27c38a", "secondary-fixed": "#dae2fd", "error": "#ba1a1a", "surface-container-lowest": "#ffffff", "surface-variant": "#e0e3e5" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "space-md": "0.75rem", "margin-md": "1.5rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter": "1rem", "margin-lg": "2rem", "gutter-lg": "1.5rem", "space-lg": "1rem", "margin": "1rem", "space-xl": "1.5rem" }, "fontFamily": { "headline-lg": [ "Plus Jakarta Sans" ], "label-md": [ "Manrope" ], "headline-xl-mobile": [ "Plus Jakarta Sans" ], "headline-xl": [ "Plus Jakarta Sans" ], "body-lg": [ "Manrope" ], "kpi-display": [ "Plus Jakarta Sans" ], "label-lg": [ "Manrope" ], "headline-md": [ "Plus Jakarta Sans" ], "headline-sm": [ "Plus Jakarta Sans" ], "body-sm": [ "Manrope" ], "body-md": [ "Manrope" ], "label-sm": [ "Manrope" ] }, "fontSize": { "headline-lg": [ "1.5rem", { "lineHeight": "2rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "label-md": [ "0.75rem", { "lineHeight": "1rem", "letterSpacing": "0.02em", "fontWeight": "600" } ], "headline-xl-mobile": [ "1.625rem", { "lineHeight": "2.125rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "headline-xl": [ "2rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.025em", "fontWeight": "700" } ], "body-lg": [ "1rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "400" } ], "kpi-display": [ "2.25rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.03em", "fontWeight": "700" } ], "label-lg": [ "0.875rem", { "lineHeight": "1.25rem", "letterSpacing": "0em", "fontWeight": "600" } ], "headline-md": [ "1.25rem", { "lineHeight": "1.75rem", "letterSpacing": "-0.015em", "fontWeight": "600" } ], "headline-sm": [ "1.125rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "body-sm": [ "0.75rem", { "lineHeight": "1.125rem", "letterSpacing": "0em", "fontWeight": "400" } ], "body-md": [ "0.875rem", { "lineHeight": "1.375rem", "letterSpacing": "-0.005em", "fontWeight": "400" } ], "label-sm": [ "0.6875rem", { "lineHeight": "0.875rem", "letterSpacing": "0.05em", "fontWeight": "700" } ] } } } };</script></head><body class="bg-background font-body-md text-body-md text-on-surface min-h-screen selection:bg-secondary-container selection:text-on-secondary-fixed"><header class="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant/30 z-50 flex items-center justify-between px-gutter lg:px-gutter-lg"><div class="flex items-center gap-space-lg"><div class="flex items-center gap-space-sm"><img alt="Hopepitome Enterprise Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1W5FyD-T-ETGrZeAB0rljmlF7OY6fBThr1Ap9xh8GGHTcmh8-wWpWMifJciY6zVEzisaMKsUZnvmpkKbeBcNIq1ZsngZQnEZQ_T1JvixPdKYnUXCMlGN92vsMcbzAGxYjR92GAQZcVLM81J5ZjXgzkuneudDCzLF-uc3wbixBLleDFADK0rnvKrTjvoIIyfofPk_jFx9eoE3rDwYM4v-f3AfL6pLkUZc9Qij1WxXUG3"/><span class="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">Hopepitome</span></div><span class="hidden xl:inline-flex items-center px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">OPERATIONS SUITE v2.4</span><div class="h-5 w-[1px] bg-outline-variant/40 hidden md:block"></div><nav class="hidden lg:flex items-center gap-space-md h-14" data-active-classes="text-primary font-semibold border-b-2 border-primary"><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="project-hub" href="#">Project Hub</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="customer-360" href="#">Customer 360 &amp; CRM</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="service-catalog-engine" href="#">Service Catalog</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="employee-directory" href="#">Employee &amp; Teams</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="commercial-quotations" href="#">Finance &amp; Billing</a></nav></div><div class="flex items-center gap-space-md"><div class="relative hidden sm:flex items-center"><span class="material-symbols-outlined absolute left-2.5 text-secondary text-[18px] pointer-events-none">search</span><input class="w-56 md:w-72 h-8.5 pl-8 pr-12 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all" placeholder="Search operations, projects, entities..." type="text"/><span class="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-[10px] border border-outline-variant/40 font-semibold">⌘K</span></div><div class="hidden md:flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-low border border-outline-variant/30"><span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span><span class="font-label-sm text-label-sm text-tertiary-container uppercase tracking-wider font-bold">PROD-LIVE</span></div><button class="relative p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span></button><div class="flex items-center gap-space-xs px-space-sm py-1 rounded border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors"><span class="font-label-md text-label-md font-semibold text-primary">Super Admin</span><span class="material-symbols-outlined text-[16px] text-secondary">arrow_drop_down</span></div><div class="flex items-center pl-space-xs"><img alt="Profile" class="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6rQP5t0iQXNKmdqrkeUcpH0hED2b4H64XZpZiX8msqz4UzuKMrIudPxiAv4ISfLNnbNYhaT_qC8XA6tFKp2_Hy_yWvTRTppPTOF-yoa6OBnCmTp8t-YPbaf91nwuf3w9xg9Q7Jw9vIs2rlDYjfNjKePwevFgm7YwHBhbEWCItEqNumsCZAEKOGLgtVh0Xses4RbYKd4aeo5PDcz7uQRJ_rJlxatuqFINqrkHkHg0"/></div></div></header><aside class="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-40 flex flex-col justify-between overflow-y-auto"><div class="p-space-md"><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">DELIVERY &amp; PROJECTS</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="project-hub" href="#"><span class="material-symbols-outlined text-[18px]">view_kanban</span><span>Project Management &amp; Board</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="service-catalog-engine" href="#"><span class="material-symbols-outlined text-[18px]">category</span><span>Service Catalogue Engine</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="customer-360" href="#"><span class="material-symbols-outlined text-[18px]">contact_page</span><span>Customer 360 Directory</span></a><a aria-current="page" class="flex items-center gap-space-sm px-space-sm py-1.5 rounded transition-colors bg-primary-container text-on-primary font-semibold" data-path="staff-task-board" href="#"><span class="material-symbols-outlined text-[18px]">assignment_ind</span><span>Staff Task Board</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="deliverables-vault" href="#"><span class="material-symbols-outlined text-[18px]">inventory_2</span><span>Deliverables Vault</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="career-work-orders" href="#"><span class="material-symbols-outlined text-[18px]">engineering</span><span>Career Work Orders</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sla-support" href="#"><span class="material-symbols-outlined text-[18px]">verified</span><span>SLA Support &amp; Maintenance</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="audit-trail" href="#"><span class="material-symbols-outlined text-[18px]">policy</span><span>Audit Trail &amp; Logs</span></a></nav></div><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">CRM &amp; SALES</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="crm-overview" href="#"><span class="material-symbols-outlined text-[18px]">query_stats</span><span>CRM Overview</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="leads-inbox" href="#"><span class="material-symbols-outlined text-[18px]">move_to_inbox</span><span>Leads Inbox</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-pipeline" href="#"><span class="material-symbols-outlined text-[18px]">timeline</span><span>Sales Pipeline</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="commercial-quotations" href="#"><span class="material-symbols-outlined text-[18px]">request_quote</span><span>Commercial Quotations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="consultations" href="#"><span class="material-symbols-outlined text-[18px]">forum</span><span>Consultations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-analytics" href="#"><span class="material-symbols-outlined text-[18px]">bar_chart</span><span>Sales Analytics</span></a></nav></div><div class="mb-space-md"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">TEAM &amp; ORG</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="employee-directory" href="#"><span class="material-symbols-outlined text-[18px]">badge</span><span>Employee Directory</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="roles-permissions" href="#"><span class="material-symbols-outlined text-[18px]">admin_panel_settings</span><span>Roles &amp; Permissions</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="departments" href="#"><span class="material-symbols-outlined text-[18px]">corporate_fare</span><span>Departments</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="activity-logs" href="#"><span class="material-symbols-outlined text-[18px]">history</span><span>Activity Logs</span></a></nav></div></div><div class="p-space-md border-t border-outline-variant/30 bg-surface-container-low/40"><div class="mb-space-sm"><div class="flex justify-between items-center mb-1"><span class="font-label-sm text-label-sm text-secondary">Enterprise Cluster</span><span class="font-label-sm text-label-sm font-semibold text-primary">92.4%</span></div><div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden"><div class="bg-primary-container h-full rounded-full" style="width: 92.4%"></div></div><div class="flex justify-between text-[11px] text-secondary mt-1 font-body-sm"><span>Storage: 4.6TB / 5.0TB</span><span class="text-tertiary-container font-semibold">Optimal</span></div></div><a class="flex items-center justify-between px-space-sm py-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#"><span class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">help_outline</span>Documentation &amp; Support</span><span class="material-symbols-outlined text-[16px]">north_east</span></a></div></aside><div class="pl-64"><main class="w-full pt-14 bg-background min-h-screen"><div class="flex flex-col w-full">
<!-- Top Command Ribbon & Header -->
<div class="w-full px-gutter lg:px-gutter-lg py-space-lg bg-surface-container-lowest shadow-sm">
<div class="flex flex-wrap items-center justify-between gap-space-md mb-space-sm">
<!-- Breadcrumbs -->
<nav class="flex items-center gap-2 font-label-md text-label-md text-secondary">
<span class="hover:text-on-surface cursor-pointer transition-colors">Operations</span>
<span class="material-symbols-outlined text-[14px]">chevron_right</span>
<span class="hover:text-on-surface cursor-pointer transition-colors">Delivery Engine</span>
<span class="material-symbols-outlined text-[14px]">chevron_right</span>
<span class="text-primary font-bold">Staff Task Board</span>
</nav>
<!-- Right Global Actions -->
<div class="flex items-center gap-space-sm">
<span class="inline-flex items-center gap-1.5 px-space-sm py-1 rounded bg-secondary-container/50 text-on-secondary-fixed font-label-sm text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
          Sprint Active: Day 6 / 14
        </span>
<button class="flex items-center gap-1.5 px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" type="button">
<span class="material-symbols-outlined text-[18px]">tune</span>
          Board Settings
        </button>
</div>
</div>
<!-- Title and Subtext + Primary Controls in Split Layout -->
<div class="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg">
<div class="max-w-3xl">
<h1 class="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
          Staff Operations &amp; Resource Board
        </h1>
<p class="font-body-md text-body-md text-secondary mt-1 max-w-2xl">
          Multi-disciplinary task distribution, sprint velocity, workload balancing, and SLA adherence across engineering and career delivery squads.
        </p>
</div>
<!-- Controls -->
<div class="flex flex-wrap items-center gap-space-sm">
<!-- Sprint Selector -->
<div class="relative">
<select class="h-9 pl-3 pr-8 rounded bg-surface-container-low text-on-surface font-label-md text-label-md appearance-none focus:outline-none focus:bg-surface-container-lowest cursor-pointer shadow-sm">
<option selected="">Sprint 44 - Enterprise Rollout</option>
<option>Sprint 43 - Financial Gateway Patch</option>
<option>Sprint 42 - Core Telemetry v3</option>
</select>
<span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-secondary pointer-events-none">arrow_drop_down</span>
</div>
<!-- Assignee Filter -->
<div class="relative">
<select class="h-9 pl-3 pr-8 rounded bg-surface-container-low text-on-surface font-label-md text-label-md appearance-none focus:outline-none focus:bg-surface-container-lowest cursor-pointer shadow-sm">
<option value="all">All Assignees (16)</option>
<option value="sj">Sarah Jenkins (Eng Lead)</option>
<option value="dc">David Chen (DevOps)</option>
<option value="er">Elena Rostova (Career Services)</option>
<option value="ma">Marcus Aurelius (Frontend)</option>
</select>
<span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-secondary pointer-events-none">group</span>
</div>
<!-- Priority Tag Filter -->
<div class="relative">
<select class="h-9 pl-3 pr-8 rounded bg-surface-container-low text-on-surface font-label-md text-label-md appearance-none focus:outline-none focus:bg-surface-container-lowest cursor-pointer shadow-sm">
<option value="all">Priority: All</option>
<option value="critical">Critical Only</option>
<option value="high">High Priority</option>
<option value="medium">Standard / Routine</option>
</select>
<span class="material-symbols-outlined absolute right-2.5 top-2.5 text-[16px] text-secondary pointer-events-none">filter_list</span>
</div>
<!-- Add Task CTA -->
<button class="flex items-center gap-1.5 h-9 px-space-md rounded bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md font-semibold transition-all shadow-md" id="open-task-drawer" type="button">
<span class="material-symbols-outlined text-[18px]">add</span>
<span>Add New Task</span>
</button>
</div>
</div>
</div>
<!-- Workload & Sprint Pulse Header (Metric Grid + Visual Progress Track) -->
<div class="w-full px-gutter lg:px-gutter-lg py-space-md">
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-md">
<!-- Active Tasks -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Active Sprint Tasks</span>
<span class="w-2 h-2 rounded-full bg-primary-container"></span>
</div>
<div class="my-space-xs flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-on-surface">64</span>
<span class="font-label-sm text-label-sm text-secondary">total scheduled</span>
</div>
<div class="flex items-center gap-1 text-tertiary-container font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[14px]">trending_up</span>
<span>100% on schedule</span>
</div>
</div>
<!-- In Progress KPI -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">In Progress</span>
<span class="w-2 h-2 rounded-full bg-secondary-container"></span>
</div>
<div class="my-space-xs flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-on-surface">22</span>
<span class="font-label-sm text-label-sm text-secondary">concurrent items</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-primary h-full rounded-full" style="width: 34.3%"></div>
</div>
</div>
<!-- Under Code Review / QA -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Review &amp; QA</span>
<span class="w-2 h-2 rounded-full bg-secondary-fixed-dim"></span>
</div>
<div class="my-space-xs flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-on-surface">14</span>
<span class="font-label-sm text-label-sm text-secondary">in review cycle</span>
</div>
<span class="font-label-sm text-label-sm text-secondary">Avg turnaround: 3.4 hrs</span>
</div>
<!-- Completed KPI -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Completed (Sprint)</span>
<span class="w-2 h-2 rounded-full bg-tertiary-container"></span>
</div>
<div class="my-space-xs flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-tertiary-container">28</span>
<span class="font-label-sm text-label-sm text-secondary">deployed</span>
</div>
<div class="flex items-center gap-1.5">
<span class="material-symbols-outlined text-tertiary-container text-[16px]">check_circle</span>
<span class="font-label-sm text-label-sm text-tertiary-container font-semibold">+18.2% vs Sprint 43</span>
</div>
</div>
<!-- Team Capacity Indicator & Workload Pulse Card -->
<div class="bg-primary text-on-primary p-space-md rounded shadow-md flex flex-col justify-between">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">Team Capacity</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container-lowest/15 text-primary-fixed font-label-sm text-[10px] font-bold tracking-widest">SLA OPTIMAL</span>
</div>
<div class="flex items-end justify-between my-space-xs">
<div>
<span class="font-kpi-display text-kpi-display font-bold">88%</span>
<div class="font-label-sm text-label-sm text-primary-fixed-dim">16 Active Staff Allocated</div>
</div>
<!-- Inline Capacity Donut Chart Visual -->
<svg class="w-12 h-12 -mb-1" viewbox="0 0 36 36">
<path class="text-primary-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3.5"></path>
<path class="text-tertiary-fixed" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-dasharray="88, 100" stroke-linecap="round" stroke-width="3.8"></path>
</svg>
</div>
<div class="flex items-center justify-between font-label-sm text-[11px] text-primary-fixed-dim">
<span>Max velocity balance</span>
<span class="font-semibold text-tertiary-fixed">12h buffer left</span>
</div>
</div>
</div>
</div>
<!-- Operational Filters & Board Density Toggle Strip -->
<div class="w-full px-gutter lg:px-gutter-lg pb-space-sm flex items-center justify-between">
<div class="flex items-center gap-space-sm overflow-x-auto py-1">
<span class="font-label-sm text-label-sm uppercase font-bold text-secondary mr-2 tracking-wider">Quick Squads:</span>
<button class="px-2.5 py-1 rounded bg-on-surface text-surface font-label-sm text-label-sm font-semibold shadow-sm">All Squads (64)</button>
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors">Core DevOps (18)</button>
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors">Enterprise Security (14)</button>
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors">Career Workflows (12)</button>
<button class="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm transition-colors">Integration &amp; API (20)</button>
</div>
<!-- Board Mode Switcher -->
<div class="hidden md:flex items-center gap-1 bg-surface-container-low p-0.5 rounded shadow-sm">
<button class="p-1 rounded bg-surface-container-lowest text-primary shadow-xs" title="Kanban View">
<span class="material-symbols-outlined text-[18px]">view_column</span>
</button>
<button class="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container" title="Resource Gantt View">
<span class="material-symbols-outlined text-[18px]">reorder</span>
</button>
<button class="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container" title="Staff Matrix Grid">
<span class="material-symbols-outlined text-[18px]">grid_view</span>
</button>
</div>
</div>
<!-- Interactive Kanban Board (4 Columns) -->
<div class="w-full px-gutter lg:px-gutter-lg pb-margin-lg overflow-x-auto">
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md min-w-[1100px] xl:min-w-0 items-start">
<!-- ================= COLUMN 1: BACKLOG & SCOPING ================= -->
<div class="bg-surface-container-low rounded p-space-md flex flex-col gap-space-md">
<!-- Column Header -->
<div class="flex items-center justify-between pb-space-xs">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded bg-outline"></span>
<h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Backlog &amp; Scoping</h2>
<span class="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold">8</span>
</div>
<button class="text-secondary hover:text-on-surface p-1 rounded hover:bg-surface-container transition-colors">
<span class="material-symbols-outlined text-[18px]">add</span>
</button>
</div>
<!-- Task List Area -->
<div class="flex flex-col gap-space-sm" id="column-backlog">
<!-- Card 1: Cloud Infra -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4812</span>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[12px]">schedule</span> 5 SP
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Multi-Region AWS GovCloud Terraform state federation
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">DevOps</span>
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Cloud</span>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover" data-alt="Portrait photo of a male operations DevOps engineer with glasses and dark crew cut in professional studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBddaFwcZ3DR8h-Qly8A9UpP-nIFCRWS4JhGZgFO5KNly5p5wxap4pYmWcSkEdz99ZLQiycVMrc93WT9q_YfWIe5VcSnP1omBCyj8MDKw2-FDHAN8xaliD5GznYoAtLEAmWMK5mpfnlC0ALwDMUtF1ar0XjjNGN7grEpKTMCEU3fPsiFRjPSAC1Us3Od87qKwazZkS3Kg3a7LxfYs_ruiQ6HAGT_t9epY2I33iRXfA"/>
<span class="font-label-sm text-label-sm text-secondary">Alexandre P.</span>
</div>
<span class="inline-flex items-center text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px] mr-1 text-secondary">low_priority</span> Med
              </span>
</div>
</div>
<!-- Card 2: Security & Frontend -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4820</span>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[12px]">schedule</span> 3 SP
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Sub-resource integrity (SRI) headers audit across micro-frontends
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-secondary-container/50 text-on-secondary-fixed font-label-sm text-label-sm font-semibold">Security</span>
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Frontend</span>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover" data-alt="Portrait of senior female cybersecurity architect with tied black hair and modern blazer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF7-3yUOEIag_eX8YLUVSJasRF3sU5jJ0BetJ0447HpBG6MZDJNjM1OxejXFrYndrDvVSyc68-29k7WrsgE6qGbH_VqQqE0xQQUAnYY_T1pCuRW6dnnn-eSoW9Mjd_WXj5GQxDRcR9kgqLhbLZ-_LXzziotG4QNCsCfMmrKh5E8pFlEoKmzmaAyuPUpnPux3x5okeqhEkhdZkSK8mDGapyRLyEmVxWMQfXu2wH5i4"/>
<span class="font-label-sm text-label-sm text-secondary">Zoya K.</span>
</div>
<span class="inline-flex items-center text-primary-container font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px] mr-1 text-primary-container">priority_high</span> High
              </span>
</div>
</div>
<!-- Card 3: Career Workflows Backlog -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4829</span>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[12px]">schedule</span> 2 SP
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Automated Skill Gap Matrix calculation for Enterprise Talent Program
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Career Ops</span>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover" data-alt="Corporate headshot of young professional Hispanic talent operations consultant" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0Mu1QXa4WdcXGEOyytFqCBbsUY9tyYxxJuBNCRkTN6us7t8SyTSSnUcSSGHvv_aq5MX07YwdZvYsJPLY6QW7SzAQD7DCmwFm65xLxaN0LMaqEYkppirQuDCAPLy_pKmjgHBVwUAgNKUaVEdUg_h-knuDg8RGIA1iL4KVXkTX6pcXSuHoAsH7eY5LNoaY-2KvdgfwWTl9urxCd3EKqjmtmkwNOHdHxF--pn2pJjEc"/>
<span class="font-label-sm text-label-sm text-secondary">Gabriel M.</span>
</div>
<span class="inline-flex items-center text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px] mr-1">remove</span> Low
              </span>
</div>
</div>
<!-- Quick Drop Target Placeholder -->
<div class="rounded p-3 text-center text-secondary font-label-sm text-label-sm bg-surface-container/60 hover:bg-surface-container cursor-pointer transition-colors">
            + Quick Draft Task (Press N)
          </div>
</div>
</div>
<!-- ================= COLUMN 2: IN PROGRESS ================= -->
<div class="bg-surface-container-low rounded p-space-md flex flex-col gap-space-md">
<!-- Column Header -->
<div class="flex items-center justify-between pb-space-xs">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded bg-primary-container"></span>
<h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">In Progress</h2>
<span class="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">12</span>
</div>
<span class="font-label-sm text-label-sm text-secondary">WIP Limit: 15</span>
</div>
<!-- Task List Area -->
<div class="flex flex-col gap-space-sm" id="column-progress">
<!-- Card 1: Implement OAuth2 PKCE & SSO -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<div class="flex items-center gap-1.5">
<span class="font-label-sm text-label-sm font-bold text-primary">HPE-4791</span>
<span class="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[10px] font-bold uppercase tracking-wider">High Priority</span>
</div>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-error-container/40 text-error font-label-sm text-[11px] font-bold">
<span class="material-symbols-outlined text-[13px]">alarm</span> Due Tomorrow
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Implement OAuth2 PKCE &amp; SSO for Apex Global
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">Security</span>
<span class="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold">Enterprise IAM</span>
</div>
<!-- Subtask progress bar -->
<div class="mb-space-md">
<div class="flex justify-between items-center text-label-sm font-label-sm text-secondary mb-1">
<span>Subtasks Progress</span>
<span class="font-bold text-on-surface">4 / 5 (80%)</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div class="bg-primary-container h-full rounded-full" style="width: 80%"></div>
</div>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover ring-2 ring-primary-container/20" data-alt="Headshot of Sarah Jenkins, senior technical solutions lead woman with tied blonde hair and navy collar shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArvDD8JU9_n8s3utVZHyVdCKygUvt2gqnVX7dRa67KWNbKD-8eh3nq7-oCIlGKSJX9iY2dc7VNsRuOjY63oi0T7o9DkKbph3TjtF4zR6MqFr7rST4KYEgxZefrOap-Drr1FvxpyVVbCL1mIOFGbcuzeVQNPguy6uXrpCyyHDZGmHYtIrF8S4QbU3eUOHlhWujRvBlDya3vy4Orvml6MQlRjEUu4ddBCZhWsl1qbWE"/>
<div>
<div class="font-label-sm text-label-sm font-bold text-on-surface">Sarah J.</div>
<div class="font-label-sm text-[10px] text-secondary">Lead Architect</div>
</div>
</div>
<span class="inline-flex items-center text-primary-container font-label-sm text-label-sm font-bold">
                8 SP
              </span>
</div>
</div>
<!-- Card 2: Kubernetes Cluster Auto-scaler -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<div class="flex items-center gap-1.5">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4796</span>
<span class="px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-[10px] font-bold">Normal</span>
</div>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[11px]">
                Due in 3d
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Kubernetes Cluster Auto-scaler tuning
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">DevOps</span>
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Infrastructure</span>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover" data-alt="Portrait of David Chen, cloud infrastructure engineer with black glasses in casual tech workspace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCA_PAtLRg0Zb2ovMgcvZCYvyiMhDe8_pfrcICjDCcnDJQIA9K-pt4QE7m5a3A2CSpde4Y9YT2R0ds2Kof9-O9BXtvNgG5Y7WHX8h-dNyDztmxNb31YV77Kzf7utpbEMVQSAFstdqTcda0s_zbMRyY-636lUGfPSCZalclZfJrOtzR19W62eyuHdgq9BJCjvecXI8NMmnIomjoosyyf7JMczrRlQ2r2UT4q7IG1C6c"/>
<div>
<div class="font-label-sm text-label-sm font-bold text-on-surface">David C.</div>
<div class="font-label-sm text-[10px] text-secondary">DevOps Specialist</div>
</div>
</div>
<span class="font-label-sm text-label-sm text-secondary font-semibold">5 SP</span>
</div>
</div>
<!-- Card 3: Career Coaching Curriculum -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<div class="flex items-center gap-1.5">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4803</span>
<span class="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] font-bold">Career Ops</span>
</div>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[11px]">
                Due in 5d
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Enterprise Career Coaching Curriculum v2
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-secondary-container/60 text-on-secondary-fixed font-label-sm text-label-sm font-semibold">Curriculum</span>
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Client Readiness</span>
</div>
<!-- Collaborative Avatar Stack -->
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<div class="flex -space-x-2">
<img class="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest" data-alt="Headshot of Elena Rostova, senior career director smiling gently with silver earrings" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXzfLmoBOU88WKUwmdpsRHBWCMkhkUyKZBjvXevDgk7OCJOyTjc5svMDWUbhXEGrzDD5-VDTWGgSzl7CNHHzTIzRj1rmYVHvf4qZeRTvJSxm0f3LOIP5IB80OKWU5aJyR3lB0Mle0TZQ4HYyzN6KNjhIljN9LswUdcNE0NweAU_utu5ou0hQeCVeKMro4Z1NDbqR9Ny0eyO8FJ8-VFqI062wS_PM28MPDDsFy4Wko"/>
<img class="w-7 h-7 rounded-full object-cover ring-2 ring-surface-container-lowest" data-alt="Headshot of male HR operations specialist with short dark beard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWheX-zBKmIFdMO-fyRt7woTStyMz1afHdkQlhpt21Fx8K31w8hHUeAWzLYFwzbpr4L_X1R390Om8AvdpjwPTRyruWaqJJpCU7BMFUKebl6jvUwT91icPA7jTgAzEi3X0FmYM72pVs5d2XlFx_QZinrvARBQAbXFH4K62qV4b3BAmKy3cp8-RSonEK0n_YD7NIA9QhTlxXThwcQtUfCe80D7ubjKYlqtCGlZcut9o"/>
</div>
<div>
<div class="font-label-sm text-label-sm font-bold text-on-surface">Elena R. +1</div>
<div class="font-label-sm text-[10px] text-secondary">Career Services</div>
</div>
</div>
<span class="font-label-sm text-label-sm text-secondary font-semibold">5 SP</span>
</div>
</div>
</div>
</div>
<!-- ================= COLUMN 3: QA, TESTING & REVIEW ================= -->
<div class="bg-surface-container-low rounded p-space-md flex flex-col gap-space-md">
<!-- Column Header -->
<div class="flex items-center justify-between pb-space-xs">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded bg-secondary"></span>
<h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">QA &amp; Client Review</h2>
<span class="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-label-sm font-bold">7</span>
</div>
<span class="font-label-sm text-label-sm text-secondary">Gatekeeper Active</span>
</div>
<!-- Task List Area -->
<div class="flex flex-col gap-space-sm" id="column-qa">
<!-- Card 1: Payment Gateway Webhook -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<div class="flex items-center gap-1.5">
<span class="font-label-sm text-label-sm font-bold text-error">HPE-4775</span>
<span class="px-1.5 py-0.5 rounded bg-error text-on-error font-label-sm text-[10px] font-bold uppercase tracking-wider">Critical SLA</span>
</div>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-tertiary-container/15 text-tertiary-container font-label-sm text-[10px] font-bold uppercase">
<span class="material-symbols-outlined text-[12px]">verified</span> UAT Ready
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Payment Gateway Stripe Integration Webhook hardening
            </h3>
<!-- Resolution tag alert -->
<div class="p-2 rounded bg-tertiary-fixed/30 text-on-tertiary-fixed flex items-center gap-2 mb-space-md">
<span class="material-symbols-outlined text-tertiary-container text-[16px]">bug_report</span>
<span class="font-label-sm text-label-sm font-bold text-tertiary-container">2 bugs resolved, ready for UAT sign-off</span>
</div>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">FinOps</span>
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Webhooks</span>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover" data-alt="Portrait of senior fintech engineer man with smart casual navy sweater" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDh9WlX6IUaMtJfMKilqNjhKlFIgGCZB8MGrCcaYptcmBJxW1U31rqMN9ZA5FqwLhJ3jdV0QiY77gxdAj8s_-CIDeUI-i0uBQrBv6bN4vt7odZ_zGi7-vvDnqjeDRLixo2VtoAbor_fQdAmoG2eXLPyuygQL-ZL3_mjmZENCbYhU3ovdbM261mf8eL61kfjxctzpvYKxgZmpZDMvtsIu3ys3g70e3v9rXwDRrR4BAU"/>
<div>
<div class="font-label-sm text-label-sm font-bold text-on-surface">Vikram S.</div>
<div class="font-label-sm text-[10px] text-secondary">FinTech Engine</div>
</div>
</div>
<span class="font-label-sm text-label-sm text-on-surface font-bold">13 SP</span>
</div>
</div>
<!-- Card 2: SLA Dashboard Metrics sync -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4780</span>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-[10px] font-bold">
                Automated QA Pass
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              SLA Dashboard Metrics sync cronjob
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Telemetry</span>
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Cron Worker</span>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover" data-alt="Portrait of female systems QA analyst in modern workspace setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlgOQV2dUFF7p9AE7Ne4IIdXrVSrVe_4L5--U9icwHhBXyVLTXi08nvqEXDhUz4usewkdZmUuX8_pPxr5D2v_NU8wYU299VFNHrOo-NaS06_-rYIZoIM_ywLITk5OpWlF_h7NdRcHXwBSQrcWEbKLmMgtLutce9dXKrHok2vaiSZgsEAtiLH-tgGfvlkOBHGZI8LpGjyUUOFzzBLHyyLnCyte-kptvguLi2BGbkIs"/>
<div>
<div class="font-label-sm text-label-sm font-bold text-on-surface">Tanya B.</div>
<div class="font-label-sm text-[10px] text-secondary">QA Automation</div>
</div>
</div>
<span class="font-label-sm text-label-sm text-secondary font-semibold">3 SP</span>
</div>
</div>
<!-- Card 3: Contract Engine Template Preview -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4784</span>
<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-[10px]">
                Pending Legal Rev
              </span>
</div>
<h3 class="font-headline-sm text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors mb-2">
              Career SLA Service Level Agreement PDF generation
            </h3>
<div class="flex flex-wrap gap-1.5 mb-space-md">
<span class="px-2 py-0.5 rounded bg-surface-container-low text-secondary font-label-sm text-label-sm font-semibold">Docs Engine</span>
</div>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-7 h-7 rounded-full object-cover" data-alt="Portrait of senior corporate compliance officer female with glasses" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY6Ccgdy6HBrZnBc2jIuL7-k_0nUKLZ18dMxZVrBGGUzUVK7R8hWmmSvZXwLItZipdfN1mQbnjEu_Akz3JLR-L1RCG8tf-hwo1i1tXAp7udbOuMeFuBiZGmiR1YGGWE8-96bH758CBmYo8LyVtvHfY6BnK_Arr9bYV5CYExp1juFOQMgzJvHwQuYBH-2SN9aBcLmWh8rbwPf9jYCRUKoh3FGghjl54T-0Uy5WWAiE"/>
<div>
<div class="font-label-sm text-label-sm font-bold text-on-surface">Claire L.</div>
<div class="font-label-sm text-[10px] text-secondary">Compliance</div>
</div>
</div>
<span class="font-label-sm text-label-sm text-secondary font-semibold">2 SP</span>
</div>
</div>
</div>
</div>
<!-- ================= COLUMN 4: COMPLETED & DEPLOYED ================= -->
<div class="bg-surface-container-low rounded p-space-md flex flex-col gap-space-md">
<!-- Column Header -->
<div class="flex items-center justify-between pb-space-xs">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded bg-tertiary-container"></span>
<h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Completed &amp; Deployed</h2>
<span class="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">24</span>
</div>
<span class="material-symbols-outlined text-tertiary-container text-[18px]">verified_user</span>
</div>
<!-- Task List Area -->
<div class="flex flex-col gap-space-sm" id="column-completed">
<!-- Card 1: Completed SSO Session Fix -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4762</span>
<div class="flex items-center gap-1 text-tertiary-container font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span>PROD LIVE</span>
</div>
</div>
<h3 class="font-headline-sm text-body-lg font-semibold text-secondary line-through mb-1">
              Redis Cluster Redis-Sentinel fallback failover config
            </h3>
<p class="font-body-sm text-body-sm text-secondary mb-space-sm">
              Deployment tag <span class="font-mono text-on-surface">v2.4.11-rc4</span> pushed cleanly without pipeline latency.
            </p>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover" data-alt="Portrait of David Chen cloud engineer smiling in server room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABLwQvabT1PdRUhRIpGz9YwOzHdvKv1hNewPYo_mfdu3ncQa0KQpC9MI4A_3tgivl3QQD0Grp4W2hHSefA800RC0iChPCOFnZYwrGhBMb_YpCrEECSboyEQAdIQ2AlSygyxk_LEV1KchPUBsKO49UJA0DNzM1b7Dl-FrmYAYcBJpn9IFLScoL77HgxgYBUnJqYvrt-_0QKtVWIOvGd3stcpkfeiq81z1MsOhRFTG8"/>
<span class="font-label-sm text-label-sm text-secondary">David C.</span>
</div>
<span class="font-label-sm text-[11px] text-secondary font-mono">Today, 09:42 EST</span>
</div>
</div>
<!-- Card 2: Completed Candidate Profile Export -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4759</span>
<div class="flex items-center gap-1 text-tertiary-container font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span>MERGED</span>
</div>
</div>
<h3 class="font-headline-sm text-body-lg font-semibold text-secondary line-through mb-1">
              Career Profile CSV batch export for HR enterprise tier
            </h3>
<p class="font-body-sm text-body-sm text-secondary mb-space-sm">
              Validated against 50,000 synthetic test profiles with full encryption at rest.
            </p>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover" data-alt="Headshot of Elena Rostova career specialist in white blazer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgV8zzr25yM0L7vfbyz9zlvsDSCKVQi_NNiKBVlFeWsu-xc53I15_r5XWzl0HHB0LTcpJuaq0F9-j6hDqoAsgcNV1FemRaX2-ucoYgqyzMxo-t5lE-aeLBZRoIeVJXiVF0oLsVXDb4yWUrW4sVTp5JsTX-j7eOI8km6RVNj6yh2ciUFOgHk_3S5g-g3Pw_tT_sHgPcFgmBFqDnRPAN2AHyfbxKZk78Dl6y_zjSIGE"/>
<span class="font-label-sm text-label-sm text-secondary">Elena R.</span>
</div>
<span class="font-label-sm text-[11px] text-secondary font-mono">Yesterday, 17:15</span>
</div>
</div>
<!-- Card 3: ElasticSearch Schema Upgrade -->
<div class="bg-surface-container-lowest p-space-md rounded shadow-sm hover:shadow-md transition-shadow group">
<div class="flex items-center justify-between mb-space-xs">
<span class="font-label-sm text-label-sm font-bold text-secondary">HPE-4744</span>
<div class="flex items-center gap-1 text-tertiary-container font-label-sm text-label-sm font-bold">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span>DEPLOYED</span>
</div>
</div>
<h3 class="font-headline-sm text-body-lg font-semibold text-secondary line-through mb-1">
              Audit log index sharding &amp; retention policy 90d
            </h3>
<div class="flex items-center justify-between pt-space-xs">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover" data-alt="Portrait of senior data platform engineer man with beard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB19UYLk80gCzSvw-comNAJbC475lws1cO_CS3SVvYcY_V_mNZ3KyAmY47yRqj3M2U9lHppElISZihYZdDrRIrvjodKroYtguFAFq7nlQjT2bOLxAw6kZJXXHzqrZnQdcqhtPUz96U34oriekqtnppPW48WY-LwEGTO4FUamxiZssU8-wg4p1Lam3Q1N8DIQZw3au9N9opt5oulEGRNf_RU2dKiQ-rkqgo-NXgl6i0"/>
<span class="font-label-sm text-label-sm text-secondary">Siddharth N.</span>
</div>
<span class="font-label-sm text-[11px] text-secondary font-mono">Oct 24, 14:02</span>
</div>
</div>
<!-- Archive CTA button -->
<button class="w-full py-2 rounded bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface font-label-sm text-label-sm flex items-center justify-center gap-1 transition-colors">
<span class="material-symbols-outlined text-[16px]">archive</span>
<span>View 21 older deployed tasks</span>
</button>
</div>
</div>
</div>
</div>
<!-- Bottom Workload Balancing Matrix (Split Team Allocation Section) -->
<div class="w-full px-gutter lg:px-gutter-lg pb-margin-lg">
<div class="bg-surface-container-lowest p-space-lg rounded shadow-sm">
<div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-md">
<div>
<h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">
            Real-Time Staff Workload Balancing
          </h2>
<p class="font-body-sm text-body-sm text-secondary">
            Continuous allocation tracking based on active story point commitment vs sprint velocity caps.
          </p>
</div>
<div class="flex items-center gap-2">
<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/15 text-tertiary-container font-label-sm text-label-sm font-bold">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span> Balanced Velocity
          </span>
<button class="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors">
            Auto-Rebalance
          </button>
</div>
</div>
<!-- Staff Allocation Rows -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
<!-- Staff 1 -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<img class="w-8 h-8 rounded-full object-cover" data-alt="Headshot of Sarah Jenkins solutions architect woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJaveAEUzBstvNL4pbF79oL8AzdiJLKZt4N1Kr_EkGnhHHolxxi2CTlpL9ZeTc4oc5QXjfn8caUOUXQWRAlFaZaA7HdHT2rZchfybJzKrAQjXqbRk1PjJ7UtRlu5JrM7BoniWxdI8F6GtwP-DCXQ2SuPXg45i20xQSouGT9JXI2GHpjxmrQllQMjYIdZAfRRyfTkpNpvE9WHg6l7A_DGe5rhpb12W3MWsEaKgjenY"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Sarah Jenkins</div>
<div class="font-label-sm text-[11px] text-secondary">Lead Arch (14 SP)</div>
</div>
</div>
<span class="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[10px] font-bold">95% (High)</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
<div class="bg-error h-full rounded-full" style="width: 95%"></div>
</div>
</div>
<!-- Staff 2 -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<img class="w-8 h-8 rounded-full object-cover" data-alt="Headshot of David Chen DevOps Specialist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCfBitWovu_vxgP42nib7JZtCGOPGHS2UJewCF2kDrcGr9rwaaBxnHIzEM3OIbJnhrfNZMchnhzb7mrki2MpaOna4fnW1i6tQzpMW1jBSMuIadP0R0DKyNLznfq4Y1t0_uVE1knMAbK-m6xIWUNG_0fe4Qyrj_KJ17L5GKw40vR4CbNoecHiJMo4bNUquX5lncwELtj3f7_pl4x-3vn8GFwdbuLGrJhbYso38yo20"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">David Chen</div>
<div class="font-label-sm text-[11px] text-secondary">DevOps (12 SP)</div>
</div>
</div>
<span class="px-1.5 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-label-sm text-[10px] font-bold">80% (Norm)</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
<div class="bg-primary h-full rounded-full" style="width: 80%"></div>
</div>
</div>
<!-- Staff 3 -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<img class="w-8 h-8 rounded-full object-cover" data-alt="Headshot of Elena Rostova career services director" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEgOkpPhgyevNPv5Cd96GFKMg2pIuHBJoK6KiQxgggXD5YMJ3KPrDT2Sk59S_B1zGX1KXCkDKDWTmJZ6NHuaO4V9tDhVv-1mEvGD-sLQnc1z74gC3UzVJ-ffxpZd6fbl7LSmsgYKmfhnbMX471i_BU5ofx_UQZbmYmyFk9J7KLUAvILhAZqUjxnBKD76WlcajDHPx2pPbzGwT265X84Lu4jTCTXqcvdaG0aCU3U4o"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Elena Rostova</div>
<div class="font-label-sm text-[11px] text-secondary">Career Ops (11 SP)</div>
</div>
</div>
<span class="px-1.5 py-0.5 rounded bg-tertiary-container/15 text-tertiary-container font-label-sm text-[10px] font-bold">73% (Norm)</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
<div class="bg-tertiary-container h-full rounded-full" style="width: 73%"></div>
</div>
</div>
<!-- Staff 4 -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col justify-between">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<img class="w-8 h-8 rounded-full object-cover" data-alt="Headshot of Vikram Singh fintech systems lead" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrBgSSJZzT83-yTDPClagOO79WMgH2wB-qn2wdPNgj1MP7v3ac8PEQF6F5VXwpf5C0aN9E8B1-F7KKwW5gL6EEDdWmAtWmoPWr28V2ePHjySDVExDMKQZrXO3tTqcJ1zJuiCrUGwPk_E2tIv0eNQsDOnh5in0QwKkdyQ1cGze-JwkAC_fFWwGrTDfjkkPszwqOQSE7RQzYBvovNtOXJfqpo76Ac10GPeq80bVI610"/>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Vikram Singh</div>
<div class="font-label-sm text-[11px] text-secondary">FinTech (16 SP)</div>
</div>
</div>
<span class="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[10px] font-bold">100% (Cap)</span>
</div>
<div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
<div class="bg-error h-full rounded-full" style="width: 100%"></div>
</div>
</div>
</div>
</div>
</div>
<!-- Side Flyout Drawer for 'Add New Task' / Detail Preview (Toggled by JS) -->
<div class="fixed inset-0 bg-inverse-surface/40 z-50 hidden transition-opacity" id="task-drawer-backdrop">
<div class="absolute right-0 top-0 bottom-0 w-full max-w-md bg-surface-container-lowest shadow-2xl flex flex-col justify-between transform translate-x-full transition-transform duration-200 ease-in-out" id="task-drawer-panel">
<!-- Drawer Header -->
<div class="p-space-lg bg-surface-container-low flex items-center justify-between">
<div>
<span class="font-label-sm text-label-sm uppercase font-bold text-secondary">Operations Task Engine</span>
<h2 class="font-headline-md text-headline-md font-bold text-on-surface">Dispatch New Work Order</h2>
</div>
<button class="p-1 rounded hover:bg-surface-container text-secondary hover:text-on-surface transition-colors" id="close-task-drawer">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<!-- Drawer Form Body -->
<div class="p-space-lg flex-1 overflow-y-auto space-y-space-md">
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Task Title &amp; Objective</label>
<input class="w-full h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest shadow-sm" placeholder="e.g., Deploy Canary build for API Gateway v4.2" type="text"/>
</div>
<div class="grid grid-cols-2 gap-space-sm">
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Sprint Destination</label>
<select class="w-full h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
<option>Sprint 44 (Current)</option>
<option>Sprint 45 (Upcoming)</option>
</select>
</div>
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Story Points</label>
<select class="w-full h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
<option>1 SP (Trivial)</option>
<option>2 SP (Minor)</option>
<option>3 SP (Standard)</option>
<option selected="">5 SP (Moderate)</option>
<option>8 SP (Complex)</option>
<option>13 SP (Architectural)</option>
</select>
</div>
</div>
<div class="grid grid-cols-2 gap-space-sm">
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Squad Domain</label>
<select class="w-full h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
<option>DevOps &amp; Infra</option>
<option>Enterprise IAM</option>
<option>Career Workflows</option>
<option>FinOps Billing</option>
</select>
</div>
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">SLA Priority</label>
<select class="w-full h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
<option>Normal (Routine)</option>
<option>High (24-48h)</option>
<option>Critical (Blocker)</option>
</select>
</div>
</div>
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Primary Assignee</label>
<select class="w-full h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none">
<option>Sarah Jenkins (Lead Arch - 95% Utilized)</option>
<option selected="">David Chen (DevOps - 80% Utilized)</option>
<option>Elena Rostova (Career Ops - 73% Utilized)</option>
<option>Vikram Singh (FinTech - 100% Utilized)</option>
</select>
</div>
<div>
<label class="block font-label-md text-label-md font-bold text-on-surface mb-1">Task Scope &amp; Acceptance Criteria</label>
<textarea class="w-full p-3 rounded bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest shadow-sm" placeholder="Detail the definition of done, security validations, and target environment..." rows="4"></textarea>
</div>
</div>
<!-- Drawer Footer Actions -->
<div class="p-space-lg bg-surface-container-low flex items-center justify-end gap-space-sm">
<button class="px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" id="cancel-task-drawer" type="button">
          Cancel
        </button>
<button class="px-space-md py-1.5 rounded bg-primary text-on-primary font-label-md text-label-md font-bold shadow-md hover:bg-primary-container transition-all" id="submit-task-btn" type="button">
          Create &amp; Assign Task
        </button>
</div>
</div>
</div>
<!-- Minimal Inline Micro-Interactions Script -->
<script>
    (function() {
      const openBtn = document.getElementById('open-task-drawer');
      const closeBtn = document.getElementById('close-task-drawer');
      const cancelBtn = document.getElementById('cancel-task-drawer');
      const backdrop = document.getElementById('task-drawer-backdrop');
      const panel = document.getElementById('task-drawer-panel');
      const submitBtn = document.getElementById('submit-task-btn');

      function openDrawer() {
        backdrop.classList.remove('hidden');
        setTimeout(() => {
          panel.classList.remove('translate-x-full');
        }, 10);
      }

      function closeDrawer() {
        panel.classList.add('translate-x-full');
        setTimeout(() => {
          backdrop.classList.add('hidden');
        }, 200);
      }

      if (openBtn) openBtn.addEventListener('click', openDrawer);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      if (cancelBtn) cancelBtn.addEventListener('click', closeDrawer);
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) closeDrawer();
        });
      }

      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          submitBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-spin">sync</span> Creating...';
          setTimeout(() => {
            submitBtn.innerHTML = 'Create & Assign Task';
            closeDrawer();
          }, 600);
        });
      }
    })();
  </script>
</div></main></div></body></html>
```


### 14.3. Customer 360 & Client Directory

```html
<!DOCTYPE html>

<html class="h-full" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base { html, body { margin: 0; padding: 0; } body { overscroll-behavior: none; } main > :first-child { margin-top: 0 !important; } main > :last-child { margin-bottom: 0 !important; } } ::-webkit-scrollbar { display: none; }</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "secondary-fixed-dim": "#bec6e0", "on-tertiary-fixed": "#002113", "surface-tint": "#4059aa", "on-error-container": "#93000a", "secondary": "#565e74", "tertiary": "#00311f", "surface-bright": "#f7f9fb", "on-surface-variant": "#444651", "surface-container-low": "#f2f4f6", "on-tertiary-fixed-variant": "#005236", "inverse-surface": "#2d3133", "on-primary-fixed": "#00164e", "on-error": "#ffffff", "on-secondary-fixed": "#131b2e", "surface": "#f7f9fb", "on-primary-fixed-variant": "#264191", "background": "#f7f9fb", "on-secondary": "#ffffff", "error-container": "#ffdad6", "primary": "#00236f", "tertiary-fixed-dim": "#4edea3", "outline": "#757682", "primary-container": "#1e3a8a", "primary-fixed": "#dce1ff", "on-primary": "#ffffff", "inverse-on-surface": "#eff1f3", "on-secondary-fixed-variant": "#3f465c", "on-surface": "#191c1e", "inverse-primary": "b6c4ff", "surface-container-highest": "#e0e3e5", "on-secondary-container": "#5c647a", "on-tertiary": "#ffffff", "tertiary-fixed": "#6ffbbe", "outline-variant": "#c5c5d3", "secondary-container": "#dae2fd", "tertiary-container": "#004a31", "on-background": "#191c1e", "surface-container": "#eceef0", "surface-container-high": "#e6e8ea", "primary-fixed-dim": "#b6c4ff", "surface-dim": "#d8dadc", "on-primary-container": "#90a8ff", "on-tertiary-container": "#27c38a", "secondary-fixed": "#dae2fd", "error": "#ba1a1a", "surface-container-lowest": "#ffffff", "surface-variant": "#e0e3e5" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "space-md": "0.75rem", "margin-md": "1.5rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter": "1rem", "margin-lg": "2rem", "gutter-lg": "1.5rem", "space-lg": "1rem", "margin": "1rem", "space-xl": "1.5rem" }, "fontFamily": { "headline-lg": [ "Plus Jakarta Sans" ], "label-md": [ "Manrope" ], "headline-xl-mobile": [ "Plus Jakarta Sans" ], "headline-xl": [ "Plus Jakarta Sans" ], "body-lg": [ "Manrope" ], "kpi-display": [ "Plus Jakarta Sans" ], "label-lg": [ "Manrope" ], "headline-md": [ "Plus Jakarta Sans" ], "headline-sm": [ "Plus Jakarta Sans" ], "body-sm": [ "Manrope" ], "body-md": [ "Manrope" ], "label-sm": [ "Manrope" ] }, "fontSize": { "headline-lg": [ "1.5rem", { "lineHeight": "2rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "label-md": [ "0.75rem", { "lineHeight": "1rem", "letterSpacing": "0.02em", "fontWeight": "600" } ], "headline-xl-mobile": [ "1.625rem", { "lineHeight": "2.125rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "headline-xl": [ "2rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.025em", "fontWeight": "700" } ], "body-lg": [ "1rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "400" } ], "kpi-display": [ "2.25rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.03em", "fontWeight": "700" } ], "label-lg": [ "0.875rem", { "lineHeight": "1.25rem", "letterSpacing": "0em", "fontWeight": "600" } ], "headline-md": [ "1.25rem", { "lineHeight": "1.75rem", "letterSpacing": "-0.015em", "fontWeight": "600" } ], "headline-sm": [ "1.125rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "body-sm": [ "0.75rem", { "lineHeight": "1.125rem", "letterSpacing": "0em", "fontWeight": "400" } ], "body-md": [ "0.875rem", { "lineHeight": "1.375rem", "letterSpacing": "-0.005em", "fontWeight": "400" } ], "label-sm": [ "0.6875rem", { "lineHeight": "0.875rem", "letterSpacing": "0.05em", "fontWeight": "700" } ] } } } };</script></head><body class="bg-background font-body-md text-body-md text-on-surface min-h-screen selection:bg-secondary-container selection:text-on-secondary-fixed"><header class="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant/30 z-50 flex items-center justify-between px-gutter lg:px-gutter-lg"><div class="flex items-center gap-space-lg"><div class="flex items-center gap-space-sm"><img alt="Hopepitome Enterprise Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1W5FyD-T-ETGrZeAB0rljmlF7OY6fBThr1Ap9xh8GGHTcmh8-wWpWMifJciY6zVEzisaMKsUZnvmpkKbeBcNIq1ZsngZQnEZQ_T1JvixPdKYnUXCMlGN92vsMcbzAGxYjR92GAQZcVLM81J5ZjXgzkuneudDCzLF-uc3wbixBLleDFADK0rnvKrTjvoIIyfofPk_jFx9eoE3rDwYM4v-f3AfL6pLkUZc9Qij1WxXUG3"/><span class="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">Hopepitome</span></div><span class="hidden xl:inline-flex items-center px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">OPERATIONS SUITE v2.4</span><div class="h-5 w-[1px] bg-outline-variant/40 hidden md:block"></div><nav class="hidden lg:flex items-center gap-space-md h-14" data-active-classes="text-primary font-semibold border-b-2 border-primary"><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="project-hub" href="#">Project Hub</a><a aria-current="page" class="transition-colors px-space-xs py-4 flex items-center text-primary font-semibold border-b-2 border-primary" data-path="customer-360" href="#">Customer 360 &amp; CRM</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="service-catalog-engine" href="#">Service Catalog</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="employee-directory" href="#">Employee &amp; Teams</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="commercial-quotations" href="#">Finance &amp; Billing</a></nav></div><div class="flex items-center gap-space-md"><div class="relative hidden sm:flex items-center"><span class="material-symbols-outlined absolute left-2.5 text-secondary text-[18px] pointer-events-none">search</span><input class="w-56 md:w-72 h-8.5 pl-8 pr-12 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all" placeholder="Search operations, projects, entities..." type="text"/><span class="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-[10px] border border-outline-variant/40 font-semibold">⌘K</span></div><div class="hidden md:flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-low border border-outline-variant/30"><span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span><span class="font-label-sm text-label-sm text-tertiary-container uppercase tracking-wider font-bold">PROD-LIVE</span></div><button class="relative p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span></button><div class="flex items-center gap-space-xs px-space-sm py-1 rounded border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors"><span class="font-label-md text-label-md font-semibold text-primary">Super Admin</span><span class="material-symbols-outlined text-[16px] text-secondary">arrow_drop_down</span></div><div class="flex items-center pl-space-xs"><img alt="Profile" class="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6rQP5t0iQXNKmdqrkeUcpH0hED2b4H64XZpZiX8msqz4UzuKMrIudPxiAv4ISfLNnbNYhaT_qC8XA6tFKp2_Hy_yWvTRTppPTOF-yoa6OBnCmTp8t-YPbaf91nwuf3w9xg9Q7Jw9vIs2rlDYjfNjKePwevFgm7YwHBhbEWCItEqNumsCZAEKOGLgtVh0Xses4RbYKd4aeo5PDcz7uQRJ_rJlxatuqFINqrkHkHg0"/></div></div></header><aside class="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-40 flex flex-col justify-between overflow-y-auto"><div class="p-space-md"><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">DELIVERY &amp; PROJECTS</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="project-hub" href="#"><span class="material-symbols-outlined text-[18px]">view_kanban</span><span>Project Management &amp; Board</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="service-catalog-engine" href="#"><span class="material-symbols-outlined text-[18px]">category</span><span>Service Catalogue Engine</span></a><a aria-current="page" class="flex items-center gap-space-sm px-space-sm py-1.5 rounded transition-colors bg-primary-container text-on-primary font-semibold" data-path="customer-360" href="#"><span class="material-symbols-outlined text-[18px]">contact_page</span><span>Customer 360 Directory</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="staff-task-board" href="#"><span class="material-symbols-outlined text-[18px]">assignment_ind</span><span>Staff Task Board</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="deliverables-vault" href="#"><span class="material-symbols-outlined text-[18px]">inventory_2</span><span>Deliverables Vault</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="career-work-orders" href="#"><span class="material-symbols-outlined text-[18px]">engineering</span><span>Career Work Orders</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sla-support" href="#"><span class="material-symbols-outlined text-[18px]">verified</span><span>SLA Support &amp; Maintenance</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="audit-trail" href="#"><span class="material-symbols-outlined text-[18px]">policy</span><span>Audit Trail &amp; Logs</span></a></nav></div><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">CRM &amp; SALES</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="crm-overview" href="#"><span class="material-symbols-outlined text-[18px]">query_stats</span><span>CRM Overview</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="leads-inbox" href="#"><span class="material-symbols-outlined text-[18px]">move_to_inbox</span><span>Leads Inbox</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-pipeline" href="#"><span class="material-symbols-outlined text-[18px]">timeline</span><span>Sales Pipeline</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="commercial-quotations" href="#"><span class="material-symbols-outlined text-[18px]">request_quote</span><span>Commercial Quotations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="consultations" href="#"><span class="material-symbols-outlined text-[18px]">forum</span><span>Consultations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-analytics" href="#"><span class="material-symbols-outlined text-[18px]">bar_chart</span><span>Sales Analytics</span></a></nav></div><div class="mb-space-md"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">TEAM &amp; ORG</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="employee-directory" href="#"><span class="material-symbols-outlined text-[18px]">badge</span><span>Employee Directory</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="roles-permissions" href="#"><span class="material-symbols-outlined text-[18px]">admin_panel_settings</span><span>Roles &amp; Permissions</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="departments" href="#"><span class="material-symbols-outlined text-[18px]">corporate_fare</span><span>Departments</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="activity-logs" href="#"><span class="material-symbols-outlined text-[18px]">history</span><span>Activity Logs</span></a></nav></div></div><div class="p-space-md border-t border-outline-variant/30 bg-surface-container-low/40"><div class="mb-space-sm"><div class="flex justify-between items-center mb-1"><span class="font-label-sm text-label-sm text-secondary">Enterprise Cluster</span><span class="font-label-sm text-label-sm font-semibold text-primary">92.4%</span></div><div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden"><div class="bg-primary-container h-full rounded-full" style="width: 92.4%"></div></div><div class="flex justify-between text-[11px] text-secondary mt-1 font-body-sm"><span>Storage: 4.6TB / 5.0TB</span><span class="text-tertiary-container font-semibold">Optimal</span></div></div><a class="flex items-center justify-between px-space-sm py-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#"><span class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">help_outline</span>Documentation &amp; Support</span><span class="material-symbols-outlined text-[16px]">north_east</span></a></div></aside><div class="pl-64"><main class="w-full pt-14 bg-background min-h-screen"><div class="flex flex-col w-full">
<!-- Dynamic Top Control Bar & Breadcrumbs -->
<section class="px-gutter lg:px-gutter-lg pt-6 pb-4 flex flex-col gap-4">
<div class="flex flex-wrap items-center justify-between gap-3">
<div class="flex items-center gap-2">
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Operations</span>
<span class="text-secondary/60 text-xs">/</span>
<span class="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">CRM &amp; Sales</span>
<span class="text-secondary/60 text-xs">/</span>
<span class="font-label-sm text-label-sm text-primary font-bold uppercase tracking-widest bg-secondary-container/40 px-2 py-0.5 rounded">Customer 360 Directory</span>
</div>
<div class="flex items-center gap-2">
<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></span>
          REAL-TIME TELEMETRY ACTIVE
        </span>
</div>
</div>
<!-- Title & Executive Action Array -->
<div class="flex flex-col xl:flex-row xl:items-end justify-between gap-5 pb-2">
<div class="max-w-3xl">
<h1 class="font-headline-xl text-headline-xl text-primary tracking-tight font-extrabold">Customer 360 &amp; Account Intelligence</h1>
<p class="font-body-md text-body-md text-secondary mt-1 max-w-2xl leading-relaxed">
          Holistic client health scores, active contracts, service order history, communication logs, and commercial SLA monitoring across global operational units.
        </p>
</div>
<div class="flex flex-wrap items-center gap-2.5">
<div class="relative">
<select class="appearance-none bg-surface-container-lowest text-on-surface font-label-md text-label-md font-semibold pl-3 pr-8 py-2 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-surface-container-low transition-colors" id="tierFilter">
<option value="all">Tier: All Portfolios (142)</option>
<option value="tier1">Tier 1 Enterprise (48)</option>
<option value="mid">Mid-Market Strategic (64)</option>
<option value="smb">SMB Fast-Track (30)</option>
</select>
<span class="material-symbols-outlined absolute right-2 top-2.5 text-secondary pointer-events-none text-base">expand_more</span>
</div>
<button class="inline-flex items-center gap-1.5 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-label-md text-label-md px-3.5 py-2 rounded shadow-sm transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[17px] text-secondary">file_upload</span>
          Import Clients
        </button>
<button class="inline-flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold px-4 py-2 rounded shadow-sm transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[18px]">add_circle</span>
          Add New Account
        </button>
</div>
</div>
</section>
<!-- Summary Intelligence Strip (4 stat widgets) -->
<section class="px-gutter lg:px-gutter-lg pb-6">
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
<!-- Metric 1 -->
<div class="bg-surface-container-lowest p-4 rounded shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Managed Accounts</span>
<span class="p-1 rounded bg-secondary-container/40 text-primary">
<span class="material-symbols-outlined text-base">corporate_fare</span>
</span>
</div>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-kpi-display text-kpi-display text-primary tracking-tight font-extrabold">142</span>
<span class="font-label-sm text-label-sm text-tertiary-container font-bold bg-tertiary-fixed/30 px-1.5 py-0.5 rounded flex items-center">
<span class="material-symbols-outlined text-xs mr-0.5">arrow_upward</span>+12
          </span>
</div>
<div class="flex items-center justify-between text-secondary mt-3 pt-2.5 bg-surface-container-low/50 px-2 py-1 rounded">
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium">Enterprise additions this quarter</span>
<span class="font-label-sm text-label-sm font-bold text-primary">+8.4%</span>
</div>
</div>
<!-- Metric 2 -->
<div class="bg-surface-container-lowest p-4 rounded shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Aggregate Client LTV</span>
<span class="p-1 rounded bg-secondary-container/40 text-primary">
<span class="material-symbols-outlined text-base">payments</span>
</span>
</div>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-kpi-display text-kpi-display text-primary tracking-tight font-extrabold">$4.85M</span>
<span class="font-label-sm text-label-sm text-secondary font-semibold">ARR Base</span>
</div>
<div class="flex items-center justify-between text-secondary mt-3 pt-2.5 bg-surface-container-low/50 px-2 py-1 rounded">
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium">Average Contract ACV</span>
<span class="font-label-sm text-label-sm font-bold text-on-surface">$84.2K</span>
</div>
</div>
<!-- Metric 3 -->
<div class="bg-surface-container-lowest p-4 rounded shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Retention &amp; Health</span>
<span class="p-1 rounded bg-tertiary-fixed/30 text-tertiary-container">
<span class="material-symbols-outlined text-base">health_and_safety</span>
</span>
</div>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-kpi-display text-kpi-display text-primary tracking-tight font-extrabold">96.8%</span>
<span class="font-label-sm text-label-sm text-tertiary-container font-bold bg-tertiary-fixed/30 px-1.5 py-0.5 rounded">
            Optimal
          </span>
</div>
<div class="flex items-center justify-between text-secondary mt-3 pt-2.5 bg-surface-container-low/50 px-2 py-1 rounded">
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium">Portfolio Churn Risk Index</span>
<span class="font-label-sm text-label-sm font-bold text-tertiary-container">0.8% Critical</span>
</div>
</div>
<!-- Metric 4 -->
<div class="bg-surface-container-lowest p-4 rounded shadow-sm flex flex-col justify-between relative overflow-hidden group">
<div class="flex items-center justify-between mb-1">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Open Escalations</span>
<span class="p-1 rounded bg-secondary-fixed/50 text-primary">
<span class="material-symbols-outlined text-base">support_agent</span>
</span>
</div>
<div class="flex items-baseline gap-2 mt-1">
<span class="font-kpi-display text-kpi-display text-primary tracking-tight font-extrabold">3</span>
<span class="font-label-sm text-label-sm text-secondary font-medium">Active Incidents</span>
</div>
<div class="flex items-center justify-between text-secondary mt-3 pt-2.5 bg-surface-container-low/50 px-2 py-1 rounded">
<span class="font-body-sm text-body-sm text-on-surface-variant font-medium">SLA Adherence</span>
<span class="font-label-sm text-label-sm font-bold text-tertiary-container">100% (&lt;2hr SLA)</span>
</div>
</div>
</div>
</section>
<!-- Main Operational Canvas: Split Directory & Dossier Inspector -->
<section class="px-gutter lg:px-gutter-lg pb-10">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
<!-- Left/Center Master Client Directory (7 Cols Desktop / Responsive) -->
<div class="lg:col-span-7 xl:col-span-7 bg-surface-container-lowest rounded shadow-sm flex flex-col overflow-hidden">
<!-- Search, Filter & Quick Bulk Bar -->
<div class="p-4 bg-surface-container-lowest flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface-container-low/30">
<div class="relative flex-1">
<span class="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-base pointer-events-none">search</span>
<input class="w-full h-9 pl-9 pr-4 rounded bg-surface-container-lowest text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm transition-all" id="clientSearchInput" placeholder="Filter by company, stakeholder, or contract ID..." type="text"/>
</div>
<div class="flex items-center gap-2">
<div class="inline-flex rounded bg-surface-container-high p-0.5">
<button class="px-2.5 py-1 text-xs font-semibold rounded bg-surface-container-lowest text-primary shadow-sm font-label-sm">Active (128)</button>
<button class="px-2.5 py-1 text-xs font-medium rounded text-secondary hover:text-on-surface font-label-sm">Onboarding (11)</button>
<button class="px-2.5 py-1 text-xs font-medium rounded text-secondary hover:text-on-surface font-label-sm">Archived (3)</button>
</div>
<button class="p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" title="Export CSV">
<span class="material-symbols-outlined text-[20px]">download</span>
</button>
</div>
</div>
<!-- Table Container -->
<div class="overflow-x-auto">
<table class="w-full text-left border-collapse">
<thead>
<tr class="bg-surface-container-low text-secondary font-label-sm text-label-sm uppercase tracking-wider">
<th class="py-3 px-4 font-bold">Client Entity &amp; Tier</th>
<th class="py-3 px-3 font-bold">Primary Stakeholder</th>
<th class="py-3 px-3 font-bold">Active Orders</th>
<th class="py-3 px-3 font-bold text-center">Health Score</th>
<th class="py-3 px-4 font-bold text-right">Spend / Renewal</th>
<th class="py-3 px-3 font-bold text-center">Inspect</th>
</tr>
</thead>
<tbody class="font-body-sm text-body-sm divide-y divide-surface-container-low" id="clientTableBody">
<!-- Row 1: Apex Global Corp (Selected Active) -->
<tr class="client-row cursor-pointer bg-secondary-container/20 hover:bg-secondary-container/30 transition-colors" data-client="apex">
<td class="py-3.5 px-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      AG
                    </div>
<div>
<div class="font-headline-sm text-body-md font-bold text-primary flex items-center gap-1.5">
                        Apex Global Corp
                        <span class="material-symbols-outlined text-xs text-primary-container" title="Key Strategic Account">verified</span>
</div>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="font-label-sm text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">Tier 1 Enterprise</span>
<span class="text-secondary text-[11px]">Fintech Core</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-3">
<div class="font-label-md text-label-md font-semibold text-on-surface">Elena Rostova</div>
<div class="text-secondary text-[11px] truncate max-w-[140px]">e.rostova@apexcorp.io</div>
</td>
<td class="py-3.5 px-3">
<div class="flex items-center gap-1">
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-fixed text-on-secondary-fixed">3 Active</span>
<span class="px-1.5 py-0.5 rounded font-label-sm text-[10px] bg-surface-container-high text-secondary">1 Quoted</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-tertiary-fixed/40 text-tertiary-container">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                    98/100
                  </div>
</td>
<td class="py-3.5 px-4 text-right">
<div class="font-label-md text-label-md font-bold text-on-surface">$340,000</div>
<div class="text-[11px] text-secondary">Renews Nov 2025</div>
</td>
<td class="py-3.5 px-3 text-center">
<button class="p-1 rounded bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-transform active:scale-95" title="View 360 Dossier" type="button">
<span class="material-symbols-outlined text-[17px]">arrow_forward</span>
</button>
</td>
</tr>
<!-- Row 2: Hyperion Logistics Group -->
<tr class="client-row cursor-pointer hover:bg-surface-container-low/60 transition-colors" data-client="hyperion">
<td class="py-3.5 px-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded bg-surface-container-high text-on-surface font-bold text-xs uppercase flex items-center justify-center">
                      HL
                    </div>
<div>
<div class="font-headline-sm text-body-md font-bold text-on-surface flex items-center gap-1.5">
                        Hyperion Logistics
                      </div>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="font-label-sm text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">Tier 1 Enterprise</span>
<span class="text-secondary text-[11px]">Freight Ops</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-3">
<div class="font-label-md text-label-md font-semibold text-on-surface">Devon Chen</div>
<div class="text-secondary text-[11px] truncate max-w-[140px]">d.chen@hyperion-grp.com</div>
</td>
<td class="py-3.5 px-3">
<div class="flex items-center gap-1">
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-fixed text-on-secondary-fixed">2 Active</span>
<span class="px-1.5 py-0.5 rounded font-label-sm text-[10px] bg-surface-container-high text-secondary">0 Quoted</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-tertiary-fixed/30 text-tertiary-container">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                    91/100
                  </div>
</td>
<td class="py-3.5 px-4 text-right">
<div class="font-label-md text-label-md font-bold text-on-surface">$195,500</div>
<div class="text-[11px] text-secondary">Renews Jan 2026</div>
</td>
<td class="py-3.5 px-3 text-center">
<button class="p-1 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" title="View 360 Dossier" type="button">
<span class="material-symbols-outlined text-[17px]">visibility</span>
</button>
</td>
</tr>
<!-- Row 3: Meridian Health Systems -->
<tr class="client-row cursor-pointer hover:bg-surface-container-low/60 transition-colors" data-client="meridian">
<td class="py-3.5 px-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded bg-surface-container-high text-on-surface font-bold text-xs uppercase flex items-center justify-center">
                      MH
                    </div>
<div>
<div class="font-headline-sm text-body-md font-bold text-on-surface flex items-center gap-1.5">
                        Meridian Health
                      </div>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="font-label-sm text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary">Mid-Market</span>
<span class="text-secondary text-[11px]">Healthcare</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-3">
<div class="font-label-md text-label-md font-semibold text-on-surface">Dr. Aris Thorne</div>
<div class="text-secondary text-[11px] truncate max-w-[140px]">athorne@meridiancare.org</div>
</td>
<td class="py-3.5 px-3">
<div class="flex items-center gap-1">
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-fixed text-on-secondary-fixed">1 Active</span>
<span class="px-1.5 py-0.5 rounded font-label-sm text-[10px] bg-secondary-container text-primary font-bold">2 Quoted</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-amber-100 text-amber-800">
<span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    72/100
                  </div>
</td>
<td class="py-3.5 px-4 text-right">
<div class="font-label-md text-label-md font-bold text-on-surface">$112,000</div>
<div class="text-[11px] text-error font-medium">Renews in 18 days</div>
</td>
<td class="py-3.5 px-3 text-center">
<button class="p-1 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" title="View 360 Dossier" type="button">
<span class="material-symbols-outlined text-[17px]">visibility</span>
</button>
</td>
</tr>
<!-- Row 4: Solis Energy Infrastructure -->
<tr class="client-row cursor-pointer hover:bg-surface-container-low/60 transition-colors" data-client="solis">
<td class="py-3.5 px-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded bg-surface-container-high text-on-surface font-bold text-xs uppercase flex items-center justify-center">
                      SE
                    </div>
<div>
<div class="font-headline-sm text-body-md font-bold text-on-surface flex items-center gap-1.5">
                        Solis Energy Infra
                      </div>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="font-label-sm text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed">Tier 1 Enterprise</span>
<span class="text-secondary text-[11px]">Renewables</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-3">
<div class="font-label-md text-label-md font-semibold text-on-surface">Kavita Narang</div>
<div class="text-secondary text-[11px] truncate max-w-[140px]">k.narang@solis-grid.eu</div>
</td>
<td class="py-3.5 px-3">
<div class="flex items-center gap-1">
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-fixed text-on-secondary-fixed">4 Active</span>
<span class="px-1.5 py-0.5 rounded font-label-sm text-[10px] bg-surface-container-high text-secondary">0 Quoted</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-tertiary-fixed/40 text-tertiary-container">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                    94/100
                  </div>
</td>
<td class="py-3.5 px-4 text-right">
<div class="font-label-md text-label-md font-bold text-on-surface">$520,000</div>
<div class="text-[11px] text-secondary">Renews Jul 2026</div>
</td>
<td class="py-3.5 px-3 text-center">
<button class="p-1 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" title="View 360 Dossier" type="button">
<span class="material-symbols-outlined text-[17px]">visibility</span>
</button>
</td>
</tr>
<!-- Row 5: Vantage Robotics AI -->
<tr class="client-row cursor-pointer hover:bg-surface-container-low/60 transition-colors" data-client="vantage">
<td class="py-3.5 px-4">
<div class="flex items-center gap-2.5">
<div class="w-8 h-8 rounded bg-surface-container-high text-on-surface font-bold text-xs uppercase flex items-center justify-center">
                      VR
                    </div>
<div>
<div class="font-headline-sm text-body-md font-bold text-on-surface flex items-center gap-1.5">
                        Vantage Robotics AI
                      </div>
<div class="flex items-center gap-1.5 mt-0.5">
<span class="font-label-sm text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary">Mid-Market</span>
<span class="text-secondary text-[11px]">Industrial AI</span>
</div>
</div>
</div>
</td>
<td class="py-3.5 px-3">
<div class="font-label-md text-label-md font-semibold text-on-surface">Markus Lindqvist</div>
<div class="text-secondary text-[11px] truncate max-w-[140px]">m.lind@vantagerobotics.com</div>
</td>
<td class="py-3.5 px-3">
<div class="flex items-center gap-1">
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-fixed text-on-secondary-fixed">1 Active</span>
<span class="px-1.5 py-0.5 rounded font-label-sm text-[10px] bg-surface-container-high text-secondary">1 Quoted</span>
</div>
</td>
<td class="py-3.5 px-3 text-center">
<div class="inline-flex items-center gap-1 px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-tertiary-fixed/30 text-tertiary-container">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                    86/100
                  </div>
</td>
<td class="py-3.5 px-4 text-right">
<div class="font-label-md text-label-md font-bold text-on-surface">$89,000</div>
<div class="text-[11px] text-secondary">Renews Mar 2026</div>
</td>
<td class="py-3.5 px-3 text-center">
<button class="p-1 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" title="View 360 Dossier" type="button">
<span class="material-symbols-outlined text-[17px]">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Directory Footer / Pagination -->
<div class="p-3 bg-surface-container-low/40 flex items-center justify-between font-label-sm text-label-sm text-secondary">
<div class="flex items-center gap-2">
<span>Showing 1-5 of 142 clients</span>
<span class="w-1 h-1 rounded-full bg-secondary/50"></span>
<span>Sorted by Commercial Priority</span>
</div>
<div class="flex items-center gap-1">
<button class="p-1 rounded hover:bg-surface-container-high text-secondary disabled:opacity-40" disabled="">
<span class="material-symbols-outlined text-sm">chevron_left</span>
</button>
<span class="px-2 py-0.5 rounded bg-surface-container-lowest font-bold text-primary shadow-sm">1</span>
<button class="px-2 py-0.5 rounded hover:bg-surface-container-high">2</button>
<button class="px-2 py-0.5 rounded hover:bg-surface-container-high">3</button>
<span class="px-1 text-secondary">...</span>
<button class="px-2 py-0.5 rounded hover:bg-surface-container-high">29</button>
<button class="p-1 rounded hover:bg-surface-container-high text-secondary">
<span class="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>
<!-- Right Panel: Selected Customer 360 Flyout / Detail Inspector (5 Cols Desktop) -->
<div class="lg:col-span-5 xl:col-span-5 flex flex-col gap-4">
<!-- Main Inspector Card -->
<div class="bg-surface-container-lowest rounded shadow-sm overflow-hidden flex flex-col">
<!-- Selected Client Header Profile -->
<div class="p-5 bg-gradient-to-r from-primary to-primary-container text-on-primary relative">
<div class="flex items-start justify-between gap-3 relative z-10">
<div class="flex items-center gap-3">
<div class="w-12 h-12 rounded bg-surface-container-lowest p-1 shadow-md flex items-center justify-center text-primary font-extrabold text-base tracking-tight">
<span class="material-symbols-outlined text-2xl text-primary">token</span>
</div>
<div>
<div class="flex items-center gap-2">
<h2 class="font-headline-md text-headline-md font-bold tracking-tight text-on-primary">Apex Global Corp</h2>
<span class="px-2 py-0.5 rounded bg-tertiary-container text-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">Enterprise Active</span>
</div>
<div class="text-on-primary-container text-body-sm font-medium mt-0.5 flex items-center gap-2">
<span>ID: ACC-7049-APX</span>
<span>•</span>
<span>Fintech Core Tier 1</span>
</div>
</div>
</div>
<!-- Quick action icon -->
<button class="p-1.5 rounded bg-surface-container-lowest/15 hover:bg-surface-container-lowest/30 text-on-primary transition-colors" title="Export Client Dossier PDF">
<span class="material-symbols-outlined text-lg">picture_as_pdf</span>
</button>
</div>
<!-- Key Executive Account Owner Strip -->
<div class="mt-4 pt-3 border-t border-surface-container-lowest/15 flex items-center justify-between text-xs text-on-primary-container">
<div class="flex items-center gap-2">
<img class="w-6 h-6 rounded-full object-cover ring-1 ring-on-primary-container/40" data-alt="Professional headshot of senior account executive Marcus Vance dressed in crisp executive attire with neutral high-end corporate office background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQOc4qtoZgB2yea6lI9-hCTna646nshFmfnvxmHG4A-A8ND9U_DmxpMpy2eME80uwjD3D3jzixEiLPHIbI0wwwDFb4wrCVZsMfJ9poB_abIL9mSYpXRoFgoRhXkiZEmPAF3axIAHe_26pqTGXiT1lzoLJYUTMqOazdZUSZfrLFbpwiO3iJ5x3bdVQLQhQHjtsr7HM1Bqk-X--jpNm8KEbyzgdWvqm2bfNpt4oZuIc"/>
<span class="font-medium text-on-primary">Marcus Vance</span>
<span class="text-on-primary-container/80 text-[11px]">(Lead Client Partner)</span>
</div>
<div class="flex items-center gap-1 font-semibold text-tertiary-fixed">
<span class="material-symbols-outlined text-sm">shield</span>
                99.98% SLA
              </div>
</div>
</div>
<!-- Segmented Tab Navigation for Detail Inspector -->
<div class="px-4 pt-3 bg-surface-container-low/40">
<div class="flex items-center gap-1 bg-surface-container-high/60 p-1 rounded font-label-sm text-label-sm font-semibold text-secondary">
<button class="flex-1 py-1.5 text-center rounded bg-surface-container-lowest text-primary shadow-sm transition-all" onclick="switchInspectorTab('contracts', this)">Contracts &amp; SLA</button>
<button class="flex-1 py-1.5 text-center rounded text-secondary hover:text-on-surface transition-all" onclick="switchInspectorTab('orders', this)">Service Orders</button>
<button class="flex-1 py-1.5 text-center rounded text-secondary hover:text-on-surface transition-all" onclick="switchInspectorTab('timeline', this)">Timeline</button>
<button class="flex-1 py-1.5 text-center rounded text-secondary hover:text-on-surface transition-all" onclick="switchInspectorTab('invoices', this)">Invoices</button>
</div>
</div>
<!-- Tab Content Area -->
<div class="p-5 flex flex-col gap-4">
<!-- Tab Pane 1: Contracts & SLA (Active Default) -->
<div class="flex flex-col gap-4" id="tab-contracts">
<!-- Active SLA Live Status Box -->
<div class="p-3.5 rounded bg-surface-container-low flex flex-col gap-2.5">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse"></span>
<span class="font-label-md text-label-md font-bold text-on-surface">Mission-Critical Tier 1 SLA</span>
</div>
<span class="font-label-sm text-label-sm font-bold text-tertiary-container bg-tertiary-fixed/30 px-2 py-0.5 rounded">
                    Contract Compliant
                  </span>
</div>
<div class="grid grid-cols-2 gap-2 mt-1">
<div class="p-2.5 rounded bg-surface-container-lowest shadow-sm">
<div class="text-[11px] text-secondary font-medium">Uptime Delivered</div>
<div class="font-headline-sm text-headline-sm font-bold text-primary mt-0.5">99.98%</div>
<div class="text-[10px] text-tertiary-container font-semibold mt-0.5">Target: 99.95%</div>
</div>
<div class="p-2.5 rounded bg-surface-container-lowest shadow-sm">
<div class="text-[11px] text-secondary font-medium">Engineering Pod</div>
<div class="font-headline-sm text-headline-sm font-bold text-primary mt-0.5">Dedicated 24/7</div>
<div class="text-[10px] text-secondary font-medium mt-0.5">Alpha-9 Platform Core</div>
</div>
</div>
<!-- Live SLA Chart Element -->
<div class="pt-2 flex items-center justify-between text-xs text-secondary">
<span>Incident MTTR Avg: <strong class="text-on-surface font-semibold">14 mins</strong></span>
<span>Escalation window: <strong class="text-on-surface font-semibold">Under 30 mins</strong></span>
</div>
</div>
<!-- Contract Master Details -->
<div class="space-y-2">
<div class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Active Agreement Details</div>
<div class="p-3 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary text-xl">description</span>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">MSA Enterprise Master v3</div>
<div class="text-[11px] text-secondary">Valid Oct 01, 2024 – Nov 30, 2025 • Auto-renewing</div>
</div>
</div>
<span class="font-label-md text-label-md font-bold text-primary">$340,000/yr</span>
</div>
<div class="p-3 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-secondary text-xl">security</span>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">DPA &amp; SOC2 Type II Addendum</div>
<div class="text-[11px] text-secondary">Compliant • Global EU/US Data Sovereignty</div>
</div>
</div>
<span class="font-label-sm text-label-sm text-tertiary-container font-bold">Active</span>
</div>
</div>
<!-- Recent Interaction Feed -->
<div class="space-y-2">
<div class="flex items-center justify-between">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">Recent Communications &amp; Logs</span>
<a class="font-label-sm text-label-sm text-primary font-bold hover:underline" href="#">View All (48)</a>
</div>
<div class="p-3 rounded bg-surface-container-low flex items-start gap-3">
<div class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
<span class="material-symbols-outlined text-sm">groups</span>
</div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between">
<span class="font-label-md text-label-md font-bold text-on-surface">Executive Quarterly Review</span>
<span class="text-[10px] text-secondary font-medium">Oct 24, 2024</span>
</div>
<p class="font-body-sm text-body-sm text-secondary mt-0.5">
                      Conducted by <strong class="text-on-surface font-semibold">Marcus Vance</strong> with CTO Elena Rostova. Alignment achieved on Q1 infrastructure cloud scaling and security penetration testing sign-off.
                    </p>
<div class="mt-2 flex items-center gap-2">
<span class="px-2 py-0.5 rounded bg-surface-container-highest text-secondary text-[10px] font-semibold">Sentiment: Positive (9.5/10)</span>
<span class="px-2 py-0.5 rounded bg-surface-container-highest text-secondary text-[10px] font-semibold">Action Items: 2 Logged</span>
</div>
</div>
</div>
<div class="p-3 rounded bg-surface-container-low flex items-start gap-3">
<div class="w-7 h-7 rounded-full bg-surface-container-high text-secondary flex items-center justify-center shrink-0 mt-0.5">
<span class="material-symbols-outlined text-sm">mail</span>
</div>
<div class="flex-1 min-w-0">
<div class="flex items-center justify-between">
<span class="font-label-md text-label-md font-bold text-on-surface">SOW Amendment Dispatched</span>
<span class="text-[10px] text-secondary font-medium">Oct 19, 2024</span>
</div>
<p class="font-body-sm text-body-sm text-secondary mt-0.5">
                      Transmitted revised cloud pod auto-scaler addendum. Awaiting signature from Legal Counsel.
                    </p>
</div>
</div>
</div>
</div>
<!-- Tab Pane 2: Service Orders (Hidden initially) -->
<div class="hidden flex-col gap-3" id="tab-orders">
<div class="space-y-2">
<div class="p-3 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">WO-8891: Realtime Fraud Guard V2</div>
<div class="text-[11px] text-secondary">Pod: Alpha-9 • Completion: 78% • Sprint 14</div>
</div>
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-fixed text-on-secondary-fixed">In Progress</span>
</div>
<div class="p-3 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">WO-8703: Disaster Recovery Hot-Site</div>
<div class="text-[11px] text-secondary">Pod: Infra-Ops • Completion: 95% • Validation</div>
</div>
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-fixed text-on-secondary-fixed">In Progress</span>
</div>
<div class="p-3 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">QUO-1044: Multi-Region APAC Gateway</div>
<div class="text-[11px] text-secondary">Estimated: $65,000 • Scoping finalized</div>
</div>
<span class="px-2 py-0.5 rounded font-label-sm text-label-sm font-bold bg-secondary-container text-primary">Quoted</span>
</div>
</div>
</div>
<!-- Tab Pane 3: Timeline (Hidden initially) -->
<div class="hidden flex-col gap-3" id="tab-timeline">
<div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-highest">
<div class="relative">
<span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest"></span>
<div class="font-label-sm text-label-sm font-bold text-on-surface">Annual Executive Review completed</div>
<div class="text-[11px] text-secondary">Oct 24, 2024 at 14:00 UTC by Marcus Vance</div>
</div>
<div class="relative">
<span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-tertiary-container ring-2 ring-surface-container-lowest"></span>
<div class="font-label-sm text-label-sm font-bold text-on-surface">SLA Milestone: 99.98% Quarterly Target met</div>
<div class="text-[11px] text-secondary">Oct 01, 2024 by Automated Telemetry Guard</div>
</div>
<div class="relative">
<span class="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
<div class="font-label-sm text-label-sm font-bold text-on-surface">Contract Addendum Signed: Cloud Pod V3</div>
<div class="text-[11px] text-secondary">Sep 15, 2024 by Elena Rostova</div>
</div>
</div>
</div>
<!-- Tab Pane 4: Invoices (Hidden initially) -->
<div class="hidden flex-col gap-3" id="tab-invoices">
<div class="space-y-2">
<div class="p-3 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">INV-2024-Q3-018</div>
<div class="text-[11px] text-secondary">Paid on Oct 04, 2024 • Wire Transfer</div>
</div>
<div class="text-right">
<div class="font-label-md text-label-md font-bold text-on-surface">$85,000.00</div>
<span class="text-[10px] text-tertiary-container font-bold">Cleared</span>
</div>
</div>
<div class="p-3 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between">
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">INV-2024-Q2-089</div>
<div class="text-[11px] text-secondary">Paid on Jul 02, 2024 • Wire Transfer</div>
</div>
<div class="text-right">
<div class="font-label-md text-label-md font-bold text-on-surface">$85,000.00</div>
<span class="text-[10px] text-tertiary-container font-bold">Cleared</span>
</div>
</div>
</div>
</div>
</div>
<!-- Bottom Action Suite for Selected Client -->
<div class="p-4 bg-surface-container-low/60 flex flex-wrap items-center justify-between gap-2.5 border-t border-surface-container-high/40">
<button class="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold px-3 py-2 rounded shadow-sm transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[17px]">add_task</span>
              Create Work Order
            </button>
<button class="inline-flex items-center justify-center gap-1.5 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-label-md text-label-md font-semibold px-3 py-2 rounded shadow-sm transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[17px] text-secondary">calendar_add_on</span>
              Schedule Review
            </button>
<button class="inline-flex items-center justify-center gap-1.5 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low font-label-md text-label-md font-semibold px-3 py-2 rounded shadow-sm transition-all active:scale-[0.98]" type="button">
<span class="material-symbols-outlined text-[17px] text-secondary">note_add</span>
              Log Interaction
            </button>
</div>
</div>
<!-- Secondary Diagnostic / Client Portfolio Health Widget -->
<div class="p-4 rounded bg-surface-container-lowest shadow-sm flex items-center justify-between gap-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded bg-tertiary-fixed/40 text-tertiary-container flex items-center justify-center">
<span class="material-symbols-outlined text-xl">troubleshoot</span>
</div>
<div>
<div class="font-label-md text-label-md font-bold text-on-surface">Client Health Diagnostics</div>
<div class="text-[12px] text-secondary">Net Promoter Score (NPS): <strong class="text-primary font-bold">+84</strong> • Churn Risk: <strong>Minimal</strong></div>
</div>
</div>
<button class="px-2.5 py-1 rounded bg-surface-container-low hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-bold transition-colors">
            Run Audit
          </button>
</div>
</div>
</div>
</section>
<!-- Interactive Client Selector & Tab Handler Script -->
<script>
    function switchInspectorTab(tabKey, buttonEl) {
      const tabs = ['contracts', 'orders', 'timeline', 'invoices'];
      tabs.forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) {
          if (t === tabKey) {
            el.classList.remove('hidden');
            el.classList.add('flex');
          } else {
            el.classList.add('hidden');
            el.classList.remove('flex');
          }
        }
      });

      // Update active button state
      const siblings = buttonEl.parentElement.querySelectorAll('button');
      siblings.forEach(btn => {
        btn.classList.remove('bg-surface-container-lowest', 'text-primary', 'shadow-sm');
        btn.classList.add('text-secondary');
      });
      buttonEl.classList.remove('text-secondary');
      buttonEl.classList.add('bg-surface-container-lowest', 'text-primary', 'shadow-sm');
    }

    // Row selection micro-interaction
    document.querySelectorAll('.client-row').forEach(row => {
      row.addEventListener('click', function() {
        document.querySelectorAll('.client-row').forEach(r => {
          r.classList.remove('bg-secondary-container/20');
        });
        this.classList.add('bg-secondary-container/20');
      });
    });

    // Client search filter interaction
    const searchInput = document.getElementById('clientSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.client-row').forEach(row => {
          const text = row.innerText.toLowerCase();
          if (text.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }

    // Tier dropdown filter
    const tierSelect = document.getElementById('tierFilter');
    if (tierSelect) {
      tierSelect.addEventListener('change', function(e) {
        const val = e.target.value;
        document.querySelectorAll('.client-row').forEach(row => {
          if (val === 'all') {
            row.style.display = '';
          } else if (val === 'tier1' && (row.innerText.includes('Tier 1 Enterprise') || row.innerText.includes('Tier 1'))) {
            row.style.display = '';
          } else if (val === 'mid' && row.innerText.includes('Mid-Market')) {
            row.style.display = '';
          } else if (val === 'smb' && row.innerText.includes('SMB')) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
  </script>
</div></main></div></body></html>
```


### 14.4. Service Catalogue Engine

```html
<!DOCTYPE html>

<html class="h-full" lang="en"><head><meta charset="utf-8"/><meta content="width=device-width, initial-scale=1.0" name="viewport"/><meta content="web_dashboard" name="shell-type"/><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;family=Manrope:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/><style>@layer base { html, body { margin: 0; padding: 0; } body { overscroll-behavior: none; } main > :first-child { margin-top: 0 !important; } main > :last-child { margin-bottom: 0 !important; } } ::-webkit-scrollbar { display: none; }</style><script src="https://cdn.tailwindcss.com"></script><script id="tailwind-config">tailwind.config = { darkMode: "class", theme: { extend: { "colors": { "secondary-fixed-dim": "#bec6e0", "on-tertiary-fixed": "#002113", "surface-tint": "#4059aa", "on-error-container": "#93000a", "secondary": "#565e74", "tertiary": "#00311f", "surface-bright": "#f7f9fb", "on-surface-variant": "#444651", "surface-container-low": "#f2f4f6", "on-tertiary-fixed-variant": "#005236", "inverse-surface": "#2d3133", "on-primary-fixed": "#00164e", "on-error": "#ffffff", "on-secondary-fixed": "#131b2e", "surface": "#f7f9fb", "on-primary-fixed-variant": "#264191", "background": "#f7f9fb", "on-secondary": "#ffffff", "error-container": "#ffdad6", "primary": "#00236f", "tertiary-fixed-dim": "#4edea3", "outline": "#757682", "primary-container": "#1e3a8a", "primary-fixed": "#dce1ff", "on-primary": "#ffffff", "inverse-on-surface": "#eff1f3", "on-secondary-fixed-variant": "#3f465c", "on-surface": "#191c1e", "inverse-primary": "b6c4ff", "surface-container-highest": "#e0e3e5", "on-secondary-container": "#5c647a", "on-tertiary": "#ffffff", "tertiary-fixed": "#6ffbbe", "outline-variant": "#c5c5d3", "secondary-container": "#dae2fd", "tertiary-container": "#004a31", "on-background": "#191c1e", "surface-container": "#eceef0", "surface-container-high": "#e6e8ea", "primary-fixed-dim": "#b6c4ff", "surface-dim": "#d8dadc", "on-primary-container": "#90a8ff", "on-tertiary-container": "#27c38a", "secondary-fixed": "#dae2fd", "error": "#ba1a1a", "surface-container-lowest": "#ffffff", "surface-variant": "#e0e3e5" }, "borderRadius": { "DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem" }, "spacing": { "space-md": "0.75rem", "margin-md": "1.5rem", "space-sm": "0.5rem", "space-xs": "0.25rem", "gutter": "1rem", "margin-lg": "2rem", "gutter-lg": "1.5rem", "space-lg": "1rem", "margin": "1rem", "space-xl": "1.5rem" }, "fontFamily": { "headline-lg": [ "Plus Jakarta Sans" ], "label-md": [ "Manrope" ], "headline-xl-mobile": [ "Plus Jakarta Sans" ], "headline-xl": [ "Plus Jakarta Sans" ], "body-lg": [ "Manrope" ], "kpi-display": [ "Plus Jakarta Sans" ], "label-lg": [ "Manrope" ], "headline-md": [ "Plus Jakarta Sans" ], "headline-sm": [ "Plus Jakarta Sans" ], "body-sm": [ "Manrope" ], "body-md": [ "Manrope" ], "label-sm": [ "Manrope" ] }, "fontSize": { "headline-lg": [ "1.5rem", { "lineHeight": "2rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "label-md": [ "0.75rem", { "lineHeight": "1rem", "letterSpacing": "0.02em", "fontWeight": "600" } ], "headline-xl-mobile": [ "1.625rem", { "lineHeight": "2.125rem", "letterSpacing": "-0.02em", "fontWeight": "700" } ], "headline-xl": [ "2rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.025em", "fontWeight": "700" } ], "body-lg": [ "1rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "400" } ], "kpi-display": [ "2.25rem", { "lineHeight": "2.5rem", "letterSpacing": "-0.03em", "fontWeight": "700" } ], "label-lg": [ "0.875rem", { "lineHeight": "1.25rem", "letterSpacing": "0em", "fontWeight": "600" } ], "headline-md": [ "1.25rem", { "lineHeight": "1.75rem", "letterSpacing": "-0.015em", "fontWeight": "600" } ], "headline-sm": [ "1.125rem", { "lineHeight": "1.5rem", "letterSpacing": "-0.01em", "fontWeight": "600" } ], "body-sm": [ "0.75rem", { "lineHeight": "1.125rem", "letterSpacing": "0em", "fontWeight": "400" } ], "body-md": [ "0.875rem", { "lineHeight": "1.375rem", "letterSpacing": "-0.005em", "fontWeight": "400" } ], "label-sm": [ "0.6875rem", { "lineHeight": "0.875rem", "letterSpacing": "0.05em", "fontWeight": "700" } ] } } } };</script></head><body class="bg-background font-body-md text-body-md text-on-surface min-h-screen selection:bg-secondary-container selection:text-on-secondary-fixed"><header class="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant/30 z-50 flex items-center justify-between px-gutter lg:px-gutter-lg"><div class="flex items-center gap-space-lg"><div class="flex items-center gap-space-sm"><img alt="Hopepitome Enterprise Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1W5FyD-T-ETGrZeAB0rljmlF7OY6fBThr1Ap9xh8GGHTcmh8-wWpWMifJciY6zVEzisaMKsUZnvmpkKbeBcNIq1ZsngZQnEZQ_T1JvixPdKYnUXCMlGN92vsMcbzAGxYjR92GAQZcVLM81J5ZjXgzkuneudDCzLF-uc3wbixBLleDFADK0rnvKrTjvoIIyfofPk_jFx9eoE3rDwYM4v-f3AfL6pLkUZc9Qij1WxXUG3"/><span class="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">Hopepitome</span></div><span class="hidden xl:inline-flex items-center px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold">OPERATIONS SUITE v2.4</span><div class="h-5 w-[1px] bg-outline-variant/40 hidden md:block"></div><nav class="hidden lg:flex items-center gap-space-md h-14" data-active-classes="text-primary font-semibold border-b-2 border-primary"><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="project-hub" href="#">Project Hub</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="customer-360" href="#">Customer 360 &amp; CRM</a><a aria-current="page" class="transition-colors px-space-xs py-4 flex items-center text-primary font-semibold border-b-2 border-primary" data-path="service-catalog-engine" href="#">Service Catalog</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="employee-directory" href="#">Employee &amp; Teams</a><a class="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors px-space-xs py-4 flex items-center" data-path="commercial-quotations" href="#">Finance &amp; Billing</a></nav></div><div class="flex items-center gap-space-md"><div class="relative hidden sm:flex items-center"><span class="material-symbols-outlined absolute left-2.5 text-secondary text-[18px] pointer-events-none">search</span><input class="w-56 md:w-72 h-8.5 pl-8 pr-12 rounded bg-surface-container-low border border-outline-variant/40 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all" placeholder="Search operations, projects, entities..." type="text"/><span class="absolute right-2 px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-label-sm text-[10px] border border-outline-variant/40 font-semibold">⌘K</span></div><div class="hidden md:flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-low border border-outline-variant/30"><span class="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span><span class="font-label-sm text-label-sm text-tertiary-container uppercase tracking-wider font-bold">PROD-LIVE</span></div><button class="relative p-1.5 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" type="button"><span class="material-symbols-outlined text-[20px]">notifications</span><span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span></button><div class="flex items-center gap-space-xs px-space-sm py-1 rounded border border-outline-variant/40 bg-surface-container-low cursor-pointer hover:bg-surface-container-high transition-colors"><span class="font-label-md text-label-md font-semibold text-primary">Super Admin</span><span class="material-symbols-outlined text-[16px] text-secondary">arrow_drop_down</span></div><div class="flex items-center pl-space-xs"><img alt="Profile" class="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6rQP5t0iQXNKmdqrkeUcpH0hED2b4H64XZpZiX8msqz4UzuKMrIudPxiAv4ISfLNnbNYhaT_qC8XA6tFKp2_Hy_yWvTRTppPTOF-yoa6OBnCmTp8t-YPbaf91nwuf3w9xg9Q7Jw9vIs2rlDYjfNjKePwevFgm7YwHBhbEWCItEqNumsCZAEKOGLgtVh0Xses4RbYKd4aeo5PDcz7uQRJ_rJlxatuqFINqrkHkHg0"/></div></div></header><aside class="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant/30 z-40 flex flex-col justify-between overflow-y-auto"><div class="p-space-md"><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">DELIVERY &amp; PROJECTS</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="project-hub" href="#"><span class="material-symbols-outlined text-[18px]">view_kanban</span><span>Project Management &amp; Board</span></a><a aria-current="page" class="flex items-center gap-space-sm px-space-sm py-1.5 rounded transition-colors bg-primary-container text-on-primary font-semibold" data-path="service-catalog-engine" href="#"><span class="material-symbols-outlined text-[18px]">category</span><span>Service Catalogue Engine</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="customer-360" href="#"><span class="material-symbols-outlined text-[18px]">contact_page</span><span>Customer 360 Directory</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="staff-task-board" href="#"><span class="material-symbols-outlined text-[18px]">assignment_ind</span><span>Staff Task Board</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="deliverables-vault" href="#"><span class="material-symbols-outlined text-[18px]">inventory_2</span><span>Deliverables Vault</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="career-work-orders" href="#"><span class="material-symbols-outlined text-[18px]">engineering</span><span>Career Work Orders</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sla-support" href="#"><span class="material-symbols-outlined text-[18px]">verified</span><span>SLA Support &amp; Maintenance</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="audit-trail" href="#"><span class="material-symbols-outlined text-[18px]">policy</span><span>Audit Trail &amp; Logs</span></a></nav></div><div class="mb-space-lg"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">CRM &amp; SALES</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="crm-overview" href="#"><span class="material-symbols-outlined text-[18px]">query_stats</span><span>CRM Overview</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="leads-inbox" href="#"><span class="material-symbols-outlined text-[18px]">move_to_inbox</span><span>Leads Inbox</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-pipeline" href="#"><span class="material-symbols-outlined text-[18px]">timeline</span><span>Sales Pipeline</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="commercial-quotations" href="#"><span class="material-symbols-outlined text-[18px]">request_quote</span><span>Commercial Quotations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="consultations" href="#"><span class="material-symbols-outlined text-[18px]">forum</span><span>Consultations</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="sales-analytics" href="#"><span class="material-symbols-outlined text-[18px]">bar_chart</span><span>Sales Analytics</span></a></nav></div><div class="mb-space-md"><div class="px-space-sm mb-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">TEAM &amp; ORG</div><nav class="space-y-0.5" data-active-classes="bg-primary-container text-on-primary font-semibold"><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="employee-directory" href="#"><span class="material-symbols-outlined text-[18px]">badge</span><span>Employee Directory</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="roles-permissions" href="#"><span class="material-symbols-outlined text-[18px]">admin_panel_settings</span><span>Roles &amp; Permissions</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="departments" href="#"><span class="material-symbols-outlined text-[18px]">corporate_fare</span><span>Departments</span></a><a class="flex items-center gap-space-sm px-space-sm py-1.5 rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-colors" data-path="activity-logs" href="#"><span class="material-symbols-outlined text-[18px]">history</span><span>Activity Logs</span></a></nav></div></div><div class="p-space-md border-t border-outline-variant/30 bg-surface-container-low/40"><div class="mb-space-sm"><div class="flex justify-between items-center mb-1"><span class="font-label-sm text-label-sm text-secondary">Enterprise Cluster</span><span class="font-label-sm text-label-sm font-semibold text-primary">92.4%</span></div><div class="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden"><div class="bg-primary-container h-full rounded-full" style="width: 92.4%"></div></div><div class="flex justify-between text-[11px] text-secondary mt-1 font-body-sm"><span>Storage: 4.6TB / 5.0TB</span><span class="text-tertiary-container font-semibold">Optimal</span></div></div><a class="flex items-center justify-between px-space-sm py-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md" href="#"><span class="flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">help_outline</span>Documentation &amp; Support</span><span class="material-symbols-outlined text-[16px]">north_east</span></a></div></aside><div class="pl-64"><main class="w-full pt-14 bg-background min-h-screen"><div class="flex flex-col w-full">
<div class="p-gutter lg:p-gutter-lg flex flex-col gap-space-xl max-w-[1720px] mx-auto w-full">
<!-- Breadcrumb & Top Bar -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-space-xs font-label-sm text-label-sm uppercase tracking-wider text-secondary">
<span class="hover:text-primary cursor-pointer transition-colors">Operations</span>
<span class="material-symbols-outlined text-[14px]">chevron_right</span>
<span class="hover:text-primary cursor-pointer transition-colors">Delivery &amp; Projects</span>
<span class="material-symbols-outlined text-[14px]">chevron_right</span>
<span class="text-primary font-bold">Service Catalogue Engine</span>
</div>
<div class="flex items-baseline gap-space-md flex-wrap mt-0.5">
<h1 class="font-headline-xl text-headline-xl text-on-surface tracking-tight">Service Catalogue &amp; Solutions Matrix</h1>
<span class="px-2.5 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold tracking-wide uppercase">Engine Spec v4.19</span>
</div>
<p class="font-body-md text-body-md text-secondary max-w-3xl">
          Standardized operational service offerings, pricing tiers, SLA bundles, deliverable playbooks, and service provisioning templates.
        </p>
</div>
<!-- Header CTAs -->
<div class="flex items-center gap-space-sm flex-wrap self-start lg:self-auto">
<button class="flex items-center gap-2 px-space-md py-2 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-high transition-colors shadow-sm font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px] text-secondary">history</span>
<span>Version History</span>
</button>
<button class="flex items-center gap-2 px-space-md py-2 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-highest transition-colors font-label-md text-label-md" type="button">
<span class="material-symbols-outlined text-[18px]">publish</span>
<span>Publish Updates</span>
</button>
<button class="flex items-center gap-2 px-space-md py-2 rounded bg-primary-container text-on-primary hover:bg-primary transition-colors shadow-sm font-label-md text-label-md" onclick="document.getElementById('configureDrawer').classList.remove('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[18px]">add</span>
<span>Add Service Package</span>
</button>
</div>
</div>
<!-- Live Operational Metric Ribbons -->
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
<div class="p-space-lg rounded bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between text-secondary">
<span class="font-label-sm text-label-sm uppercase tracking-wider">Catalogued Bundles</span>
<span class="material-symbols-outlined text-[18px] text-primary">inventory</span>
</div>
<div class="my-space-sm flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-on-surface">34</span>
<span class="text-secondary font-label-sm text-label-sm">Active SKU Units</span>
</div>
<div class="flex items-center gap-1.5 text-tertiary-container font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[16px]">trending_up</span>
<span>+4 added this quarter</span>
</div>
</div>
<div class="p-space-lg rounded bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between text-secondary">
<span class="font-label-sm text-label-sm uppercase tracking-wider">Average Gross Margin</span>
<span class="material-symbols-outlined text-[18px] text-tertiary-container">analytics</span>
</div>
<div class="my-space-sm flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-on-surface">42.8%</span>
<span class="text-secondary font-label-sm text-label-sm">across catalog</span>
</div>
<div class="flex items-center gap-1.5 text-tertiary-container font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[16px]">check_circle</span>
<span>Above 38% corporate target</span>
</div>
</div>
<div class="p-space-lg rounded bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between text-secondary">
<span class="font-label-sm text-label-sm uppercase tracking-wider">Enterprise Run-Rate</span>
<span class="material-symbols-outlined text-[18px] text-surface-tint">payments</span>
</div>
<div class="my-space-sm flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-on-surface">$1.48M</span>
<span class="text-secondary font-label-sm text-label-sm">Committed ARR</span>
</div>
<div class="flex items-center gap-1.5 text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
<span class="material-symbols-outlined text-[16px]">verified</span>
<span>47 live SLA contracts</span>
</div>
</div>
<div class="p-space-lg rounded bg-surface-container-lowest shadow-sm flex flex-col justify-between">
<div class="flex items-center justify-between text-secondary">
<span class="font-label-sm text-label-sm uppercase tracking-wider">SLA Assurance Index</span>
<span class="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">verified_user</span>
</div>
<div class="my-space-sm flex items-baseline gap-2">
<span class="font-kpi-display text-kpi-display text-on-surface">99.96%</span>
<span class="text-secondary font-label-sm text-label-sm">Compliance</span>
</div>
<div class="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm">
<span class="w-2 h-2 rounded-full bg-tertiary-container"></span>
<span>Zero critical breach incidents</span>
</div>
</div>
</div>
<!-- Category Filter Controls & Utility Toolbar -->
<div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md p-space-sm rounded bg-surface-container-lowest shadow-sm">
<!-- Tabs -->
<div class="flex items-center gap-1 overflow-x-auto p-1 bg-surface-container-low rounded">
<button class="px-space-md py-1.5 rounded font-label-md text-label-md bg-primary-container text-on-primary whitespace-nowrap shadow-sm" type="button">
          All Services (34)
        </button>
<button class="px-space-md py-1.5 rounded font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors whitespace-nowrap" type="button">
          Cloud &amp; DevOps Solutions (12)
        </button>
<button class="px-space-md py-1.5 rounded font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors whitespace-nowrap" type="button">
          Software &amp; App Engineering (10)
        </button>
<button class="px-space-md py-1.5 rounded font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors whitespace-nowrap" type="button">
          Career &amp; Talent Transformation (8)
        </button>
<button class="px-space-md py-1.5 rounded font-label-md text-label-md text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors whitespace-nowrap" type="button">
          Managed IT &amp; SLA Support (4)
        </button>
</div>
<!-- Search & Filters -->
<div class="flex items-center gap-space-sm">
<div class="relative flex items-center flex-1 sm:w-64">
<span class="material-symbols-outlined absolute left-2.5 text-secondary text-[18px]">search</span>
<input class="w-full h-9 pl-8 pr-3 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-inner" placeholder="Filter packages, deliverables..." type="text"/>
</div>
<button class="flex items-center gap-1.5 h-9 px-3 rounded bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm" type="button">
<span class="material-symbols-outlined text-[16px]">tune</span>
<span>Attributes</span>
</button>
<button class="flex items-center gap-1.5 h-9 px-3 rounded bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm" type="button">
<span class="material-symbols-outlined text-[16px]">swap_vert</span>
<span>Sort By</span>
</button>
</div>
</div>
<!-- Main Operational Workspace: Split Grid with Catalog & Sidebar Insights -->
<div class="grid grid-cols-1 2xl:grid-cols-12 gap-space-xl items-start">
<!-- Catalog Grid: 8 Columns -->
<div class="2xl:col-span-8 flex flex-col gap-space-lg">
<!-- Card 1: Enterprise Cloud Infrastructure Architecture -->
<div class="group p-space-xl rounded bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md relative overflow-hidden">
<div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container via-surface-tint to-tertiary-fixed-dim"></div>
<div class="flex flex-col lg:flex-row lg:items-start justify-between gap-space-sm">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2 flex-wrap">
<span class="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold uppercase">Division: IT Services</span>
<span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">Standard SLA Tier: 99.9%</span>
<span class="flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary text-tertiary-fixed font-label-sm text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
                  14 Active Deployments
                </span>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface group-hover:text-primary-container transition-colors mt-1">
                Enterprise Cloud Infrastructure Architecture
              </h2>
<p class="font-body-sm text-body-sm text-secondary">
                Production-grade multi-tenant and hybrid AWS/GCP cloud topology setups with security governance, automated autoscaling, and zero-downtime resilience blueprints.
              </p>
</div>
<!-- Price Tag -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col items-start lg:items-end min-w-[180px] shrink-0">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Standard Pricing</span>
<span class="font-headline-md text-headline-md text-primary font-bold">From $45,000</span>
<span class="font-label-sm text-label-sm text-secondary mt-0.5">Fixed Work Package</span>
</div>
</div>
<!-- Mid Metadata Matrix -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm p-space-md rounded bg-surface-container-low/70">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">timelapse</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Delivery Frame</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">4 - 6 Weeks</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">layers</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Artifact Blueprint</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">IAC &amp; Terraform v1.8</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">verified</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Operational Audit</p>
<p class="font-label-md text-label-md text-tertiary-container font-semibold">SOC2 &amp; HIPAA Ready</p>
</div>
</div>
</div>
<!-- Included Deliverables Pill Cluster -->
<div class="flex flex-col gap-1.5">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Included Core Deliverables</span>
<div class="flex flex-wrap gap-1.5">
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Multi-Region VPC Architecture
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Terraform IAC Repository
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> CI/CD Automated Pipelines
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> 99.9% Production SLA Tier
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Disaster Recovery Failover Runbook
              </span>
</div>
</div>
<!-- Actions -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs mt- space-xs">
<div class="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px]">account_tree</span>
<span>Linked to Template: <strong class="text-on-surface">IAC-AWS-PROD-v4</strong></span>
</div>
<div class="flex items-center gap-space-sm w-full sm:w-auto">
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md" type="button">
                View Playbook
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-colors font-label-md text-label-md" type="button">
                Configure Template
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md" type="button">
                Create Work Order
              </button>
</div>
</div>
</div>
<!-- Card 2: Full-Stack Custom SaaS Application Development -->
<div class="group p-space-xl rounded bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md relative overflow-hidden">
<div class="flex flex-col lg:flex-row lg:items-start justify-between gap-space-sm">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2 flex-wrap">
<span class="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed font-label-sm text-label-sm font-semibold uppercase">Division: Software Engineering</span>
<span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">Sprint Cycle: Bi-Weekly</span>
<span class="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                  9 Active Deployments
                </span>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface group-hover:text-primary-container transition-colors mt-1">
                Full-Stack Custom SaaS Application Development
              </h2>
<p class="font-body-sm text-body-sm text-secondary">
                Turnkey engineering of resilient cloud applications featuring responsive interfaces, domain-driven microservices, auth frameworks, and automated test coverages.
              </p>
</div>
<!-- Price Tag -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col items-start lg:items-end min-w-[180px] shrink-0">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Standard Pricing</span>
<span class="font-headline-md text-headline-md text-primary font-bold">From $75,000</span>
<span class="font-label-sm text-label-sm text-secondary mt-0.5">End-to-End Delivery</span>
</div>
</div>
<!-- Mid Metadata Matrix -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm p-space-md rounded bg-surface-container-low/70">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">date_range</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Delivery Frame</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">8 - 12 Weeks</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">code</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Tech Stack</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">React / Next.js / Go</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">bug_report</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Coverage Threshold</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">&gt;88% Unit &amp; Integration</p>
</div>
</div>
</div>
<!-- Included Deliverables Pill Cluster -->
<div class="flex flex-col gap-1.5">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Included Core Deliverables</span>
<div class="flex flex-wrap gap-1.5">
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Figma Design System &amp; Prototypes
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> React/Next.js Frontend Architecture
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Microservices Scalable Backend
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Comprehensive CI Test Suite
              </span>
</div>
</div>
<!-- Actions -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs mt-space-xs">
<div class="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px]">extension</span>
<span>Template: <strong class="text-on-surface">SAAS-CORP-FULL-02</strong></span>
</div>
<div class="flex items-center gap-space-sm w-full sm:w-auto">
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md" type="button">
                View Playbook
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-colors font-label-md text-label-md" type="button">
                Configure Template
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md" type="button">
                Create Work Order
              </button>
</div>
</div>
</div>
<!-- Card 3: Corporate Workforce AI Upskilling Program -->
<div class="group p-space-xl rounded bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md relative overflow-hidden">
<div class="flex flex-col lg:flex-row lg:items-start justify-between gap-space-sm">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2 flex-wrap">
<span class="px-2 py-0.5 rounded bg-surface-tint text-on-primary font-label-sm text-label-sm font-semibold uppercase">Division: Career Services</span>
<span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">Capacity: 25-50 Seats</span>
<span class="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
<span class="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>
                  6 Enterprise Cohorts
                </span>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface group-hover:text-primary-container transition-colors mt-1">
                Corporate Workforce AI Upskilling Program
              </h2>
<p class="font-body-sm text-body-sm text-secondary">
                Rigorous enterprise human-capital transformation syllabus enabling cross-functional units to master applied LLM pipelines, autonomous agents, and operational prompt engineering.
              </p>
</div>
<!-- Price Tag -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col items-start lg:items-end min-w-[180px] shrink-0">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Standard Pricing</span>
<span class="font-headline-md text-headline-md text-primary font-bold">From $25,000</span>
<span class="font-label-sm text-label-sm text-secondary mt-0.5">Per Corporate Cohort</span>
</div>
</div>
<!-- Mid Metadata Matrix -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm p-space-md rounded bg-surface-container-low/70">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">calendar_month</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Delivery Frame</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">6 Weeks (Intensive)</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">school</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Accreditation</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">Hopepitome Verified</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">psychology</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Practicum Track</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">Domain Practical Labs</p>
</div>
</div>
</div>
<!-- Included Deliverables Pill Cluster -->
<div class="flex flex-col gap-1.5">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Included Core Deliverables</span>
<div class="flex flex-wrap gap-1.5">
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> 12 Interactive Executive Workshops
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Custom LMS Enterprise Portal
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Practical Capstone Evaluations
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> 1-on-1 Senior Staff Coaching
              </span>
</div>
</div>
<!-- Actions -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs mt-space-xs">
<div class="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px]">groups</span>
<span>Template: <strong class="text-on-surface">ED-WORKFORCE-AI-01</strong></span>
</div>
<div class="flex items-center gap-space-sm w-full sm:w-auto">
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md" type="button">
                View Playbook
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-colors font-label-md text-label-md" type="button">
                Configure Template
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md" type="button">
                Create Work Order
              </button>
</div>
</div>
</div>
<!-- Card 4: 24/7 Mission-Critical SLA & DevOps Incident Support -->
<div class="group p-space-xl rounded bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col gap-space-md relative overflow-hidden">
<div class="flex flex-col lg:flex-row lg:items-start justify-between gap-space-sm">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2 flex-wrap">
<span class="px-2 py-0.5 rounded bg-tertiary text-tertiary-fixed font-label-sm text-label-sm font-semibold uppercase">Division: Managed IT</span>
<span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-medium">Tier: Tier-1 P0 Response</span>
<span class="flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse"></span>
                  18 Active Retainers
                </span>
</div>
<h2 class="font-headline-lg text-headline-lg text-on-surface group-hover:text-primary-container transition-colors mt-1">
                24/7 Mission-Critical SLA &amp; DevOps Incident Support
              </h2>
<p class="font-body-sm text-body-sm text-secondary">
                Always-on SRE monitoring, automated failover incident dispatch, live triage escalations, patch cycles, and dedicated on-call site reliability engineering.
              </p>
</div>
<!-- Price Tag -->
<div class="p-space-md rounded bg-surface-container-low flex flex-col items-start lg:items-end min-w-[180px] shrink-0">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Standard Pricing</span>
<span class="font-headline-md text-headline-md text-primary font-bold">$8,500 / mo</span>
<span class="font-label-sm text-label-sm text-secondary mt-0.5">Recurring Retainer</span>
</div>
</div>
<!-- Mid Metadata Matrix -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm p-space-md rounded bg-surface-container-low/70">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">sync</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Delivery Frame</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">Ongoing Retainer</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">timer</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Guaranteed Triage</p>
<p class="font-label-md text-label-md text-tertiary-container font-semibold">&lt; 15 Min SLA</p>
</div>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[20px]">security</span>
<div>
<p class="font-label-sm text-label-sm text-secondary uppercase">Escalation Channel</p>
<p class="font-label-md text-label-md text-on-surface font-semibold">PagerDuty &amp; Slack Bridged</p>
</div>
</div>
</div>
<!-- Included Deliverables Pill Cluster -->
<div class="flex flex-col gap-1.5">
<span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary">Included Core Deliverables</span>
<div class="flex flex-wrap gap-1.5">
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> 15-Minute Critical Incident Response SLA
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Enterprise PagerDuty + OpsGenie Integration
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Monthly Automated Security Audits
              </span>
<span class="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1.5">
<span class="material-symbols-outlined text-[14px] text-tertiary-container">check_circle</span> Bi-weekly Kernel &amp; Package Patching
              </span>
</div>
</div>
<!-- Actions -->
<div class="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs mt-space-xs">
<div class="flex items-center gap-2 text-secondary font-label-sm text-label-sm">
<span class="material-symbols-outlined text-[16px]">dns</span>
<span>Template: <strong class="text-on-surface">OPS-247-CRIT-SRE</strong></span>
</div>
<div class="flex items-center gap-space-sm w-full sm:w-auto">
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors font-label-md text-label-md" type="button">
                View Playbook
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim transition-colors font-label-md text-label-md" type="button">
                Configure Template
              </button>
<button class="flex-1 sm:flex-none px-space-md py-1.5 rounded bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md" type="button">
                Create Work Order
              </button>
</div>
</div>
</div>
</div>
<!-- Right Column: Stats, Compliance & Modular Item Builder (4 Columns) -->
<div class="2xl:col-span-4 flex flex-col gap-space-lg">
<!-- Most Requested Package Highlight Card -->
<div class="p-space-xl rounded bg-primary-container text-on-primary shadow-sm flex flex-col gap-space-md relative overflow-hidden">
<div class="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-surface-tint/30 blur-2xl pointer-events-none"></div>
<div class="flex items-center justify-between">
<span class="px-2.5 py-0.5 rounded bg-primary text-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Top Velocity Bundle
            </span>
<span class="material-symbols-outlined text-primary-fixed text-[20px]">stars</span>
</div>
<div class="flex flex-col gap-1">
<p class="font-headline-md text-headline-md font-bold text-on-primary">Enterprise Cloud Infrastructure</p>
<p class="font-body-sm text-body-sm text-primary-fixed-dim">
              Constitutes 41% of total Q1-Q2 enterprise proposals with an 88% quote-to-close conversion rate.
            </p>
</div>
<!-- Mini Inline Bar Visualization -->
<div class="flex flex-col gap-1.5 pt-space-xs">
<div class="flex justify-between font-label-sm text-label-sm text-primary-fixed">
<span>Delivery Velocity Index</span>
<span>4.8 / 5.0</span>
</div>
<div class="w-full bg-primary/60 h-2 rounded overflow-hidden">
<div class="bg-tertiary-fixed-dim h-full rounded" style="width: 96%"></div>
</div>
</div>
<div class="p-space-md rounded bg-primary/40 flex items-center justify-between">
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-primary-fixed">Current Backlog</span>
<span class="font-headline-sm text-headline-sm font-bold text-on-primary">14 Engagements</span>
</div>
<button class="px-3 py-1.5 rounded bg-on-primary text-primary hover:bg-surface-bright font-label-sm text-label-sm font-bold transition-colors" type="button">
              Inspect Capacity
            </button>
</div>
</div>
<!-- Real-Time SLA Compliance Checker -->
<div class="p-space-xl rounded bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">health_and_safety</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">SLA Compliance Validator</h3>
</div>
<span class="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">ALL PASS</span>
</div>
<p class="font-body-sm text-body-sm text-secondary">
            Continuous verification against operational staffing bandwidth, on-call schedules, and infrastructure dependencies.
          </p>
<div class="flex flex-col gap-space-xs">
<div class="p-2.5 rounded bg-surface-container-low flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-tertiary-container text-[18px]">verified</span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold">Tier 1 Incidents (15m SLA)</span>
</div>
<span class="text-tertiary-container font-label-sm text-label-sm font-bold">100% Covered</span>
</div>
<div class="p-2.5 rounded bg-surface-container-low flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-tertiary-container text-[18px]">verified</span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold">IAC Peer Verification Cycle</span>
</div>
<span class="text-tertiary-container font-label-sm text-label-sm font-bold">3 SREs Active</span>
</div>
<div class="p-2.5 rounded bg-surface-container-low flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-tertiary-container text-[18px]">verified</span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold">AI Upskilling Facilitator Ratio</span>
</div>
<span class="text-tertiary-container font-label-sm text-label-sm font-bold">1:12 Verified</span>
</div>
</div>
<!-- Instant Diagnostic Action -->
<div class="flex items-center justify-between pt-1">
<span class="font-label-sm text-label-sm text-secondary">Last automated probe: 3m ago</span>
<button class="text-primary hover:underline font-label-sm text-label-sm font-semibold flex items-center gap-1" type="button">
<span>Run Diagnostic Probe</span>
<span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Modular Service Item Builder Card -->
<div class="p-space-xl rounded bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[20px]">construction</span>
<h3 class="font-headline-sm text-headline-sm text-on-surface">Modular Add-on Engine</h3>
</div>
<span class="text-secondary font-label-sm text-label-sm">Dynamic SKU Stack</span>
</div>
<p class="font-body-sm text-body-sm text-secondary">
            Drag-or-toggle auxiliary technical modules into standard client work orders.
          </p>
<div class="flex flex-col gap-2">
<!-- Modular Item 1 -->
<label class="p-space-sm rounded bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between cursor-pointer">
<div class="flex items-center gap-2.5">
<input checked="" class="rounded border-outline-variant/40 text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
<div class="flex flex-col">
<span class="font-label-md text-label-md font-semibold text-on-surface">SOC2 Readiness Dossier</span>
<span class="font-body-sm text-body-sm text-secondary">+1 Week Deliverable</span>
</div>
</div>
<span class="font-label-sm text-label-sm font-bold text-on-surface">+$8,500</span>
</label>
<!-- Modular Item 2 -->
<label class="p-space-sm rounded bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between cursor-pointer">
<div class="flex items-center gap-2.5">
<input checked="" class="rounded border-outline-variant/40 text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
<div class="flex flex-col">
<span class="font-label-md text-label-md font-semibold text-on-surface">Multi-Region Hot Standby</span>
<span class="font-body-sm text-body-sm text-secondary">Zero-RPO Architecture</span>
</div>
</div>
<span class="font-label-sm text-label-sm font-bold text-on-surface">+$14,000</span>
</label>
<!-- Modular Item 3 -->
<label class="p-space-sm rounded bg-surface-container-low hover:bg-surface-container-high transition-colors flex items-center justify-between cursor-pointer">
<div class="flex items-center gap-2.5">
<input class="rounded border-outline-variant/40 text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
<div class="flex flex-col">
<span class="font-label-md text-label-md font-semibold text-on-surface">Custom White-Label LMS Branding</span>
<span class="font-body-sm text-body-sm text-secondary">Asset package bundle</span>
</div>
</div>
<span class="font-label-sm text-label-sm font-bold text-on-surface">+$3,200</span>
</label>
</div>
<button class="w-full py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center justify-center gap-2" type="button">
<span class="material-symbols-outlined text-[16px]">add_circle</span>
<span>Attach to Custom Quote</span>
</button>
</div>
<!-- Operational Health Card -->
<div class="p-space-lg rounded bg-surface-container-low flex flex-col gap-2">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-secondary text-[18px]">verified</span>
<span class="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">Service Governance Status</span>
</div>
<p class="font-body-sm text-body-sm text-secondary">
            All 34 catalog items currently comply with Hopepitome ISO-27001 operational blueprints and finance price-book authorizations.
          </p>
</div>
</div>
</div>
</div>
<!-- Side Drawer / Configuration Engine Overlay -->
<div class="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-surface-container-lowest shadow-2xl z-50 transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto" id="configureDrawer">
<div class="p-space-xl flex flex-col gap-space-lg">
<!-- Drawer Header -->
<div class="flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[22px]">tune</span>
<h2 class="font-headline-md text-headline-md text-on-surface">Configure Package Template</h2>
</div>
<button class="p-1 rounded hover:bg-surface-container-high text-secondary hover:text-on-surface transition-colors" onclick="document.getElementById('configureDrawer').classList.add('translate-x-full')" type="button">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
<p class="font-body-sm text-body-sm text-secondary">
        Define standard scope deliverables, pricing mechanisms, margin baseline, and linked delivery blueprints for this service SKU.
      </p>
<!-- Form Inputs -->
<div class="flex flex-col gap-space-md">
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Service Package Title</label>
<input class="h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" type="text" value="Enterprise Cloud Infrastructure Architecture"/>
</div>
<div class="grid grid-cols-2 gap-space-sm">
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Division Lead</label>
<select class="h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest">
<option selected="">IT Services</option>
<option>Software Engineering</option>
<option>Career Services</option>
<option>Managed IT</option>
</select>
</div>
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Standard Base Price</label>
<input class="h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" type="text" value="$45,000"/>
</div>
</div>
<div class="grid grid-cols-2 gap-space-sm">
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Est. Delivery Frame</label>
<input class="h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" type="text" value="4 - 6 Weeks"/>
</div>
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Target Margin %</label>
<input class="h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest" type="text" value="44.5%"/>
</div>
</div>
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Linked Playbook Blueprint</label>
<div class="p-2.5 rounded bg-surface-container-low flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-[18px]">menu_book</span>
<span class="font-label-sm text-label-sm text-on-surface font-semibold">PLAYBOOK-CLOUD-2024.pdf</span>
</div>
<button class="text-primary hover:underline font-label-sm text-label-sm font-semibold" type="button">Change</button>
</div>
</div>
<div class="flex flex-col gap-1">
<label class="font-label-sm text-label-sm text-secondary uppercase font-semibold">Standard SLA Commitment</label>
<select class="h-9 px-3 rounded bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest">
<option selected="">99.9% Availability (Production Standard)</option>
<option>99.99% Availability (High-Criticality)</option>
<option>15-Minute Response (Incident Retainer)</option>
<option>Best Effort (Advisory &amp; Training)</option>
</select>
</div>
</div>
</div>
<!-- Drawer Footer Actions -->
<div class="p-space-lg bg-surface-container-low flex items-center justify-between gap-space-sm">
<button class="flex-1 px-space-md py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors" onclick="document.getElementById('configureDrawer').classList.add('translate-x-full')" type="button">
        Cancel
      </button>
<button class="flex-1 px-space-md py-2 rounded bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md transition-colors" onclick="document.getElementById('configureDrawer').classList.add('translate-x-full')" type="button">
        Save Template
      </button>
</div>
</div>
</div></main></div></body></html>
```


## 15. Git and Antigravity handoff

### Recommended repository location

Commit this file at:

`docs/admin-dashboard/ADMIN_DASHBOARD_UI_UX_REFINEMENT.md`

Create the directory if it does not exist. Do not commit credentials, `.env.local`, service-account JSON files, private keys, shared secrets, Firebase tokens or client documents.

### Example Git commands

From the project root:

```bash
mkdir -p docs/admin-dashboard
# Copy this downloaded Markdown file into:
# docs/admin-dashboard/ADMIN_DASHBOARD_UI_UX_REFINEMENT.md

git add docs/admin-dashboard/ADMIN_DASHBOARD_UI_UX_REFINEMENT.md
git commit -m "docs: add admin dashboard UI UX refinement brief"
git push origin main
```

### Message to give Antigravity

```text
Read and follow this implementation brief:
`docs/admin-dashboard/ADMIN_DASHBOARD_UI_UX_REFINEMENT.md`

The file includes the full design requirements and four original HTML reference screens. Inspect the entire repository and all four HTML references first. Then refine the existing authenticated Admin Dashboard across all admin modules.

STRICT SCOPE: Admin Dashboard only. Do not modify the public website, Client Portal, Employee Portal, their routes, their styles or their authentication. Do not change Firebase, Firestore rules, Cloudflare Worker APIs, Google Apps Script, Google Drive integration or existing business logic.

Use the embedded HTML as design references, not as production replacement pages. Adapt the design into the existing component architecture. Prioritise font sizing, text alignment, spacing, responsive layout, mobile navigation, cards, tables, forms, drawers and accessibility. Preserve all existing interactions and data bindings.

Implement the changes, test all Admin Dashboard modules at the viewport sizes listed in the brief, fix issues found, and report the exact files changed plus confirmation that public, client and employee experiences were not modified.
```

## 16. Definition of done

The task is complete only when the Admin Dashboard looks cohesive and professional across modules, typography and spacing are consistent, mobile layouts are genuinely usable, existing admin workflows remain functional, and the public website plus Client and Employee Portals remain unchanged. Provide a concise implementation and QA report with any remaining limitations.
