import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PageLoader } from "./PageLoader";
import { PageLoaderProvider, usePageLoader } from "./PageLoaderProvider";
import Button from "../Button/Button";

const meta = {
  title: "Components/PageLoader",
  component: PageLoader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isLoading: { control: "boolean" },
    shape: {
      control: "select",
      options: ["spinner", "ring", "dots", "pulse", "bars"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    label: { control: "text" },
    progress: { control: "number", min: 0, max: 100 },
    showProgress: { control: "boolean" },
    blur: { control: "boolean" },
    showBrand: { control: "boolean" },
  },
  args: {
    isLoading: true,
    shape: "spinner",
    size: "md",
    label: "Loading archives...",
    blur: true,
    showProgress: false,
    showBrand: false,
  },
} satisfies Meta<typeof PageLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Spinner: Story = {
  args: { shape: "spinner" },
};

export const Ring: Story = {
  args: { shape: "ring" },
};

export const Dots: Story = {
  args: { shape: "dots" },
};

export const Pulse: Story = {
  args: { shape: "pulse" },
};

export const Bars: Story = {
  args: { shape: "bars" },
};

export const WithBrand: Story = {
  args: {
    shape: "spinner",
    label: "Loading archives...",
    showBrand: true,
  },
};

export const WithProgress: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    return (
      <div className="relative h-screen bg-[var(--color-bg-primary)]">
        <div className="p-8">
          <Button variant="primary" onClick={() => setProgress(0)}>
            Reset Progress
          </Button>
        </div>
        <PageLoader
          isLoading={progress < 100}
          shape="spinner"
          label="Downloading data..."
          progress={progress}
          showProgress
          showBrand
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let p = 0;
              const interval = setInterval(() => {
                p += 2;
                if (p > 100) { clearInterval(interval); return; }
                document.dispatchEvent(new CustomEvent("demo-progress", { detail: p }));
              }, 60);
            `,
          }}
        />
      </div>
    );
  },
};

export const ProviderDemo: Story = {
  render: () => {
    const Demo = () => {
      const loader = usePageLoader();

      const simulateRoute = () => {
        loader.show({
          label: "Navigating...",
          shape: "spinner",
          showBrand: true,
        });
        setTimeout(() => loader.hide(), 2000);
      };

      const simulateFetch = async () => {
        await loader.wrap(
          async () => {
            await new Promise((r) => setTimeout(r, 1800));
          },
          { label: "Fetching data...", shape: "dots" },
        );
      };

      const simulateProgress = () => {
        loader.show({
          label: "Uploading...",
          shape: "bars",
          showProgress: true,
        });
        let p = 0;
        const interval = setInterval(() => {
          p += 5;
          loader.setProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => loader.hide(), 300);
          }
        }, 100);
      };

      return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] p-8">
          <h1 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            PageLoader Provider Demo
          </h1>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={simulateRoute}>
              Simulate Route Change
            </Button>
            <Button variant="secondary" onClick={simulateFetch}>
              Simulate Data Fetch
            </Button>
            <Button variant="accent" onClick={simulateProgress}>
              Simulate Upload with Progress
            </Button>
          </div>
        </div>
      );
    };

    return (
      <PageLoaderProvider>
        <Demo />
      </PageLoaderProvider>
    );
  },
};
