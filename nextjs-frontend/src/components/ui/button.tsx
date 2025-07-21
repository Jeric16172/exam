import React from "react";
import buttonConfig from "@/registries/ui/button.json";
import { ButtonProps, ButtonVariant, ButtonSize } from "@/types/ui/button";

const variantStyles: Record<ButtonVariant, string> =
  buttonConfig.styles.variantStyles;
const sizeStyles: Record<ButtonSize, string> = buttonConfig.styles.sizeStyles;

export const Button: React.FC<ButtonProps> = ({
  variant = buttonConfig.props.variant.default,
  size = buttonConfig.props.size.default,
  icon,
  iconPosition = buttonConfig.props.iconPosition.default,
  iconSize = buttonConfig.defaultIconSize,
  children,
  disabled = buttonConfig.props.disabled?.default ?? false,
  className = "",
  ...props
}) => {
  const isIconOnly = (size === "icon-md" || size === "icon-sm") && !children;
  const appliedVariant = disabled ? "disabled" : variant;

  const sizedIcon = icon && React.cloneElement(icon as React.ReactElement, {
    size: iconSize,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <button
      type="button"
      className={`
        ${buttonConfig.initialClassName}
        ${variantStyles[appliedVariant]}
        ${sizeStyles[size]}
        ${isIconOnly ? "" : "whitespace-nowrap"}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {sizedIcon && iconPosition === "left" && (
        <span className="flex items-center">{sizedIcon}</span>
      )}
      {!isIconOnly && children}
      {sizedIcon && iconPosition === "right" && (
        <span className="flex items-center">{sizedIcon}</span>
      )}
    </button>
  );
};
