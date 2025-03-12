import API from "@/api/axios";
import { LoginFormData, ProfileFormData, RegisterFormData } from "@/types/auth-form";
import { CreateCourseFormData, LectureFormData, UpdateCourseFormData } from "@/types/course-form";
import axios, { AxiosError } from "axios";

// ---------------- Auth Requests -------------------
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

export async function ProfileUpdateRequest(formData: ProfileFormData, onProgressCallback: (progress: number) => void) {
  try {
    const { data } = await API.post('/user/profile', {
      ...formData,
      profileImage: {
        name: formData?.profileImage?.name,
        size: formData?.profileImage?.size,
        type: formData?.profileImage?.type
      }
    });

    if(data?.presignedUrl) {
      await axios.put(data.presignedUrl, formData.profileImage, {
        headers: {
          "Content-Type": formData?.profileImage?.type
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          onProgressCallback(percentCompleted);
        }
      });
    }

    
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error fetching profile:', errData);
    throw errData || {message: 'Profile Update failed'};
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

export async function fetchStudentViewCourseListRequest(query: string) {
  try {
    const { data } = await API.get(`/course/preview/search?${query}`);
  
    return data;
  }
  catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error Fetching Courses:', errData);
    throw errData || {message: 'Cannot Fetch Courses'};
  }
}

export async function fetchStudentViewCourseDetailsRequest(courseId: string) {
  try {
    const { data } = await API.get(`/course/preview/${courseId}`);
  
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error Getting Course Details:', errData);
    throw errData || {message: 'Cannot Get Course Details'};
  }
}

// ---------------- Payment Requests -------------------

export async function createCheckoutSessionRequest(courseId: string) {
  try {
    const { data } = await API.post(`/purchase/checkout`, {
      courseId
    });

    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error creating checkout session:', errData);
    throw errData || {message: 'Cannot create checkout session'};
  }
}

export async function verifyPaymentRequest(paymentDetails: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  try {
    const { data } = await API.post(`/purchase/verify`, paymentDetails);
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error verifying payment:', errData);
    throw errData || {message: 'Payment verification failed'};
  }
}

export async function fetchStudentBoughtCoursesRequest() {
  try {
    const { data } = await API.get('/purchase/courses');
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error verifying payment:', errData);
    throw errData || {message: 'Payment verification failed'};
  }
}

export async function checkCoursePurchaseStatusRequest(courseId: string) {
  try {
    const { data } = await API.get(`/purchase/courses/${courseId}`);
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error verifying payment:', errData);
  }
}

// ---------------- Course Progress Requests -------------------

export async function getCurrentCourseProgressRequest(courseId: string) {
  try {
    const { data } = await API.get(`/progress/${courseId}`);
  
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error Fetching Course Progress:', errData);
    throw errData || {message: 'Cannot Fetch Course Progress'};
  }
}

export async function markCourseAsCompletedRequest(courseId: string) {
  try {
    const { data } = await API.post(`/progress/${courseId}/complete`);
  
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error Marking Course Progress Complete:', errData);
    throw errData || {message: 'Cannot Mark Course Progress Complete'};
  }
}

export async function markLectureAsViewedRequest(courseProgressId: string, lectureId: string) {
  try {
    const { data } = await API.post(`/progress/${courseProgressId}/lecture/${lectureId}/view`);
  
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error Marking Lecture Complete:', errData);
    throw errData || {message: 'Cannot Mark Lecture Complete'};
  }
}

export async function resetCourseProgressRequest(courseId: string) {
  try {
    const { data } = await API.post(`/progress/${courseId}/incomplete`);
  
    return data;
  } catch (error) {
    const errData = (error as AxiosError).response?.data as { message: string };
    console.error('Error Reseting Course Progress:', errData);
    throw errData || {message: 'Cannot Reset Course Progress'};
  }
}