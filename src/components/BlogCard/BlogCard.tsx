import React, { useState, useRef } from "react";
import { Badge } from "../Badge/Badge";
import { Avatar } from "../Avatar/Avatar";

export interface BlogCardProps {
  /**
   * Blog post title
   */
  title: string;
  /**
   * Blog post excerpt
   */
  excerpt: string;
  /**
   * Cover image URL
   */
  coverImage?: string;
  /**
   * Author name
   */
  author?: string;
  /**
   * Author avatar URL
   */
  authorAvatar?: string;
  /**
   * Publication date
   */
  date?: string | Date;
  /**
   * Read time in minutes
   */
  readTime?: number;
  /**
   * Category
   */
  category?: string;
  /**
   * Tags
   */
  tags?: string[];
  /**
   * Link to full post
   */
  link?: string;
  /**
   * Click callback
   */
  onClick?: () => void;
  /**
   * Featured (larger)
   * @default false
   */
  featured?: boolean;
  /**
   * Layout
   * @default "vertical"
   */
  layout?: "vertical" | "horizontal";
  /**
   * Glow
   * @default "none"
   */
  glow?: "purple" | "cyan" | "pink" | "none";
  /**
   * Show category badge
   * @default true
   */
  showCategory?: boolean;
  /**
   * Show author
   * @default true
   */
  showAuthor?: boolean;
  /**
   * Show read time
   * @default true
   */
  showReadTime?: boolean;
  /**
   * Additional className
   */
  className?: string;
  /**
   * Full width on mobile
   * @default false
   */
  fullWidthMobile?: boolean;
}

/**
 * Dara UI BlogCard – glass blog card with 3D tilt, elevation & glow hover
 *
 * Features:
 * - Vertical / horizontal layouts + featured size
 * - 3D tilt + lift + glow on hover
 * - Cover zoom, stable line-clamps, in-flow Read more
 * - RTL-friendly badge (start-*)
 */
export const BlogCard: React.FC<BlogCardProps> = ({
  title,
  excerpt,
  coverImage,
  author,
  authorAvatar,
  date,
  readTime,
  category,
  tags = [],
  link,
  onClick,
  featured = false,
  layout = "vertical",
  glow = "none",
  showCategory = true,
  showAuthor = true,
  showReadTime = true,
  className = "",
  fullWidthMobile = false,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHorizontal = layout === "horizontal";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotation({
      x: ((y - rect.height / 2) / (rect.height / 2)) * -6,
      y: ((x - rect.width / 2) / (rect.width / 2)) * 6,
    });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  const glowStyles = {
    purple: "glow-purple",
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  };

  const hoverGlowShadow = {
    purple:
      "0 0 28px color-mix(in srgb, var(--color-primary) 45%, transparent)",
    cyan: "0 0 28px color-mix(in srgb, var(--color-secondary) 45%, transparent)",
    pink: "0 0 28px color-mix(in srgb, var(--color-accent) 45%, transparent)",
    none: "0 0 24px color-mix(in srgb, var(--color-primary) 28%, transparent)",
  }[glow];

  const restShadow = "var(--shadow-float, 0 8px 24px rgba(0,0,0,0.18))";
  const elevatedShadow = `0 16px 40px rgba(0,0,0,0.28), ${hoverGlowShadow}`;

  const formatDate = (dateValue: string | Date) => {
    const d = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const Placeholder = () => (
    <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]">
      <svg
        className="w-10 h-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5"
        />
      </svg>
    </div>
  );

  const coverClass = isHorizontal
    ? "w-full sm:w-44 sm:h-44 md:w-52 md:h-52 flex-shrink-0 aspect-video sm:aspect-square"
    : featured
      ? "w-full aspect-[16/9]"
      : "w-full aspect-video";

  const tagLimit = featured ? 4 : 3;

  return (
    <div
      ref={cardRef}
      className={`
        glass relative overflow-hidden
        ${featured ? "p-5" : "p-4"}
        ${glowStyles[glow]}
        ${fullWidthMobile ? "w-full sm:w-auto" : ""}
        ${isHorizontal ? "flex flex-col sm:flex-row gap-4" : "flex flex-col h-full"}
        ${className}
        cursor-pointer
      `}
      style={{
        transform: isHovering
          ? `perspective(900px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(-6px) scale(1.02)`
          : "perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)",
        transformStyle: "preserve-3d",
        boxShadow: isHovering ? elevatedShadow : restShadow,
        transition:
          "transform 0.22s ease-out, box-shadow 0.3s ease, border-color 0.25s ease",
        borderColor: isHovering
          ? "color-mix(in srgb, var(--color-primary) 35%, var(--color-border-primary))"
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      aria-label={`Blog post: ${title}`}
    >
      {/* Soft glow wash on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0"
        style={{
          opacity: isHovering ? 1 : 0,
          background:
            "radial-gradient(ellipse at 30% 0%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 55%)",
        }}
      />

      {/* Cover */}
      <div
        className={`
          ${coverClass}
          rounded-[var(--radius-md)] overflow-hidden
          bg-[var(--color-bg-tertiary)] relative z-[1]
        `}
      >
        {coverImage && !imageError ? (
          <img
            src={coverImage}
            alt={title}
            className={`
              w-full h-full object-cover transition-transform duration-500
              ${isHovering ? "scale-105" : "scale-100"}
            `}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <Placeholder />
        )}

        {category && showCategory && (
          <span className="absolute top-2.5 start-2.5 z-10">
            <Badge variant="primary" size="sm" glow>
              {category}
            </Badge>
          </span>
        )}
      </div>

      {/* Content */}
      <div
        className={`
          flex flex-col flex-1 min-w-0 relative z-[1]
          ${isHorizontal ? "" : "mt-3"}
        `}
      >
        <h3
          className={`
            font-heading font-bold leading-snug line-clamp-2
            ${featured ? "text-2xl" : isHorizontal ? "text-lg" : "text-xl"}
            transition-colors duration-180
            ${isHovering ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"}
          `}
          onClick={(e) => {
            if (link) {
              e.stopPropagation();
              window.open(link, "_blank");
            }
          }}
        >
          {title}
        </h3>

        <p
          className={`
            text-[var(--color-text-secondary)] mt-2 flex-1
            ${featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"}
          `}
        >
          {excerpt}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, tagLimit).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
              >
                #{tag}
              </span>
            ))}
            {tags.length > tagLimit && (
              <span className="text-[10px] font-mono text-[var(--color-text-tertiary)]">
                +{tags.length - tagLimit}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 pt-3 border-t border-[var(--color-border-secondary)]">
          {showAuthor && author && (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar
                src={authorAvatar}
                fallbackText={author}
                size="sm"
                glow="none"
              />
              <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {author}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] ms-auto">
            {date && (
              <time
                dateTime={typeof date === "string" ? date : date.toISOString()}
              >
                {formatDate(date)}
              </time>
            )}
            {showReadTime && readTime != null && (
              <span className="flex items-center gap-1">
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readTime} min
              </span>
            )}
          </div>
        </div>

        {/* Read more – always in flow when link exists */}
        {link && (
          <div className="mt-3">
            <span
              className={`
                text-sm font-medium text-[var(--color-primary)]
                inline-flex items-center gap-1
                transition-all duration-200
                ${isHovering ? "opacity-100 translate-x-0.5" : "opacity-70"}
              `}
            >
              Read more
              <svg
                className={`
                  h-4 w-4 transition-transform duration-200
                  ${isHovering ? "translate-x-0.5" : ""}
                `}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

BlogCard.displayName = "BlogCard";
export default BlogCard;
