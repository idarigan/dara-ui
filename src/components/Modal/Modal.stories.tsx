import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { useState } from "react";
import Button from "../Button/Button";

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    closeOnBackdropClick: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    title: { control: "text" },
    children: { control: "text" },
    confirmText: { control: "text" },
    cancelText: { control: "text" },
  },
  args: {
    isOpen: false,
    onClose: () => {},
    size: "md",
    closeOnBackdropClick: true,
    closeOnEscape: true,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  args: {
    title: "🗂️ Archive Access",
    children:
      "You've discovered a sealed Jedi archive fragment. This modal uses glass-heavy styling with blur(30px) backdrop, scale-in animation, and is rendered via React Portal.",
    confirmText: "Accept Mission",
    cancelText: "Decline",
  },
  render: function DefaultStory(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          🔮 Open Modal
        </Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    );
  },
};

// ----- Sizes -----
export const Sizes: Story = {
  render: function SizesStory() {
    const [isOpenSm, setIsOpenSm] = useState(false);
    const [isOpenMd, setIsOpenMd] = useState(false);
    const [isOpenLg, setIsOpenLg] = useState(false);
    const [isOpenXl, setIsOpenXl] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 flex-wrap">
          <Button size="sm" variant="primary" onClick={() => setIsOpenSm(true)}>
            Small
          </Button>
          <Button variant="primary" onClick={() => setIsOpenMd(true)}>
            Medium
          </Button>
          <Button size="lg" variant="primary" onClick={() => setIsOpenLg(true)}>
            Large
          </Button>
          <Button variant="secondary" onClick={() => setIsOpenXl(true)}>
            X-Large
          </Button>
        </div>

        <Modal
          isOpen={isOpenSm}
          onClose={() => setIsOpenSm(false)}
          title="Small Modal"
          size="sm"
          confirmText="OK"
        >
          This is a small modal.
        </Modal>

        <Modal
          isOpen={isOpenMd}
          onClose={() => setIsOpenMd(false)}
          title="Medium Modal"
          size="md"
          confirmText="OK"
        >
          This is a medium modal - the default size.
        </Modal>

        <Modal
          isOpen={isOpenLg}
          onClose={() => setIsOpenLg(false)}
          title="Large Modal"
          size="lg"
          confirmText="OK"
        >
          This is a large modal with more space for content.
        </Modal>

        <Modal
          isOpen={isOpenXl}
          onClose={() => setIsOpenXl(false)}
          title="X-Large Modal"
          size="xl"
          confirmText="OK"
        >
          This is the extra large modal variant.
        </Modal>
      </div>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ----- Without Actions -----
export const WithoutActions: Story = {
  render: function WithoutActionsStory() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button variant="glass" onClick={() => setIsOpen(true)}>
          📜 View Content Only
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="📜 Just Content"
        >
          This modal has no action buttons. Click the X or backdrop to close.
        </Modal>
      </div>
    );
  },
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

// ----- Interactive Playground -----
export const Interactive: Story = {
  args: {
    title: "🗂️ Archive Access",
    children:
      "You've discovered a sealed Jedi archive fragment. This modal uses glass-heavy styling with blur(30px) backdrop.",
    confirmText: "Accept Mission",
    cancelText: "Decline",
    size: "md",
    closeOnBackdropClick: true,
    closeOnEscape: true,
  },
  render: function InteractiveStory(args) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          🔮 Open Modal
        </Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={() => {
            console.log("Mission accepted!");
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
};
