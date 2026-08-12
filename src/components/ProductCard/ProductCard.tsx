import React, { useState, useRef } from "react";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";

export interface ProductCardProps {
  /**
   * Product title
   */
  title: string;
  /**
   * Product price
   */
  price: number | string;
  /**
   * Product currency symbol
   * @default "$"
   */
  currency?: string;
  /**
   * Product image URL
   */
  image?: string;
  /**
   * Product description (shown on hover or expand)
   */
  description?: string;
  /**
   * Product rating (0-5)
   */
  rating?: number;
  /**
   * Number of reviews
   */
  reviewCount?: number;
  /**
   * Product category
   */
  category?: string;
  /**
   * Product tags
   */
  tags?: string[];
  /**
   * Is product on sale
   * @default false
   */
  onSale?: boolean;
  /**
   * Original price (for sale items)
   */
  originalPrice?: number | string;
  /**
   * Is product in stock
   * @default true
   */
  inStock?: boolean;
  /**
   * Product badge text (e.g., "New", "Sale", "Limited")
   */
  badge?: string;
  /**
   * Badge variant
   * @default "primary"
   */
  badgeVariant?: "primary" | "secondary" | "success" | "danger" | "warning";
  /**
   * Product link URL
   */
  link?: string;
  /**
   * Callback when add to cart is clicked
   */
  onAddToCart?: () => void;
  /**
   * Callback when product is clicked
   */
  onClick?: () => void;
  /**
   * Layout variant
   * @default "vertical"
   */
  layout?: "vertical" | "horizontal" | "compact";
  /**
   * Glow variant color
   * @default "none"
   */
  glow?: "purple" | "cyan" | "pink" | "none";
  /**
   * Show quick actions on hover
   * @default true
   */
  showQuickActions?: boolean;
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
 * Dara UI ProductCard - Glassy product card with 3D hover effect
 *
 * Features:
 * - 3D tilt effect on hover (same as RPG components)
 * - Glassmorphism styling
 * - Vertical, horizontal, and compact layouts
 * - Product image with fallback
 * - Rating stars display
 * - Sale badge and price comparison
 * - Stock status indicator
 * - Quick add to cart button
 * - Responsive with optional full width on mobile
 * - Theme-aware colors
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  currency = "$",
  image,
  description,
  rating = 0,
  reviewCount = 0,
  category,
  tags = [],
  onSale = false,
  originalPrice,
  inStock = true,
  badge,
  badgeVariant = "primary",
  link,
  onAddToCart,
  onClick,
  layout = "vertical",
  glow = "none",
  showQuickActions = true,
  className = "",
  fullWidthMobile = false,
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isHorizontal = layout === "horizontal";
  const isCompact = layout === "compact";

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

  // Render rating stars
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className="text-[var(--color-warning)]">
            ★
          </span>,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className="text-[var(--color-warning)]">
            ★
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-[var(--color-text-tertiary)]">
            ☆
          </span>,
        );
      }
    }
    return stars;
  };

  // Format price
  const formatPrice = (value: number | string) => {
    if (typeof value === "string") return value;
    return `${currency}${value.toFixed(2)}`;
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
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      </svg>
    </div>
  );

  // Image component
  const renderImage = () => {
    const imageClasses = `
      ${isHorizontal ? "w-32 h-32 md:w-40 md:h-40 flex-shrink-0" : "w-full aspect-square"}
      ${isCompact ? "w-16 h-16 flex-shrink-0" : ""}
      rounded-[var(--radius-md)] overflow-hidden
      bg-[var(--color-bg-tertiary)]
      relative
    `;

    return (
      <div className={imageClasses}>
        {image && !imageError ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          placeholderImage()
        )}
        {badge && (
          <Badge
            variant={badgeVariant}
            size="sm"
            glow
            className="absolute top-2 left-2 z-10"
          >
            {badge}
          </Badge>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-[var(--radius-md)]">
            <span className="font-heading font-bold text-white text-sm uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>
    );
  };

  // Product info
  const renderInfo = () => {
    const infoClasses = `
      ${isHorizontal ? "flex-1 min-w-0" : ""}
      ${isCompact ? "flex-1 min-w-0" : ""}
      flex flex-col
    `;

    return (
      <div className={infoClasses}>
        {/* Category */}
        {category && (
          <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1">
            {category}
          </span>
        )}

        {/* Title */}
        <h3
          className={`
            font-heading font-bold text-[var(--color-text-primary)]
            ${isCompact ? "text-sm" : "text-base"}
            ${isHorizontal ? "text-base" : ""}
            line-clamp-2
            ${link ? "cursor-pointer hover:text-[var(--color-primary)]" : ""}
            transition-colors duration-180
          `}
          onClick={() => link && window.open(link, "_blank")}
        >
          {title}
        </h3>

        {/* Description (only on vertical and horizontal) */}
        {description && !isCompact && (
          <p className="text-[var(--color-text-secondary)] text-sm mt-1 line-clamp-2 flex-1">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && !isCompact && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] font-mono text-[var(--color-text-tertiary)]">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price + Rating */}
        <div
          className={`
          flex items-center justify-between mt-auto pt-3
          ${isHorizontal ? "flex-wrap gap-2" : ""}
          ${isCompact ? "flex-wrap gap-1 pt-1" : ""}
        `}
        >
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg text-[var(--color-text-primary)]">
              {formatPrice(price)}
            </span>
            {onSale && originalPrice && (
              <span className="text-sm text-[var(--color-text-tertiary)] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            {onSale && (
              <Badge variant="danger" size="sm">
                Sale
              </Badge>
            )}
          </div>

          {rating > 0 && !isCompact && (
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-sm">
                {renderStars()}
              </span>
              {reviewCount > 0 && (
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick actions (on hover) */}
        {showQuickActions && !isCompact && (
          <div
            className={`
              mt-3 pt-3 border-t border-[var(--color-border-secondary)]
              transition-all duration-300
              ${isHovering ? "opacity-100 max-h-20" : "opacity-0 max-h-0 overflow-hidden"}
            `}
          >
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
              disabled={!inStock}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Layout classes
  const layoutClasses = {
    vertical: "flex flex-col gap-4",
    horizontal: "flex flex-col sm:flex-row gap-4",
    compact: "flex flex-row items-center gap-3",
  };

  const mobileFullWidth = fullWidthMobile ? "w-full sm:w-auto" : "";

  return (
    <div
      ref={cardRef}
      className={`
        glass p-4 float-card relative
        transition-all duration-300
        ${glowStyles[glow]}
        ${layoutClasses[layout]}
        ${mobileFullWidth}
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
      aria-label={`Product: ${title}`}
    >
      {renderImage()}
      {renderInfo()}

      {/* Compact layout quick action */}
      {isCompact && inStock && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.();
          }}
          className={`
            flex-shrink-0 p-2 rounded-full
            bg-[var(--color-primary)] text-white
            hover:bg-[var(--color-primary-hover)]
            transition-all duration-180
            ${isHovering ? "scale-100 opacity-100" : "scale-0 opacity-0"}
          `}
          aria-label="Add to cart"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

ProductCard.displayName = "ProductCard";
export default ProductCard;
