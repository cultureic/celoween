# Implementation Plan: Enhanced Course Module UX

🚨 **PRE-IMPLEMENTATION CHECKLIST:**
- [x] Reviewed `PROJECT_RULES.md` - No violations
- [x] Reviewed `PRODUCTION_STATUS.md` - Safe to enhance lesson rendering
- [x] Reviewed `COURSE_PAYWALL.md` - Changes happen AFTER paywall check
- [x] Will NOT touch paywall logic or enrollment system
- [x] Will only modify lesson content rendering (client-side)

**Status:** ✅ **READY TO IMPLEMENT**  
**Risk Level:** 🟢 **LOW** - Only affects content presentation  
**Deployment:** Incremental rollout

---

## Phase 1: Enhanced Markdown Rendering (Week 1)

### Goal
Replace basic markdown rendering with proper MDX system for better typography and code blocks.

### Scope
**Files to Modify:**
- ✅ `components/mdx/RenderMdx.tsx` - Replace with proper markdown parser
- ✅ `app/globals.css` - Add prose typography styles

**Files to Create:**
- ✅ `components/mdx/MdxComponents.tsx` - Component map for MDX

### Implementation Steps

#### Step 1.1: Install Dependencies
```bash
npm install react-markdown remark-gfm rehype-highlight rehype-raw
npm install @types/react-syntax-highlighter react-syntax-highlighter
```

**Why these?**
- `react-markdown` - Lightweight, works great client-side
- `remark-gfm` - GitHub Flavored Markdown (tables, task lists)
- `rehype-highlight` - Syntax highlighting for code
- `react-syntax-highlighter` - Better code block styling

#### Step 1.2: Create Enhanced RenderMdx Component

**Location:** `components/mdx/RenderMdx.tsx`

```typescript
"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { MdxComponents } from './MdxComponents';

// Import highlight.js theme
import 'highlight.js/styles/github-dark.css';

interface RenderMdxProps {
  source: string;
}

export default function RenderMdx({ source }: RenderMdxProps) {
  if (!source) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight, rehypeRaw]}
      components={MdxComponents}
      className="prose prose-invert max-w-none"
    >
      {source}
    </ReactMarkdown>
  );
}
```

**Safety:**
- ✅ Client-only component (`"use client"`)
- ✅ No Wagmi hooks
- ✅ No server-side logic
- ✅ Runs AFTER paywall check (in LessonContent)

#### Step 1.3: Create Component Map

**Location:** `components/mdx/MdxComponents.tsx`

```typescript
import { ComponentPropsWithoutRef } from 'react';
import { CodeBlock } from './CodeBlock';

export const MdxComponents = {
  // Headings with better styling
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="text-4xl font-bold mb-6 mt-8 text-celo-yellow" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="text-3xl font-bold mb-4 mt-6 text-celo-yellow border-l-4 border-celo-yellow pl-4" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="text-2xl font-semibold mb-3 mt-5 text-white" {...props} />
  ),

  // Paragraphs with better spacing
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="text-lg leading-relaxed mb-4 text-white/90" {...props} />
  ),

  // Lists
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-white/90" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-white/90" {...props} />
  ),

  // Code blocks
  code: CodeBlock,

  // Links
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a className="text-celo-yellow hover:underline" {...props} />
  ),

  // Blockquotes
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-4 border-celo-yellow pl-4 italic my-4 text-white/80" {...props} />
  ),
};
```

#### Step 1.4: Create CodeBlock Component

**Location:** `components/mdx/CodeBlock.tsx`

```typescript
"use client";

import { ComponentPropsWithoutRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

export function CodeBlock({ inline, className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Inline code
  if (inline || !language) {
    return (
      <code className="bg-white/10 px-2 py-1 rounded text-celo-yellow font-mono text-sm" {...props}>
        {children}
      </code>
    );
  }

  // Code block with syntax highlighting
  return (
    <div className="relative group my-4">
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded bg-white/10 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-white" />
        )}
      </button>

      {/* Language label */}
      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-celo-yellow/20 text-celo-yellow text-xs font-mono">
        {language}
      </div>

      {/* Syntax highlighted code */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="!bg-black/50 !rounded-lg !p-4 !mt-8"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}
```

**Safety:**
- ✅ Client component only
- ✅ No external dependencies on Wagmi
- ✅ Pure UI component

### Testing Plan Phase 1

```bash
# 1. Install dependencies
npm install

# 2. Test locally
npm run dev

# 3. Visit a lesson page (must be enrolled)
# Check:
# - Headings render with yellow color
# - Code blocks have syntax highlighting
# - Copy button works
# - Lists are properly styled
# - Links are yellow
```

**Acceptance Criteria:**
- [ ] Markdown renders properly (headings, lists, links)
- [ ] Code blocks have syntax highlighting
- [ ] Copy button works on code blocks
- [ ] No console errors
- [ ] Page loads fast
- [ ] Mobile responsive

