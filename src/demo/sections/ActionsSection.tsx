import { Avatar, Badge, Button, Tooltip, useI18n } from "../../index";
import { Preview, Section } from "../Section";

const buttonVariants = [
  "primary",
  "secondary",
  "accent",
  "glass",
  "danger",
  "success",
  "outline",
] as const;

const badgeVariants = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
] as const;

export const ActionsSection = () => {
  const { t } = useI18n();

  return (
    <Section
      id="actions"
      title="Actions"
      description="Buttons, badges, avatars and tooltips for everyday interface actions."
    >
      <Preview
        title={t("buttons.title")}
        code={`<Button variant="primary" glow="primary">Launch</Button>`}
      >
        {buttonVariants.map((variant) => (
          <Button key={variant} variant={variant}>
            {t(`buttons.${variant}`)}
          </Button>
        ))}
      </Preview>

      <Preview title={t("buttons.states")}>
        <Button loading>{t("buttons.loading")}</Button>
        <Button disabled>{t("buttons.disabled")}</Button>
        <Button glow="primary">{t("buttons.glowPrimary")}</Button>
        <Button glow="accent" variant="accent">
          {t("buttons.glowAccent")}
        </Button>
      </Preview>

      <Preview
        title={t("badges.title")}
        code={`<Badge variant="success" glow>Online</Badge>`}
      >
        {badgeVariants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {t(`badges.${variant}`)}
          </Badge>
        ))}
        {badgeVariants.map((variant) => (
          <Badge key={`o-${variant}`} variant={variant} outline>
            {t(`badges.${variant}`)}
          </Badge>
        ))}
      </Preview>

      <Preview title={t("avatar.title")}>
        <Avatar size="sm" fallbackText="JD" />
        <Avatar size="md" fallbackText="JS" glow="primary" />
        <Avatar size="lg" fallbackText="AK" status="online" />
        <Avatar
          size="lg"
          src="https://i.pravatar.cc/150?img=5"
          alt="User"
          glow="accent"
        />
        <Avatar group size="md">
          <Avatar fallbackText="JD" />
          <Avatar fallbackText="JS" />
          <Avatar fallbackText="AK" />
        </Avatar>
      </Preview>

      <Preview title={t("tooltip.title")}>
        {(["top", "bottom", "left", "right"] as const).map((placement) => (
          <Tooltip
            key={placement}
            content={t(`tooltip.${placement}`)}
            placement={placement}
          >
            <Button size="sm" variant="glass">
              {t(`tooltip.${placement}`)}
            </Button>
          </Tooltip>
        ))}
      </Preview>
    </Section>
  );
};
