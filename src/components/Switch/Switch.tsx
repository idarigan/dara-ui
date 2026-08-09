import React, { useState, useRef, useEffect } from "react";

export interface SwitchProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  /**
   * Whether the switch is on
   * @default false
   */
  checked?: boolean;
  /**
   * Default checked state (uncontrolled)
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Callback when checked state changes
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Label text for the switch (appears above)
   */
  label?: string;
  /**
   * Switch size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * If true, adds a glow effect when checked
   * @default false
   */
  glow?: boolean;
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Switch - Toggle switch with glass styling and sparkle animation
 *
 * Features:
 * - Glass styling with theme-aware colors
 * - Smooth toggle animation with sparkle effect on turn on
 * - Glow effect when checked
 * - RTL support (label stays above, switch mirrors direction)
 * - Controlled and uncontrolled modes
 * - Multiple sizes (sm, md, lg)
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      label,
      size = "md",
      glow = false,
      disabled = false,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [showSparkles, setShowSparkles] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Determine if RTL
    const [isRTL, setIsRTL] = useState(false);
    useEffect(() => {
      const updateDir = () => {
        setIsRTL(document.documentElement.dir === "rtl");
      };
      updateDir();
      const observer = new MutationObserver(updateDir);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir"],
      });
      return () => observer.disconnect();
    }, []);

    const checked = isControlled ? controlledChecked : internalChecked;

    // Generate unique ID for label association
    const generatedId = React.useId();
    const switchId = id || generatedId;

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);

      // Trigger sparkle animation only when turning on
      if (newChecked) {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 800);
      }
    };

    // Size mapping
    const sizes = {
      sm: {
        track: "w-9 h-5",
        thumb: "w-4 h-4",
        thumbOffset: "translate-x-4",
        thumbOffOffset: "translate-x-0",
        label: "text-sm",
        gap: "gap-1.5",
      },
      md: {
        track: "w-11 h-6",
        thumb: "w-5 h-5",
        thumbOffset: "translate-x-5",
        thumbOffOffset: "translate-x-0",
        label: "text-base",
        gap: "gap-2",
      },
      lg: {
        track: "w-14 h-7",
        thumb: "w-6 h-6",
        thumbOffset: "translate-x-7",
        thumbOffOffset: "translate-x-0",
        label: "text-lg",
        gap: "gap-2.5",
      },
    };

    const sizeClasses = sizes[size] || sizes.md;

    // Glow styles
    const glowClasses =
      glow && checked
        ? "shadow-[var(--shadow-glow-primary)] ring-2 ring-[var(--color-primary)]/30"
        : "";

    // Track styles
    const trackClasses = checked
      ? `bg-[var(--color-primary)] ${glowClasses}`
      : "bg-[var(--color-bg-tertiary)]";

    // Thumb position - RTL aware (switch direction mirrors in RTL)
    const getThumbTranslate = () => {
      if (checked) {
        // In RTL, the thumb moves left (negative direction)
        return isRTL ? "-translate-x-full" : sizeClasses.thumbOffset;
      }
      return sizeClasses.thumbOffOffset;
    };

    // Checkmark icon for thumb
    const CheckIcon = () => (
      <svg
        className={`${sizeClasses.thumb === "w-4 h-4" ? "h-2.5 w-2.5" : sizeClasses.thumb === "w-5 h-5" ? "h-3 w-3" : "h-3.5 w-3.5"} text-[var(--color-text-inverse)]`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );

    // Cross icon for thumb (when off)
    const CrossIcon = () => (
      <svg
        className={`${sizeClasses.thumb === "w-4 h-4" ? "h-2.5 w-2.5" : sizeClasses.thumb === "w-5 h-5" ? "h-3 w-3" : "h-3.5 w-3.5"} text-[var(--color-text-tertiary)]`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
    );

    // Sparkle particles
    const Sparkles = () => {
      const colors = [
        "var(--color-primary)",
        "var(--color-secondary)",
        "var(--color-accent)",
        "var(--color-success)",
        "#ffffff",
      ];
      const particles = 12;

      return (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {Array.from({ length: particles }).map((_, i) => {
            const angle = (i / particles) * 360 + Math.random() * 30;
            const distance = 12 + Math.random() * 20;
            const size = 2 + Math.random() * 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = Math.random() * 0.15;

            return (
              <div
                key={i}
                className="switch-sparkle"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: "50%",
                  position: "absolute",
                  transform: `translate(-50%, -50%)`,
                  "--angle": `${angle}deg`,
                  "--distance": `${distance}px`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      );
    };

    return (
      <div
        className={`
          inline-flex flex-col
          ${sizeClasses.gap}
          ${className}
        `}
      >
        {/* Label - always above the switch */}
        {label && (
          <label
            htmlFor={switchId}
            className={`
              ${sizeClasses.label}
              text-[var(--color-text-primary)]
              font-sans font-medium
              ${disabled ? "text-[var(--color-text-tertiary)]" : ""}
              select-none
              ${isRTL ? "text-right" : "text-left"}
            `}
          >
            {label}
          </label>
        )}

        {/* Switch container */}
        <label
          htmlFor={switchId}
          className={`
            inline-flex items-center
            cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {/* Hidden input */}
          <input
            ref={(node) => {
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                (
                  ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = node;
              }
              (
                inputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
            }}
            id={switchId}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />

          {/* Custom switch track */}
          <div
            className={`
              relative flex-shrink-0
              ${sizeClasses.track}
              rounded-full
              transition-all duration-[var(--transition-med)]
              ${trackClasses}
              ${disabled ? "bg-[var(--color-bg-tertiary)]" : ""}
              flex items-center
              border border-[var(--color-border-primary)]
              ${checked ? "border-[var(--color-primary)]" : ""}
            `}
            style={{
              boxShadow:
                checked && glow ? "var(--shadow-glow-primary)" : "none",
            }}
          >
            {/* Thumb */}
            <div
              className={`
                ${sizeClasses.thumb}
                rounded-full
                bg-white
                shadow-md
                transition-all duration-[var(--transition-med)] ease-[var(--ease-bounce)]
                ${getThumbTranslate()}
                flex items-center justify-center
                relative
                ${checked ? "bg-white" : "bg-white"}
              `}
              style={{
                transform: `translateX(${checked ? (isRTL ? "-100%" : "100%") : "0%"})`,
              }}
            >
              {checked ? <CheckIcon /> : <CrossIcon />}
            </div>

            {/* Sparkle animation */}
            {checked && showSparkles && <Sparkles />}
          </div>
        </label>

        {/* Sparkle animation styles */}
        <style>{`
          .switch-sparkle {
            animation: switchSparkleBurst 0.7s ease-out forwards;
          }

          @keyframes switchSparkleBurst {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(
                calc(-50% + cos(var(--angle)) * var(--distance)),
                calc(-50% + sin(var(--angle)) * var(--distance))
              ) scale(0);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  },
);

Switch.displayName = "Switch";
export default Switch;
