import {Navigate, Link} from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const courses = [
  {
    id: 1,
    title: "UI Styleguide With Figma",
    thumbnail: "/placeholder.svg?height=400&width=600",
    level: "Intermediate",
    instructor: {
      name: "Jonathan Due",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      lessons: 24,
      likes: 9,
      students: 30,
    },
    progress: 45,
    daysRemaining: "4/12",
  },
  {
    id: 2,
    title: "Interectoin design With Figma",
    thumbnail: "/placeholder.svg?height=400&width=600",
    level: "Beginner",
    instructor: {
      name: "Killan James",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      lessons: 24,
      likes: 9,
      students: 30,
    },
    progress: 75,
    daysRemaining: "4/12",
  },
  {
    id: 3,
    title: "3D illustration Design With Figma",
    thumbnail: "/placeholder.svg?height=400&width=600",
    level: "Intermediate",
    instructor: {
      name: "Jonathan Due",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      lessons: 24,
      likes: 9,
      students: 30,
    },
    progress: 65,
    daysRemaining: "4/12",
  },
  {
    id: 4,
    title: "Web App Design With Figma",
    thumbnail: "/placeholder.svg?height=400&width=600",
    level: "Master",
    instructor: {
      name: "Jonathan Due",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    stats: {
      lessons: 24,
      likes: 9,
      students: 30,
    },
    progress: 25,
    daysRemaining: "4/12",
  },
]

const levelStyles = {
  Beginner: "bg-green-100 text-green-800",
  Intermediate: "bg-blue-100 text-blue-800",
  Master: "bg-purple-100 text-purple-800",
}

export function CourseGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <Link to={`/courses/${course.id}`}>
          <div className="relative aspect-video">
            <img
              src={course.thumbnail}
              alt={course.title}
            //   fill
              className="object-cover"
            />
            <span
              className={cn(
                "absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium",
                levelStyles[course.level as keyof typeof levelStyles]
              )}
            >
              {course.level}
            </span>
          </div>
          </Link>
          <CardContent className="grid gap-2.5 p-4">
            <h3 className="line-clamp-2 font-semibold">{course.title}</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={course.instructor.avatar} />
                <AvatarFallback>
                  {course.instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {course.instructor.name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{course.stats.lessons}</span>
              <span>{course.stats.likes}</span>
              <span>{course.stats.students}</span>
            </div>
            <Progress value={course.progress} className="h-1" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Completed: {course.progress}%</span>
              <span>Days: {course.daysRemaining}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}