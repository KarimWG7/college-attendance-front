import { apiGet, apiPost, apiPut, apiDelete } from './client';
import { Course } from '../types';

export const coursesApi = {
  getAll: () => apiGet<Course[]>('/api/courses/all'),

  add: (data: Omit<Course, 'id'>) =>
    apiPost<{ message: string }>('/api/courses/add', data),

  update: (id: number, data: Omit<Course, 'id'>) =>
    apiPut<{ message: string }>(`/api/courses/update/${id}`, data),

  delete: (id: number) =>
    apiDelete<{ message: string }>(`/api/courses/delete/${id}`),

  changeInstructor: (id: number, instructorID: number) =>
    apiPut<{ message: string }>('/api/courses/change-instructor', { id, instructorID }),
};
