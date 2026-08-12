import React, { useState, useRef } from "react";
import { Badge } from "../Badge/Badge";
import Button from "../Button/Button";

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
   * Product description
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
   * Product badge text (e.g., "New", "Limited")
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
   * Show add-to-cart action
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
 * Dara UI ProductCard – glass product card with 3D tilt, elevation & glow hover
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
  const isVertical = layout === "vertical";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isCompact) return;
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

  // Hover glow ring (works even when glow="none")
  const hoverGlowShadow = {
    purple:
      "0 0 28px color-mix(in srgb, var(--color-primary) 45%, transparent)",
    cyan: "0 0 28px color-mix(in srgb, var(--color-secondary) 45%, transparent)",
    pink: "0 0 28px color-mix(in srgb, var(--color-accent) 45%, transparent)",
    none: "0 0 24px color-mix(in srgb, var(--color-primary) 28%, transparent)",
  }[glow];

  const restShadow = "var(--shadow-float, 0 8px 24px rgba(0,0,0,0.18))";
  const elevatedShadow = `0 16px 40px rgba(0,0,0,0.28), ${hoverGlowShadow}`;

  const formatPrice = (value: number | string) => {
    if (typeof value === "string") return value;
    return `${currency}${value.toFixed(2)}`;
  };

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={
          i < Math.round(rating)
            ? "text-[var(--color-warning)]"
            : "text-[var(--color-text-tertiary)]"
        }
      >
        {i < Math.round(rating) ? "★" : "☆"}
      </span>
    ));

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
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
        />
      </svg>
    </div>
  );

  const imageBoxClass = isCompact
    ? "w-14 h-14 flex-shrink-0"
    : isHorizontal
      ? "w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0"
      : "w-full aspect-square";

  // Compact: lift + scale (no 3D). Others: 3D + lift.
  const hoverTransform = isCompact
    ? isHovering
      ? "translateY(-4px) scale(1.03)"
      : "translateY(0) scale(1)"
    : isHovering
      ? `perspective(900px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(-6px) scale(1.02)`
      : "perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)";

  return (
    <div
      ref={cardRef}
      className={`
        glass relative overflow-hidden
        ${isCompact ? "p-3" : "p-4"}
        ${glowStyles[glow]}
        ${fullWidthMobile ? "w-full sm:w-auto" : ""}
        ${isVertical ? "flex flex-col h-full" : ""}
        ${isHorizontal ? "flex flex-row gap-4 items-stretch" : ""}
        ${isCompact ? "flex flex-row items-center gap-3" : ""}
        ${className}
        cursor-pointer
      `}
      style={{
        transform: hoverTransform,
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
      aria-label={`Product: ${title}`}
    >
      {/* Soft glow wash on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background:
            "radial-gradient(ellipse at 30% 0%, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 55%)",
        }}
      />

      {/* Compact corner Sale ribbon */}
      {isCompact && onSale && (
        <div
          className="absolute top-0 end-0 z-20 w-12 h-12 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <span className="absolute top-[7px] end-[-18px] w-[56px] text-center bg-[var(--color-danger)] text-white text-[8px] font-bold uppercase tracking-wider py-0.5 shadow-sm rotate-45 origin-center">
            Sale
          </span>
        </div>
      )}

      {/* Compact full-card Out of Stock */}
      {isCompact && !inStock && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-black/60 backdrop-blur-[2px]">
          <span className="font-heading font-bold text-white text-[11px] uppercase tracking-widest px-2 text-center">
            Out of Stock
          </span>
        </div>
      )}

      {/* Image */}
      <div
        className={`
          ${imageBoxClass}
          rounded-[var(--radius-md)] overflow-hidden
          bg-[var(--color-bg-tertiary)] relative
          transition-transform duration-300
          ${isHovering && isCompact ? "scale-105" : ""}
        `}
      >
        {image && !imageError ? (
          <img
            src={image}
            alt={title}
            className={`
              w-full h-full object-cover transition-transform duration-500
              ${isHovering && !isCompact ? "scale-105" : "scale-100"}
            `}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <Placeholder />
        )}

        <div className="absolute top-2 start-2 z-10 flex flex-col gap-1 items-start">
          {badge && !isCompact && (
            <Badge variant={badgeVariant} size="sm" glow>
              {badge}
            </Badge>
          )}
          {onSale && !isCompact && (
            <Badge variant="danger" size="sm" glow>
              Sale
            </Badge>
          )}
        </div>

        {!inStock && !isCompact && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center z-10">
            <span className="font-heading font-bold text-white text-xs uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div
        className={`
          flex flex-col min-w-0 relative z-[1]
          ${isVertical ? "flex-1 mt-3" : "flex-1"}
        `}
      >
        {category && !isCompact && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1">
            {category}
          </span>
        )}

        <h3
          className={`
            font-heading font-bold text-[var(--color-text-primary)]
            ${isCompact ? "text-sm" : "text-base"}
            line-clamp-2 leading-snug
            ${link || isHovering ? "hover:text-[var(--color-primary)]" : ""}
            transition-colors duration-180
            ${isHovering ? "text-[var(--color-primary)]" : ""}
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

        {description && !isCompact && (
          <p className="text-[var(--color-text-secondary)] text-sm mt-1.5 line-clamp-2">
            {description}
          </p>
        )}

        {tags.length > 0 && !isCompact && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
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

        <div
          className={`
            flex items-center justify-between gap-3
            ${isVertical ? "mt-auto pt-3" : "mt-2"}
            ${isCompact ? "mt-1" : ""}
          `}
        >
          <div className="relative inline-flex items-baseline min-w-0">
            <span
              className={`
                font-heading font-bold
                ${isCompact ? "text-sm" : "text-lg"}
                ${onSale ? "text-[var(--color-danger)]" : "text-[var(--color-text-primary)]"}
              `}
            >
              {formatPrice(price)}
            </span>
            {onSale && originalPrice && (
              <span
                className={`
                  absolute line-through text-[var(--color-text-tertiary)] font-mono
                  pointer-events-none whitespace-nowrap
                  ${isCompact ? "text-[8px] -top-2.5 start-0" : "text-[10px] -top-3 start-0.5"}
                `}
              >
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {rating > 0 && !isCompact && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="flex text-xs leading-none">{renderStars()}</span>
              {reviewCount > 0 && (
                <span className="text-[10px] text-[var(--color-text-tertiary)]">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}
        </div>

        {showQuickActions && !isCompact && (
          <div className="mt-3 pt-3 border-t border-[var(--color-border-secondary)]">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              disabled={!inStock}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        )}
      </div>

      {/* Compact cart – pops on hover */}
      {isCompact && showQuickActions && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (inStock) onAddToCart?.();
          }}
          disabled={!inStock}
          className={`
            flex-shrink-0 w-9 h-9 rounded-full
            flex items-center justify-center relative z-10
            transition-all duration-200
            ${
              inStock
                ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed"
            }
            ${isHovering && inStock ? "scale-110 shadow-[var(--shadow-glow-primary)]" : "scale-100"}
          `}
          aria-label={inStock ? "Add to cart" : "Out of stock"}
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
