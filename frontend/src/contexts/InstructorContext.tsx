import {courseCurriculumInitialFormData,courseLandingInitialFormData} from "@/config";
import { createContext, useState, useContext, ReactNode } from "react";
import { InstructorCourseType } from "@/types";


interface InstructorContextType {
  instructorCoursesList: InstructorCourseType[];
  setInstructorCoursesList: any;
  loading: boolean;
  setLoading: any;
  currentEditedCourseId: string;
  setCurrentEditedCourseId: any;
  courseLandingFormData: any;
  setCourseLandingFormData: any;
  courseCurriculumFormData: any;
  setCourseCurriculumFormData: any;
  mediaUploadProgress: boolean;
  setMediaUploadProgress: any;
  mediaUploadProgressPercentage: number;
  setMediaUploadProgressPercentage: any;
}

export const InstructorContext = createContext<InstructorContextType>({
    instructorCoursesList: [],
    setInstructorCoursesList: () => {},
    loading: false,
    setLoading: () => {},
    currentEditedCourseId: "",
    setCurrentEditedCourseId: () => {},
    courseCurriculumFormData: courseCurriculumInitialFormData,
    setCourseCurriculumFormData: () => {},
    courseLandingFormData: courseLandingInitialFormData,
    setCourseLandingFormData: () => {},
    mediaUploadProgress: false,
    setMediaUploadProgress: () => {},
    mediaUploadProgressPercentage: 0,
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
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState("");
  const [loading, setLoading] = useState<boolean>(false);



  const value = {
      instructorCoursesList,
      setInstructorCoursesList,
      currentEditedCourseId,
      setCurrentEditedCourseId,
      loading,
      setLoading,
      courseLandingFormData,
      setCourseLandingFormData,
      courseCurriculumFormData,
      setCourseCurriculumFormData,
      mediaUploadProgress,
      setMediaUploadProgress,
      mediaUploadProgressPercentage,
      setMediaUploadProgressPercentage,
  };

  return (
      <InstructorContext.Provider value={value}>
        {children}
      </InstructorContext.Provider>
  );
}