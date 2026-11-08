import { useMemo, useState } from "react";
import {
  CustomCursor,
  Dropdown,
  Footer,
  GradientRing,
  I18nProvider,
  LanguageChanger,
  Navbar,
  NoiseOverlay,
  PageLoaderProvider,
  Particles,
  SocialMedia,
  Switch,
  ThemeChanger,
  ThemeProvider,
  ToastProvider,
  Topography,
  translations,
  useI18n,
} from "../index";
import type { NavLink } from "../index";
import { DocsNav } from "./DocsNav";
import { useActiveSection } from "./useActiveSection";
import { ActionsSection } from "./sections/ActionsSection";
import { CardsSection } from "./sections/CardsSection";
import { DisplaySection } from "./sections/DisplaySection";
import { FeedbackSection } from "./sections/FeedbackSection";
import { FormsSection } from "./sections/FormsSection";
import { LayoutSection } from "./sections/LayoutSection";

// ============================================
// NAVIGATION
// ============================================

const sectionIds = [
  "actions",
  "forms",
  "display",
  "feedback",
  "cards",
  "layout",
] as const;

const backgroundValues = ["topography", "particles", "none"] as const;

const brand = (
  <span
    className="font-heading font-bold text-lg tracking-tight text-gradient-primary"
    dir="ltr"
  >
    DARA UI
  </span>
);

// ============================================
// SHELL
// ============================================

function Shell() {
  const { t } = useI18n();
  const [background, setBackground] = useState("topography");
  const [cursor, setCursor] = useState(true);
  const activeSection = useActiveSection(sectionIds);

  const sections = useMemo(
    () =>
      sectionIds.map((id) => ({
        id,
        label: t(`demo.sections.${id}.title`),
      })),
    [t],
  );

  const backgrounds = useMemo(
    () =>
      backgroundValues.map((value) => ({
        value,
        label: t(`demo.backgrounds.${value}`),
      })),
    [t],
  );

  const navLinks: NavLink[] = useMemo(
    () => sections.map((s) => ({ label: s.label, href: `#${s.id}` })),
    [sections],
  );

  return (
    <>
      {/* Effects */}
      <NoiseOverlay />
      {background === "topography" && <Topography />}
      {background === "particles" && <Particles />}
      {cursor && <CustomCursor />}

      {/* Navbar */}
      <Navbar
        brand={brand}
        links={navLinks}
        scrollSpy
        showSearch={false}
        showLanguageChanger
        languageChanger={<LanguageChanger iconOnly size="sm" />}
        languageChangerMobile={
          <LanguageChanger iconOnly size="sm" openUpward />
        }
        showThemeChanger
        themeChanger={<ThemeChanger iconOnly size="sm" />}
        themeChangerMobile={<ThemeChanger iconOnly size="sm" openUpward />}
      />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-32 pb-24">
        {/* Hero */}
        <section className="relative mb-24 text-center">
          <GradientRing />
          <span className="section-label block mb-4">{t("hero.version")}</span>
          <h1 className="font-heading text-6xl md:text-8xl font-bold mb-6 tracking-tight text-gradient-hero">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl leading-relaxed text-[var(--color-text-secondary)]">
            {t("hero.subtitle")}
          </p>

          <div className="glass mx-auto flex max-w-xl flex-wrap items-end justify-center gap-6 p-5 hover:z-20 focus-within:z-20">
            <Dropdown
              label={t("demo.background")}
              options={backgrounds}
              value={background}
              onChange={setBackground}
            />
            <Switch
              label={t("demo.customCursor")}
              checked={cursor}
              onCheckedChange={setCursor}
              glow
            />
          </div>
        </section>

        {/* Docs */}
        <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <DocsNav
              items={sections}
              activeId={activeSection}
              label={t("demo.navLabel")}
            />
          </aside>

          <div className="min-w-0">
            <ActionsSection />
            <FormsSection />
            <DisplaySection />
            <FeedbackSection />
            <CardsSection />
            <LayoutSection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        brand={brand}
        tagline={t("hero.subtitle")}
        columns={[
          {
            title: t("demo.footer.components"),
            links: sections.map((s) => ({ label: s.label, href: `#${s.id}` })),
          },
          {
            title: t("demo.footer.project"),
            links: [
              {
                label: "GitHub",
                href: "https://github.com/idarigan",
                external: true,
              },
              {
                label: "Storybook",
                href: "https://dara-ui.vercel.app",
                external: true,
              },
            ],
          },
        ]}
        bottomBar={<>{t("demo.footer.rights")}</>}
      />

      <SocialMedia
        links={[
          { platform: "github", url: "https://github.com/idarigan" },
          { platform: "discord", url: "https://discord.gg/dara-ui" },
          { platform: "youtube", url: "https://youtube.com/@dara-ui" },
        ]}
        position="left"
        size="md"
      />
    </>
  );
}

// ============================================
// APP
// ============================================

function App() {
  return (
    <ToastProvider>
      <I18nProvider translations={translations} defaultLanguage="en">
        <ThemeProvider defaultTheme="nightfall">
          <PageLoaderProvider>
            <Shell />
          </PageLoaderProvider>
        </ThemeProvider>
      </I18nProvider>
    </ToastProvider>
  );
}

export default App;
