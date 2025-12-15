import { apiGet } from './client';
import { StudentReport, CourseReport, MonthlyReport } from '../types';

export const reportsApi = {
  getBasicReport: (studentId: number) =>
    apiGet<StudentReport>(`/api/StudentReport/basic/${studentId}`),

  getByCourse: (studentId: number) =>
    apiGet<CourseReport[]>(`/api/StudentReport/by-course/${studentId}`),

  getByMonth: (studentId: number) =>
    apiGet<MonthlyReport[]>(`/api/StudentReport/by-month/${studentId}`),
};
