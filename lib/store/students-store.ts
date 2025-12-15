import { create } from 'zustand';
import { Student } from '../types';

interface StudentsStore {
  students: Student[];
  selectedStudent: Student | null;
  filters: {
    level?: number;
    departmentId?: number;
  };
  setStudents: (students: Student[]) => void;
  setSelectedStudent: (student: Student | null) => void;
  setFilters: (filters: StudentsStore['filters']) => void;
  clearFilters: () => void;
}

export const useStudentsStore = create<StudentsStore>((set) => ({
  students: [],
  selectedStudent: null,
  filters: {},
  setStudents: (students) => set({ students }),
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));
