import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const courses = [
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
  
  export function CourseTable() {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Tools</TableHead>
              <TableHead>Lessons</TableHead>
              <TableHead className="text-right">Points required</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.name}>
                <TableCell className="font-medium">{course.name}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>
                  <span className={levelColors[course.level as keyof typeof levelColors]}>
                    {course.level}
                  </span>
                </TableCell>
                <TableCell>{course.tools}</TableCell>
                <TableCell>{course.lessons}</TableCell>
                <TableCell className="text-right">{course.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }  