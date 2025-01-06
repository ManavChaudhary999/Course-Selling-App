import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseGrid } from "@/components/courses/course-grid"
import { CourseTable } from "@/components/courses/course-table"
import { useCourses } from "@/contexts/CoursesContext"

export default function CoursesPage() {
  const {courses, loading} = useCourses();

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Course</h1>
      </div>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-8">
          <CourseGrid courses={courses} />
          <CourseTable courses={courses} />
        </TabsContent>
        <TabsContent value="active">
          <CourseGrid courses={courses} />
        </TabsContent>
        <TabsContent value="completed">
          <CourseGrid courses={courses} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

