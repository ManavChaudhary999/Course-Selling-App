export interface ControlItemType {
  name: string;
  label: string;
  componentType: string;
  type?: string;
  placeholder: string;
  options?: any[];
}

export interface UserType {
  id: string;
  email: string;
  name: string;
  role: 'INSTRUCTOR' | 'STUDENT';
  profileUrl?: string;
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
  user: UserType;
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

export interface CourseProgressType {
  id: string;
  courseId: string;
  userId: string;
  completed: boolean;
  lectureProgress: LectureProgress[];
}

export interface LectureProgress {
  id: string;
  lectureId: string;
  updatedAt: string;
  viewed: boolean;
}