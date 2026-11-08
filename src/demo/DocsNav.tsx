import React from "react";

// ============================================
// DOCS NAV
// ============================================

export interface DocsNavItem {
  id: string;
  label: string;
}

interface DocsNavProps {
  items: DocsNavItem[];
  activeId: string;
  label?: string;
  className?: string;
}

export const DocsNav: React.FC<DocsNavProps> = ({
  items,
  activeId,
  label,
  className = "",
}) => (
  <div className={`sticky top-28 ${className}`}>
    <nav className="glass flex flex-col gap-1 p-2 text-sm" aria-label={label}>
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? "location" : undefined}
            className={`
              relative rounded-[var(--radius-md)] px-4 py-2
              transition-colors duration-180
              ${
                isActive
                  ? "bg-[var(--color-primary-light)] font-medium !text-[var(--color-primary)]"
                  : "!text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)]/40 hover:!text-[var(--color-text-primary)]"
              }
            `}
          >
            {isActive && (
              <span
                className="absolute start-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--color-primary)] shadow-[var(--shadow-glow-primary)]"
                aria-hidden="true"
              />
            )}
            {item.label}
          </a>
        );
      })}
    </nav>
  </div>
);

DocsNav.displayName = "DocsNav";
export default DocsNav;
