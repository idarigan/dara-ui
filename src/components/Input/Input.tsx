import React, { forwardRef, useId, useState } from "react";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /**
   * Input variant
   * @default "text"
   */
  type?: "text" | "password" | "search" | "email" | "tel" | "number" | "url";
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
   * Error message to display below input
   */
  errorMessage?: string;
  /**
   * Success message to display below input
   */
  successMessage?: string;
  /**
   * Left icon element
   */
  leftIcon?: React.ReactNode;
  /**
   * Right icon element
   */
  rightIcon?: React.ReactNode;
  /**
   * If true, input will have glow effect on focus
   * @default true
   */
  glowFocus?: boolean;
  /**
   * Label text
   */
  label?: string;
  /**
   * Helper text shown below input
   */
  helperText?: string;
  /**
   * If true, input will take full width
   * @default false
   */
  fullWidth?: boolean;
  /**
   * If true, input will be disabled
   */
  disabled?: boolean;
}

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
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const generatedId = useId();
    const inputId = id || generatedId;

    // Size styles
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-5 py-3.5 text-lg",
    };

    // Icon size mapping
    const iconSizes = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    };

    // Base input styles
    const baseStyles =
      "w-full font-sans text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-all duration-[var(--transition-fast)] outline-none disabled:opacity-60 disabled:cursor-not-allowed";

    // Background styles
    const bgStyles =
      "bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)] focus:bg-[var(--color-bg-elevated)]";

    // Border styles based on validation
    const validationBorderStyles = {
      default:
        "border border-[var(--color-border-primary)] focus:border-[var(--color-primary)]",
      success:
        "border border-[var(--color-success)] focus:border-[var(--color-success)]",
      error:
        "border border-[var(--color-danger)] focus:border-[var(--color-danger)]",
      warning:
        "border border-[var(--color-warning)] focus:border-[var(--color-warning)]",
    };

    const borderStyle = validation
      ? validationBorderStyles[validation]
      : validationBorderStyles.default;

    // Glow effect
    const glowStyles = glowFocus
      ? {
          default: "focus:shadow-[0_0_20px_rgba(124,92,255,0.15)]",
          success: "focus:shadow-[0_0_20px_rgba(0,255,153,0.15)]",
          error: "focus:shadow-[0_0_20px_rgba(255,83,112,0.15)]",
          warning: "focus:shadow-[0_0_20px_rgba(255,200,87,0.15)]",
        }[validation || "default"]
      : "";

    // Radius
    const radiusStyles = "rounded-[var(--radius-md)]";

    // Padding for icons
    const paddingStyles = {
      left: leftIcon
        ? size === "sm"
          ? "pl-9"
          : size === "md"
            ? "pl-11"
            : "pl-14"
        : "",
      right:
        rightIcon || type === "password"
          ? size === "sm"
            ? "pr-9"
            : size === "md"
              ? "pr-11"
              : "pr-14"
          : "",
    };

    // Build className
    const inputClasses = [
      baseStyles,
      bgStyles,
      borderStyle,
      glowStyles,
      radiusStyles,
      sizes[size],
      fullWidth ? "w-full" : "",
      paddingStyles.left,
      paddingStyles.right,
      disabled ? "opacity-60 cursor-not-allowed" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Icon wrapper styles
    const iconWrapperStyles =
      "absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-[var(--color-text-tertiary)] transition-colors duration-[var(--transition-fast)]";

    const iconColorStyles =
      validation === "error"
        ? "text-[var(--color-danger)]"
        : validation === "success"
          ? "text-[var(--color-success)]"
          : isFocused
            ? "text-[var(--color-primary)]"
            : "text-[var(--color-text-tertiary)]";

    // Left icon position
    const leftIconPosition = {
      sm: "left-3",
      md: "left-4",
      lg: "left-5",
    };

    // Right icon position
    const rightIconPosition = {
      sm: "right-3",
      md: "right-4",
      lg: "right-5",
    };

    // Handle focus events
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Password toggle icon
    const PasswordToggleIcon = () => (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className={`
          absolute top-1/2 -translate-y-1/2
          flex items-center justify-center
          text-[var(--color-text-tertiary)]
          hover:text-[var(--color-text-primary)]
          transition-colors duration-[var(--transition-fast)]
          focus:outline-none cursor-pointer
          ${rightIconPosition[size]}
        `}
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <svg
            className={iconSizes[size]}
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
            className={iconSizes[size]}
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
    );

    return (
      <div className={`${fullWidth ? "w-full" : ""} flex flex-col gap-1.5`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={`text-sm font-medium font-sans transition-colors duration-[var(--transition-fast)] ${
              isFocused
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)]"
            }`}
          >
            {label}
          </label>
        )}
        {/* Input wrapper */}
        <div className="relative group w-full">
          {/* Left Icon */}
          {leftIcon && (
            <span
              className={`
                ${iconWrapperStyles}
                ${leftIconPosition[size]}
                ${iconColorStyles}
              `}
            >
              <span className={iconSizes[size]}>{leftIcon}</span>
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={type === "password" && showPassword ? "text" : type}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && !(type === "password") && (
            <span
              className={`
                ${iconWrapperStyles}
                ${rightIconPosition[size]}
                ${iconColorStyles}
              `}
            >
              <span className={iconSizes[size]}>{rightIcon}</span>
            </span>
          )}

          {/* Password Toggle */}
          {type === "password" && <PasswordToggleIcon />}
        </div>
        {/* Helper Text / Validation Messages */}
        {(helperText || errorMessage || successMessage) && (
          <div className="flex items-center gap-1.5 text-xs font-sans">
            {/* Error */}
            {validation === "error" && errorMessage && (
              <>
                <span className="text-[var(--color-danger)]">⚠️</span>
                <span className="text-[var(--color-danger)]">
                  {errorMessage}
                </span>
              </>
            )}
            {/* Success */}
            {validation === "success" && successMessage && (
              <>
                <span className="text-[var(--color-success)]">✅</span>
                <span className="text-[var(--color-success)]">
                  {successMessage}
                </span>
              </>
            )}
            {/* Warning or Neutral - show helperText */}
            {(validation === "warning" || !validation) && helperText && (
              <span
                className={
                  validation === "warning"
                    ? "text-[var(--color-warning)]"
                    : "text-[var(--color-text-tertiary)]"
                }
              >
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
