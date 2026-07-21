import React, { forwardRef, useState } from "react";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /**
   * Input type
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
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // - .input-dara styles
    const baseStyles =
      "w-full font-body transition-all duration-180 outline-none disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-white/35";

    const bgStyles = "bg-white/5 hover:bg-white/10 focus:bg-white/10";

    const borderStyles = {
      default: "border border-white/12 focus:border-[#7c5cff]",
      success: "border border-[#00ff99] focus:border-[#00ff99]",
      error: "border border-[#ff5370] focus:border-[#ff5370]",
      warning: "border border-[#ffc857] focus:border-[#ffc857]",
    };

    const glowStyles = glowFocus
      ? {
          default:
            "focus:shadow-[0_0_25px_rgba(124,92,255,0.1)] focus:shadow-[0_0_0_3px_rgba(124,92,255,0.15)]",
          success: "focus:shadow-[0_0_25px_rgba(0,255,153,0.1)]",
          error: "focus:shadow-[0_0_25px_rgba(255,83,112,0.1)]",
          warning: "focus:shadow-[0_0_25px_rgba(255,200,87,0.1)]",
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

    return (
      <div className={`${fullWidth ? "w-full" : ""} flex flex-col gap-1.5`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/60 font-body"
          >
            {label}
          </label>
        )}
        <div className="relative group w-full">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors cursor-pointer"
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
              <span className="text-[#ff5370]">⚠️ {errorMessage}</span>
            )}
            {validation === "success" && successMessage && (
              <span className="text-[#00ff99]">✅ {successMessage}</span>
            )}
            {!validation && helperText && (
              <span className="text-white/40">{helperText}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
