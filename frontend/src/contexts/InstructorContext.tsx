import {courseCurriculumInitialFormData,courseLandingInitialFormData} from "@/config";
import { createContext, useState, useContext, ReactNode } from "react";
import { Course } from "@/types";
import { CreateCourseFormData } from "@/types/course-form";

interface InstructorContextType {
  courses: Course[];
  loading: boolean;
  currentEditedCourseId: number | null;
  setCurrentEditedCourseId: any;
  courseLandingFormData: any;
  courseCurriculumFormData: any;
  setCourseLandingFormData: any;
  setCourseCurriculumFormData: any;
  mediaUploadProgress: boolean;
  setMediaUploadProgress: any;
  mediaUploadProgressPercentage: number;
  setMediaUploadProgressPercentage: any;
}

export const InstructorContext = createContext<InstructorContextType>({
    courses: [],
    loading: false,
    currentEditedCourseId: null,
    courseCurriculumFormData: courseCurriculumInitialFormData,
    courseLandingFormData: courseLandingInitialFormData,
    mediaUploadProgress: false,
    mediaUploadProgressPercentage: 0,
    setCurrentEditedCourseId: () => {},
    setCourseCurriculumFormData: () => {},
    setCourseLandingFormData: () => {},
    setMediaUploadProgress: () => {},
    setMediaUploadProgressPercentage: () => {},
});

export const useInstructor = () => useContext(InstructorContext);

interface InstructorProviderProps {
  children: ReactNode;
}

export function InstructorProvider({ children } : InstructorProviderProps) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [courses, setCourses] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);


  const value = {
      courses,
      currentEditedCourseId,
      loading,
      courseLandingFormData,
      courseCurriculumFormData,
      mediaUploadProgress,
      mediaUploadProgressPercentage,
      setCourseLandingFormData,
      setCourseCurriculumFormData,
      setCurrentEditedCourseId,
      setMediaUploadProgress,
      setMediaUploadProgressPercentage,
  };

  return (
      <InstructorContext.Provider value={value}>
          {children}
      </InstructorContext.Provider>
  );
}