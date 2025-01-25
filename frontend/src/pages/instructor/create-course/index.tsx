import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseCurriculum from "./course-curriculam";
import CourseLanding from "./course-landing";
import CourseThumbnail from "./course-thumbnail";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstructor } from "@/contexts/InstructorContext";
import { useAuth } from "@/contexts/AuthContext";
import { addLectureRequest, addNewCourseRequest, fetchInstructorCourseDetailsRequest } from "@/services";
import { useToast } from "@/hooks/use-toast";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { CreateCourseFormData } from "@/types/course-form";
import { Skeleton } from "@/components/ui/skeleton";
import MediaProgressbar from "@/components/MediaProgressBar";

function CreateCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
    loading,
    setLoading,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructor();
  const { user } = useAuth();

  const navigate = useNavigate();
  const params = useParams();
  const {toast} = useToast();

  function isEmpty(value: number | string | null | undefined) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === undefined;
  }

  function validateFormData() {
    console.log("Validating form data...");
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }
    
    // let hasFreePreview = false;
    console.log("Validating form data begin...");
    
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl)
        // isEmpty(item.video)
      ) {
        return false;
      }
      
      // if (item.freePreview) {
        //   hasFreePreview = true; //found at least one free preview
        // }
      }
      
      // return hasFreePreview;
      console.log("Validating form data end");

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

      setMediaUploadProgress(true);

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
      setMediaUploadProgress(false);
      navigate(-1);
    } catch (err) {
      toast({
        title: 'Could Not Create Course',
        description: (err as Error).message,
        variant: "destructive"
      })
      setMediaUploadProgress(false);
    }
  }

  async function fetchCurrentCourseDetails() {
    try {
      setLoading(true);

      const data = await fetchInstructorCourseDetailsRequest(currentEditedCourseId);
  
      if (data?.course) {
        const setCourseFormData = Object.keys(
          courseLandingInitialFormData
        ).reduce((acc, key) => {
          // @ts-ignore
          acc[key] = data?.course[key] || courseLandingInitialFormData[key];
  
          return acc;
        }, {});
  
        console.log(data?.course);
        setCourseLandingFormData(setCourseFormData);
        setCourseCurriculumFormData(data?.course?.lectures);
        setLoading(false);
      }  
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null && currentEditedCourseId === params?.courseId) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">{currentEditedCourseId !== null ? "Edit Course" : "Create New Course"}</h1>
        <Button
          disabled={!validateFormData() || mediaUploadProgress}
          className="text-sm tracking-wider font-bold px-8"
          onClick={handleCreateCourse}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        {mediaUploadProgress && (
          <div className="container mx-auto p-4">
            <MediaProgressbar isMediaUploading={mediaUploadProgress} progress={mediaUploadProgressPercentage} />
          </div>
        )}
        {!mediaUploadProgress && (
          <CardContent>
            <div className="container mx-auto p-4">
              <Tabs defaultValue="course-landing-page" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                  <TabsTrigger value="thumbnail">Course Thumbnail</TabsTrigger>
                  <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                </TabsList>
                {
                  loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <>
                      <TabsContent value="course-landing-page">
                        <CourseLanding />
                      </TabsContent>
                      <TabsContent value="thumbnail">
                        <CourseThumbnail />
                      </TabsContent>
                      <TabsContent value="curriculum">
                        <CourseCurriculum courseId={currentEditedCourseId} />
                      </TabsContent>
                    </>
                  )
                }
              </Tabs>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default CreateCoursePage;