import React from "react";

interface InputFieldProps {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  type?: string;
  value?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  rightIcon,
  placeholder,
  type = "text",
  value,
  onChange,
}) => (
  <div className="flex items-center rounded-lg px-3 py-2 bg-[#F2F2F2]">
    {icon && <span className="mr-2 text-gray-400">{icon}</span>}
    <input
      className="flex-1 outline-none bg-transparent"
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
    />
    {rightIcon && <span className="ml-2 text-gray-400">{rightIcon}</span>}
  </div>
);

export default InputField;