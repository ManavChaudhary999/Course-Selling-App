import { useState, createContext, useContext, useEffect } from "react";
import { AxiosError } from "axios";
import API from "@/api/axios";
import {InstructorCourseType} from '../types';

interface UploadCourseReturnType {
    course: InstructorCourseType;
    message: string;
}

interface CoursesContextType {
    courses: InstructorCourseType[] | null;
    loading: boolean;
    getCourses: () => Promise<void>;
    getCourseById: (id: number) => Promise<InstructorCourseType>;
    uploadCourse: (data: FormData) => Promise<UploadCourseReturnType>;
}

const CoursesContext = createContext<CoursesContextType>({
    courses: null,
    loading: false,
    getCourses: () => Promise.resolve(),
    getCourseById: () => Promise.resolve({} as InstructorCourseType),
    uploadCourse: () => Promise.resolve({} as UploadCourseReturnType)
});

export const useCourses = () => useContext(CoursesContext);

export const CoursesProvider = ({children} : {children: React.ReactNode}) => {
    
    const [courses, setCourses] = useState<InstructorCourseType[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchCourses = async () => {
            await getCourses();
        }

        fetchCourses();
    }, [])


    const getCourses = async () => {
        try {
            setLoading(true);
            const response = await API.get('/course/preview');
            setCourses(response.data);
        } catch (error) {
            const errData = (error as AxiosError).response?.data as { message: string };
            console.error('Error logging in:', errData);
            setLoading(false);
            throw errData || {message: 'No Courses Found'};
        }
        setLoading(false);
    }

    const getCourseById = async (id: number) => {
        try {
            const response = await API.get(`/course/preview/${id}`);
            return response.data;
        } catch (error) {
            const errData = (error as AxiosError).response?.data as { message: string };
            console.error('Error logging in:', errData);
            setLoading(false);
            throw errData || {message: 'Cannot get course'};
        }
    }

    const uploadCourse = async (data: FormData) => {
        try {
            setLoading(true);
            const response = await API.post('/admin/course', data);
            setLoading(false);
            return response.data;
        } catch (error) {
            const errData = (error as AxiosError).response?.data as { message: string };
            console.error('Error logging in:', errData);
            setLoading(false);
            throw errData || {message: 'Cannot Upload course'};
        }
    }

    const value = {
        courses,
        loading,
        getCourses,
        getCourseById,
        uploadCourse
    };

    return (
        <CoursesContext.Provider value={value}>
            {children}
        </CoursesContext.Provider>
    );
}