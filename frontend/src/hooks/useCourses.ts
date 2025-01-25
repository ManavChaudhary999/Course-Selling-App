import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
import { InstructorCourseType, Enrollment } from '@/types';

export const useCourses = (userId?: number) => {
  const [courses, setCourses] = useState<InstructorCourseType[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCourses();
    if (userId) {
      fetchEnrolledCourses(userId);
    }
  }, [userId]);

  const fetchCourses = async () => {
    // try {
    //   const { data, error } = await supabase
    //     .from('courses')
    //     .select('*')
    //     .order('rating', { ascending: false });

    //   if (error) throw error;
    //   setCourses(data || []);
    // } catch (err) {
    //   setError((err as Error).message);
    // } finally {
    //   setLoading(false);
    // }
  };

  const fetchEnrolledCourses = async (userId: number) => {
    // try {
    //   const { data, error } = await supabase
    //     .from('enrollments')
    //     .select('*, courses(*)')
    //     .eq('user_id', userId);

    //   if (error) throw error;
    //   setEnrolledCourses(data || []);
    // } catch (err) {
    //   setError((err as Error).message);
    // }
  };

  return { courses, enrolledCourses, loading, error };
};