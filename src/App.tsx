import React, { useState } from "react";
import Button from "./components/Button/Button";
import "./styles/index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          Dara UI Component Library
        </h1>

        {/* Button Showcase */}
        <section className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-large)] p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Button Examples</h2>

          <div className="space-y-6">
            {/* Variants */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                Variants
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                Sizes
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* Interactive Demo */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                Interactive
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => setCount(count + 1)}>
                  Clicked {count} times
                </Button>
                <Button variant="secondary" onClick={() => setCount(0)}>
                  Reset
                </Button>
              </div>
            </div>

            {/* With Icons */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                With Icons
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  leftIcon={
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  }
                >
                  Add
                </Button>
                <Button
                  rightIcon={
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  }
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">
                States
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)] p-6">
            <div className="text-[var(--color-primary)] text-3xl mb-2">🎨</div>
            <h3 className="font-semibold mb-1">Customizable</h3>
            <p className="text-sm text-gray-400">
              Fully customizable with CSS variables
            </p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)] p-6">
            <div className="text-[var(--color-secondary)] text-3xl mb-2">
              ⚡
            </div>
            <h3 className="font-semibold mb-1">Fast & Light</h3>
            <p className="text-sm text-gray-400">
              Built with performance in mind
            </p>
          </div>
          <div className="bg-[var(--color-bg-secondary)] rounded-[var(--radius-standard)] p-6">
            <div className="text-[var(--color-accent)] text-3xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Type Safe</h3>
            <p className="text-sm text-gray-400">Full TypeScript support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
