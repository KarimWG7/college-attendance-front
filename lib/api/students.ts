import { apiGet, apiPost, apiPut, apiDelete } from './client';
import { Student } from '../types';

export const studentsApi = {
  getAll: () => apiGet<Student[]>('/api/student/all'),

  getById: (id: number) => apiGet<Student>(`/api/student/${id}`),

  getByLevel: (level: number) => apiGet<Student[]>(`/api/student/by-level/${level}`),

  getByDepartment: (departmentId: number) =>
    apiGet<Student[]>(`/api/student/by-department/${departmentId}`),

  add: (data: Omit<Student, 'id'>) =>
    apiPost<{ message: string }>('/api/student/add', data),

  update: (id: number, data: Omit<Student, 'id'>) =>
    apiPut<{ message: string }>(`/api/student/update/${id}`, data),

  delete: (id: number) =>
    apiDelete<{ message: string }>(`/api/student/delete/${id}`),
};
