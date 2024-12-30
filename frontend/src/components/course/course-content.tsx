import { Clock } from 'lucide-react'

const lessons = [
  { title: "What is UI Design?", duration: "00:45" },
  { title: "How to Concept?", duration: "00:45" },
  { title: "What is UI Design?", duration: "00:45" },
  { title: "What is UI Design?", duration: "00:45" },
  { title: "What is UI Design?", duration: "00:45" },
]

export function CourseContent() {
  return (
    <div className="divide-y">
      {lessons.map((lesson, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 hover:bg-muted/50"
        >
          <span className="text-sm font-medium">{lesson.title}</span>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {lesson.duration}
          </span>
        </div>
      ))}
    </div>
  )
}