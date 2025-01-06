import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Course } from "@/types"
  
  const mockCourses = [
    {
      name: "3D animation",
      category: "UI Design",
      level: "Beginner",
      tools: "Cinema 4D",
      lessons: "25 tutorials",
      points: "100 points",
    },
    {
      name: "Design Thinking",
      category: "UX Design",
      level: "Intermediate",
      tools: "Adobe XD",
      lessons: "25 tutorials",
      points: "100 points",
    },
    {
      name: "Matching Learning",
      category: "Data Learn",
      level: "Advance",
      tools: "VS Code",
      lessons: "25 tutorials",
      points: "100 points",
    },
    {
      name: "Responsive Design",
      category: "UI Design",
      level: "Beginner",
      tools: "Figma",
      lessons: "25 tutorials",
      points: "100 points",
    },
  ]
  
  const levelColors = {
    Beginner: "text-green-600",
    Intermediate: "text-blue-600",
    Advance: "text-yellow-600",
  }
  
  export function CourseTable({courses}: {courses: Course[] | null}) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Lessons</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>
                  <span className={levelColors["Beginner" as keyof typeof levelColors]}>
                    Beginner
                  </span>
                </TableCell>
                <TableCell>10</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }  