// const progressData = [
//   { day: 'Mon', hours: 1.5 },
//   { day: 'Tue', hours: 2.5 },
//   { day: 'Wed', hours: 2 },
//   { day: 'Thu', hours: 4 },
//   { day: 'Fri', hours: 3 },
//   { day: 'Sat', hours: 2 },
//   { day: 'Sun', hours: 1 },
// ];

import { Card } from "@/components/ui/card"
import { CourseList } from "@/components/dashboard/course-list"
import { LearningChart } from "@/components/dashboard/learning-chart"
import { PremiumCard } from "@/components/dashboard/premium-card"

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hello Josh!</h2>
          <p className="text-muted-foreground">
            It&apos;s good to see you again.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="p-2">
            <div className="grid grid-cols-2 gap-4 p-2">
              <div className="text-center">
                <div className="text-2xl font-bold">11</div>
                <div className="text-xs text-muted-foreground">
                  Courses completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4</div>
                <div className="text-xs text-muted-foreground">
                  Courses in progress
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <CourseList />
        </div>
        <div className="col-span-3">
          <div className="grid gap-4">
            <Card className="p-6">
              <h3 className="font-semibold">Your statistics</h3>
              <div className="mt-4">
                <LearningChart />
              </div>
            </Card>
            <PremiumCard />
          </div>
        </div>
      </div>
    </div>
  )
}