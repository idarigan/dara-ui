import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { useState } from "react";

// Icons
const StarIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const RocketIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l14.25-11.25L13.5 3.75 3.75 13.5zM3.75 13.5L6.75 16.5M13.5 3.75L16.5 6.75M12 12l-3 3M9 15l-3 3"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12l3-3M15 9l3-3"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Allow multiple items open at once",
    },
    glass: {
      control: "boolean",
      description: "Glass styling",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Accordion size",
    },
  },
  args: {
    multiple: false,
    glass: true,
    size: "md",
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  {
    id: "1",
    title: "📜 What is Dara UI?",
    content: (
      <div>
        Dara UI is a design system that feels like an interface discovered
        inside a futuristic archive hidden beneath Calgary during a snowstorm.
        It blends glassmorphism, cyberpunk, gothic aesthetics, Apple minimalism,
        and anime HUD elements.
      </div>
    ),
  },
  {
    id: "2",
    title: "🎨 What themes are available?",
    content: (
      <div>
        <p className="mb-2">Three themes are available:</p>
        <ul className="list-disc list-inside space-y-1 text-[var(--color-text-tertiary)]">
          <li>
            <span className="text-[var(--color-primary)]">Nightfall</span> —
            Dark, mysterious, glass-heavy
          </li>
          <li>
            <span className="text-[var(--color-warning)]">Daylight</span> —
            Light, clean, minimal
          </li>
          <li>
            <span className="text-[var(--color-danger)]">Bloody Moon</span> —
            Dark, intense, red-accented
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "3",
    title: "🔧 How do I install it?",
    content: (
      <div>
        <code className="block p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] font-mono text-sm">
          npm install dara-ui
          <br />
          # or
          <br />
          yarn add dara-ui
        </code>
        <p className="mt-2">Then import components:</p>
        <code className="block p-3 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)] font-mono text-sm">
          import {"{"} Button, Card, Input {"}"} from 'dara-ui';
        </code>
      </div>
    ),
  },
];

const longContentItems = [
  {
    id: "1",
    title: "📦 Long Content Example",
    content: (
      <div className="space-y-2">
        <p>
          This accordion item contains a lot of content to demonstrate smooth
          height animation.
        </p>
        <p>
          When you open or close it, the height should smoothly transition based
          on the actual content height.
        </p>
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-tertiary)]">
          <p className="text-sm text-[var(--color-text-secondary)]">
            This is some additional content inside a nested container.
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-[var(--color-text-tertiary)]">
            <li>Item 1 with some text</li>
            <li>Item 2 with more text</li>
            <li>Item 3 with even more text to make it longer</li>
            <li>Item 4 to really stretch the height</li>
          </ul>
        </div>
        <p>
          And here is some more content at the bottom to make it even longer!
        </p>
      </div>
    ),
  },
  {
    id: "2",
    title: "📊 Short Content Example",
    content: (
      <p>
        This is a short content item. The height animation will still work
        smoothly.
      </p>
    ),
  },
];

// Default
export const Default: Story = {
  args: {
    items: defaultItems,
    defaultOpenItems: ["1"],
  },
};

// Single Mode
export const SingleMode: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[500px]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Single open mode — Only one item can be open at a time
      </p>
      <Accordion
        items={defaultItems}
        defaultOpenItems={["1"]}
        multiple={false}
      />
    </div>
  ),
};

// Multiple Mode
export const MultipleMode: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[500px]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
        Multiple open mode — Multiple items can be open simultaneously
      </p>
      <Accordion
        items={defaultItems}
        defaultOpenItems={["1", "2"]}
        multiple={true}
      />
    </div>
  ),
};

