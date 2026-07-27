// src/components/Input/Input.tsx
import React, { forwardRef, useState, useId } from "react";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /**
   * Input type
   * @default "text"
   */
  type?:
    | "text"
    | "password"
    | "search"
    | "email"
    | "tel"
    | "number"
    | "url"
    | "date";
  /**
   * Input size
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * Validation state
   */
  validation?: "success" | "error" | "warning";
  /**
   * Error message
   */
  errorMessage?: string;
  /**
   * Success message
   */
  successMessage?: string;
  /**
   * Left icon
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon
   */
  rightIcon?: React.ReactNode;
  /**
   * Glow focus effect
   * @default true
   */
  glowFocus?: boolean;
  /**
   * Label text
   */
  label?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
}

/**
 * Dara UI Input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      size = "md",
      validation,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      glowFocus = true,
      label,
      helperText,
      fullWidth = false,
      disabled = false,
      className = "",
      placeholder,
      value,
      onChange,
      onFocus,
      onBlur,
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const inputId = id || generatedId;

    // - .input-dara styles
    const baseStyles =
      "w-full font-sans transition-all duration-180 outline-none disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-[var(--color-text-tertiary)]";

    const bgStyles =
      "bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] focus:bg-[var(--color-bg-elevated)]";

    const borderStyles = {
      default:
        "border border-[var(--color-border-primary)] focus:border-[var(--color-primary)]",
      success:
        "border border-[var(--color-success)] focus:border-[var(--color-success)]",
      error:
        "border border-[var(--color-danger)] focus:border-[var(--color-danger)]",
      warning:
        "border border-[var(--color-warning)] focus:border-[var(--color-warning)]",
    };

    const glowStyles = glowFocus
      ? {
          default:
            "focus:shadow-[var(--shadow-glow-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20",
          success: "focus:shadow-[var(--shadow-glow-success)]",
          error: "focus:shadow-[var(--shadow-glow-danger)]",
          warning: "focus:shadow-[var(--shadow-glow-warning)]",
        }[validation || "default"]
      : "";

    const radiusStyles = "rounded-[14px]";

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-3 text-base",
      lg: "px-5 py-3.5 text-lg",
    };

    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    const classes = [
      baseStyles,
      bgStyles,
      borderStyles[validation || "default"],
      glowStyles,
      radiusStyles,
      sizes[size],
      fullWidth ? "w-full" : "",
      leftIcon
        ? size === "sm"
          ? "pl-9"
          : size === "md"
            ? "pl-11"
            : "pl-14"
        : "",
      rightIcon || type === "password"
        ? size === "sm"
          ? "pr-9"
          : size === "md"
            ? "pr-11"
            : "pr-14"
        : "",
      disabled ? "opacity-60 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Determine label color based on focus and validation state
    const getLabelColor = () => {
      if (disabled) return "text-[var(--color-text-tertiary)]";
      if (validation === "error") return "text-[var(--color-danger)]";
      if (validation === "success") return "text-[var(--color-success)]";
      if (validation === "warning") return "text-[var(--color-warning)]";
      if (isFocused) return "text-[var(--color-primary)]";
      return "text-[var(--color-text-secondary)]";
    };

    // Determine icon color based on focus and validation state
    const getIconColor = () => {
      if (disabled) return "text-[var(--color-text-tertiary)]";
      if (validation === "error") return "text-[var(--color-danger)]";
      if (validation === "success") return "text-[var(--color-success)]";
      if (validation === "warning") return "text-[var(--color-warning)]";
      if (isFocused) return "text-[var(--color-primary)]";
      return "text-[var(--color-text-tertiary)]";
    };

    return (
      <div className={`${fullWidth ? "w-full" : ""} flex flex-col gap-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium font-sans transition-colors duration-180 ${getLabelColor()}`}
          >
            {label}
          </label>
        )}
        <div className="relative group w-full">
          {leftIcon && (
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-180 ${getIconColor()}`}
            >
              <span className={iconSizes[size]}>{leftIcon}</span>
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type === "password" && showPassword ? "text" : type}
            className={classes}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        {(helperText || errorMessage || successMessage) && (
          <div className="flex items-center gap-1.5 text-xs">
            {validation === "error" && errorMessage && (
              <span className="text-[var(--color-danger)]">
                ⚠️ {errorMessage}
              </span>
            )}
            {validation === "success" && successMessage && (
              <span className="text-[var(--color-success)]">
                ✅ {successMessage}
              </span>
            )}
            {!validation && helperText && (
              <span className="text-[var(--color-text-tertiary)]">
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
