// import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseCurriculum from "./course-curriculam";
import CourseLanding from "./course-landing";
import CourseThumbnail from "./course-thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstructor } from "@/contexts/InstructorContext";
import { useAuth } from "@/contexts/AuthContext";
import { addLectureRequest, addNewCourseRequest } from "@/services";
import { useToast } from "@/hooks/use-toast";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { CreateCourseFormData } from "@/types/course-form";

function CreateCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    // currentEditedCourseId,
    setCurrentEditedCourseId,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructor();
  const { user } = useAuth();

  const navigate = useNavigate();
  // const params = useParams();
  const {toast} = useToast();

  function isEmpty(value: number | string | null | undefined) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    // let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.video)
      ) {
        return false;
      }

      // if (item.freePreview) {
      //   hasFreePreview = true; //found at least one free preview
      // }
    }

    // return hasFreePreview;

    return true;
  }

  async function handleCreateCourse() {
    const courseFinalFormData: CreateCourseFormData = {
      ...courseLandingFormData,
      instructorId: user?.id,
      lectures: courseCurriculumFormData,
    };

    // const response =
    //   currentEditedCourseId !== null
    //     ? await updateCourseByIdService(
    //         currentEditedCourseId,
    //         courseFinalFormData
    //       )
    //     : await addNewCourseService(courseFinalFormData);

    try {      
      toast({
        title: `Creating Course...)`,
        description: 'Please wait while we create your course.',
        variant: "default"
      })
        
      const courseData = await addNewCourseRequest(courseFinalFormData, setMediaUploadProgressPercentage);
            
      for(let i = 0; i < courseCurriculumFormData.length; i++){
        
        toast({
          title: `Uploading Lecture${i + 1}`,
          description: 'Please wait while we upload your lecture.',
          variant: "default"
        })
  
        await addLectureRequest(courseData?.course?.id, courseCurriculumFormData[i], setMediaUploadProgressPercentage);
  
        toast({
          title: `Lecture${i + 1} Uploaded Successfully`,
          variant: "success"
        })
      }

      toast({
        title: 'Course Created Successfully',
        variant: "success"
      })

      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCurrentEditedCourseId(null);
      navigate(-1);
    } catch (err) {
      toast({
        title: 'Could Not Create Course',
        description: (err as Error).message,
        variant: "destructive"
      })
    }
  }

//   async function fetchCurrentCourseDetails() {
//     const response = await fetchInstructorCourseDetailsService(
//       currentEditedCourseId
//     );

//     if (response?.success) {
//       const setCourseFormData = Object.keys(
//         courseLandingInitialFormData
//       ).reduce((acc, key) => {
//         acc[key] = response?.data[key] || courseLandingInitialFormData[key];

//         return acc;
//       }, {});

//       console.log(setCourseFormData, response?.data, "setCourseFormData");
//       setCourseLandingFormData(setCourseFormData);
//       setCourseCurriculumFormData(response?.data?.curriculum);
//     }

//     console.log(response, "response");
//   }

//   useEffect(() => {
//     if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
//   }, [currentEditedCourseId]);

//   useEffect(() => {
//     if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
//   }, [params?.courseId]);

//   console.log(params, currentEditedCourseId, "params");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="course-landing-page" className="space-y-4">
              <TabsList>
                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="thumbnail">Course Thumbnail</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              </TabsList>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="thumbnail">
                <CourseThumbnail />
              </TabsContent>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCoursePage;