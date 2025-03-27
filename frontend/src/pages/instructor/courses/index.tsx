import { useNavigate } from "react-router-dom";
import { Edit, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { useInstructor } from "@/contexts/InstructorContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { fetchInstructorCourseListRequest } from "@/services";

function InstructorCourses() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    instructorCoursesList,
    setInstructorCoursesList,
    loading,
    setLoading,
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useInstructor();

  const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchInstructorCourseListRequest();
        setInstructorCoursesList(data.courses);
      } catch (error) {
        setLoading(false);
        throw error;
      }
      setLoading(false);
  }
  
  useEffect(() => {
    if(instructorCoursesList?.length > 0) return;

    try {
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      })
    }
  }, []);

  if(loading) {
    <div className="h-screen flex flex-col justify-center items-center space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  }

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-course");
          }}
          className="p-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructorCoursesList?.length > 0
                ? instructorCoursesList.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>{course.enrollments?.length}</TableCell>
                      <TableCell>
                        <p className="flex items-center gap-1">
                          <IndianRupee className="w-3.5 h-3.5" />
                          {course.enrollments?.length * course.price}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course.id}`);
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-6 w-6" />
                        </Button>
                        {/* <Button variant="ghost" size="sm">
                          <Delete className="h-6 w-6" />
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;