import { Enrolment } from "../types";
import { apiGet, apiPost, apiDelete } from "./client";

export const enrolmentsApi = {
  getAll: () =>
    apiGet<{ success: boolean; data: Enrolment[] }>("/api/enrolments"),

  create: (studentId: number, courseId: number) =>
    apiPost<{ message: string }>("/api/enrolments", { studentId, courseId }),

  delete: (id: number) =>
    apiDelete<{ message: string }>(`/api/enrolments/${id}`),
};
