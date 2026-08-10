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
   * Glow when checked
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
   * Value (required for groups)
   */
  value?: string;
  /**
   * Name (shared across a group)
   */
  name?: string;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Dara UI Radio – glass ring + spring dot
 *
 * Features:
 * - Optimistic UI: visual state flips on click (no wait for parent re-render)
 * - Glass outer ring, solid center dot
 * - Fast CSS motion (~100ms)
 * - Optional glow
 * - RTL via document dir
 * - Group-ready with name + value
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      onChange,
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
    // Optimistic visual state
    const [visualChecked, setVisualChecked] = useState(
      isControlled ? !!controlledChecked : defaultChecked,
    );
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync from parent when controlled
    useEffect(() => {
      if (isControlled) {
        setVisualChecked(!!controlledChecked);
      }
    }, [controlledChecked, isControlled]);

    const generatedId = React.useId();
    const radioId = id || generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.checked;

      // Paint immediately
      setVisualChecked(next);
      if (!isControlled) setInternalChecked(next);

      onCheckedChange?.(next);
      onChange?.(event);
    };

    useEffect(() => {
      if (isControlled || !name) return;

      const syncFromDOM = () => {
        const el = inputRef.current;
        if (el) setVisualChecked(el.checked);
      };

      document.addEventListener("change", syncFromDOM, true);
      return () => document.removeEventListener("change", syncFromDOM, true);
    }, [isControlled, name]);

    const sizes = {
      sm: {
        ring: "w-4 h-4",
        dot: "w-1.5 h-1.5",
        label: "text-sm",
        gap: "gap-2",
      },
      md: {
        ring: "w-5 h-5",
        dot: "w-2 h-2",
        label: "text-base",
        gap: "gap-2.5",
      },
      lg: {
        ring: "w-6 h-6",
        dot: "w-2.5 h-2.5",
        label: "text-lg",
        gap: "gap-3",
      },
    };

    const s = sizes[size] || sizes.md;
    const checked = visualChecked;

    return (
      <label
        htmlFor={radioId}
        className={`
          inline-flex items-center
          ${s.gap}
          cursor-pointer
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        <input
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                node;
            (
              inputRef as React.MutableRefObject<HTMLInputElement | null>
            ).current = node;
          }}
          id={radioId}
          type="radio"
          checked={isControlled ? controlledChecked : internalChecked}
          onChange={handleChange}
          disabled={disabled}
          value={value}
          name={name}
          className="sr-only"
          aria-invalid={error}
          {...props}
        />

        {/* Outer ring */}
        <span
          className={`
            relative flex-shrink-0
            ${s.ring}
            rounded-full
            flex items-center justify-center
            border-2
            transition-[border-color,box-shadow,background-color] duration-100 ease-out
            ${
              error
                ? "border-[var(--color-danger)]"
                : checked
                  ? "border-[var(--color-primary)]"
                  : "border-[var(--color-border-primary)]"
            }
            ${
              checked
                ? "bg-[var(--color-primary)]/10"
                : "bg-[var(--color-bg-elevated)]/40 hover:bg-[var(--color-bg-elevated)]/60"
            }
            backdrop-blur-[8px]
            ${
              glow && checked
                ? "shadow-[var(--shadow-glow-primary)] ring-2 ring-[var(--color-primary)]/25"
                : ""
            }
          `}
        >
          {/* Center dot – short spring */}
          <span
            className={`
              ${s.dot}
              rounded-full
              bg-[var(--color-primary)]
              transition-transform duration-100
              ease-[cubic-bezier(0.34,1.4,0.64,1)]
              ${checked ? "scale-100" : "scale-0"}
            `}
          />

          {checked && (
            <span
              key={String(checked) + radioId}
              className="absolute inset-0 rounded-full pointer-events-none radio-pulse-ring"
              aria-hidden
            />
          )}
        </span>

        {label && (
          <span
            className={`
              ${s.label}
              font-sans font-medium
              text-[var(--color-text-primary)]
              select-none
              ${disabled ? "text-[var(--color-text-tertiary)]" : ""}
            `}
          >
            {label}
          </span>
        )}

        <style>{`
          .radio-pulse-ring {
            animation: radioPulse 0.35s ease-out forwards;
          }
          @keyframes radioPulse {
            0% {
              box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 40%, transparent);
              opacity: 1;
            }
            100% {
              box-shadow: 0 0 0 8px transparent;
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