// Controlled
export const Controlled: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>(["1"]);

    const items = [
      {
        id: "1",
        title: "📁 Archive",
        content: (
          <div className="text-[var(--color-text-secondary)]">
            Browse encrypted Jedi records, holocrons, and mission logs.
            <div className="mt-2 text-xs text-[var(--color-text-tertiary)] font-mono">
              Open items:{" "}
              <span className="text-[var(--color-primary)]">
                {openItems.join(", ")}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "2",
        title: "⚔️ Quests",
        content: (
          <div className="text-[var(--color-text-secondary)]">
            Active missions, bounties, and side-quests await your attention.
            <div className="mt-2 text-xs text-[var(--color-text-tertiary)] font-mono">
              Open items:{" "}
              <span className="text-[var(--color-primary)]">
                {openItems.join(", ")}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "3",
        title: "📊 Stats",
        content: (
          <div className="text-[var(--color-text-secondary)]">
            Track your Force alignment, XP gains, and cybernetic enhancements.
            <div className="mt-2 text-xs text-[var(--color-text-tertiary)] font-mono">
              Open items:{" "}
              <span className="text-[var(--color-primary)]">
                {openItems.join(", ")}
              </span>
            </div>
          </div>
        ),
      },
    ];

    return (
      <div className="flex flex-col gap-4 w-[500px]">
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-xs text-[var(--color-text-tertiary)] font-mono">
            Controlled — Open items:
          </p>
          <div className="flex gap-2 flex-wrap">
            {openItems.map((id) => (
              <span
                key={id}
                className="px-2 py-0.5 text-xs bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full"
              >
                {id}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 text-xs bg-[var(--color-primary)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--color-primary-hover)]"
              onClick={() => setOpenItems(["1"])}
            >
              Open 1
            </button>
            <button
              className="px-2 py-1 text-xs bg-[var(--color-secondary)] text-[var(--color-bg-primary)] rounded-[var(--radius-sm)] hover:bg-[var(--color-secondary-hover)]"
              onClick={() => setOpenItems(["1", "2"])}
            >
              Open 1,2
            </button>
            <button
              className="px-2 py-1 text-xs bg-[var(--color-danger)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--color-danger-hover)]"
              onClick={() => setOpenItems([])}
            >
              Close All
            </button>
          </div>
        </div>
        <Accordion
          items={items}
          openItems={openItems}
          onOpenChange={setOpenItems}
          multiple={true}
        />
      </div>
    );
  },
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="w-[500px]">
      <Accordion
        items={[
          {
            id: "1",
            title: "Dashboard",
            icon: <StarIcon />,
            content: (
              <div className="text-[var(--color-text-secondary)]">
                📊 Dashboard overview with key metrics.
              </div>
            ),
          },
          {
            id: "2",
            title: "Projects",
            icon: <RocketIcon />,
            content: (
              <div className="text-[var(--color-text-secondary)]">
                🚀 Active projects and their status.
              </div>
            ),
          },
          {
            id: "3",
            title: "Settings",
            icon: <SettingsIcon />,
            content: (
              <div className="text-[var(--color-text-secondary)]">
                ⚙️ Configure your application preferences.
              </div>
            ),
          },
        ]}
        defaultOpenItems={["1"]}
      />
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[500px]">
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Small
        </p>
        <Accordion items={defaultItems} defaultOpenItems={["1"]} size="sm" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Medium (default)
        </p>
        <Accordion items={defaultItems} defaultOpenItems={["1"]} size="md" />
      </div>
      <div>
        <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
          Large
        </p>
        <Accordion items={defaultItems} defaultOpenItems={["1"]} size="lg" />
      </div>
    </div>
  ),
};

// Without Glass
export const WithoutGlass: Story = {
  render: () => (
    <div className="w-[500px]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
        No glass — solid background
      </p>
      <Accordion items={defaultItems} defaultOpenItems={["1"]} glass={false} />
    </div>
  ),
};

// Disabled Items
export const DisabledItems: Story = {
  render: () => (
    <div className="w-[500px]">
      <Accordion
        items={[
          {
            id: "1",
            title: "✅ Enabled Item",
            content: (
              <div className="text-[var(--color-text-secondary)]">
                This item can be opened and closed.
              </div>
            ),
          },
          {
            id: "2",
            title: "🚫 Disabled Item",
            content: (
              <div className="text-[var(--color-text-secondary)]">
                This item cannot be interacted with.
              </div>
            ),
            disabled: true,
          },
          {
            id: "3",
            title: "✅ Another Enabled Item",
            content: (
              <div className="text-[var(--color-text-secondary)]">
                This item can also be opened and closed.
              </div>
            ),
          },
        ]}
        defaultOpenItems={["1"]}
      />
    </div>
  ),
};

// Long Content
export const LongContent: Story = {
  render: () => (
    <div className="w-[500px]">
      <p className="text-xs text-[var(--color-text-tertiary)] font-mono mb-2">
        Demonstrates smooth height animation with varying content
      </p>
      <Accordion
        items={longContentItems}
        defaultOpenItems={["1"]}
        multiple={true}
      />
    </div>
  ),
};

// Interactive Playground
export const Interactive: Story = {
  args: {
    items: defaultItems,
    defaultOpenItems: ["1"],
    multiple: false,
    glass: true,
    size: "md",
  },
};
