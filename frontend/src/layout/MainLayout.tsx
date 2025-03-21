import { Outlet, Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserNav } from "./UserNav";


export default function MainLayout() {  
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center space-x-2">
                <GraduationCap className="h-8 w-8 mr-4" />
                <span className="hidden font-bold text-2xl lg:inline-block">
                  EduVista
                </span>
              </Link>
              {/* <div className="hidden lg:flex relative flex-1 max-w-[400px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search for anything"
                  className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div> */}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/courses" className="hidden lg:block text-sm font-semibold">
                Explore
              </Link>
              {
                user ? (
                  <>
                    <Link to="/courses/purchased" className="hidden lg:block text-sm font-semibold">
                      My Courses
                    </Link>
                    <UserNav />
                  </>
                ) : (
                  <>
                    <Link to="/instructor/signup" className="hidden lg:block text-sm font-semibold">
                      Teach on EduVista
                    </Link>
                    
                    <Link to="/login">
                      <Button variant="outline" className="font-semibold">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="bg-black text-white hover:bg-gray-800">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 p-8 pt-6">
        <Outlet />
      </main>
    </div>
  );
}