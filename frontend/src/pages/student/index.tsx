import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";
import { checkCoursePurchaseStatusRequest, fetchStudentViewCourseListRequest } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { CourseCardSkeleton } from "@/components/LoadingSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";


function StudentHomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { loadingState, setLoadingState, studentViewCoursesList, setStudentViewCoursesList } = useStudent();
  const { user } = useAuth();

  function handleNavigateToCoursesPage(getCurrentId: string) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    try {
      setLoadingState(true);
      const data = await fetchStudentViewCourseListRequest("");
      
      const newCoursesList = [];
      for(const course of data?.courses?.slice(0, 4) || []) {
        newCoursesList.push({
          ...course,
          lectures: course._count?.lectures,
        });
      }

      setStudentViewCoursesList(newCoursesList);
      setLoadingState(false);
  } catch (error) {
      toast({
          title: "Error",
          description: (error as Error).message,
          variant: "destructive"
      })
      setLoadingState(false);
  }
  }

  async function handleCourseNavigate(getCurrentCourseId: string) {
    const coursePurchaseStatus = await checkCoursePurchaseStatusRequest(getCurrentCourseId);
    
    coursePurchaseStatus?.isEnrolled ?
      navigate(`/course/progress/${getCurrentCourseId}`)
      :
      navigate(`/course/details/${getCurrentCourseId}`);
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div>
      <section className="relative bg-gray-50 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 z-10">
              <div className="bg-white p-8 rounded-lg shadow-sm max-w-md">
                <h1 className="text-3xl font-bold mb-4">
                  Learning thet gets you
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Expand your horizons with learning that's worldwide.
                </p>
                <Link to={user ? "/courses" : "/login"}>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:absolute right-0 top-0 h-full">
              <div className="h-full w-full bg-orange-500 clip-diagonal">
                <img
                  src="/banner-img-2.webp"
                  alt="Student learning"
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">All the skills you need in one place</h2>
        <p className="text-lg text-gray-600 mb-8">
          From critical skills to technical topics, we support your professional development.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start hover:bg-gray-100"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList?.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <Card
                key={courseItem.id}
                onClick={() => handleCourseNavigate(courseItem?.id)}
                className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer"
              >
                <CardContent className="p-0">
                  <img
                    src={courseItem?.imageUrl}
                    width={300}
                    height={150}
                    className="w-full h-40 object-cover rounded-t-xl"
                    alt={courseItem?.title}
                  />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {courseItem?.Instructor?.name}
                    </p>
                    <p className="flex items-center font-bold text-[16px] mt-auto">
                      <IndianRupee className="h-3 w-3 mt-0.5" />
                      {courseItem.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : loadingState ? (
            [...Array(6)].map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          ) : (
            <h1 className="font-extrabold text-4xl">No Courses Found</h1>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-400">
                We're dedicated to providing quality education and helping students achieve their learning goals through our comprehensive online courses.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/courses" className="text-gray-400 hover:text-white transition-colors">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <div className="text-gray-400 space-y-2">
                <p>Email: support@eduvista.com</p>
                <p>Phone: +1 234 567 890</p>
                <p>Address: 123 Learning Street, Education City</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} EduVista. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StudentHomePage;