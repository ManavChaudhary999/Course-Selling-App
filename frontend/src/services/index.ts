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
  
export async function fetchInstructorCourseDetailsRequest(id: string) {
  try {
    const { data } = await API.get(`/course/${id}`);
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error fetching courses:', errData);
    throw errData || {message: 'Course fetch failed'};
  }
}

export async function addNewCourseRequest(formData: CreateCourseFormData, onProgressCallback: (progress: number) => void) {
  try {
    const {title, description, price, image, level, category} = formData;

    const { data: courseData } = await API.post(`/course`, {
      title,
      description,
      price: Number(price),
      level,
      category,
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

export async function updateCourseByIdRequest(courseId: string, formData: UpdateCourseFormData) {
  try {
    const {title, description, price, level, category} = formData;

    const { data } = await API.put(`/course/${courseId}`, {
      title,
      description,
      price: Number(price),
      level,
      category,
    });

    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as {message: string};
    console.log(errData);
    throw errData || {message: 'Course update failed'};
  }
}

export async function addLectureRequest(courseId: string, formData: LectureFormData, onProgressCallback: (progress: number) => void) {
  try {
    const {title, description, video, preview} = formData;
    
    const { data: lectureData } = await API.post(`/course/${courseId}/lecture`, {
      title,
      description,
      preview
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

export async function updateLectureRequest(courseId: string, lectureId: string, formData: LectureFormData) {
  try {
    const {title, description, preview} = formData;
    
    const { data } = await API.put(`/course/${courseId}/lecture/${lectureId}`, {
      title,
      description,
      preview
    });

    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error updating Lecture:', errData);
    throw errData || {message: 'Lecture update failed'};
  }
}

export async function deleteLectureRequest(courseId: string, lectureId: string) {
  try {
    const { data } = await API.delete(`/course/${courseId}/lecture/${lectureId}`);
  
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error deleting Lecture:', errData);
    throw errData || {message: 'Lecture deletion failed'};
  }
}

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