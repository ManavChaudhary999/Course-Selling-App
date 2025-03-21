import {Outlet} from 'react-router-dom';
import { BookOpen, LayoutDashboard, Settings } from 'lucide-react';
import {Sidebar} from './Sidebar';


const instructorNavItems = [
  {
    title: "Dashboard",
    href: "/instructor",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    title: "Settings",
    href: "/instructor/settings",
    icon: Settings,
  },
]

export default function InstructorLayout() {

  return (
    <div className="flex min-h-screen">
      <Sidebar items={instructorNavItems} />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <Outlet />
      </main>
    </div>
  );
}