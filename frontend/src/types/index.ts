export interface User {
  id: number;
  email: string;
  name?: string;
  // role: 'user' | 'admin';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  instructor: string;
  rating: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
  courses?: Course;
}

export interface Progress {
  id: string;
  enrollment_id: string;
  lesson_number: number;
  completed: boolean;
  completed_at?: string;
}