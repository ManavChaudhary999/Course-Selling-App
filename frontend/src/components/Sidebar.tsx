"use client"

import {Link, useLocation} from "react-router-dom";
// import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, GraduationCap, Home, LayoutDashboard, MessageSquare, Settings } from 'lucide-react'

const userNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
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

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Lessons",
    href: "/admin/lessons",
    icon: GraduationCap,
  },
]

export function Sidebar() {
  const location = useLocation();
//   const pathname = usePathname()
//   const isAdmin = pathname.startsWith("/admin")
//   const items = isAdmin ? adminNavItems : userNavItems

  return (
    <div className="flex h-screen w-[64px] flex-col justify-between border-r bg-gray-100/40 lg:w-[240px]">
      <div className="flex flex-col">
        <div className="flex h-[64px] items-center px-6">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="hidden font-bold lg:inline-block">
              Course Platform
            </span>
          </Link>
        </div>
        <nav className="grid gap-1 p-2">
          {userNavItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-x-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                "hover:bg-gray-100",
                location.pathname === item.href && "bg-gray-100 text-gray-900"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="hidden lg:inline-block">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}