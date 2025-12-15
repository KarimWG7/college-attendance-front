import { create } from 'zustand';
import { Course } from '../types';

interface CoursesStore {
  courses: Course[];
  selectedCourse: Course | null;
  setCourses: (courses: Course[]) => void;
  setSelectedCourse: (course: Course | null) => void;
}

export const useCoursesStore = create<CoursesStore>((set) => ({
  courses: [],
  selectedCourse: null,
  setCourses: (courses) => set({ courses }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
