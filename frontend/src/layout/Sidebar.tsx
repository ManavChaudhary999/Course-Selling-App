import {Link, useLocation} from "react-router-dom";
import { cn } from "@/lib/utils"
import { GraduationCap, LogOut } from 'lucide-react';
import { Button } from "../components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItem {
  title: string;
  href: string;
  icon: any;
}
export function Sidebar({items} : {items: SidebarItem[]}) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex h-screen w-[64px] flex-col justify-between border-r bg-gray-100/40 lg:w-[240px]">
      <div className="flex flex-col">
        <div className="flex h-[64px] items-center px-6">
          <Link to="/instructor" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 mr-4" />
            <span className="hidden font-bold text-xl lg:inline-block">
              EduVista
            </span>
          </Link>
        </div>
        <nav className="grid gap-1 p-2">
          {items.map((item, index) => (
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
          <Button className="w-full justify-start mb-2" onClick={()=> logout()}>
            <LogOut className="mr-2 h-4 w-4" />  
            Log Out
          </Button>
        </nav>
      </div>
    </div>
  )
}