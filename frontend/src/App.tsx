import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';

import { PrivateRoute, StudentProtectedRoute, InstructorProtectedRoute } from './layout/PrivateRoute';
import MainLayout from './layout/MainLayout';
import InstructorLayout from './layout/InstructorLayout';
import NotFound from './pages/not-found';

import InstructorSignup from './pages/auth/instructor/register';
import InstructorLogin from './pages/auth/instructor/login';
import Login from './pages/auth/student/login';
import Signup from './pages/auth/student/register';

import InstructorDashboard from './pages/instructor';
import InstructorCourses from './pages/instructor/courses';
import CreateCoursePage from './pages/instructor/create-course';

import StudentHomePage from './pages/student';
import CoursesPage from './pages/student/courses';
import CourseDetailsPage from './pages/student/course-details';
import CourseProgressPage from './pages/student/course-progress';
import PurchasedCourses from './pages/student/purchased-courses';
import UserProfileSettings from './pages/student/profileSettings';


function App() {
  return (
    <>
      <Routes>

        {/* Student Routes */}
        <Route path="/" element={<StudentProtectedRoute><MainLayout /></StudentProtectedRoute>}>
          <Route index element={<StudentHomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path='courses' element={<CoursesPage />} />
          <Route path='courses/purchased' element={<PrivateRoute><PurchasedCourses /></PrivateRoute>} />
          <Route path='course/details/:courseId' element={<CourseDetailsPage />} />
          <Route path='course/progress/:courseId' element={<PrivateRoute><CourseProgressPage /></PrivateRoute>} />
          <Route path='settings' element={<PrivateRoute><UserProfileSettings /></PrivateRoute>} />
        </Route>

        {/* Instructor Routes */}
        <Route path="/instructor/signup" element={<InstructorProtectedRoute><InstructorSignup /></InstructorProtectedRoute>} />
        <Route path="/instructor/login" element={<InstructorProtectedRoute><InstructorLogin /></InstructorProtectedRoute>} />
        <Route path="/instructor" element={
          <PrivateRoute>
            <InstructorProtectedRoute>
              <InstructorLayout />
            </InstructorProtectedRoute>
          </PrivateRoute>
        }>
          <Route index element={<InstructorDashboard />} />
          <Route path='courses' element={<InstructorCourses />} />
          <Route path='create-course' element={<CreateCoursePage />} />
          <Route path='edit-course/:courseId' element={<CreateCoursePage />} />
          <Route path='settings' element={<UserProfileSettings />} />
        </Route>

        {/* Not Found Route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster />
    </>        
  );
}

export default App;