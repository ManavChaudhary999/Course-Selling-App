import {Outlet, useLocation} from 'react-router-dom';
import { BookOpen, GraduationCap, LayoutDashboard, MessageSquare, Settings } from 'lucide-react';
import {Sidebar} from '../components/Sidebar';
import {UserNav} from '../components/UserNav';

const studentNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

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
    title: "Lessons",
    href: "/instructor/lessons",
    icon: GraduationCap,
  },
]

export default function MainLayout() {
  const location = useLocation();
  const isInstructor = location.pathname.startsWith("/instructor");
  const items = isInstructor ? instructorNavItems : studentNavItems;

  return (
    <div className="flex min-h-screen">
      <Sidebar items={items} />
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-4">
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 space-y-4 p-8 pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}