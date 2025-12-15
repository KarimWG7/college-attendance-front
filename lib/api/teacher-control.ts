import { apiGet, apiPost, apiPut, apiDelete } from './client';

export const teacherControlApi = {
  openLecture: (lectureId: number) =>
    apiPost<{ success: boolean; message: string }>(`/api/TeacherControl/open-lecture/${lectureId}`),

  closeLecture: (lectureId: number) =>
    apiPost<{ success: boolean; message: string }>(`/api/TeacherControl/close-lecture/${lectureId}`),

  changeRoom: (lectureId: number, room: string) =>
    apiPut<{ success: boolean; message: string }>(`/api/TeacherControl/change-room/${lectureId}?room=${room}`),

  forceAttendance: (studentId: number, lectureId: number) => {
    const params = new URLSearchParams({
      studentId: studentId.toString(),
      lectureId: lectureId.toString(),
    });
    return apiPost<{ success: boolean; message: string }>(`/api/TeacherControl/force-attendance?${params}`);
  },

  markAbsent: (studentId: number, lectureId: number) =>
    apiPost<{ success: boolean; message: string }>('/api/TeacherControl/mark-absent', { studentId, lectureId }),

  markLate: (studentId: number, lectureId: number) =>
    apiPost<{ success: boolean; message: string }>('/api/TeacherControl/mark-late', { studentId, lectureId }),

  removeAttendance: (studentId: number, lectureId: number) =>
    apiDelete<{ success: boolean; message: string }>(`/api/TeacherControl/remove-attendance?studentId=${studentId}&lectureId=${lectureId}`),

  getPresentStudents: (lectureId: number) =>
    apiGet<any[]>(`/api/TeacherControl/present-students/${lectureId}`),

  getAbsentStudents: (lectureId: number) =>
    apiGet<any[]>(`/api/TeacherControl/absent-students/${lectureId}`),

  blockStudent: (studentId: number, lectureId: number) =>
    apiPost<{ success: boolean; message: string }>('/api/TeacherControl/block-student', { studentId, lectureId }),
};
