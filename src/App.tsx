import React, { useState, useEffect } from "react";
import Button from "./components/Button/Button";
import useDirection from "./hooks/useDirection";
import "./styles/index.css";

type Theme = "nightfall" | "daylight" | "bloody-moon";

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

          {/* Theme Switcher */}
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

        {/* Button Showcase */}
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

        {/* Glow Showcase */}
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

        {/* Gradient Showcase */}
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

        {/* Glass & Glow Showcase */}
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

        {/* Typography Showcase */}
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

        {/* Persian Text Showcase */}
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
