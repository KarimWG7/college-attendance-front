'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { instructorsApi } from '@/lib/api/instructors';
import { Instructor } from '@/lib/types';
import { toast } from 'sonner';

export default function InstructorsPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    instructor: Instructor | null;
  }>({ open: false, instructor: null });
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    instructor: Instructor | null;
  }>({ open: false, instructor: null });
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gmail: '',
  });

  useEffect(() => {
    loadInstructors();
  }, []);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const data = await instructorsApi.getAll();
      setInstructors(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.instructor) return;

    try {
      await instructorsApi.delete(deleteDialog.instructor.id);
      toast.success('Instructor deleted successfully');
      setDeleteDialog({ open: false, instructor: null });
      loadInstructors();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete instructor');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      if (formDialog.instructor) {
        await instructorsApi.update(formDialog.instructor.id, formData);
        toast.success('Instructor updated successfully');
      } else {
        await instructorsApi.add(formData);
        toast.success('Instructor added successfully');
      }
      setFormDialog({ open: false, instructor: null });
      setFormData({ firstName: '', lastName: '', gmail: '' });
      loadInstructors();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save instructor');
    } finally {
      setSaving(false);
    }
  };

  const openFormDialog = (instructor: Instructor | null = null) => {
    if (instructor) {
      setFormData({
        firstName: instructor.firstName,
        lastName: instructor.lastName,
        gmail: instructor.gmail,
      });
    } else {
      setFormData({ firstName: '', lastName: '', gmail: '' });
    }
    setFormDialog({ open: true, instructor });
  };

  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'firstName', header: 'First Name', sortable: true },
    { key: 'lastName', header: 'Last Name', sortable: true },
    { key: 'gmail', header: 'Email', sortable: true },
    {
      key: 'actions',
      header: 'Actions',
      render: (instructor: Instructor) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              openFormDialog(instructor);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialog({ open: true, instructor });
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
        title="Instructors"
        description="Manage instructor records"
        actions={
          <Button onClick={() => openFormDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Button>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          data={instructors}
          columns={columns}
          searchPlaceholder="Search instructors..."
        />
      )}

      <Dialog open={formDialog.open} onOpenChange={(open) => !open && setFormDialog({ open: false, instructor: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formDialog.instructor ? 'Edit Instructor' : 'Add Instructor'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gmail">Email</Label>
              <Input
                id="gmail"
                type="email"
                value={formData.gmail}
                onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formDialog.instructor ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && setDeleteDialog({ open: false, instructor: null })}
        title="Delete Instructor"
        description={`Are you sure you want to delete ${deleteDialog.instructor?.firstName} ${deleteDialog.instructor?.lastName}?`}
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