---

## Phase 2: Interactive Components (Week 2)

### Components to Build

#### 2.1: Callout Component

**Location:** `components/mdx/Callout.tsx`

Visual callout boxes for tips, warnings, info.

```typescript
"use client";

import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  children: React.ReactNode;
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      Icon: Info,
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      Icon: AlertTriangle,
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/50',
      text: 'text-green-400',
      Icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/50',
      text: 'text-red-400',
      Icon: AlertCircle,
    },
  };

  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div className={`${style.bg} ${style.border} border-l-4 p-4 rounded my-4`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 text-white/90">{children}</div>
      </div>
    </div>
  );
}
```

**Usage in markdown:**
```html
<Callout type="info">
💡 **Pro Tip:** Always test smart contracts on testnet first!
</Callout>
```

#### 2.2: Tabs Component

**Location:** `components/mdx/Tabs.tsx`

For showing multiple code examples (JS vs TS, etc.)

```typescript
"use client";

import { useState } from 'react';

interface TabsProps {
  children: React.ReactNode;
  defaultTab?: number;
}

export function Tabs({ children, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tabs = React.Children.toArray(children);

  return (
    <div className="my-6">
      {/* Tab buttons */}
      <div className="flex gap-2 border-b border-white/10 mb-4">
        {tabs.map((tab: any, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === index
                ? 'text-celo-yellow border-b-2 border-celo-yellow'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>{tabs[activeTab]}</div>
    </div>
  );
}

export function Tab({ children }: { label: string; children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

#### 2.3: Accordion Component

**Location:** `components/mdx/Accordion.tsx`

Expandable sections for solutions, extra info.

```typescript
"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/10 rounded-lg my-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="font-semibold text-white">{title}</span>
        <ChevronDown
          className={`w-5 h-5 text-celo-yellow transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-black/30">
          {children}
        </div>
      )}
    </div>
  );
}
```

### Update MdxComponents Map

Add new components to the map:

```typescript
import { Callout } from './Callout';
import { Tabs, Tab } from './Tabs';
import { Accordion } from './Accordion';

export const MdxComponents = {
  // ... existing components
  Callout,
  Tabs,
  Tab,
  Accordion,
};
```

---

## Phase 3: Visual Enhancements (Week 3)

### 3.1: Better Typography

Update `app/globals.css`:

```css
/* Enhanced prose for lesson content */
.prose {
  @apply text-white/90;
  font-size: 18px;
  line-height: 1.8;
  max-width: 75ch;
}

.prose h2 {
  position: relative;
  padding-left: 1rem;
}

.prose h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--celo-yellow);
  border-radius: 2px;
}

/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Better focus styles */
a:focus,
button:focus {
  outline: 2px solid var(--celo-yellow);
  outline-offset: 2px;
}
```

### 3.2: Add Progress Indicator

Show reading progress within lesson.

**Location:** `components/academy/ReadingProgress.tsx`

```typescript
"use client";

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
      <div
        className="h-full bg-celo-yellow transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
```

Add to `LessonLayout.tsx`:

```typescript
import { ReadingProgress } from './ReadingProgress';

// In the return:
return (
  <div className="min-h-screen bg-black">
    <ReadingProgress />
    {/* ... rest of layout */}
  </div>
);
```

---

## Deployment Checklist

### Before Deployment
- [ ] All components tested locally
- [ ] No Wagmi hooks in new components
- [ ] No changes to paywall logic
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] No console errors
- [ ] Lighthouse score > 80

### Deployment Steps
1. Merge to `feature/enhanced-ux` branch
2. Test on staging/preview
3. Monitor for errors
4. Merge to main
5. Deploy to production
6. Monitor metrics

### Rollback Plan
If anything breaks:
```bash
git revert <commit-hash>
git push origin main
```

---

## Success Metrics

### User Engagement
- ⬆️ Average time on lesson pages
- ⬆️ Lesson completion rate
- ⬇️ Bounce rate
- ⬆️ Scroll depth

### Technical
- ✅ No new errors
- ✅ Page load < 2s
- ✅ Lighthouse score > 85
- ✅ Mobile experience improved

---

## Risk Assessment

### What Could Go Wrong?
1. ❌ **Bundle size increase** - Solution: Code splitting
2. ❌ **SSR issues** - Solution: All components are client-only
3. ❌ **Breaking existing content** - Solution: Backward compatible

### Mitigation
- ✅ All components client-side (`"use client"`)
- ✅ No Wagmi dependencies
- ✅ Standard markdown still works
- ✅ Progressive enhancement (new features opt-in)

---

**READY TO START?** ✅

This implementation is safe, follows all rules, and won't break the paywall system.

Want me to begin with **Phase 1** (Enhanced Markdown Rendering)?
