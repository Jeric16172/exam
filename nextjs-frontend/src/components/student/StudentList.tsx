// src/components/student/StudentList.tsx
"use client";

import { useStudents } from "@/hooks/useStudents";
import SubmitButton from "@/components/ui/SubmitButton";
import { Student } from "@/types/student";

interface StudentListProps {
  setForm: (student: Student) => void;
  setEditId: (id: number) => void;
}

export default function StudentList({ setForm, setEditId }: StudentListProps) {
  const { students, deleteStudent } = useStudents();

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Registered Students</h2>
      <ul className="space-y-4">
        {students.map((student) => (
          <li key={student.id} className="p-4 border rounded shadow-sm">
            <p>
              <strong>Name:</strong> {student.firstName} {student.lastName}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <div className="flex gap-2 mt-2">
              <SubmitButton
                onClick={() => deleteStudent(student.id!)}
                variant="destructive"
              >
                Delete
              </SubmitButton>
              <SubmitButton
                onClick={() => {
                  setForm(student);
                  setEditId(student.id!);
                }}
              >
                Update
              </SubmitButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
