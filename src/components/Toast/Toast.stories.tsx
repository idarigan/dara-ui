import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastContainer } from "./Toast";
import { useState } from "react";
import Button from "../Button/Button";

const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["success", "error", "warning", "info"],
      description: "Toast type",
    },
    duration: {
      control: "number",
      description: "Duration in ms",
    },
    message: {
      control: "text",
      description: "Toast message",
    },
  },
  args: {
    message: "Toast notification",
    type: "info",
    duration: 3000,
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  render: function DefaultStory(args) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative min-h-[200px] w-[400px] overflow-hidden">
        <Button variant="primary" onClick={() => setIsVisible(true)}>
          Show Toast
        </Button>
        {isVisible && (
          <div className="absolute top-0 right-0">
            <Toast {...args} onDismiss={() => setIsVisible(false)} />
          </div>
        )}
      </div>
    );
  },
};

// ----- Success -----
export const Success: Story = {
  args: {
    message: "Mission complete! +300 XP earned.",
    type: "success",
  },
  render: function SuccessStory(args) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative min-h-[200px] w-[400px] overflow-hidden">
        <Button variant="success" onClick={() => setIsVisible(true)}>
          Success Toast
        </Button>
        {isVisible && (
          <div className="absolute top-0 right-0">
            <Toast {...args} onDismiss={() => setIsVisible(false)} />
          </div>
        )}
      </div>
    );
  },
};

// ----- Error -----
export const Error: Story = {
  args: {
    message: "Connection lost. Retrying...",
    type: "error",
  },
  render: function ErrorStory(args) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative min-h-[200px] w-[400px] overflow-hidden">
        <Button variant="danger" onClick={() => setIsVisible(true)}>
          Error Toast
        </Button>
        {isVisible && (
          <div className="absolute top-0 right-0">
            <Toast {...args} onDismiss={() => setIsVisible(false)} />
          </div>
        )}
      </div>
    );
  },
};

// ----- Warning -----
export const Warning: Story = {
  args: {
    message: "Please check your connection",
    type: "warning",
  },
  render: function WarningStory(args) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative min-h-[200px] w-[400px] overflow-hidden">
        <Button variant="outline" onClick={() => setIsVisible(true)}>
          Warning Toast
        </Button>
        {isVisible && (
          <div className="absolute top-0 right-0">
            <Toast {...args} onDismiss={() => setIsVisible(false)} />
          </div>
        )}
      </div>
    );
  },
};

// ----- Info -----
export const Info: Story = {
  args: {
    message: "Archives are being indexed",
    type: "info",
  },
  render: function InfoStory(args) {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div className="relative min-h-[200px] w-[400px] overflow-hidden">
        <Button variant="glass" onClick={() => setIsVisible(true)}>
          Info Toast
        </Button>
        {isVisible && (
          <div className="absolute top-0 right-0">
            <Toast {...args} onDismiss={() => setIsVisible(false)} />
          </div>
        )}
      </div>
    );
  },
};

// ----- Stacked (shows multiple toasts stacked vertically) -----
export const Stacked: Story = {
  render: function StackedStory() {
    const [toasts, setToasts] = useState<
      {
        id: string;
        type: "success" | "error" | "warning" | "info";
        message: string;
      }[]
    >([]);

    const addToast = (
      type: "success" | "error" | "warning" | "info",
      message: string,
    ) => {
      const id = Date.now().toString();
      setToasts((prev) => {
        const newToasts = [...prev, { id, type, message }];
        // Keep max 5 toasts (FIFO)
        if (newToasts.length > 5) {
          return newToasts.slice(1);
        }
        return newToasts;
      });
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    };

    return (
      <div className="relative min-h-[300px] w-[500px] overflow-hidden">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="success"
            onClick={() => addToast("success", "Mission complete! +300 XP")}
          >
            Success
          </Button>
          <Button
            variant="danger"
            onClick={() => addToast("error", "Connection lost. Retrying...")}
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() => addToast("warning", "Please check your connection")}
          >
            Warning
          </Button>
          <Button
            variant="glass"
            onClick={() => addToast("info", "Archives are being indexed")}
          >
            Info
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              addToast("success", "Task 1 completed");
              setTimeout(() => addToast("info", "Task 2 in progress"), 500);
              setTimeout(
                () => addToast("warning", "Task 3 needs review"),
                1000,
              );
              setTimeout(() => addToast("success", "Task 4 done"), 1500);
              setTimeout(() => addToast("error", "Task 5 failed"), 2000);
            }}
          >
            Stack 5
          </Button>
        </div>
        <div className="absolute top-0 right-0 flex flex-col-reverse gap-3 pointer-events-none">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                message={toast.message}
                type={toast.type}
                duration={3000}
                onDismiss={() =>
                  setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
};
