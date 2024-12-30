import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Star } from 'lucide-react'

const courses = [
  {
    id: 1,
    title: "Learn Figma",
    author: "Christopher Morgan",
    duration: "6h 30min",
    rating: 4.9,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    title: "Analog photography",
    author: "Gordon Norman",
    duration: "3h 15min",
    rating: 4.7,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    title: "Master Instagram",
    author: "Sophie Gill",
    duration: "7h 40min",
    rating: 4.6,
    image: "/placeholder.svg?height=60&width=60",
  },
]

export function CourseList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Courses</h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">All Courses</Button>
          <Button variant="ghost" size="sm">The Newest</Button>
          <Button variant="ghost" size="sm">Top Rated</Button>
          <Button variant="ghost" size="sm">Most Popular</Button>
        </div>
      </div>
      <div className="grid gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={course.image}
                alt={course.title}
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div className="flex-1 space-y-1">
                <h4 className="font-medium">{course.title}</h4>
                <p className="text-sm text-muted-foreground">
                  by {course.author}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span className="text-sm font-medium">{course.rating}</span>
              </div>
              <Button>View course</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}