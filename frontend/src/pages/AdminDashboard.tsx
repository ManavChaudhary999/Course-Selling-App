import { useState } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { StatCard } from '@/components/dashboard/StatCard';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { CourseForm } from '@/components/admin/CourseForm';
import { ErrorMessage } from '@/components/ErrorMessage';
import {Button} from '../components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { courses, loading, error } = useCourses();
  const [users, setUsers] = useState([]);
  const { logout } = useAuth();

  const handleAddCourse = async (formData: any) => {
    // try {
    //   const { data, error } = await supabase
    //     .from('courses')
    //     .insert([
    //       {
    //         ...formData,
    //         duration: parseInt(formData.duration),
    //       },
    //     ]);

    //   if (error) throw error;
    // } catch (err) {
    //   console.error('Error adding course:', err);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your courses and users</p>
          <Button onClick={logout}><LogOut className="mr-2 h-4 w-4" /></Button>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>
            <CourseForm onSubmit={handleAddCourse} />
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Course Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <StatCard title="Total Courses" value={courses.length} />
                <StatCard title="Total Users" value={users.length} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
              <div className="space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}