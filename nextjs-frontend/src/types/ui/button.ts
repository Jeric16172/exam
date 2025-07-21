import React from "react";
import buttonConfig from "@/registries/ui/button.json";

export type ButtonVariant = (typeof buttonConfig.props.variant.values)[number];
export type ButtonSize = (typeof buttonConfig.props.size.values)[number];
export type IconPosition = (typeof buttonConfig.props.iconPosition.values)[number];

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  iconSize?: number | string;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}
