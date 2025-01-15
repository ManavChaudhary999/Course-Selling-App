export interface ControlItemType {
  name: string;
  label: string;
  componentType: string;
  type?: string;
  placeholder: string;
  options?: any[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'INSTRUCTOR' | 'STUDENT';
}

export interface Course {
  id: string;
  isntructorId: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished: boolean;
  categoryId: string;
  created_at: string;
  updated_at: string;
  // duration: number;
  // instructor: string;
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