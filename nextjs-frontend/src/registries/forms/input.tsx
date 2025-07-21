import React from "react";

type InputVariant = "default" | "withIcon" | "withButton";

interface DynamicInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  variant?: InputVariant;
  disabled?: boolean;
  showIcon?: boolean;
  showButton?: boolean;
}

const iconStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  color: "#bdbdbd",
  fontWeight: 600,
  fontSize: 18,
  marginRight: 8,
  userSelect: "none",
};

const buttonStyle: React.CSSProperties = {
  background: "#00b6f0",
  borderRadius: "50%",
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: 700,
  fontSize: 20,
  border: "none",
  cursor: "pointer",
  marginLeft: 8,
};

const inputContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "#f5f5f5",
  borderRadius: 12,
  padding: "0 16px",
  height: 56,
  margin: 8,
  minWidth: 180,
};

const inputStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: 20,
  color: "#222",
  outline: "none",
  flex: 1,
  fontWeight: 400,
};

const disabledInputStyle: React.CSSProperties = {
  ...inputStyle,
  color: "#bdbdbd",
};

const DynamicInput: React.FC<DynamicInputProps> = ({
  value,
  onChange,
  placeholder = "Input Text",
  variant = "default",
  disabled = false,
  showIcon = false,
  showButton = false,
}) => {
  return (
    <div style={inputContainerStyle}>
      {(variant === "withIcon" || showIcon) && (
        <span style={iconStyle}>
          A<span style={{ fontSize: 14, marginLeft: 2 }}>↓</span>
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={disabled ? disabledInputStyle : inputStyle}
        disabled={disabled}
      />
      {(variant === "withButton" || showButton) && (
        <button style={buttonStyle} disabled={disabled}>
          <span style={{ display: "flex", alignItems: "center" }}>
            A<span style={{ fontSize: 16, marginLeft: 2 }}>↓</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default DynamicInput;