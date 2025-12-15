"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TableSkeleton } from "@/components/loading-skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { enrolmentsApi } from "@/lib/api/enrolments";
import { studentsApi } from "@/lib/api/students";
import { coursesApi } from "@/lib/api/courses";
import { Student, Course, Enrolment } from "@/lib/types";
import { toast } from "sonner";

export default function EnrolmentsPage() {
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    enrolment: Enrolment | null;
  }>({ open: false, enrolment: null });
  const [formDialog, setFormDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ studentId: "", courseId: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [enrolmentsData, studentsData, coursesData] = await Promise.all([
        enrolmentsApi.getAll(),
        studentsApi.getAll(),
        coursesApi.getAll(),
      ]);
      setEnrolments(enrolmentsData.data);
      setStudents(studentsData);
      setCourses(coursesData);
      console.log(enrolmentsData, studentsData, coursesData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.enrolment) return;

    try {
      await enrolmentsApi.delete(deleteDialog.enrolment.id);
      toast.success("Enrolment removed successfully");
      setDeleteDialog({ open: false, enrolment: null });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove enrolment");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId || !formData.courseId) {
      toast.error("Please select both student and course");
      return;
    }

    const studentId = parseInt(formData.studentId);
    const courseId = parseInt(formData.courseId);

    const alreadyEnroled = enrolments.some(
      (e) => e.studentId === studentId && e.courseId === courseId
    );

    if (alreadyEnroled) {
      toast.error("This student is already enrolled in this course");
      return;
    }

    try {
      setSaving(true);
      await enrolmentsApi.create(studentId, courseId);
      toast.success("Student enrolled successfully");
      setFormDialog(false);
      setFormData({ studentId: "", courseId: "" });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to enroll student");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      key: "id",
      header: "ID",
      sortable: true,
    },
    {
      key: "studentId",
      header: "Student",
      sortable: true,
      render: (enrolment: Enrolment) => {
        const student = students.find((s) => s.id === enrolment.studentId);
        return student ? `${student.firstName} ${student.lastName}` : "Unknown";
      },
    },
    {
      key: "courseId",
      header: "Course",
      sortable: true,
      render: (enrolment: Enrolment) => {
        const course = courses.find((c) => c.id === enrolment.courseId);
        return course ? `${course.name} (${course.code})` : "Unknown";
      },
    },
    {
      key: "level",
      header: "Level",
      render: (enrolment: Enrolment) => {
        const course = courses.find((c) => c.id === enrolment.courseId);
        return course ? `Level ${course.level}` : "N/A";
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (enrolment: Enrolment) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteDialog({ open: true, enrolment });
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];
  return (
    <div>
      <PageHeader
        title="Student Enrolments"
        description="Manage student enrollments in courses"
        actions={
          <Button onClick={() => setFormDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Enrol Student
          </Button>
        }
      />

      {!enrolments ? (
        <TableSkeleton />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Enrolments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{enrolments.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {new Set(enrolments?.map((e) => e.studentId)).size}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {new Set(enrolments?.map((e) => e.courseId)).size}
                </p>
              </CardContent>
            </Card>
          </div>

          <DataTable
            data={enrolments}
            columns={columns}
            searchPlaceholder="Search enrolments..."
          />
        </>
      )}

      <Dialog open={formDialog} onOpenChange={setFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enrol Student in Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student</Label>
              <select
                id="studentId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                required
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
              <select
                id="courseId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code}) - Level {course.level}
                  </option>
                ))}
              </select>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enrol Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, enrolment: null })
        }
        title="Remove Enrolment"
        description={`Are you sure you want to remove this student's enrollment from this course? This action cannot be undone.`}
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Remove"
      />
    </div>
  );
}
