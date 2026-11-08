import { useMemo, useState } from "react";
import { Accordion, Progress, Tabs, XPBar, useI18n } from "../../index";
import { Preview, Section } from "../Section";

export const DisplaySection = () => {
  const { t } = useI18n();
  const [tab, setTab] = useState("archive");

  const tabItems = useMemo(
    () =>
      (["archive", "quests", "stats", "settings"] as const).map((key) => ({
        label: t(`tabs.${key}`),
        value: key,
        content: (
          <div className="py-4 text-[var(--color-text-secondary)]" dir="auto">
            {t(`tabs.${key}Content`)}
          </div>
        ),
      })),
    [t],
  );

  const accordionItems = useMemo(
    () =>
      (["1", "2", "3"] as const).map((n) => ({
        id: n,
        title: t(`accordion.q${n}`),
        content: <div dir="auto">{t(`accordion.a${n}`)}</div>,
      })),
    [t],
  );

  return (
    <Section
      id="display"
      title={t("demo.sections.display.title")}
      description={t("demo.sections.display.description")}
    >
      <Preview title={t("tabs.title")}>
        <div className="w-full">
          <Tabs items={tabItems} activeValue={tab} onChange={setTab} />
        </div>
      </Preview>

      <Preview title={t("accordion.title")}>
        <div className="w-full">
          <Accordion items={accordionItems} defaultOpenItems={["1"]} />
        </div>
      </Preview>

      <Preview title={t("progress.title")} grid>
        <div className="flex flex-col gap-4">
          <Progress
            value={75}
            color="primary"
            labelPosition="right"
            showLabel
          />
          <Progress
            value={55}
            color="gradient"
            labelPosition="right"
            showLabel
          />
          <Progress
            value={30}
            color="danger"
            labelPosition="inside"
            showLabel
          />
        </div>
        <div className="flex items-center gap-6">
          <Progress
            variant="radial"
            value={75}
            color="primary"
            showLabel
            glow
          />
          <Progress variant="radial" value={45} color="accent" showLabel />
        </div>
      </Preview>

      <Preview title={t("xpbar.title")}>
        <div className="w-full">
          <XPBar
            value={3400}
            max={5000}
            level={14}
            levelLabel={t("xpbar.tier")}
            xpLabel={t("xpbar.points")}
            customLabel={t("xpbar.rankProgress")}
            ranks={[
              { label: t("rank.common"), requiredXP: 0 },
              { label: t("rank.uncommon"), requiredXP: 1000 },
              { label: t("rank.rare"), requiredXP: 2500 },
              { label: t("rank.epic"), requiredXP: 4000 },
            ]}
          />
        </div>
      </Preview>
    </Section>
  );
};
