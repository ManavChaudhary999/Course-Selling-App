// import { useAuth } from '@/contexts/AuthContext';
// import { useCourses } from '@/hooks/useCourses';
// import { StatCard } from '@/components/dashboard/StatCard';
// import { CourseCard } from '@/components/dashboard/CourseCard';
// import { ProgressChart } from '@/components/dashboard/ProgressChart';
// import { ErrorMessage } from '@/components/ErrorMessage';

// const progressData = [
//   { day: 'Mon', hours: 1.5 },
//   { day: 'Tue', hours: 2.5 },
//   { day: 'Wed', hours: 2 },
//   { day: 'Thu', hours: 4 },
//   { day: 'Fri', hours: 3 },
//   { day: 'Sat', hours: 2 },
//   { day: 'Sun', hours: 1 },
// ];

// export default function UserDashboard() {
//   const { user } = useAuth();
//   const { enrolledCourses, error } = useCourses(user?.id);

//   console.log(user);

//   const stats = {
//     completed: enrolledCourses.filter(e => e.completed_at).length,
//     inProgress: enrolledCourses.filter(e => !e.completed_at).length,
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//             <h1 className="text-3xl font-bold mb-2">Welcome Back {user?.email}</h1>
//             <p className="text-gray-600">Here's an overview of your courses</p>
//           </div>

//           {error && <ErrorMessage message={error} />}

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <StatCard title="Total Enrolled" value={enrolledCourses.length} />
//             <StatCard title="Completed" value={stats.completed} />
//             <StatCard title="In Progress" value={stats.inProgress} />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h2 className="text-xl font-bold mb-4">Recent enrolled courses</h2>
//               <div className="space-y-4">
//                 {enrolledCourses.slice(0, 3).map((enrollment) => (
//                   enrollment.courses && (
//                     <CourseCard
//                       key={enrollment.id}
//                       course={enrollment.courses}
//                       actionLabel="Continue"
//                       onAction={() => {/* Handle continue */}}
//                     />
//                   )
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg p-6">
//               <h2 className="text-xl font-bold mb-4">Daily progress</h2>
//               <ProgressChart data={progressData} />
//             </div>
//           </div>
//         </div>
//     </div>
//   );
// }

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