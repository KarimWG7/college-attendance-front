import { create } from 'zustand';
import { Instructor } from '../types';

interface InstructorsStore {
  instructors: Instructor[];
  selectedInstructor: Instructor | null;
  setInstructors: (instructors: Instructor[]) => void;
  setSelectedInstructor: (instructor: Instructor | null) => void;
}

export const useInstructorsStore = create<InstructorsStore>((set) => ({
  instructors: [],
  selectedInstructor: null,
  setInstructors: (instructors) => set({ instructors }),
  setSelectedInstructor: (instructor) => set({ selectedInstructor: instructor }),
}));
