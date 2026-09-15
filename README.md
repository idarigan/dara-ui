# Dara UI

A modern React component library built for interfaces that feel refined and intentional.  
Glassmorphism surfaces, subtle cyberpunk accents, complete RTL support, and a flexible theming system - all in one cohesive package.

---

## Features

- **Glassmorphism design language** - soft translucency, layered depth, and restrained glow
- **Three built-in themes** - Nightfall, Daylight, and Dracula
- **Full RTL support** - layout, icons, scroll direction, and typography adapt automatically
- **Accessible by default** - keyboard navigation, focus states, and ARIA attributes
- **Tree-shakeable** - import only what you need
- **TypeScript-first** - complete type definitions out of the box
- **Zero-config theming** - CSS variables + simple provider pattern

---

## Installation

```bash
npm install dara-ui
```

or

```bash
yarn add dara-ui
pnpm add dara-ui
```

---

## Quick Start

### 1. Import styles

Add the stylesheet once at the root of your application:

```ts
import "dara-ui/style.css";
```

### 2. Wrap your app with providers

```tsx
import { ThemeProvider, I18nProvider } from "dara-ui";
import { translations } from "dara-ui/translations";

export default function Root() {
  return (
    <ThemeProvider defaultTheme="nightfall">
      <I18nProvider translations={translations} defaultLanguage="en">
        <App />
      </I18nProvider>
    </ThemeProvider>
  );
}
```

---

## Themes

Dara UI ships with three carefully tuned themes:

| Theme       | Description                             | Default |
| ----------- | --------------------------------------- | ------- |
| `nightfall` | Deep charcoal with cyan accents         | Yes     |
| `daylight`  | Soft light surfaces with muted contrast | No      |
| `dracula`   | High-contrast purple-tinted dark mode   | No      |

### Switching themes

**Option A - HTML attribute**

```html
<html data-theme="daylight"></html>
```

**Option B - Component**

```tsx
import { ThemeChanger } from "dara-ui";

<ThemeChanger />;
```

Themes are applied via CSS custom properties, so you can also override individual tokens in your own stylesheet.

---

## Components

### Core

Button · Badge · Input · Checkbox · Switch · Radio · Range · Avatar · Tooltip · Progress

### Layout & Navigation

Card · Tabs · Accordion · Dropdown · Modal · Navbar · Sidebar

### Data Display

XPBar · StatsWidget · QuestCard · CharacterCard · ProductCard · BlogCard

### Feedback & Utilities

Toast · ThemeChanger · LanguageChanger · SocialMedia

### Visual Effects

AuroraBlobs · Particles · GradientRing · NoiseOverlay

All components accept standard React props and respect the active theme and text direction.

---

## Internationalization

Dara UI includes a lightweight `I18nProvider` that works with the built-in translation dictionaries or your own.

```tsx
import { I18nProvider, LanguageChanger } from "dara-ui";
import { translations } from "dara-ui/translations";

<I18nProvider translations={translations} defaultLanguage="en">
  <LanguageChanger />
  {/* your app */}
</I18nProvider>;
```

RTL is detected automatically from `document.documentElement.dir` and applied across layout, icons, scroll behavior, and spacing.

---

## Sidebar

The `Sidebar` component is fully responsive:

- **Desktop** - classic vertical navigation with collapse / expand, group labels, nested items, and icon-only mode
- **Mobile** - horizontal scrollable tab strip with edge arrows that appear only when scrolling is possible

```tsx
import { Sidebar } from "dara-ui";

<Sidebar
  groups={[
    {
      label: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: <IconHome /> },
        { id: "settings", label: "Settings", icon: <IconSettings /> },
      ],
    },
  ]}
  collapsible
  defaultCollapsed={false}
/>;
```

---

## Customization

All visual tokens are exposed as CSS variables. Override them globally or per component:

```css
:root {
  --color-primary: #00e5ff;
  --radius-md: 10px;
  --shadow-float: 0 12px 40px rgba(0, 0, 0, 0.35);
}
```

---

## License

MIT © Dara UI

---

Built with care for interfaces that deserve better defaults.
