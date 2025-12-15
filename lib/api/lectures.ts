import { apiGet, apiPost, apiPut, apiDelete } from "./client";
import { Lecture } from "../types";

export const lecturesApi = {
  getAll: () => apiGet<Lecture[]>("/api/lectures/all"),

  getById: (id: number) => apiGet<Lecture>(`/api/lectures/${id}`),

  add: (data: Omit<Lecture, "id">) => {
    console.log(data);
    return apiPost<{ message: string }>("/api/lectures/add", data);
  },

  update: (id: number, data: Partial<Lecture>) => {
    return apiPut<{ message: string }>(`/api/lectures/update/${id}`, data);
  },

  delete: (id: number) =>
    apiDelete<{ message: string }>(`/api/lectures/delete/${id}`),
};
