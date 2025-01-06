import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CoursesProvider } from './contexts/CoursesContext';
import { PrivateRoute } from './components/PrivateRoute';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Homepage from './pages/homepage';
import Courses from './pages/Courses';
import Course from './pages/Course';
import SettingsPage from './pages/Settings';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
              <Route index element={<Homepage />} />
              <Route path='dashboard' element={<UserDashboard />} />
              <Route path='courses' element={<Courses />} />
              <Route path='courses/:id' element={<Course />} />
              <Route path='settings' element={<SettingsPage />} />
            </Route>
            <Route 
              path="/admin" 
              element={
                <PrivateRoute requireAdmin>
                  <AdminDashboard />
                </PrivateRoute>
              } 
              />
          </Routes>
        </Router>
        <Toaster />
      </CoursesProvider>
    </AuthProvider>
  );
}

export default App;