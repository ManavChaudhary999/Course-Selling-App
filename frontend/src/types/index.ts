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

export interface InstructorCourseType {
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
  enrollments: Enrollment[];
}

export interface Enrollment {
  id: string;
  user: User;
}

export interface Progress {
  id: string;
  enrollment_id: string;
  lesson_number: number;
  completed: boolean;
  completed_at?: string;
}