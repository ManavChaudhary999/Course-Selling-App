import API from "@/api/axios";
import { LoginFormData, RegisterFormData } from "@/types/auth-form";
import { CreateCourseFormData, LectureFormData, UpdateCourseFormData } from "@/types/course-form";
import axios, { AxiosError } from "axios";

// ---------------- User Requests -------------------
export async function SignupRequest(formData : RegisterFormData) {
  try {
    const { data } = await API.post('/user/signup', formData);

    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error Signing Up:', errData);
    throw errData || {message: 'Signup failed'};
  }
}

export async function LoginRequest(formData : LoginFormData) {
  try {
    const { data } = await API.post('/user/signin', formData);

    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error logging in:', error);
    throw errData || {message: 'Login failed'};
  }
}

export async function LogoutRequest() {
  try {
    const {data} = await API.post('/user/logout');

    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error logging out:', errData);
    throw errData || {message: 'Logout failed'};
  }
}

export async function ProfileRequest() {
  try {
    const { data } = await API.get('/user/profile');
    
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error fetching profile:', errData);
    throw errData || {message: 'Profile fetch failed'};
  }
}

// ---------------- Instructor Requests -------------------

export async function fetchInstructorCourseListRequest() {
  try {
    const { data } = await API.get(`/course`);
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error fetching courses:', errData);
    throw errData || {message: 'Course fetch failed'};
  }
}
  
export async function addNewCourseRequest(formData: CreateCourseFormData, onProgressCallback: (progress: number) => void) {
  try {
    const {title, description, price, image, level, category, instructorId} = formData;

    const { data: courseData } = await API.post(`/course`, {
      title,
      description,
      price: Number(price),
      level,
      category,
      instructorId
    });

    const {name, size, type} = image;

    const { data: mediaData } = await API.put(`/course/${courseData?.course?.id}`, {
      thumbnail: {
        name,
        size,
        type
      }
    });

    await axios.put(mediaData.presignedUrl, image, {
      headers: {
        "Content-Type": type
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        onProgressCallback(percentCompleted);
      }
    });
  
    return courseData;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error creating course:', errData);
    throw errData || {message: 'Course creation failed'};
  }
}
  
export async function fetchInstructorCourseDetailsRequest(id: string) {
  const { data } = await API.get(`/course/${id}`);

  return data;
}

export async function updateCourseByIdRequest(id: string, formData: UpdateCourseFormData) {
  const { data } = await API.put(`/course/${id}`, formData);

  return data;
}

export async function addLectureRequest(courseId: string, formData: LectureFormData, onProgressCallback: (progress: number) => void) {
  try {
    const {title, description, video, freePreview} = formData;
    
    const { data: lectureData } = await API.post(`/course/${courseId}/lecture`, {
      title,
      description,
      preview: freePreview
    });

    const  {name, type, size} = video;

    const { data: mediaData } = await API.put(`/course/${courseId}/lecture/${lectureData?.lecture?.id}`, {
      video: {
        name,
        type,
        size
      }
    });

    await axios.put(mediaData.presignedUrl, video, {
      headers: {
        "Content-Type": video.type
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );
        onProgressCallback(percentCompleted);
      }
    });

    return lectureData;

  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error creating Lecture:', errData);
    throw errData || {message: 'Lecture creation failed'};
  }
}

// export async function mediaUploadService(formData, onProgressCallback) {
//   const { data } = await API.post(`/course/${id}/lecture`, formData, {
//     onUploadProgress: (progressEvent) => {
//       const percentCompleted = Math.round(
//         (progressEvent.loaded * 100) / progressEvent.total
//       );
//       onProgressCallback(percentCompleted);
//     },
//   });

//   return data;
// }

// export async function mediaBulkUploadService(formData, onProgressCallback) {
//   const { id } = formData;
//   const { data } = await API.post(`/course/${id}/lecture`, formData, {
//     onUploadProgress: (progressEvent) => {
//       const percentCompleted = Math.round(
//         (progressEvent.loaded * 100) / progressEvent.total
//       );
//       onProgressCallback(percentCompleted);
//     },
//   });

//   return data;
// }

// ---------------- Student Requests -------------------


export async function fetchStudentViewCourseListRequest() {
  const { data } = await API.get(`/course/preview`);

  return data;
}

export async function fetchStudentSearchCourseListRequest(query: string) {
  const { data } = await API.get(`/course/preview/search?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsRequest(courseId: string) {
  const { data } = await API.get(`/course/preview/${courseId}`);

  return data;
}

//   export async function checkCoursePurchaseInfoService(courseId, studentId) {
//     const { data } = await axiosInstance.get(
//       `/student/course/purchase-info/${courseId}/${studentId}`
//     );

//     return data;
//   }

//   export async function createPaymentService(formData) {
//     const { data } = await axiosInstance.post(`/student/order/create`, formData);

//     return data;
//   }

//   export async function captureAndFinalizePaymentService(
//     paymentId,
//     payerId,
//     orderId
//   ) {
//     const { data } = await axiosInstance.post(`/student/order/capture`, {
//       paymentId,
//       payerId,
//       orderId,
//     });

//     return data;
//   }

//   export async function fetchStudentBoughtCoursesService(studentId) {
//     const { data } = await axiosInstance.get(
//       `/student/courses-bought/get/${studentId}`
//     );

//     return data;
//   }

export async function getCurrentCourseProgressRequest(courseId: string) {
  const { data } = await API.get(`/progress/${courseId}`);

  return data;
}

export async function markCourseAsCompletedRequest(courseId: string) {
  const { data } = await API.get(`/progress/${courseId}/complete`);

  return data;
}

export async function markLectureAsViewedRequest(courseId: string, lectureId: string) {
  const { data } = await API.get(`/progress/${courseId}/lecture/${lectureId}/view`);

  return data;
}

export async function resetCourseProgressRequest(courseId: string) {
  const { data } = await API.get(`/progress/${courseId}/incomplete`);

  return data;
}