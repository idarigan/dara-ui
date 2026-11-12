import React from "react";

// ============================================
// SECTION
// ============================================

interface SectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  id,
  title,
  description,
  children,
}) => (
  <section id={id} className="scroll-mt-28 mb-20">
    <header className="mb-8">
      <h2 className="font-heading text-3xl font-bold text-gradient-primary">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
          {description}
        </p>
      )}
    </header>
    <div className="flex flex-col gap-6">{children}</div>
  </section>
);

// ============================================
// PREVIEW
// ============================================

interface PreviewProps {
  title: string;
  code?: string;
  grid?: boolean;
  children: React.ReactNode;
}

export const Preview: React.FC<PreviewProps> = ({
  title,
  code,
  grid = false,
  children,
}) => (
  <div className="glass focus-within:z-20">
    <div className="px-5 py-3 border-b border-[var(--color-border-secondary)]">
      <h3 className="font-heading text-sm font-semibold text-[var(--color-text-primary)]">
        {title}
      </h3>
    </div>

    <div
      className={
        grid
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6"
          : "flex flex-wrap items-center gap-4 p-6"
      }
    >
      {children}
    </div>

    {code && (
      <pre
        className="code-block m-0 overflow-x-auto rounded-b-[var(--radius-standard)] border-t border-[var(--color-border-secondary)] !bg-[var(--color-bg-tertiary)]/60 p-4 text-xs"
        dir="ltr"
      >
        <code className="code-block !bg-transparent !p-0">{code}</code>
      </pre>
    )}
  </div>
);
