import { ToggleSwitchProps } from "@/types/ui/toggle";
import React, { useEffect, useState } from "react";

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
  style,
}) => {
  
  useEffect(() => {
    console.log(checked);
  }, [checked]);
  
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = typeof checked === "boolean";
  const isOn = isControlled ? checked! : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    if (!isControlled) {
      setInternalChecked((prev) => !prev);
    }
    onChange?.(!isOn);
  };

  return (
    <button
      onClick={handleClick}
      aria-pressed={isOn}
      disabled={disabled}
      className={`relative w-14 h-8 rounded-full bg-gray-300 transition-colors duration-300 focus:outline-none ${className}`}
      style={{
        backgroundColor: isOn ? "#4ade80" : "#d1d5db",
        cursor: disabled ? "not-allowed" : "pointer",
        ...style,
      }}
    >
      <span
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300"
        style={{
          transform: isOn ? "translateX(24px)" : "translateX(0)",
        }}
      />
    </button>
  );
};