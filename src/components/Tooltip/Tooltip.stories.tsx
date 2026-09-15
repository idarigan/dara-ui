import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import Button from "../Button/Button";
import { Badge } from "../Badge/Badge";
import { I18nProvider, useI18n } from "../LanguageChanger/LanguageChanger";
import { translations } from "../../translations";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: [
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ],
    },
    variant: {
      control: "select",
      options: ["glass", "solid", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    delay: { control: "number" },
    hideDelay: { control: "number" },
    arrow: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    content: "This is a tooltip",
    children: <Button variant="primary">Hover me</Button>,
    placement: "top",
    variant: "glass",
    size: "md",
    delay: 300,
    hideDelay: 0,
    arrow: true,
    disabled: false,
  },
  decorators: [
    (Story) => (
      <I18nProvider translations={translations} defaultLanguage="en">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

// ----- Default -----
export const Default: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Tooltip content={t("tooltip.interactive")}>
        <Button variant="primary">{t("buttons.primary")}</Button>
      </Tooltip>
    );
  },
};

// ----- Placements -----
export const Placements: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <div className="grid grid-cols-3 gap-8 p-8">
        <Tooltip content={t("tooltip.top")} placement="top">
          <Button size="sm" variant="glass">
            {t("tooltip.top")}
          </Button>
        </Tooltip>
        <Tooltip content={t("tooltip.bottom")} placement="bottom">
          <Button size="sm" variant="glass">
            {t("tooltip.bottom")}
          </Button>
        </Tooltip>
        <Tooltip content={t("tooltip.left")} placement="left">
          <Button size="sm" variant="glass">
            {t("tooltip.left")}
          </Button>
        </Tooltip>
        <Tooltip content={t("tooltip.right")} placement="right">
          <Button size="sm" variant="glass">
            {t("tooltip.right")}
          </Button>
        </Tooltip>
        <Tooltip content={t("tooltip.topLeft")} placement="top-left">
          <Button size="sm" variant="glass">
            {t("tooltip.topLeft")}
          </Button>
        </Tooltip>
        <Tooltip content={t("tooltip.topRight")} placement="top-right">
          <Button size="sm" variant="glass">
            {t("tooltip.topRight")}
          </Button>
        </Tooltip>
        <Tooltip content={t("tooltip.bottomLeft")} placement="bottom-left">
          <Button size="sm" variant="glass">
            {t("tooltip.bottomLeft")}
          </Button>
        </Tooltip>
        <Tooltip content={t("tooltip.bottomRight")} placement="bottom-right">
          <Button size="sm" variant="glass">
            {t("tooltip.bottomRight")}
          </Button>
        </Tooltip>
      </div>
    );
  },
};

// ----- Variants -----
export const Variants: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <div className="flex items-center gap-8">
        <Tooltip content={t("tooltip.glassTooltip")} variant="glass">
          <Button variant="glass">{t("tooltip.glassLabel")}</Button>
        </Tooltip>
        <Tooltip content={t("tooltip.solidTooltip")} variant="solid">
          <Button variant="secondary">{t("tooltip.solidLabel")}</Button>
        </Tooltip>
        <Tooltip content={t("tooltip.outlineTooltip")} variant="outline">
          <Button variant="outline">{t("tooltip.outlineLabel")}</Button>
        </Tooltip>
      </div>
    );
  },
};

// ----- Sizes -----
export const Sizes: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <div className="flex items-center gap-8">
        <Tooltip content={t("tooltip.small")} size="sm">
          <Button size="sm">{t("buttons.small")}</Button>
        </Tooltip>
        <Tooltip content={t("tooltip.medium")} size="md">
          <Button size="md">{t("buttons.medium")}</Button>
        </Tooltip>
        <Tooltip content={t("tooltip.large")} size="lg">
          <Button size="lg">{t("buttons.large")}</Button>
        </Tooltip>
      </div>
    );
  },
};

// ----- Long Content -----
export const LongContent: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Tooltip content={t("tooltip.longTooltip")}>
        <Button variant="primary">{t("tooltip.hoverDetails")}</Button>
      </Tooltip>
    );
  },
};

// ----- With Badge -----
export const WithBadge: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Tooltip content={t("tooltip.unreadMessages", { count: 42 })}>
        <Badge variant="primary" glow className="cursor-pointer">
          42
        </Badge>
      </Tooltip>
    );
  },
};

// ----- Disabled -----
export const Disabled: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Tooltip content={t("tooltip.disabledTooltip")} disabled>
        <Button variant="secondary">{t("buttons.disabled")}</Button>
      </Tooltip>
    );
  },
};

// ----- No Arrow -----
export const NoArrow: Story = {
  render: () => {
    const { t } = useI18n();
    return (
      <Tooltip content={t("tooltip.noArrow")} arrow={false}>
        <Button variant="glass">{t("tooltip.noArrow")}</Button>
      </Tooltip>
    );
  },
};

// ----- Interactive Playground -----
export const Interactive: Story = {
  args: {
    content: "Interactive tooltip",
    children: <Button variant="primary">Hover me</Button>,
    placement: "top",
    variant: "glass",
    size: "md",
    delay: 300,
    hideDelay: 0,
    arrow: true,
  },
};
