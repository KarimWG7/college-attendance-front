'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardSkeleton } from '@/components/loading-skeleton';
import { Users, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { studentsApi } from '@/lib/api/students';
import { instructorsApi } from '@/lib/api/instructors';
import { coursesApi } from '@/lib/api/courses';
import { lecturesApi } from '@/lib/api/lectures';
import { toast } from 'sonner';

interface Stats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalLectures: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [students, instructors, courses, lectures] = await Promise.all([
        studentsApi.getAll(),
        instructorsApi.getAll(),
        coursesApi.getAll(),
        lecturesApi.getAll(),
      ]);

      setStats({
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalCourses: courses.length,
        totalLectures: lectures.length,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Instructors',
      value: stats?.totalInstructors || 0,
      icon: GraduationCap,
      color: 'text-green-600',
    },
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'text-orange-600',
    },
    {
      title: 'Total Lectures',
      value: stats?.totalLectures || 0,
      icon: Calendar,
      color: 'text-purple-600',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of the attendance system"
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
