import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { useState } from "react";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    multiple: { control: "boolean" },
    glass: { control: "boolean" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
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
    content:
      "Dara UI is a design system that feels like an interface discovered inside a futuristic archive hidden beneath Calgary during a snowstorm.",
  },
  {
    id: "2",
    title: "🎨 What themes are available?",
    content:
      "Night Archive (default), Snow Calgary (light), Sith Mode (black + red), Jedi Temple (white + blue), Dracula (purple), and Wine (deep reds).",
  },
  {
    id: "3",
    title: "🔧 How do I install it?",
    content: "npm install dara-ui # or yarn add dara-ui",
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    defaultOpenItems: ["1"],
  },
};

export const SingleMode: Story = {
  render: () => (
    <div className="w-[500px]">
      <p className="text-xs text-white/40 font-mono mb-2">Single open mode</p>
      <Accordion
        items={defaultItems}
        defaultOpenItems={["1"]}
        multiple={false}
      />
    </div>
  ),
};

export const MultipleMode: Story = {
  render: () => (
    <div className="w-[500px]">
      <p className="text-xs text-white/40 font-mono mb-2">Multiple open mode</p>
      <Accordion
        items={defaultItems}
        defaultOpenItems={["1", "2"]}
        multiple={true}
      />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [openItems, setOpenItems] = useState<string[]>(["1"]);
    return (
      <div className="w-[500px]">
        <p className="text-xs text-white/40 font-mono mb-2">
          Controlled — Open:{" "}
          <span className="text-[#7c5cff]">{openItems.join(", ")}</span>
        </p>
        <Accordion
          items={defaultItems}
          openItems={openItems}
          onOpenChange={setOpenItems}
          multiple={true}
        />
        <div className="flex gap-2 mt-3">
          <button
            className="px-2 py-1 text-xs bg-[#7c5cff] text-white rounded hover:bg-[#6a4ae8]"
            onClick={() => setOpenItems(["1"])}
          >
            Open 1
          </button>
          <button
            className="px-2 py-1 text-xs bg-[#00d9ff] text-[#0b0f19] rounded hover:bg-[#00c4e6]"
            onClick={() => setOpenItems(["1", "2"])}
          >
            Open 1,2
          </button>
          <button
            className="px-2 py-1 text-xs bg-[#ff5370] text-white rounded hover:bg-[#e84560]"
            onClick={() => setOpenItems([])}
          >
            Close All
          </button>
        </div>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[500px]">
      <Accordion items={defaultItems} defaultOpenItems={["1"]} size="sm" />
      <Accordion items={defaultItems} defaultOpenItems={["1"]} size="md" />
      <Accordion items={defaultItems} defaultOpenItems={["1"]} size="lg" />
    </div>
  ),
};

export const WithoutGlass: Story = {
  render: () => (
    <div className="w-[500px]">
      <p className="text-xs text-white/40 font-mono mb-2">Without glass</p>
      <Accordion items={defaultItems} defaultOpenItems={["1"]} glass={false} />
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-[500px]">
      <Accordion
        items={[
          {
            id: "1",
            title: "Dashboard",
            icon: "📊",
            content: "Dashboard content",
          },
          {
            id: "2",
            title: "Projects",
            icon: "🚀",
            content: "Projects content",
          },
          {
            id: "3",
            title: "Settings",
            icon: "⚙️",
            content: "Settings content",
          },
        ]}
        defaultOpenItems={["1"]}
      />
    </div>
  ),
};
