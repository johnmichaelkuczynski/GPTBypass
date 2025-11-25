# GPTBypass Design Guidelines

## Design Approach
**System:** Material Design + Linear-inspired productivity aesthetic
**Rationale:** Combines Material's robust component patterns with Linear's refined typography and spacing for a productivity-focused text editing interface.

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - All UI text
- Monospace: JetBrains Mono - Code/technical content display

**Hierarchy:**
- H1: 2.5rem (40px), font-weight: 700, tracking tight
- H2: 1.5rem (24px), font-weight: 600
- Body: 0.875rem (14px), font-weight: 400, line-height: 1.6
- Small: 0.75rem (12px), font-weight: 500
- Button Text: 0.875rem (14px), font-weight: 600, uppercase tracking

## Layout Architecture

**Spacing System:**
Tailwind units: 2, 4, 6, 8, 12, 16 (p-2, p-4, gap-6, etc.)

**Grid Structure:**
- Fixed left sidebar: 280px width (w-[280px])
- Main content: flex-1 with max-w-7xl container
- Sidebar padding: p-6
- Main content padding: p-8
- Component gaps: gap-6 standard, gap-4 for tighter groupings

**Viewport Strategy:**
Full-height application (h-screen with overflow hidden on body, scrollable content areas)

## Component Library

### Left Sidebar
- Fixed positioning, full height
- Style selection buttons stacked vertically with gap-3
- Each button: full-width, h-12, rounded-lg
- Active state: subtle elevation (shadow-md)
- AI provider dropdown at bottom of sidebar
- Divider between sections (h-px, my-6)

### Style Selection Buttons (ACADEMIC, PERSONAL, CUSTOM)
- Large touch targets: min-h-12, px-4
- Left-aligned text with icon prefix (16px icon size)
- Active state shows filled background with higher contrast
- Inactive state: transparent with subtle border

### Text Box Grid
- 2x2 grid layout on desktop (grid-cols-2, gap-6)
- Single column on mobile (grid-cols-1)
- Each text box container: rounded-lg border, p-4
- Labels: text-sm font-semibold, mb-2
- Textarea: w-full, min-h-64, font-mono text-sm, p-4, rounded, resize-y
- Focus state: enhanced border width, no ring

**Four Boxes Layout:**
```
[Input Text]        [Style Guide]
[Content Notes]     [Output Text]
```

### AI Provider Selection
- Dropdown component: w-full, h-10
- Label above: text-sm font-medium, mb-2
- Options: padding py-2 px-3
- Selected state indicator (checkmark icon, 16px)

### Header Bar (Top of Main Content)
- Sticky positioning (sticky top-0)
- Height: h-16
- Contains: App title (H2), action buttons right-aligned
- Border bottom: border-b
- Backdrop blur effect for depth (backdrop-blur-sm)

### Action Buttons
- Primary: h-10, px-6, rounded-md, font-semibold
- Secondary: h-10, px-4, rounded-md, border
- Icon buttons: h-10 w-10, rounded-md, centered icon (20px)
- Grouped with gap-3

### Status Indicators
- Small badges: px-2 py-1, rounded-full, text-xs font-medium
- Position: top-right of relevant text boxes
- States: Processing, Ready, Error

## Responsive Behavior

**Desktop (lg:):**
- Sidebar visible, 280px fixed
- 2x2 text box grid
- All controls inline

**Tablet (md:):**
- Sidebar collapses to hamburger menu
- 2x2 grid maintained if space allows
- Slightly reduced padding (p-6 → p-4)

**Mobile (base):**
- Hamburger menu for sidebar
- Single column layout (grid-cols-1)
- Reduced text box heights (min-h-48)
- Stack action buttons vertically

## Interaction Patterns

**Text Box Interactions:**
- Click to focus with smooth border transition
- Character count in bottom-right corner (text-xs)
- Copy button appears on hover (top-right, absolute)
- Auto-resize textarea based on content

**Style Button Selection:**
- Single selection (radio button behavior)
- Immediate visual feedback on click
- Subtle scale animation (scale-[0.98])

**Provider Dropdown:**
- Click to expand with slide-down animation
- Keyboard navigation support
- Close on outside click

## Elevation & Depth

**Layer System:**
- Base layer: Main content area (z-0)
- Sidebar: (z-10, shadow-lg)
- Dropdowns: (z-20, shadow-xl)
- Modals: (z-30, shadow-2xl)
- Toasts: (z-40)

## Animations

**Subtle Transitions Only:**
- Button states: transition-all duration-200
- Dropdown expand: transition-opacity duration-150
- Text box focus: transition-colors duration-200
- Avoid decorative animations

## Images

**Not Required:** This is a text-editing productivity application. No hero images or decorative imagery needed. Focus remains on functional text input/output interface.