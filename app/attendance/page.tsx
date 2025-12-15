"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableSkeleton } from "@/components/loading-skeleton";
import { DataTable } from "@/components/data-table";
import { lecturesApi } from "@/lib/api/lectures";
import { teacherControlApi } from "@/lib/api/teacher-control";
import { coursesApi } from "@/lib/api/courses";
import { Lecture, Course } from "@/lib/types";
import { toast } from "sonner";
import { Play, Square, Users, UserX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AttendanceControlPage() {
  const router = useRouter();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

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

  const handleOpenLecture = async (lectureId: number) => {
    try {
      await teacherControlApi.openLecture(lectureId);
      toast.success("Lecture opened successfully");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to open lecture");
    }
  };

  const handleCloseLecture = async (lectureId: number) => {
    try {
      await teacherControlApi.closeLecture(lectureId);
      toast.success("Lecture closed successfully");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to close lecture");
    }
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
    {
      key: "startTime",
      header: "Start Time",
      render: (lecture: Lecture) =>
        new Date(lecture.startTime).toLocaleString(),
    },
    {
      key: "status",
      header: "Status",
      render: (lecture: Lecture) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            lecture.state === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {lecture.state || "Closed"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (lecture: Lecture) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (lecture.state === "Active") {
                handleCloseLecture(lecture.id);
              } else {
                handleOpenLecture(lecture.id);
              }
            }}
          >
            {lecture.state === "Active" ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Close
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Open
              </>
            )}
          </Button>
          {lecture.state === "Active" && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/attendance/${lecture.id}`);
              }}
            >
              <Users className="mr-2 h-4 w-4" />
              Manage
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance Control"
        description="Manage lecture attendance sessions"
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
    </div>
  );
}
