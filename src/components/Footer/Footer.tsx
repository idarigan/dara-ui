import React from "react";

export type FooterVariant = "default" | "sticky" | "minimal";

export interface FooterColumn {
  /**
   * Column heading
   */
  title?: string;
  /**
   * Links in this column
   */
  links?: {
    label: string;
    href: string;
    external?: boolean;
    icon?: React.ReactNode;
  }[];
  /**
   * Free-form content for this column (overrides links)
   */
  content?: React.ReactNode;
}

export interface FooterProps {
  /**
   * Layout variant
   * - default: static footer at page bottom, brand + columns + bottom bar
   * - sticky: always pinned to bottom of viewport (content pushes it up)
   * - minimal: single-row thin strip
   * @default "default"
   */
  variant?: FooterVariant;
  /**
   * Brand element (logo, name)
   */
  brand?: React.ReactNode;
  /**
   * Short tagline under the brand
   */
  tagline?: string;
  /**
   * Columns of links / content
   */
  columns?: FooterColumn[];
  /**
   * Social icons / media strip (rendered above the bottom bar)
   */
  social?: React.ReactNode;
  /**
   * Bottom bar content (copyright, legal links)
   */
  bottomBar?: React.ReactNode;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Footer
 *
 * Features:
 * - Three variants: default, sticky, minimal
 * - Glass-morphism styling consistent with Navbar
 * - Responsive columns (2 cols on mobile, 4 on desktop)
 * - RTL aware
 * - Slots: brand, tagline, columns, social, bottomBar
 */
export const Footer: React.FC<FooterProps> = ({
  variant = "default",
  brand,
  tagline,
  columns = [],
  social,
  bottomBar,
  className = "",
}) => {
  // ----- Minimal -----
  if (variant === "minimal") {
    return (
      <footer
        className={`
          w-full border-t border-[var(--color-border-primary)]
          py-4 px-6
          ${className}
        `}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {brand && <div className="flex-shrink-0">{brand}</div>}
          {bottomBar && (
            <div className="text-xs text-[var(--color-text-tertiary)] font-mono">
              {bottomBar}
            </div>
          )}
        </div>
      </footer>
    );
  }

  // ----- Sticky -----
  if (variant === "sticky") {
    return (
      <footer
        className={`
          fixed bottom-0 left-0 right-0 z-40
          navbar-glass
          py-3 px-6
          ${className}
        `}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {brand && <div className="flex-shrink-0">{brand}</div>}
          {social && <div className="flex items-center gap-3">{social}</div>}
          {bottomBar && (
            <div className="text-xs text-[var(--color-text-tertiary)] font-mono">
              {bottomBar}
            </div>
          )}
        </div>
      </footer>
    );
  }

  // ----- Default -----
  return (
    <footer
      className={`
        w-full border-t border-[var(--color-border-primary)]
        bg-[var(--color-bg-secondary)]/60
        backdrop-blur-[20px]
        pt-12 pb-6 px-6
        ${className}
      `}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top: brand + columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Brand column */}
          <div className="md:col-span-4 flex flex-col gap-3">
            {brand && <div className="flex-shrink-0">{brand}</div>}
            {tagline && (
              <p
                className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs"
                dir="auto"
              >
                {tagline}
              </p>
            )}
            {social && (
              <div className="flex items-center gap-3 mt-2">{social}</div>
            )}
          </div>

          {/* Link columns */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-6">
            {columns.map((column, i) => (
              <div key={i} className="flex flex-col gap-3">
                {column.title && (
                  <h4
                    className="font-heading font-semibold text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]"
                    dir="auto"
                  >
                    {column.title}
                  </h4>
                )}
                {column.content ? (
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    {column.content}
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {column.links?.map((link, j) => (
                      <li key={j}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          className="
                            inline-flex items-center gap-2
                            text-sm text-[var(--color-text-secondary)]
                            hover:text-[var(--color-primary)]
                            transition-colors duration-180
                          "
                          dir="auto"
                        >
                          {link.icon && (
                            <span className="flex-shrink-0">{link.icon}</span>
                          )}
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        {bottomBar && (
          <div className="pt-6 border-t border-[var(--color-border-secondary)] flex items-center justify-between flex-wrap gap-4">
            <div
              className="text-xs text-[var(--color-text-tertiary)] font-mono"
              dir="auto"
            >
              {bottomBar}
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";
export default Footer;
