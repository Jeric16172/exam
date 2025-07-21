// src/components/ui/SubmitButton.tsx
import React from "react";
import clsx from "clsx";

type SubmitButtonProps = {
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "button";
  variant?: "primary" | "destructive";
};

export default function SubmitButton({
  label,
  children,
  onClick,
  type = "submit",
  variant = "primary",
}: SubmitButtonProps) {
  const baseStyle = "px-4 py-2 rounded text-white";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    destructive: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(baseStyle, variants[variant])}
    >
      {children || label}
    </button>
  );
}
