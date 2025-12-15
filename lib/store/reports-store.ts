import { create } from 'zustand';
import { StudentReport, CourseReport, MonthlyReport } from '../types';

interface ReportsStore {
  basicReport: StudentReport | null;
  courseReports: CourseReport[];
  monthlyReports: MonthlyReport[];
  setBasicReport: (report: StudentReport | null) => void;
  setCourseReports: (reports: CourseReport[]) => void;
  setMonthlyReports: (reports: MonthlyReport[]) => void;
  clearReports: () => void;
}

export const useReportsStore = create<ReportsStore>((set) => ({
  basicReport: null,
  courseReports: [],
  monthlyReports: [],
  setBasicReport: (report) => set({ basicReport: report }),
  setCourseReports: (reports) => set({ courseReports: reports }),
  setMonthlyReports: (reports) => set({ monthlyReports: reports }),
  clearReports: () => set({ basicReport: null, courseReports: [], monthlyReports: [] }),
}));
