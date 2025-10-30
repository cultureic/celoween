# 🎃 Celoween Animations & Visual Effects

## Loading States

### Ghost Loader
Simple bouncing ghost for quick loading states.

```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="md" message="Loading contests..." />
```

**Sizes:** `sm` | `md` | `lg`

### Pumpkin Loader
Spinning pumpkin with ring for longer operations.

```tsx
import { PumpkinLoader } from '@/components/ui/LoadingSpinner';

<PumpkinLoader message="Submitting to blockchain..." />
```

### Skeleton Cards
Placeholder cards while content loads.

```tsx
import { SkeletonCard } from '@/components/ui/LoadingSpinner';

<div className="grid grid-cols-3 gap-6">
  {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
</div>
```

---

## Custom Animations

### Float
Gentle up/down floating motion (3s loop).

```tsx
<div className="animate-float">
  👻
</div>
```

### Spin Slow
Slower rotation animation (3s vs default 1s).

```tsx
<div className="animate-spin-slow">
  🎃
</div>
```

### Glow
Pulsing opacity effect (2s loop).

```tsx
<div className="animate-glow">
  ✨
</div>
```

---

## Shadow Effects

### Glow Shadows
Halloween-themed glowing shadows.

```tsx
// Orange glow (for contest cards)
<div className="shadow-glow-orange hover:shadow-glow-orange-sm">
  Content
</div>

// Violet glow (for voting elements)
<div className="shadow-glow-violet hover:shadow-glow-violet-sm">
  Content
</div>
```

**Variants:**
- `shadow-glow-orange` - Large orange glow
- `shadow-glow-violet` - Large violet glow  
- `shadow-glow-orange-sm` - Small orange glow
- `shadow-glow-violet-sm` - Small violet glow

---

## Gradient Backgrounds

### Spooky Gradient
Pre-defined gradient for backgrounds.

```tsx
<div className="gradient-spooky min-h-screen">
  Page content
</div>
```

**CSS Definition:**
```css
.gradient-spooky {
  background: linear-gradient(
    135deg,
    var(--spook-bg) 0%,
    #1a0a2e 100%
  );
}
```

---

## Transitions

### Hover Effects
Smooth transitions on interactive elements.

```tsx
<button className="transition-all duration-300 hover:scale-105 hover:shadow-glow-orange">
  Click me
</button>
```

### Common Patterns

**Card Hover:**
```tsx
<div className="
  transition-all duration-300
  hover:scale-[1.02]
  hover:shadow-glow-orange
">
  Card content
</div>
```

**Button Hover:**
```tsx
<button className="
  bg-spook-orange
  hover:bg-spook-orange/80
  transition-colors
  hover:shadow-glow-orange
">
  Submit
</button>
```

---

## Toast Notifications

### Using Toast Hook

```tsx
import { useToast, ToastContainer } from '@/components/ui/Toast';

function MyComponent() {
  const { toasts, success, error, info, removeToast } = useToast();

  const handleSubmit = async () => {
    try {
      await submitData();
      success('✅ Submission successful!');
    } catch (err) {
      error('❌ Failed to submit');
    }
  };

  return (
    <>
      <button onClick={handleSubmit}>Submit</button>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
```

**Toast Types:**
- `success()` - Green with ✅
- `error()` - Red with ❌  
- `info()` - Violet with 👻

---

## Halloween Emojis

### Available Emojis
- 🎃 Pumpkin (main brand)
- 👻 Ghost (loading, info)
- 🕷️ Spider
- 🦇 Bat
- 🧛 Vampire
- 🧟 Zombie
- 🕸️ Spider Web
- 🔮 Crystal Ball
- ⚰️ Coffin
- 💀 Skull
- 🌙 Moon
- ⭐ Star
- ✨ Sparkles
- 🗳️ Voting
- 🏆 Trophy
- 🎭 Masks

### Usage Guidelines
- Use **🎃** for branding and main CTAs
- Use **👻** for loading states
- Use **🗳️** for voting actions
- Use **🏆** for winners/leaderboard
- Use **✨** for special actions

---

## Performance Tips

### Optimize Animations
```tsx
// Good: Use transform (GPU accelerated)
<div className="hover:scale-105">

// Bad: Use margin/padding (CPU intensive)
<div className="hover:m-2">
```

### Reduce Motion
Respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Lazy Load Heavy Assets
```tsx
// Use loading="lazy" for images
<img src="..." loading="lazy" />

// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <LoadingSpinner />
});
```

---

## Future Enhancements

- [ ] Lottie animations for page transitions
- [ ] Particle effects on vote cast
- [ ] Confetti on contest completion
- [ ] Sound effects (toggle-able)
- [ ] Dark mode skeleton variants
- [ ] Animated SVG illustrations
