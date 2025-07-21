// src/components/student/StudentForms.tsx
"use client";

import InputField from "@/components/ui/InputField";
import SubmitButton from "@/components/ui/SubmitButton";
import { Student } from "@/types/student";
import React from "react";

interface StudentFormProps {
  form: Student;
  setForm: (form: Student) => void;
  editId: number | null;
  setEditId: (id: number | null) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function StudentForm({
  form,
  setForm,
  editId,
  setEditId,
  handleChange,
  handleSubmit,
}: StudentFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
      {["firstName", "lastName", "username", "email", "contact", "password"].map((field) => (
        <InputField
          key={field}
          name={field}
          type={field === "password" ? "password" : "text"}
          value={(form as any)[field] || ""}
          onChange={handleChange}
        />
      ))}
      <SubmitButton label={editId ? "Update" : "Register"} />
    </form>
  );
}
