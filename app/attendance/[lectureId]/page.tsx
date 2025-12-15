"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { teacherControlApi } from "@/lib/api/teacher-control";
import { lecturesApi } from "@/lib/api/lectures";
import { enrolmentsApi } from "@/lib/api/enrolments";
import { studentsApi } from "@/lib/api/students";
import { toast } from "sonner";

interface StudentAttendance {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  status: "Present" | "Absent" | "Late" | null;
  scanTime?: string;
}

export default function LectureAttendancePage({
  params,
}: {
  params: { lectureId: string };
}) {
  const router = useRouter();
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentAttendance[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [key: number]: string }>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAttendance();
  }, [params.lectureId]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.studentId.toString().includes(searchQuery)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const lectureId = parseInt(params.lectureId);

      const lecture = await lecturesApi.getById(lectureId);
      const enrolments = await enrolmentsApi.getAll();
      const studentsList = await studentsApi.getAll();

      const enrolledStudents = enrolments.data
        .filter((e) => {
          const course = { id: e.courseId };
          return course.id === lecture.courseId;
        })
        .map((e) => e.studentId);

      const enrolledStudentsList = studentsList.filter((s) =>
        enrolledStudents.includes(s.id)
      );

      const presentStudents = await teacherControlApi.getPresentStudents(
        lectureId
      );
      const presentIds = presentStudents.map((s: any) => s.id || s.ID);

      const attendanceData = enrolledStudentsList.map((student) => {
        const isPresent = presentIds.includes(student.id);
        return {
          studentId: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.gmail,
          status: (isPresent ? "Present" : null) as "Present" | null,
        };
      });

      setStudents(attendanceData);
      setFilteredStudents(attendanceData);
    } catch (error: any) {
      console.error("Error loading attendance:", error);
      toast.error(error.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkStatus = async (
    studentId: number,
    status: "Present" | "Absent" | "Late"
  ) => {
    try {
      setActionLoading((prev) => ({ ...prev, [studentId]: status }));
      const lectureId = parseInt(params.lectureId);

      if (status === "Present") {
        await teacherControlApi.forceAttendance(studentId, lectureId);
      } else if (status === "Absent") {
        await teacherControlApi.markAbsent(studentId, lectureId);
      } else if (status === "Late") {
        await teacherControlApi.markLate(studentId, lectureId);
      }

      setStudents((prev) =>
        prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
      );

      toast.success(`Student marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message || `Failed to mark ${status}`);
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });
    }
  };

  const handleRemoveAttendance = async (studentId: number) => {
    try {
      setActionLoading((prev) => ({ ...prev, [studentId]: "removing" }));
      const lectureId = parseInt(params.lectureId);
      await teacherControlApi.removeAttendance(studentId, lectureId);

      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === studentId ? { ...s, status: null } : s
        )
      );

      toast.success("Attendance record removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove attendance");
    } finally {
      setActionLoading((prev) => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });
    }
  };

  const stats = {
    total: students.length,
    present: students.filter((s) => s.status === "Present").length,
    late: students.filter((s) => s.status === "Late").length,
    absent: students.filter((s) => s.status === null).length,
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800";
      case "Late":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Lecture Attendance"
          actions={
            <Button
              variant="outline"
              onClick={() => router.push("/attendance")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          }
        />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lecture Attendance"
        description="View and manage attendance for this lecture"
        actions={
          <Button variant="outline" onClick={() => router.push("/attendance")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">
                        {student.studentId}
                      </TableCell>
                      <TableCell>
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="text-sm">{student.email}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status || "Not Marked"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button
                            variant={
                              student.status === "Present"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleMarkStatus(student.studentId, "Present")
                            }
                            disabled={!!actionLoading[student.studentId]}
                          >
                            {actionLoading[student.studentId] === "Present" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Present"
                            )}
                          </Button>
                          <Button
                            variant={
                              student.status === "Late" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleMarkStatus(student.studentId, "Late")
                            }
                            disabled={!!actionLoading[student.studentId]}
                          >
                            {actionLoading[student.studentId] === "Late" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Late"
                            )}
                          </Button>
                          <Button
                            variant={
                              student.status === "Absent"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleMarkStatus(student.studentId, "Absent")
                            }
                            disabled={!!actionLoading[student.studentId]}
                          >
                            {actionLoading[student.studentId] === "Absent" ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              "Absent"
                            )}
                          </Button>
                          {student.status && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveAttendance(student.studentId)
                              }
                              disabled={!!actionLoading[student.studentId]}
                            >
                              {actionLoading[student.studentId] ===
                              "removing" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Clear"
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
