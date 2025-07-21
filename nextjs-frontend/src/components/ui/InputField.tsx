"use client";

import React from "react";

interface InputFieldProps {
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function InputField({
  name,
  type = "text",
  value,
  placeholder,
  onChange,
  required = false,
}: InputFieldProps) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder || name}
      onChange={onChange}
      className="w-full p-2 border rounded"
      required={required}
    />
  );
}
