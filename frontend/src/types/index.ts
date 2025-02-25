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
  createdAt: string;
  updatedAt: string;
  enrollments: Enrollment[];
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
  createdAt: string;
  updatedAt: string;
  Instructor: {
    name: string;
    profileUrl: string;
  }
  lectures: number;
  // enrollments: Enrollment[];
}

export interface StudentCourseDetailsType {
  id: string;
  title: string;
  description?: string;
  price: number;
  imageUrl: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  // isPublished: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
  Instructor: {
    name: string;
    profileUrl: string;
  }
  lectures: LectureType[],
  enrollments: Enrollment[];
}

interface Enrollment {
  id: string;
  user: User;
}

export interface LectureType {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  preview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  enrollment_id: string;
  lesson_number: number;
  completed: boolean;
  completed_at?: string;
}