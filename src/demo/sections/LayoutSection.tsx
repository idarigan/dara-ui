import { useMemo } from "react";
import {
  Card,
  FolderIcon,
  HomeIcon,
  SettingsIcon,
  Sidebar,
  useI18n,
} from "../../index";
import type { SidebarGroup } from "../../index";
import { Preview, Section } from "../Section";

export const LayoutSection = () => {
  const { t } = useI18n();

  const groups: SidebarGroup[] = useMemo(
    () => [
      {
        label: t("sidebar.main"),
        defaultExpanded: true,
        items: [
          {
            id: "dashboard",
            label: t("sidebar.dashboard"),
            icon: <HomeIcon />,
            content: (
              <Card glow="primary">
                <h3 className="font-heading font-bold" dir="auto">
                  {t("sidebar.dashboard")}
                </h3>
                <p
                  className="text-sm text-[var(--color-text-secondary)]"
                  dir="auto"
                >
                  {t("sidebar.dashboardContent")}
                </p>
              </Card>
            ),
          },
          {
            id: "projects",
            label: t("sidebar.projects"),
            icon: <FolderIcon />,
            badge: 12,
            content: (
              <Card glow="secondary">
                <h3 className="font-heading font-bold" dir="auto">
                  {t("sidebar.projects")}
                </h3>
                <p
                  className="text-sm text-[var(--color-text-secondary)]"
                  dir="auto"
                >
                  {t("sidebar.projectsContent")}
                </p>
              </Card>
            ),
          },
        ],
      },
      {
        label: t("sidebar.management"),
        items: [
          {
            id: "settings",
            label: t("sidebar.settings"),
            icon: <SettingsIcon />,
            content: (
              <Card glow="accent">
                <h3 className="font-heading font-bold" dir="auto">
                  {t("sidebar.settings")}
                </h3>
                <p
                  className="text-sm text-[var(--color-text-secondary)]"
                  dir="auto"
                >
                  {t("sidebar.settingsContent")}
                </p>
              </Card>
            ),
          },
        ],
      },
    ],
    [t],
  );

  return (
    <Section
      id="layout"
      title="Layout"
      description="Navigation structures that switch to a horizontal strip on small screens."
    >
      <Preview title={t("sidebar.title")}>
        <div className="h-[380px] w-full overflow-hidden rounded-[var(--radius-large)] border border-[var(--color-border-primary)]">
          <Sidebar
            groups={groups}
            defaultActiveItemId="dashboard"
            height="380px"
            brand={
              <span
                className="font-heading font-bold text-lg tracking-tight truncate text-gradient-primary"
                dir="ltr"
              >
                DARA UI
              </span>
            }
          />
        </div>
      </Preview>
    </Section>
  );
};
