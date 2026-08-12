import React, { useState, useRef } from "react";
import { Badge } from "../Badge/Badge";
import { Avatar } from "../Avatar/Avatar";

export interface BlogCardProps {
  /**
   * Blog post title
   */
  title: string;
  /**
   * Blog post excerpt / description
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
   * Blog post category
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
   * Callback when card is clicked
   */
  onClick?: () => void;
  /**
   * Featured post (larger)
   * @default false
   */
  featured?: boolean;
  /**
   * Layout variant
   * @default "vertical"
   */
  layout?: "vertical" | "horizontal";
  /**
   * Glow variant color
   * @default "none"
   */
  glow?: "purple" | "cyan" | "pink" | "none";
  /**
   * Show category badge
   * @default true
   */
  showCategory?: boolean;
  /**
   * Show author info
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
 * Dara UI BlogCard - Glassy blog card with 3D hover effect
 *
 * Features:
 * - 3D tilt effect on hover (same as RPG components)
 * - Glassmorphism styling
 * - Vertical and horizontal layouts
 * - Featured variant with larger size
 * - Author avatar and name
 * - Publication date and read time
 * - Category and tags
 * - Responsive with optional full width on mobile
 * - Theme-aware colors
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

  // Handle 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  // Glow styles
  const glowStyles = {
    purple: "glow-purple",
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  };

  // Format date
  const formatDate = (dateValue: string | Date) => {
    if (typeof dateValue === "string") {
      return new Date(dateValue).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return dateValue.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Placeholder image
  const placeholderImage = () => (
    <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] text-4xl">
      <svg
        className="w-12 h-12"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.486 5.486 0 006.75 15.75v-1.5m-7.007 11.55h.007"
        />
      </svg>
    </div>
  );

  // Image component
  const renderCover = () => {
    const coverClasses = `
      ${isHorizontal ? "w-full md:w-56 md:h-56 flex-shrink-0" : "w-full aspect-video"}
      ${featured ? "aspect-video" : ""}
      rounded-[var(--radius-md)] overflow-hidden
      bg-[var(--color-bg-tertiary)]
      relative
    `;

    return (
      <div className={coverClasses}>
        {coverImage && !imageError ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          placeholderImage()
        )}
        {category && showCategory && (
          <Badge
            variant="primary"
            size="sm"
            glow
            className="absolute top-3 left-3 z-10"
          >
            {category}
          </Badge>
        )}
      </div>
    );
  };

  // Content
  const renderContent = () => {
    const contentClasses = `
      ${isHorizontal ? "flex-1 min-w-0" : ""}
      flex flex-col
    `;

    return (
      <div className={contentClasses}>
        {/* Title */}
        <h3
          className={`
            font-heading font-bold text-[var(--color-text-primary)]
            ${featured ? "text-2xl" : isHorizontal ? "text-lg" : "text-xl"}
            ${isHorizontal ? "text-lg" : ""}
            line-clamp-2
            ${link ? "cursor-pointer hover:text-[var(--color-primary)]" : ""}
            transition-colors duration-180
          `}
          onClick={() => link && window.open(link, "_blank")}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p
          className={`
            text-[var(--color-text-secondary)] 
            ${featured ? "text-base" : "text-sm"}
            mt-2
            line-clamp-${featured ? "3" : "2"}
            flex-1
          `}
        >
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, featured ? 4 : 3).map((tag, index) => (
              <span
                key={index}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
              >
                #{tag}
              </span>
            ))}
            {tags.length > (featured ? 4 : 3) && (
              <span className="text-[10px] font-mono text-[var(--color-text-tertiary)]">
                +{tags.length - (featured ? 4 : 3)}
              </span>
            )}
          </div>
        )}

        {/* Footer: Author + Date + Read time */}
        <div
          className={`
            flex items-center gap-4 mt-4 pt-4
            border-t border-[var(--color-border-secondary)]
            ${isHorizontal ? "flex-wrap" : ""}
          `}
        >
          {showAuthor && author && (
            <div className="flex items-center gap-2">
              <Avatar
                src={authorAvatar}
                fallbackText={author}
                size="sm"
                glow="none"
                bordered={false}
              />
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {author}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
            {date && (
              <time
                dateTime={typeof date === "string" ? date : date.toISOString()}
              >
                {formatDate(date)}
              </time>
            )}
            {showReadTime && readTime && (
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
                {readTime} min read
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Layout classes
  const layoutClasses = {
    vertical: "flex flex-col gap-4",
    horizontal: "flex flex-col md:flex-row gap-4",
  };

  const mobileFullWidth = fullWidthMobile ? "w-full sm:w-auto" : "";

  return (
    <div
      ref={cardRef}
      className={`
        glass p-5 float-card relative
        transition-all duration-300
        ${glowStyles[glow]}
        ${layoutClasses[layout]}
        ${mobileFullWidth}
        ${featured ? "p-6" : ""}
        ${className}
        cursor-pointer
      `}
      style={{
        transform: isHovering
          ? `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.02)`
          : "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)",
        transformStyle: "preserve-3d",
        transition: "transform 0.2s ease-out, box-shadow 0.4s ease",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Blog post: ${title}`}
    >
      {renderCover()}
      {renderContent()}

      {/* Read more link on hover for featured */}
      {featured && isHovering && link && (
        <div className="absolute bottom-5 right-5 z-10">
          <span className="text-sm font-medium text-[var(--color-primary)] flex items-center gap-1">
            Read More
            <svg
              className="h-4 w-4"
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
  );
};

BlogCard.displayName = "BlogCard";
export default BlogCard;
