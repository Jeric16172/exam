"use client";

import { useState } from "react";
import { Student } from "@/types/student";
import { useStudents } from "@/hooks/useStudents";

export function useStudentForm() {
  const [form, setForm] = useState<Student>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    contact: "",
    password: "",
  });

  const [editId, setEditId] = useState<number | null>(null);
  const { addStudent, updateStudent } = useStudents();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      await updateStudent(editId, form);
    } else {
      await addStudent(form);
    }
    resetForm();
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      contact: "",
      password: "",
    });
    setEditId(null);
  };

  return {
    form,
    setForm,
    editId,
    setEditId,
    handleChange,
    handleSubmit,
  };
}
