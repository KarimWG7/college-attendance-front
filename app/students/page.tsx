"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TableSkeleton } from "@/components/loading-skeleton";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { studentsApi } from "@/lib/api/students";
import { Student } from "@/lib/types";
import { toast } from "sonner";

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    student: Student | null;
  }>({ open: false, student: null });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.student) return;

    try {
      await studentsApi.delete(deleteDialog.student.id);
      toast.success("Student deleted successfully");
      setDeleteDialog({ open: false, student: null });
      loadStudents();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete student");
    }
  };

  const columns = [
    {
      key: "id",
      header: "ID",
      sortable: true,
    },
    {
      key: "firstName",
      header: "First Name",
      sortable: true,
    },
    {
      key: "lastName",
      header: "Last Name",
      sortable: true,
    },
    {
      key: "gmail",
      header: "Email",
      sortable: true,
    },
    {
      key: "level",
      header: "Level",
      sortable: true,
    },
    {
      key: "nfc_Tag",
      header: "NFC Tag",
    },
    {
      key: "actions",
      header: "Actions",
      render: (student: Student) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/students/${student.id}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/students/${student.id}/edit`);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteDialog({ open: true, student });
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
        title="Students"
        description="Manage student records"
        actions={
          <Button onClick={() => router.push("/students/add")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <DataTable
          data={students}
          columns={columns}
          searchPlaceholder="Search students..."
        />
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !open && setDeleteDialog({ open: false, student: null })
        }
        title="Delete Student"
        description={`Are you sure you want to delete ${deleteDialog.student?.firstName} ${deleteDialog.student?.lastName}? This action cannot be undone.`}
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
