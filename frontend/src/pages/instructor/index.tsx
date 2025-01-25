import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { IndianRupee, Users } from "lucide-react";
import { useInstructor } from "@/contexts/InstructorContext";
import { useToast } from "@/hooks/use-toast";
import { fetchInstructorCourseListRequest } from "@/services";

function InstructorDashboard() {
  const { toast } = useToast();
  const {instructorCoursesList, setInstructorCoursesList, loading, setLoading} = useInstructor();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchInstructorCourseListRequest();
      setInstructorCoursesList(data.courses);
      console.log(data.courses);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  }

  useEffect(() => {
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

  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = instructorCoursesList.reduce(
      (acc, course) => {
        const studentCount = course.enrollments.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.price * studentCount;

        course.enrollments.forEach(({user: student}) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [] as {courseTitle: string, studentId: string, studentName: string, studentEmail: string}[],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const {studentList, totalProfit, totalStudents} = calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
    },
    {
      icon: IndianRupee,
      label: "Total Revenue",
      value: totalProfit,
    },
  ];

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {
                studentList.length <= 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" className="h-24 text-lg">No students found</TableCell>
                  </TableRow>
                ) : (studentList.map((studentItem) => (
                      <TableRow key={studentItem.studentId}>
                        <TableCell className="font-medium">
                          {studentItem.courseTitle}
                        </TableCell>
                        <TableCell>{studentItem.studentName}</TableCell>
                        <TableCell>{studentItem.studentEmail}</TableCell>
                      </TableRow>
                    ))
                )
              }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;