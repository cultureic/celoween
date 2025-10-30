# Course UX Enhancement - Usage Guide

This guide provides comprehensive documentation for the enhanced course module UX and markdown rendering system.

## Overview

The course UX redesign includes three major enhancements:

1. **Phase 1: Enhanced Markdown Rendering** - Syntax highlighting, GFM support, copy buttons
2. **Phase 2: Interactive Components** - Callouts, tabs, accordions, code embeds
3. **Phase 3: Visual Enhancements** - Reading progress, table of contents, improved typography

All components are client-side only and do not interact with Wagmi/wallet functionality.

---

## Phase 1: Enhanced Markdown Rendering

### Features

- **GitHub Flavored Markdown (GFM)**: Tables, task lists, strikethrough, autolinks
- **Syntax Highlighting**: Powered by `highlight.js` with 190+ languages
- **Copy Button**: One-click code snippet copying
- **Enhanced Typography**: Beautiful headings, lists, blockquotes, and tables

### Usage

The enhanced markdown rendering is automatically applied to all course content through the `RenderMdx` component:

```tsx
import { RenderMdx } from '@/components/mdx/RenderMdx';

<RenderMdx markdown={courseContent} />
```

### Supported Code Languages

All major languages are supported, including:
- JavaScript, TypeScript, React, JSX, TSX
- Solidity, Rust, Go, Python
- Bash, Shell, YAML, JSON
- And 180+ more

---

## Phase 2: Interactive Components

### 1. Callout Component

Display important information with visual emphasis.

**Variants**: `info`, `warning`, `success`, `tip`, `danger`

**Usage in Markdown:**

```markdown
<Callout variant="info" title="Important Note">
  This is an informational callout that draws attention to key concepts.
</Callout>
```

**Example:**

```tsx
import { Callout } from '@/components/course';

<Callout variant="warning" title="Security Warning">
  Always validate user input before processing transactions.
</Callout>
```

### 2. Tabs Component

Switch between different content views (e.g., multiple programming languages).

**Usage:**

```tsx
import { Tabs } from '@/components/course';

const tabs = [
  { label: 'JavaScript', content: <div>JavaScript code here...</div> },
  { label: 'Solidity', content: <div>Solidity code here...</div> },
];

<Tabs tabs={tabs} defaultTab={0} />
```

### 3. Accordion Component

Create collapsible sections for better content organization.

**Usage:**

```tsx
import { Accordion } from '@/components/course';

const items = [
  { title: 'What is Celo?', content: <p>Celo is a mobile-first blockchain...</p> },
  { title: 'How do I get started?', content: <p>Begin by...</p> },
];

<Accordion items={items} allowMultiple={true} defaultOpen={[0]} />
```

### 4. CodeEmbed Component

Embed interactive code playgrounds.

**Supported Platforms**: `codesandbox`, `codepen`, `stackblitz`, `replit`

**Usage:**

```tsx
import { CodeEmbed } from '@/components/course';

<CodeEmbed 
  type="codesandbox" 
  id="your-sandbox-id"
  title="Interactive Demo"
  height={600}
/>
```

---

## Phase 3: Visual Enhancements

### 1. Reading Progress Bar

A fixed progress indicator at the top of the page that tracks reading position.

**Usage:**

```tsx
import { ReadingProgress } from '@/components/course';

// Add to your course page layout
<ReadingProgress />
```

### 2. Table of Contents (TOC)

Auto-generated navigation from markdown headings with active section highlighting.

**Usage:**

```tsx
import { TableOfContents } from '@/components/course';

const contentRef = useRef<HTMLElement>(null);

<article ref={contentRef}>
  {/* Your course content */}
</article>

<TableOfContents contentRef={contentRef} />
```

### 3. CourseLayout Wrapper

All-in-one layout with TOC, reading progress, and optimal content spacing.

**Usage:**

```tsx
import { CourseLayout } from '@/components/course';

<CourseLayout showTOC={true} showProgress={true}>
  <RenderMdx markdown={courseContent} />
</CourseLayout>
```

**Features:**
- Responsive design (TOC hidden on mobile)
- Smooth scroll behavior
- Enhanced prose styling with `.prose-course` class
- Reading progress bar
- Side-by-side TOC on large screens

---

## Enhanced CSS Classes

### `.prose-course`

Apply enhanced typography and spacing to course content:

```tsx
<div className="prose-course">
  <RenderMdx markdown={content} />
</div>
```

**Includes:**
- Larger line height (1.8) for better readability
- Scroll margin on headings for anchor navigation
- Enhanced code block styling with shadows
- Beautiful blockquotes with Celo yellow accent
- Responsive images with rounded corners

---

## Complete Example

Here's a complete course page implementation:

```tsx
'use client';

import { useState, useRef } from 'react';
import { RenderMdx } from '@/components/mdx/RenderMdx';
import { 
  CourseLayout, 
  Callout, 
  Tabs, 
  Accordion 
} from '@/components/course';

export default function CoursePage({ course }) {
  return (
    <CourseLayout showTOC={true} showProgress={true}>
      <div className="prose-course">
        <h1>{course.title}</h1>
        
        <Callout variant="info" title="Prerequisites">
          Basic knowledge of JavaScript and blockchain concepts.
        </Callout>

        <RenderMdx markdown={course.content} />

        <Accordion items={[
          { title: 'Additional Resources', content: <div>Links here...</div> }
        ]} />
      </div>
    </CourseLayout>
  );
}
```

---

## Component API Reference

### Callout

```tsx
interface CalloutProps {
  variant?: 'info' | 'warning' | 'success' | 'tip' | 'danger';
  title?: string;
  children: React.ReactNode;
}
```

### Tabs

```tsx
interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
}
```

### Accordion

```tsx
interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number[];
}
```

### CodeEmbed

```tsx
interface CodeEmbedProps {
  type: 'codesandbox' | 'codepen' | 'stackblitz' | 'replit';
  id: string;
  title?: string;
  height?: number;
}
```

### CourseLayout

```tsx
interface CourseLayoutProps {
  children: React.ReactNode;
  showTOC?: boolean;
  showProgress?: boolean;
}
```

---

## Best Practices

1. **Use Callouts Sparingly**: Reserve them for truly important information
2. **Tabs for Code Examples**: Use tabs when showing the same functionality in different languages
3. **Accordion for Optional Content**: Keep main content visible, use accordions for supplementary material
4. **Test on Mobile**: All components are responsive, but always verify on mobile devices
5. **Semantic HTML**: Ensure headings follow proper hierarchy (h1 → h2 → h3)
6. **Anchor Links**: Use heading IDs for deep linking to specific sections

---

## Migration from Old System

If you're migrating from the old markdown renderer:

1. Replace `<ReactMarkdown>` with `<RenderMdx>`
2. Wrap content in `<CourseLayout>` for full enhancement
3. Add interactive components where appropriate
4. Test syntax highlighting with your existing code blocks

---

## Performance Considerations

- All components are client-side (`'use client'`) to support interactivity
- Syntax highlighting is optimized with highlight.js
- TOC uses Intersection Observer for efficient scroll tracking
- Images use lazy loading by default

---

## Browser Support

All modern browsers are supported:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## Questions?

For issues or feature requests, please check:
- Component source: `/components/course/`
- MDX rendering: `/components/mdx/`
- Styling: `/app/globals.css`
