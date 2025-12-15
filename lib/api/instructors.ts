import { apiGet, apiPost, apiPut, apiDelete } from './client';
import { Instructor } from '../types';

export const instructorsApi = {
  getAll: () => apiGet<Instructor[]>('/api/instructors/all'),

  getById: (id: number) => apiGet<Instructor>(`/api/instructors/${id}`),

  add: (data: Omit<Instructor, 'id'>) =>
    apiPost<{ message: string }>('/api/instructors/add', data),

  update: (id: number, data: Omit<Instructor, 'id'>) =>
    apiPut<{ message: string }>(`/api/instructors/update/${id}`, data),

  delete: (id: number) =>
    apiDelete<{ message: string }>(`/api/instructors/delete/${id}`),
};
