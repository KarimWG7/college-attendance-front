"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Link2,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
  { name: "Instructors", href: "/instructors", icon: GraduationCap },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Enrolments", href: "/enrolments", icon: Link2 },
  { name: "Lectures", href: "/lectures", icon: Calendar },
  { name: "Attendance Control", href: "/attendance", icon: ClipboardCheck },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebarStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out bg-card border-r",
        isOpen ? "translate-x-0 w-64" : "-translate-x-full"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Attendance System</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
