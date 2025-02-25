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

export interface StudentCourseType {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  // isPublished: boolean;
  category: string;
  created_at: string;
  updated_at: string;
  Instructor: {
    name: string;
    profileUrl: string;
  }
  // enrollments: Enrollment[];
}

export interface StudentCourseListType {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  // isPublished: boolean;
  category: string;
  created_at: string;
  updated_at: string;
  Instructor: {
    name: string;
    profileUrl: string;
  }
  lectures: LectureType[];
  // enrollments: Enrollment[];
}

export interface LectureType {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  preview: boolean;
}

export interface Progress {
  id: string;
  enrollment_id: string;
  lesson_number: number;
  completed: boolean;
  completed_at?: string;
}