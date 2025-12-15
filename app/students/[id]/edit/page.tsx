"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSkeleton } from "@/components/loading-skeleton";
import { ArrowLeft, Loader2 } from "lucide-react";
import { studentsApi } from "@/lib/api/students";
import { toast } from "sonner";

export default function EditStudentPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gmail: "",
    departmentID: "",
    nfc_Tag: "",
    level: "",
  });

  useEffect(() => {
    loadStudent();
  }, [params.id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const data = await studentsApi.getById(parseInt(params.id));
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        gmail: data.gmail,
        departmentID: data.departmentID.toString(),
        nfc_Tag: data.nfc_Tag,
        level: data.level.toString(),
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await studentsApi.update(parseInt(params.id), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gmail: formData.gmail,
        departmentID: parseInt(formData.departmentID),
        nfc_Tag: formData.nfc_Tag,
        level: parseInt(formData.level),
      });
      toast.success("Student updated successfully");
      router.push(`/students/${params.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Edit Student" />
        <Card>
          <CardContent className="pt-6">
            <FormSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Student"
        description="Update student information"
        actions={
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gmail">Email</Label>
                <Input
                  id="gmail"
                  type="email"
                  value={formData.gmail}
                  onChange={(e) =>
                    setFormData({ ...formData, gmail: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nfc_Tag">NFC Tag</Label>
                <Input
                  id="nfc_Tag"
                  value={formData.nfc_Tag}
                  onChange={(e) =>
                    setFormData({ ...formData, nfc_Tag: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentID">Department ID</Label>
                <Input
                  id="departmentID"
                  type="number"
                  value={formData.departmentID}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentID: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Input
                  id="level"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
