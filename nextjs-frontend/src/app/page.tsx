// src/app/page.tsx
"use client";

import StudentForm from "@/components/student/StudentForms";
import StudentList from "@/components/student/StudentList";
import { useStudentForm } from "@/hooks/useStudentForms";

export default function HomePage() {
  const {
    form,
    setForm,
    editId,
    setEditId,
    handleChange,
    handleSubmit,
  } = useStudentForm();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Student Enrollment</h1>
      <StudentForm
        form={form}
        setForm={setForm}
        editId={editId}
        setEditId={setEditId}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <StudentList setForm={setForm} setEditId={setEditId} />
    </main>
  );
}
