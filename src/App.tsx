import React, { useState, useEffect } from "react";
import Button from "./components/Button/Button";
import { Badge } from "./components/Badge/Badge";
import { Input } from "./components/Input/Input";
import { Card } from "./components/Card/Card";
import useDirection from "./hooks/useDirection";
import "./styles/index.css";

type Theme = "nightfall" | "daylight" | "bloody-moon";

// Icons
const SearchIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const UserIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

function App() {
  const [theme, setTheme] = useState<Theme>("nightfall");
  const { direction, toggleDirection } = useDirection("ltr");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen p-8 transition-theme">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-gradient-primary">
            Dara UI Components
          </h1>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={theme === "nightfall" ? "primary" : "outline"}
              onClick={() => changeTheme("nightfall")}
            >
              🌙 Nightfall
            </Button>
            <Button
              size="sm"
              variant={theme === "daylight" ? "primary" : "outline"}
              onClick={() => changeTheme("daylight")}
            >
              ☀️ Daylight
            </Button>
            <Button
              size="sm"
              variant={theme === "bloody-moon" ? "primary" : "outline"}
              onClick={() => changeTheme("bloody-moon")}
            >
              🍷 Bloody Moon
            </Button>
            <Button size="sm" variant="outline" onClick={toggleDirection}>
              {direction === "ltr" ? "🔁 RTL" : "🔁 LTR"}
            </Button>
          </div>
        </div>

        {/* ----- BADGE SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Badges</h2>

          {/* Variants */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Variants
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          </div>

          {/* Outline */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Outline
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge outline variant="primary">
                Primary
              </Badge>
              <Badge outline variant="secondary">
                Secondary
              </Badge>
              <Badge outline variant="success">
                Success
              </Badge>
              <Badge outline variant="danger">
                Danger
              </Badge>
              <Badge outline variant="warning">
                Warning
              </Badge>
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Sizes
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </div>

          {/* With Glow */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              With Glow
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge glow variant="primary">
                Glow Primary
              </Badge>
              <Badge glow variant="success">
                Glow Success
              </Badge>
              <Badge glow variant="danger">
                Glow Danger
              </Badge>
            </div>
          </div>
        </section>

        {/* ----- BUTTON SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Button Variants</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="glass">Glass</Button>
          </div>
        </section>

        {/* ----- CARD SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Cards</h2>

          {/* Variants */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Variants
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="glass">
                <h3 className="font-heading font-bold">Glass</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  backdrop-filter: blur(20px)
                </p>
              </Card>
              <Card variant="solid">
                <h3 className="font-heading font-bold">Solid</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  More opaque, less blur
                </p>
              </Card>
              <Card variant="outline">
                <h3 className="font-heading font-bold">Outline</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Transparent with border
                </p>
              </Card>
            </div>
          </div>

          {/* Float + Glow */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Float + Glow
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card float glow="primary">
                <h3 className="font-heading font-bold">Primary Glow</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Hover to float ✨
                </p>
              </Card>
              <Card float glow="secondary">
                <h3 className="font-heading font-bold">Secondary Glow</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Hover to float ✨
                </p>
              </Card>
              <Card float glow="accent">
                <h3 className="font-heading font-bold">Accent Glow</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Hover to float ✨
                </p>
              </Card>
            </div>
          </div>

          {/* Feature Cards */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Feature Cards
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card glow="primary" className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <h3 className="font-heading font-bold">Launch</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Deploy your project with one click.
                </p>
              </Card>
              <Card variant="solid" className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-heading font-bold">Analytics</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  Track your performance metrics.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ----- INPUT SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Inputs</h2>

          {/* Basic Inputs */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Basic Inputs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Text input" />
              <Input type="password" placeholder="Password" />
              <Input type="search" placeholder="Search..." />
              <Input type="email" placeholder="Email" />
            </div>
          </div>

          {/* With Labels */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              With Labels
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Username" placeholder="Enter username" />
              <Input
                label="Email"
                type="email"
                placeholder="Enter email"
                helperText="We'll never share your email."
              />
            </div>
          </div>

          {/* With Icons */}
          <div className="mb-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              With Icons
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input leftIcon={<UserIcon />} placeholder="Username" />
              <Input
                leftIcon={<SearchIcon />}
                type="search"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Validation States */}
          <div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-3 font-mono">
              Validation States
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Success"
                validation="success"
                successMessage="Valid input!"
              />
              <Input
                placeholder="Error"
                validation="error"
                errorMessage="Something went wrong"
              />
            </div>
          </div>
        </section>

        {/* ----- GLOW SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Glow Effects</h2>
          <div className="flex flex-wrap gap-3">
            <Button glow variant="primary">
              Glow Primary
            </Button>
            <Button glow variant="success">
              Glow Success
            </Button>
            <Button glow variant="danger">
              Glow Danger
            </Button>
          </div>
        </section>

        {/* ----- GRADIENT SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Gradients</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-primary text-white text-center">
              Primary
            </div>
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-accent text-white text-center">
              Accent
            </div>
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-success text-white text-center">
              Success
            </div>
            <div className="p-4 rounded-[var(--radius-standard)] bg-gradient-danger text-white text-center">
              Danger
            </div>
          </div>
        </section>

        {/* ----- GLASS & GLOW SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Effects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-[var(--radius-standard)] glass text-center">
              Glass Effect
            </div>
            <div className="p-6 rounded-[var(--radius-standard)] glow-primary text-center bg-[var(--color-bg-tertiary)]">
              Glow Primary
            </div>
            <div className="p-6 rounded-[var(--radius-standard)] glow-accent text-center bg-[var(--color-bg-tertiary)]">
              Glow Accent
            </div>
          </div>
        </section>

        {/* ----- TYPOGRAPHY SHOWCASE ----- */}
        <section className="p-8 mb-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Typography</h2>
          <div className="space-y-4">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Text Secondary
            </p>
            <p className="text-base">Regular body text with Inter font</p>
            <p className="text-xl font-bold text-gradient-primary">
              Gradient Heading
            </p>
            <p className="text-lg font-medium text-[var(--color-accent)]">
              Accent colored text
            </p>
            <code className="px-3 py-1 rounded-[var(--radius-sm)] block">
              console.log("Code with JetBrains Mono");
            </code>
          </div>
        </section>

        {/* ----- PERSIAN TEXT SHOWCASE -----  */}
        <section className="p-8 rounded-[var(--radius-large)] bg-[var(--color-bg-secondary)]">
          <h2 className="text-2xl font-semibold mb-6">Persian Support</h2>
          <div className="space-y-4">
            <p className="lang-fa text-lg">
              این متن با فونت وزیرمتن نمایش داده می‌شود
            </p>
            <h3 className="lang-fa-heading text-xl">عنوان فارسی با قلم Kook</h3>
            <p className="lang-fa text-sm text-[var(--color-text-secondary)]">
              متن فارسی با اندازه کوچک و رنگ ثانویه
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
