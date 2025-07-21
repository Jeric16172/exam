"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Student } from "@/types/student";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/api/students");
      setStudents(response.data);
    } catch (err: any) {
      setError("Failed to fetch students");
      console.error(err);
    }
  };

  const addStudent = async (student: Student) => {
    try {
      const response = await api.post("/api/register", student);
      if (response.status === 201 || response.status === 200) {
        await fetchStudents();
      }
    } catch (err: any) {
      setError("Failed to register student");
      console.error(err);
    }
  };

  const updateStudent = async (id: number, updated: Student) => {
    try {
      const response = await api.put(`/api/students/${id}`, updated);
      if (response.status === 200) {
        await fetchStudents();
      }
    } catch (err: any) {
      setError("Failed to update student");
      console.error(err);
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const response = await api.delete(`/api/students/${id}`);
      if (response.status === 200) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err: any) {
      setError("Failed to delete student");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    fetchStudents,
  };
};
