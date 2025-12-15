"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/loading-skeleton";
import { ArrowLeft, Pencil } from "lucide-react";
import { studentsApi } from "@/lib/api/students";
import { reportsApi } from "@/lib/api/reports";
import { Student, StudentReport } from "@/lib/types";
import { toast } from "sonner";

export default function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [report, setReport] = useState<StudentReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [params.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const studentData = await studentsApi.getById(parseInt(params.id));
      setStudent(studentData);

      try {
        const reportData = await reportsApi.getBasicReport(parseInt(params.id));
        setReport(reportData);
      } catch (error) {
        console.log("No report data available");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load student");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Student Details" />
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div>
      <PageHeader
        title={`${student.firstName} ${student.lastName}`}
        description="Student information and attendance summary"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/students/${params.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => router.push("/students")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Student ID</p>
              <p className="font-medium">{student.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{student.gmail}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="font-medium">{student.level}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Department ID</p>
              <p className="font-medium">{student.departmentID}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NFC Tag</p>
              <p className="font-medium font-mono">{student.nfc_Tag}</p>
            </div>
          </CardContent>
        </Card>

        {report && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Total Lectures</p>
                <p className="font-medium text-2xl">{report.totalLectures}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="font-medium text-lg text-green-600">
                    {report.present}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Absent</p>
                  <p className="font-medium text-lg text-red-600">
                    {report.absent}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <p className="font-medium text-lg text-orange-600">
                    {report.late}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
