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
   * Label text – always rendered above the switch
   */
  label?: string;
  /**
   * Switch size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Glow effect when checked
   * @default false
   */
  glow?: boolean;
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional icon shown inside the thumb when ON
   */
  onIcon?: React.ReactNode;
  /**
   * Optional icon shown inside the thumb when OFF
   */
  offIcon?: React.ReactNode;
  /**
   * Additional className for the outer wrapper
   */
  className?: string;
}

/**
 * Dara UI Switch – glassmorphism toggle
 *
 * Features:
 * - Glass track + elevated thumb
 * - Thumb overhangs the track when ON
 * - Sparkle burst only when turning on
 * - Optional glow
 * - Optional on/off icons (none by default)
 * - Label always above, inherits document dir
 * - Full RTL mirroring (thumb travels the opposite way)
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
      onIcon,
      offIcon,
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

    // Live RTL detection
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

    const generatedId = React.useId();
    const switchId = id || generatedId;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.checked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);

      if (next) {
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 700);
      }
    };

    // Size tokens
    const sizes = {
      sm: {
        track: "w-10 h-5",
        thumb: "w-5 h-5",
        travel: 20,
        label: "text-xs",
        icon: "text-[10px]",
        gap: "gap-1.5",
        thumbOffset: 0,
      },
      md: {
        track: "w-12 h-6",
        thumb: "w-6 h-6",
        travel: 24,
        label: "text-sm",
        icon: "text-xs",
        gap: "gap-2",
        thumbOffset: 0,
      },
      lg: {
        track: "w-16 h-8",
        thumb: "w-8 h-8",
        travel: 32,
        label: "text-base",
        icon: "text-sm",
        gap: "gap-2.5",
        thumbOffset: 0,
      },
    };

    const s = sizes[size] || sizes.md;

    // LTR: OFF at left (0), ON at right (travel)
    // RTL: OFF at right (0), ON at left (-travel)
    let thumbX = 0;
    if (checked) {
      thumbX = isRTL ? -s.travel : s.travel;
    } else {
      thumbX = 0;
    }

    return (
      <label
        htmlFor={switchId}
        className={`
          inline-flex flex-col items-start
          ${s.gap}
          ${disabled ? "opacity-50 pointer-events-none" : "cursor-pointer"}
          ${className}
        `}
      >
        {/* Label */}
        {label && (
          <span
            className={`
              ${s.label}
              font-sans font-medium
              text-[var(--color-text-primary)]
              select-none
            `}
          >
            {label}
          </span>
        )}

        <div
          className={`
            relative inline-flex items-center
            cursor-pointer
            ${disabled ? "cursor-not-allowed" : ""}
            align-middle
          `}
        >
          <input
            ref={(node) => {
              if (typeof ref === "function") ref(node);
              else if (ref)
                (
                  ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = node;
              (
                inputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
            }}
            id={switchId}
            type="checkbox"
            role="switch"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
            aria-checked={checked}
            {...props}
          />

          {/* Track */}
          <div
            className={`
              relative flex-shrink-0
              ${s.track}
              rounded-full
              overflow-visible
              transition-all duration-300 ease-[var(--ease-in-out)]
              border
              ${
                checked
                  ? `
                    bg-[var(--color-primary)]/25
                    border-[var(--color-primary)]/50
                    backdrop-blur-[12px]
                  `
                  : `
                    bg-[var(--color-bg-elevated)]/40
                    border-[var(--color-border-primary)]
                    backdrop-blur-[10px]
                  `
              }
              ${
                glow && checked
                  ? "shadow-[var(--shadow-glow-primary)] ring-2 ring-[var(--color-primary)]/25"
                  : "shadow-[var(--shadow-float)]"
              }
            `}
            style={{
              boxShadow:
                glow && checked ? "var(--shadow-glow-primary)" : undefined,
            }}
          >
            {/* Soft inner highlight */}
            <div
              className={`
                absolute inset-0 rounded-full pointer-events-none
                transition-opacity duration-300
                ${checked ? "opacity-100" : "opacity-40"}
              `}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
              }}
            />

            {/* Thumb */}
            <div
              className={`
                absolute
                ${s.thumb}
                rounded-full
                flex items-center justify-center
                transition-transform duration-350
                ease-[cubic-bezier(0.34,1.56,0.64,1)]
                ${
                  checked
                    ? `
                      bg-white
                      shadow-[0_2px_12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.4)]
                    `
                    : `
                      bg-[var(--color-bg-secondary)]
                      shadow-[0_2px_8px_rgba(0,0,0,0.2),0_0_0_1px_var(--color-border-primary)]
                    `
                }
              `}
              style={{
                top: "50%",
                [isRTL ? "right" : "left"]: 0,
                transform: `translateY(-50%) translateX(${thumbX}px)`,
              }}
            >
              {checked && onIcon && (
                <span
                  className={`
                    ${s.icon}
                    flex items-center justify-center leading-none
                    text-[var(--color-primary)]
                  `}
                >
                  {onIcon}
                </span>
              )}
              {!checked && offIcon && (
                <span
                  className={`
                    ${s.icon}
                    flex items-center justify-center leading-none
                    text-[var(--color-text-tertiary)]
                  `}
                >
                  {offIcon}
                </span>
              )}
            </div>

            {/* Sparkles */}
            {checked && showSparkles && (
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {Array.from({ length: 10 }).map((_, i) => {
                  const angle = (i / 10) * 360 + Math.random() * 24;
                  const distance = 14 + Math.random() * 18;
                  const particleSize = 2 + Math.random() * 2.5;
                  const colors = [
                    "var(--color-primary)",
                    "var(--color-secondary)",
                    "var(--color-accent)",
                    "#ffffff",
                  ];
                  const color =
                    colors[Math.floor(Math.random() * colors.length)];
                  const delay = Math.random() * 0.12;

                  return (
                    <div
                      key={i}
                      className="switch-sparkle"
                      style={{
                        position: "absolute",
                        left: isRTL ? "20%" : "80%",
                        top: "50%",
                        width: `${particleSize}px`,
                        height: `${particleSize}px`,
                        backgroundColor: color,
                        borderRadius: "50%",
                        // @ts-expect-error CSS custom properties
                        "--angle": `${angle}deg`,
                        "--distance": `${distance}px`,
                        animationDelay: `${delay}s`,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <style>{`
          .switch-sparkle {
            animation: switchSparkleBurst 0.65s ease-out forwards;
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
      </label>
    );
  },
);

Switch.displayName = "Switch";
export default Switch;
