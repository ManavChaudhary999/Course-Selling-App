import { StudentCourseDetailsType, StudentCourseListType } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

interface StudentContextType {
    studentViewCoursesList: StudentCourseListType[];
    setStudentViewCoursesList: any;
    loadingState: boolean;
    setLoadingState: any;
    studentViewCourseDetails: StudentCourseDetailsType | null;
    setStudentViewCourseDetails: any;
    currentCourseDetailsId: string;
    setCurrentCourseDetailsId: any;
    studentBoughtCoursesList: StudentCourseListType[];
    setStudentBoughtCoursesList: any;
    studentCurrentCourseProgress: any;
    setStudentCurrentCourseProgress: any;
}

export const StudentContext = createContext<StudentContextType>({
    studentViewCoursesList: [],
    setStudentViewCoursesList: () => {},
    loadingState: false,
    setLoadingState: () => {},
    studentViewCourseDetails: null,
    setStudentViewCourseDetails: () => {},
    currentCourseDetailsId: "",
    setCurrentCourseDetailsId: () => {},
    studentBoughtCoursesList: [],
    setStudentBoughtCoursesList: () => {},
    studentCurrentCourseProgress: {},
    setStudentCurrentCourseProgress: () => {},
});

export const useStudent = () => useContext(StudentContext);

interface StudentProviderProps {
  children: ReactNode;
}
export function StudentProvider({ children }: StudentProviderProps) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState('');
  const [studentBoughtCoursesList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({});

  const value = {
      studentViewCoursesList,
      setStudentViewCoursesList,
      loadingState,
      setLoadingState,
      studentViewCourseDetails,
      setStudentViewCourseDetails,
      currentCourseDetailsId,
      setCurrentCourseDetailsId,
      studentBoughtCoursesList,
      setStudentBoughtCoursesList,
      studentCurrentCourseProgress,
      setStudentCurrentCourseProgress,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
}