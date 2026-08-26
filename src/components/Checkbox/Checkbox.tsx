import React, { useState, useRef, useEffect } from "react";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  /**
   * Whether the checkbox is checked
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
   * Label text for the checkbox
   */
  label?: string;
  /**
   * Checkbox size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * If true, adds a glow effect when checked
   * @default false
   */
  glow?: boolean;
  /**
   * Error state
   * @default false
   */
  error?: boolean;
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
 * Dara UI Checkbox - Interactive checkbox with glass styling and sparkle animation
 *
 * Features:
 * - Glass styling with theme-aware colors
 * - Smooth check animation with sparkle effect
 * - Glow effect when checked
 * - RTL support via document dir (box on the right, label on the left in RTL)
 * - Controlled and uncontrolled modes
 * - Multiple sizes (sm, md, lg)
 * - Error state support
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      label,
      size = "md",
      glow = false,
      error = false,
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

    const checked = isControlled ? controlledChecked : internalChecked;

    // Generate unique ID for label association
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);

      // Trigger sparkle animation
      if (newChecked) {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 800);
      }
    };

    // Size mapping
    const sizes = {
      sm: {
        box: "w-4 h-4",
        icon: "h-2.5 w-2.5",
        label: "text-sm",
        gap: "gap-2",
      },
      md: {
        box: "w-5 h-5",
        icon: "h-3 w-3",
        label: "text-base",
        gap: "gap-2.5",
      },
      lg: {
        box: "w-6 h-6",
        icon: "h-3.5 w-3.5",
        label: "text-lg",
        gap: "gap-3",
      },
    };

    const sizeClasses = sizes[size] || sizes.md;

    // Glow styles
    const glowClasses =
      glow && checked
        ? "shadow-[var(--shadow-glow-primary)] ring-2 ring-[var(--color-primary)]/30"
        : "";

    // Error styles
    const errorClasses = error
      ? "border-[var(--color-danger)]"
      : "border-[var(--color-border-primary)]";

    // Checkmark icon
    const CheckIcon = () => (
      <svg
        className={`${sizeClasses.icon} text-[var(--color-text-inverse)]`}
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
                className="sparkle-particle"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  borderRadius: "50%",
                  position: "absolute",
                  transform: "translate(-50%, -50%)",
                  // @ts-expect-error CSS custom properties
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
      <label
        htmlFor={checkboxId}
        className={`
          inline-flex items-center
          ${sizeClasses.gap}
          cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        {/* Hidden input */}
        <input
          ref={(node) => {
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node;
            }
            (
              inputRef as React.MutableRefObject<HTMLInputElement | null>
            ).current = node;
          }}
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          aria-invalid={error}
          {...props}
        />

        {/* Custom checkbox box – first in DOM so it sits at flex-start
            (left in LTR, right in RTL when document dir is set) */}
        <div
          className={`
            relative flex-shrink-0
            ${sizeClasses.box}
            rounded-[var(--radius-sm)]
            transition-all duration-[var(--transition-med)]
            ${errorClasses}
            ${disabled ? "bg-[var(--color-bg-tertiary)]" : ""}
            ${
              checked
                ? `bg-[var(--color-primary-solid)] ${glowClasses}`
                : "bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)]"
            }
            flex items-center justify-center
            border
          `}
          style={{
            boxShadow: checked && glow ? "var(--shadow-glow-primary)" : "none",
          }}
        >
          {checked && (
            <div
              className="flex items-center justify-center w-full h-full"
              style={{
                animation: "checkScale 0.25s ease-out",
              }}
            >
              <CheckIcon />
            </div>
          )}

          {/* Sparkle animation */}
          {checked && showSparkles && <Sparkles />}
        </div>

        {/* Label – second in DOM, sits after the box in reading direction */}
        {label && (
          <span
            className={`
              ${sizeClasses.label}
              text-[var(--color-text-primary)]
              font-sans font-medium
              ${disabled ? "text-[var(--color-text-tertiary)]" : ""}
              select-none
            `}
          >
            {label}
          </span>
        )}

        {/* Sparkle animation styles */}
        <style>{`
          .sparkle-particle {
            animation: sparkleBurst 0.7s ease-out forwards;
          }

          @keyframes sparkleBurst {
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

          @keyframes checkScale {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
