'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { TableSkeleton } from '@/components/loading-skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { coursesApi } from '@/lib/api/courses';
import { instructorsApi } from '@/lib/api/instructors';
import { Course, Instructor } from '@/lib/types';
import { toast } from 'sonner';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; course: Course | null }>({ open: false, course: null });
  const [formDialog, setFormDialog] = useState<{ open: boolean; course: Course | null }>({ open: false, course: null });
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', instructorID: '', level: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, instructorsData] = await Promise.all([
        coursesApi.getAll(),
        instructorsApi.getAll(),
      ]);
      setCourses(coursesData);
      setInstructors(instructorsData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.course) return;
    try {
      await coursesApi.delete(deleteDialog.course.id);
      toast.success('Course deleted successfully');
      setDeleteDialog({ open: false, course: null });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = {
        name: formData.name,
        code: formData.code,
        instructorID: parseInt(formData.instructorID),
        level: parseInt(formData.level),
      };
      if (formDialog.course) {
        await coursesApi.update(formDialog.course.id, data);
        toast.success('Course updated successfully');
      } else {
        await coursesApi.add(data);
        toast.success('Course added successfully');
      }
      setFormDialog({ open: false, course: null });
      setFormData({ name: '', code: '', instructorID: '', level: '' });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const openFormDialog = (course: Course | null = null) => {
    if (course) {
      setFormData({
        name: course.name,
        code: course.code,
        instructorID: course.instructorID.toString(),
        level: course.level.toString(),
      });
    } else {
      setFormData({ name: '', code: '', instructorID: '', level: '' });
    }
    setFormDialog({ open: true, course });
  };

  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'code', header: 'Code', sortable: true },
    { key: 'level', header: 'Level', sortable: true },
    {
      key: 'instructor',
      header: 'Instructor',
      render: (course: Course) => {
        const instructor = instructors.find((i) => i.id === course.instructorID);
        return instructor ? `${instructor.firstName} ${instructor.lastName}` : 'N/A';
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (course: Course) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openFormDialog(course); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, course }); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Manage course records"
        actions={
          <Button onClick={() => openFormDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        }
      />
      {loading ? <TableSkeleton /> : <DataTable data={courses} columns={columns} searchPlaceholder="Search courses..." />}

      <Dialog open={formDialog.open} onOpenChange={(open) => !open && setFormDialog({ open: false, course: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formDialog.course ? 'Edit Course' : 'Add Course'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructorID">Instructor</Label>
              <select
                id="instructorID"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.instructorID}
                onChange={(e) => setFormData({ ...formData, instructorID: e.target.value })}
                required
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.firstName} {instructor.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input id="level" type="number" min="1" max="4" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formDialog.course ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, course: null })}
        title="Delete Course"
        description={`Are you sure you want to delete ${deleteDialog.course?.name}?`}
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
