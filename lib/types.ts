export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  gmail: string;
  departmentID: number;
  nfc_Tag: string;
  level: number;
}

export interface Instructor {
  id: number;
  firstName: string;
  lastName: string;
  gmail: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  instructorID: number;
  level: number;
}

export interface Lecture {
  id: number;
  courseId: number;
  startTime: string;
  endTime: string;
  room: string;
  state: "Active" | "Closed";
}

export interface AttendanceRecord {
  id: number;
  studentId: number;
  lectureId: number;
  status: "present" | "absent" | "late";
  timestamp: string;
}

export interface StudentReport {
  id: number;
  fullName: string;
  totalLectures: number;
  present: number;
  absent: number;
  late: number;
}

export interface CourseReport {
  course: string;
  present: number;
  absent: number;
  late: number;
}

export interface MonthlyReport {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalLectures: number;
}

export interface Enrolment {
  id: number;
  studentId: number;
  courseId: number;
}
