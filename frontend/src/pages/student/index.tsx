import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useStudent } from "@/contexts/StudentContext";
import { checkCoursePurchaseStatusRequest, fetchStudentViewCourseListRequest } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { CourseCardSkeleton } from "@/components/LoadingSkeleton";

function StudentHomePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { loadingState, setLoadingState, studentViewCoursesList, setStudentViewCoursesList } = useStudent();

  function handleNavigateToCoursesPage(getCurrentId: string) {
    console.log(getCurrentId);
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
      for(const course of data?.courses) {
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
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning thet gets you</h1>
          <p className="text-xl">
            Skills for your present and your future. Get Started with US
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src='/banner-img.png'
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured COourses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList?.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?.id)}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.imageUrl}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.Instructor?.name}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.price}
                  </p>
                </div>
              </div>
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
    </div>
  );
}

export default StudentHomePage;