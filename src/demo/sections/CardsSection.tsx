import {
  BlogCard,
  Card,
  CharacterCard,
  ProductCard,
  QuestCard,
  StatsWidget,
  useI18n,
} from "../../index";
import { Preview, Section } from "../Section";

const threeDaysFromNow = new Date(
  Date.now() + 3 * 24 * 60 * 60 * 1000,
).toISOString();

export const CardsSection = () => {
  const { t } = useI18n();

  return (
    <Section
      id="cards"
      title={t("demo.sections.cards.title")}
      description={t("demo.sections.cards.description")}
    >
      <Preview title={t("cards.title")} grid>
        <Card float glow="primary">
          <h3 className="font-heading font-bold">{t("cards.primaryGlow")}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("common.hoverToFloat")}
          </p>
        </Card>
        <Card float glow="secondary">
          <h3 className="font-heading font-bold">{t("cards.secondaryGlow")}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("common.hoverToFloat")}
          </p>
        </Card>
        <Card float glow="accent">
          <h3 className="font-heading font-bold">{t("cards.accentGlow")}</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("common.hoverToFloat")}
          </p>
        </Card>
      </Preview>

      <Preview title={t("quest.title")} grid>
        <QuestCard
          title={t("quest.buildCMS")}
          description={t("quest.buildCMSDesc")}
          xp={300}
          deadline="tomorrow"
          rank="S"
          glow="secondary"
        />
        <QuestCard
          title={t("quest.secureArchives")}
          description={t("quest.secureArchivesDesc")}
          xp={200}
          deadline={threeDaysFromNow}
          rank="A"
          glow="primary"
          requirements={[t("quest.completeReviews"), t("quest.writeTests")]}
        />
      </Preview>

      <Preview title={t("character.title")} grid>
        <CharacterCard
          name={t("character.daraName")}
          subtitle={t("character.daraSubtitle")}
          quote={t("character.daraQuote")}
          mbti="INTJ"
          species={t("character.speciesHumanCyborg")}
          affiliation={t("character.affiliationJedi")}
          stats={[
            { label: t("character.force"), value: 73, color: "primary" },
            { label: t("character.combat"), value: 85, color: "secondary" },
            { label: t("character.intelligence"), value: 92, color: "accent" },
          ]}
          glow="primary"
        />
        <StatsWidget
          title={t("statsWidget.forceStats")}
          glow="secondary"
          stats={[
            {
              label: t("character.force"),
              value: 73,
              color: "primary",
              trend: 12,
            },
            {
              label: t("character.combat"),
              value: 85,
              color: "secondary",
              trend: 8,
            },
            {
              label: t("character.wisdom"),
              value: 68,
              color: "warning",
              trend: -3,
            },
          ]}
        />
      </Preview>

      <Preview
        title={t("productCard.title")}
        grid
        code={`<ProductCard title="Holocron" price={149.99} link="/products/holocron" />`}
      >
        <ProductCard
          title={t("productCard.product1")}
          price={79.99}
          image="https://picsum.photos/seed/cyberpunk/300/300"
          description={t("productCard.desc1")}
          rating={4.5}
          reviewCount={128}
          category={t("productCard.category1")}
          badge={t("productCard.limited")}
          badgeVariant="danger"
          link="#"
        />
        <ProductCard
          title={t("productCard.product2")}
          price={149.99}
          originalPrice={199.99}
          onSale
          image="https://picsum.photos/seed/holocron/300/300"
          description={t("productCard.desc2")}
          rating={5}
          reviewCount={89}
          category={t("productCard.category2")}
          glow="primary"
          link="#"
        />
        <ProductCard
          title={t("productCard.product3")}
          price={59.99}
          image="https://picsum.photos/seed/controller/300/300"
          description={t("productCard.desc3")}
          rating={4}
          reviewCount={203}
          category={t("productCard.category3")}
          inStock={false}
          link="#"
        />
      </Preview>

      <Preview title={t("blogCard.title")} grid>
        <BlogCard
          title={t("blogCard.post1")}
          excerpt={t("blogCard.excerpt1")}
          coverImage="https://picsum.photos/seed/glassmorphism/400/250"
          author={t("blogCard.author1")}
          date={new Date("2024-11-15")}
          readTime={5}
          category={t("blogCard.category1")}
          tags={[t("blogCard.tag1"), t("blogCard.tag2")]}
          link="#"
        />
        <BlogCard
          title={t("blogCard.post2")}
          excerpt={t("blogCard.excerpt2")}
          coverImage="https://picsum.photos/seed/design-system/400/250"
          author={t("blogCard.author2")}
          date={new Date("2024-11-10")}
          readTime={8}
          category={t("blogCard.category2")}
          glow="secondary"
          link="#"
        />
      </Preview>
    </Section>
  );
};
