import React, { useState, useRef, useEffect } from "react";

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  /**
   * Whether the radio is checked
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
   * Label text for the radio
   */
  label?: string;
  /**
   * Radio size
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
   * Value for the radio (used in groups)
   */
  value?: string;
  /**
   * Name for the radio (used in groups)
   */
  name?: string;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Radio - Glass-morphism radio button with smooth animations
 *
 * Features:
 * - Glass styling with theme-aware colors
 * - Smooth check animation with pulse effect
 * - Glow effect when checked
 * - RTL support (label on right, radio on left in RTL)
 * - Controlled and uncontrolled modes
 * - Multiple sizes (sm, md, lg)
 * - Error state support
 * - Group capable via name attribute
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
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
      value,
      name,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const [showPulse, setShowPulse] = useState(false);
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
    const radioId = id || generatedId;

    // Handle change
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);

      // Trigger pulse animation
      if (newChecked) {
        setShowPulse(true);
        setTimeout(() => setShowPulse(false), 700);
      }
    };

    // Size mapping
    const sizes = {
      sm: {
        radio: "w-4 h-4",
        dot: "h-2 w-2",
        label: "text-sm",
        gap: "gap-2",
        pulseSize: 20,
      },
      md: {
        radio: "w-5 h-5",
        dot: "h-2.5 w-2.5",
        label: "text-base",
        gap: "gap-2.5",
        pulseSize: 24,
      },
      lg: {
        radio: "w-6 h-6",
        dot: "h-3 w-3",
        label: "text-lg",
        gap: "gap-3",
        pulseSize: 28,
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

    // Radio dot
    const RadioDot = () => (
      <div
        className={`
          ${sizeClasses.dot}
          rounded-full
          bg-[var(--color-primary)]
          transition-all duration-[var(--transition-med)] ease-[var(--ease-bounce)]
          ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        `}
      />
    );

    // Pulse ring animation
    const PulseRing = () => {
      const pulseSize = sizeClasses.pulseSize || 20;

      return (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: "radioPulse 0.7s ease-out forwards",
          }}
        >
          <div
            className="absolute rounded-full border-2 border-[var(--color-primary)]"
            style={{
              width: `${pulseSize}px`,
              height: `${pulseSize}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animation: "radioPulseRing 0.7s ease-out forwards",
            }}
          />
        </div>
      );
    };

    return (
      <label
        htmlFor={radioId}
        className={`
          inline-flex items-center
          ${isRTL ? "flex-row-reverse" : "flex-row"}
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
          id={radioId}
          type="radio"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          value={value}
          name={name}
          className="sr-only"
          aria-invalid={error}
          {...props}
        />

        {/* Custom radio button */}
        <div
          className={`
            relative flex-shrink-0
            ${sizeClasses.radio}
            rounded-full
            transition-all duration-[var(--transition-med)]
            ${errorClasses}
            ${disabled ? "bg-[var(--color-bg-tertiary)]" : ""}
            ${
              checked
                ? `bg-[var(--color-primary)] ${glowClasses}`
                : "bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)]"
            }
            flex items-center justify-center
            border
          `}
          style={{
            boxShadow: checked && glow ? "var(--shadow-glow-primary)" : "none",
          }}
        >
          <RadioDot />

          {/* Pulse animation */}
          {checked && showPulse && <PulseRing />}
        </div>

        {/* Label */}
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

        {/* Pulse animation styles */}
        <style>{`
          @keyframes radioPulse {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

          @keyframes radioPulseRing {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2.5);
              opacity: 0;
            }
          }
        `}</style>
      </label>
    );
  },
);

Radio.displayName = "Radio";
export default Radio;
