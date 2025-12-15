"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { lecturesApi } from "@/lib/api/lectures";
import { coursesApi } from "@/lib/api/courses";
import { Lecture, Course } from "@/lib/types";
import { toast } from "sonner";

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    lecture: Lecture | null;
  }>({ open: false, lecture: null });
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    lecture: Lecture | null;
  }>({ open: false, lecture: null });
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Omit<Lecture, "id">>({
    courseId: 0,
    startTime: "",
    endTime: "",
    room: "",
    state: "Active",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lecturesData, coursesData] = await Promise.all([
        lecturesApi.getAll(),
        coursesApi.getAll(),
      ]);
      setLectures(lecturesData);
      setCourses(coursesData);
    } catch (error: any) {
      toast.error(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.lecture) return;
    try {
      await lecturesApi.delete(deleteDialog.lecture.id);
      toast.success("Lecture deleted successfully");
      setDeleteDialog({ open: false, lecture: null });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete lecture");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        courseId: formData.courseId,
        startTime: formData.startTime,
        endTime: formData.endTime,
        room: formData.room,
        state: formData.state,
      };
      if (formDialog.lecture) {
        await lecturesApi.update(formDialog.lecture.id, data);
        toast.success("Lecture updated successfully");
      } else {
        await lecturesApi.add(data);
        toast.success("Lecture added successfully");
      }
      setFormDialog({ open: false, lecture: null });
      setFormData({
        courseId: 0,
        startTime: "",
        endTime: "",
        room: "",
        state: "Active",
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to save lecture");
    } finally {
      setSaving(false);
    }
  };

  const openFormDialog = (lecture: Lecture | null = null) => {
    if (lecture) {
      setFormData({
        courseId: lecture.courseId,
        startTime: lecture.startTime,
        endTime: lecture.endTime,
        room: lecture.room,
        state: lecture.state || "Active",
      });
    } else {
      setFormData({
        courseId: 0,
        startTime: "",
        endTime: "",
        room: "",
        state: "Active",
      });
    }
    setFormDialog({ open: true, lecture });
  };

  const columns = [
    { key: "id", header: "ID", sortable: true },
    {
      key: "course",
      header: "Course",
      render: (lecture: Lecture) => {
        const course = courses.find((c) => c.id === lecture.courseId);
        return course ? `${course.name} (${course.code})` : "N/A";
      },
    },
    { key: "room", header: "Room", sortable: true },
    { key: "state", header: "State", sortable: true },
    {
      key: "startTime",
      header: "Start Time",
      render: (lecture: Lecture) =>
        new Date(lecture.startTime).toLocaleString(),
    },
    {
      key: "endTime",
      header: "End Time",
      render: (lecture: Lecture) => new Date(lecture.endTime).toLocaleString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (lecture: Lecture) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              openFormDialog(lecture);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialog({ open: true, lecture });
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Lectures"
        description="Manage lecture schedules"
        actions={
          <Button onClick={() => openFormDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lecture
          </Button>
        }
      />
      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          data={lectures}
          columns={columns}
          searchPlaceholder="Search lectures..."
        />
      )}

      <Dialog
        open={formDialog.open}
        onOpenChange={(open) =>
          !open && setFormDialog({ open: false, lecture: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formDialog.lecture ? "Edit Lecture" : "Add Lecture"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">Course</Label>
              <select
                id="courseId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseId: parseInt(e.target.value),
                  })
                }
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) =>
                  setFormData({ ...formData, room: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stete">State</Label>
              <select
                id="stete"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value as "Active" | "Closed",
                  })
                }
                required
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formDialog.lecture ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, lecture: null })
        }
        title="Delete Lecture"
        description="Are you sure you want to delete this lecture?"
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
