import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowUpDownIcon, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

import { courseFilterOptionType, filterOptions, sortOptions } from "@/config";
import { useStudent } from "@/contexts/StudentContext";
import {
  checkCoursePurchaseStatusRequest,
  fetchStudentViewCourseListRequest,
} from "@/services";
import { useToast } from "@/hooks/use-toast";
import { CourseCardSkeleton } from "@/components/LoadingSkeleton";
import { useAuth } from "@/contexts/AuthContext";

function createSearchParamsHelper(filterParams: any) {
  const queryParams: any[] = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      value.forEach(item => {
        queryParams.push(`${key}=${encodeURIComponent(item)}`);
      });
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [_, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState(()=> {
    const storedFilters = sessionStorage.getItem("filters");
    return storedFilters ? JSON.parse(storedFilters) : {};
  });
  
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useStudent();

  const  { user } = useAuth();

  const navigate = useNavigate();
  const {toast} = useToast();

  function handleFilterOnChange(getSectionId: string, getCurrentOption: courseFilterOptionType) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters: any, sort: any) {
    const query = new URLSearchParams();
  
    for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
            value.forEach(item => {
                query.append(key, item);
            });
        }
    }
    
    if (sort) {
        query.append('sortBy', sort);
    }

    try {
        setLoadingState(true);
        const data = await fetchStudentViewCourseListRequest(query.toString());
        
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
    if(!user) {
      navigate(`/course/details/${getCurrentCourseId}`);
      return;
    }

    const coursePurchaseStatus = await checkCoursePurchaseStatusRequest(getCurrentCourseId);
    
    coursePurchaseStatus?.isEnrolled ?
      navigate(`/course/progress/${getCurrentCourseId}`)
      :
      navigate(`/course/details/${getCurrentCourseId}`);
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:h-screen md:border-r-2 md:w-64 md:space-y-4">
          <div>
            {Object.keys(filterOptions).map((ketItem: string) => (
              <div className="p-4 border-b" key={ketItem}>
                <h3 className="font-bold mb-3">{ketItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                    {/* @ts-ignore */}
                  {filterOptions[ketItem].map((option: courseFilterOptionType) => (
                    <Label className="flex font-medium items-center gap-3" key={option.id}>
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[ketItem] &&
                          filters[ketItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(ketItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">
              {studentViewCoursesList.length} Results
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentViewCoursesList?.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  onClick={() => handleCourseNavigate(courseItem.id)}
                  className="h-full hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  key={courseItem.id}
                >
                  <CardContent className="flex flex-col p-4 h-full">
                    <div className="w-full aspect-video mb-4">
                      <img
                        src={courseItem.imageUrl}
                        className="w-full h-full object-cover rounded-md"
                        alt={courseItem.title}
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <CardTitle className="text-xl mb-2">
                        {courseItem.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By{" "}
                        <span className="font-bold">
                          {courseItem.Instructor.name}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mt-3 mb-2">
                        {`${courseItem.lectures} ${
                          courseItem.lectures <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="flex items-center font-bold text-lg mt-auto">
                        <IndianRupee className="h-4 w-4 mt-0.5" />
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
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;