import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VideoPlayer } from "@/components/course/video-player"
import { CourseContent } from "@/components/course/course-content"
import { RelatedCourses } from "@/components/course/related-courses"
import { Badge } from "@/components/ui/badge"
// import { Heart } from 'lucide-react'

export default function CoursePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-6 text-3xl font-bold">UI Styleguide With Figma</h1>
          
          <div className="mb-6 rounded-lg bg-black">
            <VideoPlayer />
          </div>

          <Tabs defaultValue="about" className="space-y-6">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-green-600">80 points required</span>
                  <Badge variant="secondary">Intermediate</Badge>
                </div>
                
                <h2 className="text-xl font-semibold">About this course</h2>
                <p className="text-muted-foreground">
                  In this online 3d illustraion design short course, you'll learn how to create realistic
                  props, characters and entironment using Learn 3D Animation online at your own pace.
                  Start today and improve your skills. Join millions of learners from around the world
                  already learning on Udemy. Expert Instructors. Lifetime
                </p>
                
                <p className="text-muted-foreground">
                  Characters and entironment using Learn 3D Animation online at your own pace.
                  Start today and improve your skills.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="text-muted-foreground">Course details content</div>
            </TabsContent>
            
            <TabsContent value="review">
              <div className="text-muted-foreground">Course reviews content</div>
            </TabsContent>
            
            <TabsContent value="resources">
              <div className="text-muted-foreground">Course resources content</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border">
            <h2 className="border-b p-4 text-xl font-semibold">Course Content</h2>
            <CourseContent />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Student Also Bought</h2>
            <RelatedCourses />
          </div>
        </div>
      </div>
    </div>
  )
}