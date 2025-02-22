# KnowledgeDeck UI Migration Plan to shadcn/ui

## Overview
This document outlines the step-by-step plan for migrating KnowledgeDeck's UI components to shadcn/ui while maintaining the existing functionality and enhancing the user experience.

## Current Color Scheme Mapping

```typescript
// Current Colors
const currentColors = {
  primary: {
    dark: '#0c3547',    // Very dark blue
    DEFAULT: '#10656d', // Very dark cyan
    light: '#598f91',   // Mostly desaturated dark cyan
  },
  secondary: {
    dark: '#93b071',    // Mostly desaturated dark green
    DEFAULT: '#ede2cc', // Light grayish orange
    light: '#edae93',   // Very soft orange
  },
  accent: '#dd6670',    // Soft red
}

// shadcn/ui Mapping
const shadcnColors = {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))", // Map to #10656d
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))", // Map to #ede2cc
    foreground: "hsl(var(--secondary-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))", // Map to #dd6670
    foreground: "hsl(var(--accent-foreground))",
  },
}
```

## Phase 1: Setup & Infrastructure (Day 1 Morning)

1. Install Required Dependencies
```bash
pnpm add @radix-ui/react-icons
pnpm add -D @types/node autoprefixer postcss tailwindcss-animate class-variance-authority clsx tailwind-merge
pnpm add lucide-react
```

2. Update Tailwind Configuration
```typescript
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  plugins: [require("tailwindcss-animate")],
}
```

3. Add CSS Variables
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 187 73% 24%;      /* #10656d */
    --primary-foreground: 0 0% 100%;
    --secondary: 39 53% 86%;     /* #ede2cc */
    --secondary-foreground: 0 0% 0%;
    --accent: 355 57% 66%;       /* #dd6670 */
    --accent-foreground: 0 0% 100%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 187 73% 24%;
    --primary-foreground: 0 0% 100%;
    --secondary: 39 53% 86%;
    --secondary-foreground: 0 0% 0%;
    --accent: 355 57% 66%;
    --accent-foreground: 0 0% 100%;
  }
}
```

## Phase 2: Core Components Migration (Day 1 Afternoon)

### Common Components
1. Button Component
   - Replace current buttons with shadcn/ui Button
   - Migrate variants and states
   - Update all button references

2. Input & Form Elements
   - Implement Input, Select, Checkbox components
   - Update form validation integration
   - Migrate any custom input styles

3. Dialog & Modal Components
   - Replace current modals with shadcn/ui Dialog
   - Migrate modal states and animations
   - Update modal triggers

## Phase 3: Layout & Navigation (Day 2 Morning)

1. Sidebar Component
   - Implement Sheet component for sidebar
   - Migrate current sidebar navigation
   - Update folder tree structure

2. Navigation Components
   - Implement NavigationMenu
   - Update top navigation bar
   - Migrate breadcrumbs

3. Card Components
   - Create custom Card variants
   - Migrate current card layouts
   - Update drag-and-drop integration

## Phase 4: Advanced Features (Day 2 Afternoon)

1. Editor Integration
   - Style TipTap editor with shadcn/ui theme
   - Update toolbar components
   - Migrate custom editor features

2. Mind Map Components
   - Create custom node components
   - Style connection lines
   - Update interaction handlers

3. Search Components
   - Implement Command component for search
   - Update search results styling
   - Migrate filter components

## Phase 5: Polish & Testing (Day 3)

1. Theme Consistency
   - Audit all components for theme compliance
   - Test dark mode implementation
   - Verify color scheme consistency

2. Performance Testing
   - Measure component render performance
   - Optimize bundle size
   - Test animation performance

3. Accessibility Testing
   - Verify ARIA attributes
   - Test keyboard navigation
   - Check screen reader compatibility

## Component Migration Checklist

### Layout Components
- [ ] Sidebar
- [ ] NavigationMenu
- [ ] Breadcrumb
- [ ] Sheet

### Common Components
- [ ] Button
- [ ] Input
- [ ] Select
- [ ] Checkbox
- [ ] Radio
- [ ] Switch
- [ ] Textarea
- [ ] Form

### Dialog Components
- [ ] Dialog
- [ ] Sheet
- [ ] Popover
- [ ] Tooltip

### Data Display
- [ ] Card
- [ ] Table
- [ ] Avatar
- [ ] Badge

### Editor Components
- [ ] Toolbar
- [ ] DropdownMenu
- [ ] Separator
- [ ] Toggle

### Feedback Components
- [ ] Alert
- [ ] Progress
- [ ] Skeleton
- [ ] Toast

## Rollback Plan

1. Backup Current Implementation
   - Create a backup branch
   - Document current component state
   - Save current styling configuration

2. Incremental Testing
   - Test each component after migration
   - Maintain feature parity
   - Document any breaking changes

3. Emergency Rollback
   - Revert to backup branch if needed
   - Restore original components
   - Update dependency tree

## Post-Migration Tasks

1. Documentation Update
   - Update component documentation
   - Add new component examples
   - Update styling guide

2. Performance Monitoring
   - Set up performance metrics
   - Monitor bundle size
   - Track component render times

3. User Feedback
   - Collect user feedback
   - Address usability issues
   - Plan future improvements

## Success Metrics

1. Performance
   - Bundle size < 200KB
   - First paint < 1.5s
   - Interaction to Next Paint < 100ms

2. Accessibility
   - WCAG 2.1 AA compliance
   - Perfect Lighthouse accessibility score
   - Full keyboard navigation support

3. Code Quality
   - 90%+ test coverage
   - Zero TypeScript errors
   - Consistent styling implementation 