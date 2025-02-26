import { useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { Lock, PlayCircle } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast"
import { useStudent } from "@/contexts/StudentContext"
import { fetchStudentViewCourseDetailsRequest } from "@/services"
import { LectureType } from "@/types"
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { RazorpayButton } from "@/components/payment/razorpay-button";

export default function CourseDetailsPage() {
    const params = useParams();
    const { toast } = useToast();
    const location = useLocation();

    const {
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useStudent();

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState('');
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

    async function fetchStudentViewCourseDetails() {
        // const checkCoursePurchaseInfoResponse =
        //   await checkCoursePurchaseInfoService(
        //     currentCourseDetailsId,
        //     auth?.user._id
        //   );
    
        // if (
        //   checkCoursePurchaseInfoResponse?.success &&
        //   checkCoursePurchaseInfoResponse?.data
        // ) {
        //   navigate(`/course-progress/${currentCourseDetailsId}`);
        //   return;
        // }

        try {
            setLoadingState(true);
            const data = await fetchStudentViewCourseDetailsRequest(currentCourseDetailsId);
            console.log(data);
            setStudentViewCourseDetails(data?.course);
            setLoadingState(false);
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive"
            })
            setLoadingState(false);
        }
    }

    function handleSetFreePreview(getCurrentVideoInfo: LectureType) {
        setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
    }

    useEffect(() => {
        if(params?.courseId) setCurrentCourseDetailsId(params.courseId);

        return () => {
            setStudentViewCourseDetails(null);
            setCurrentCourseDetailsId(null);
            // setCoursePurchaseId(null);
        }
    }, [params?.courseId]);

    useEffect(() => {
        if (currentCourseDetailsId) fetchStudentViewCourseDetails();
    }, [currentCourseDetailsId]);

    useEffect(() => {
        if (displayCurrentVideoFreePreview) setShowFreePreviewDialog(true);
    }, [displayCurrentVideoFreePreview]);

    if (loadingState) return <LoadingSkeleton />;

    const getIndexOfFreePreviewUrl = studentViewCourseDetails?.lectures?.findIndex((item) => item.preview) ?? -1;

    return (
        <div className=" mx-auto p-4">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">
                    {studentViewCourseDetails?.title}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span>Created By {studentViewCourseDetails?.Instructor?.name}</span>
                    <span>Created On {studentViewCourseDetails?.createdAt?.split('T')[0]}</span>
                    <span>
                    {studentViewCourseDetails?.enrollments?.length}{" "}
                    {studentViewCourseDetails?.enrollments.length! <= 1
                        ? "Student Enrolled"
                        : "Students Enrolled"}
                    </span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Description</CardTitle>
                        </CardHeader>
                        <CardContent>{studentViewCourseDetails?.description}</CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Course Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {studentViewCourseDetails?.lectures?.map((lecture) => (
                                <li
                                    key={lecture.id}
                                    className={`${ lecture?.preview ? "cursor-pointer" : "cursor-not-allowed" } flex items-center mb-4`}
                                    onClick={
                                        lecture?.preview
                                        ? () => handleSetFreePreview(lecture)
                                        : undefined
                                    }
                                >
                                    {lecture?.preview ? (
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Lock className="mr-2 h-4 w-4" />
                                    )}
                                    <span>{lecture?.title}</span>
                                </li>
                            )
                            )}
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                <VideoPlayer
                                    url={
                                    getIndexOfFreePreviewUrl !== -1
                                        ? studentViewCourseDetails?.lectures[
                                            getIndexOfFreePreviewUrl
                                        ].videoUrl
                                        : ""
                                    }
                                    width="450px"
                                    height="200px"
                                />
                            </div>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">
                                    ${studentViewCourseDetails?.price}
                                </span>
                            </div>
                            <RazorpayButton
                                courseId={currentCourseDetailsId}
                                onSuccess={() => {
                                    toast({
                                        title: "Success",
                                        description: "Course purchased successfully",
                                        variant: "success"
                                    })
                                    // location.reload();
                                }}
                                onError={(error) => {
                                    toast({
                                        title: "Error",
                                        description: error.message,
                                        variant: "destructive"
                                    })
                                }}
                            />
                        </CardContent>
                    </Card>
                </aside>
            </div>
            <Dialog
                open={showFreePreviewDialog}
                onOpenChange={() => {
                    setShowFreePreviewDialog(false);
                    setDisplayCurrentVideoFreePreview('');
                }}
            >
                <DialogContent className="w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video rounded-lg flex items-center justify-center">
                        <VideoPlayer
                            url={displayCurrentVideoFreePreview}
                            width="450px"
                            height="200px"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                    {studentViewCourseDetails?.lectures
                        ?.filter((item) => item.preview)
                        .map((filteredItem) => (
                        <p
                            onClick={() => handleSetFreePreview(filteredItem)}
                            className="cursor-pointer text-[16px] font-medium"
                        >
                            {filteredItem?.title}
                        </p>
                        ))}
                    </div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}