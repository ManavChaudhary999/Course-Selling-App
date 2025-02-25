import { Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { PrivateRoute } from './components/PrivateRoute';
import MainLayout from './layout/MainLayout';
import NotFound from './pages/not-found';

import Login from './pages/auth/login';
import Register from './pages/auth/register';

import StudentHomePage from './pages/student';
import UserDashboard from './pages/student/dashboard';
import UserProfileSettings from './pages/student/profileSettings';

import InstructorDashboard from './pages/instructor';
import InstructorCourses from './pages/instructor/courses';
import CreateCoursePage from './pages/instructor/create-course';

import CoursesPage from './pages/student/courses';
import Course from './pages/Course';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<StudentHomePage />} />
          <Route path='courses' element={<CoursesPage />} />
          <Route path='courses/:id' element={<Course />} />
          <Route path='settings' element={<UserProfileSettings />} />
        </Route>
          {/* Instructor Routes */}
        <Route path="/instructor" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
          <Route index element={<InstructorDashboard />} />
          <Route path='courses' element={<InstructorCourses />} />
          <Route path='create-course' element={<CreateCoursePage />} />
          <Route path='edit-course/:courseId' element={<CreateCoursePage />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Toaster />
    </>        
  );
}

export default App;