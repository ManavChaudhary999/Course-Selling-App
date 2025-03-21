import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { IndianRupee, Lock, PlayCircle } from "lucide-react";
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
import { checkCoursePurchaseStatusRequest, fetchStudentViewCourseDetailsRequest } from "@/services"
import { LectureType } from "@/types"
import { CourseDetailsSkeleton } from "@/components/LoadingSkeleton";
import { RazorpayButton } from "@/components/RazorpayButton";
import { useAuth } from "@/contexts/AuthContext";
import MarkdownViewer from "@/components/MarkdownViewer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function CourseDetailsPage() {
    const params = useParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    const {
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        currentCourseDetailsId,
        setCurrentCourseDetailsId,
        loadingState,
        setLoadingState,
    } = useStudent();

    const { user } = useAuth();

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState('');
    const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);

    async function fetchStudentViewCourseDetails() {
        
        try {
            if(user) {
                setLoadingState(true);
                const coursePurchaseStatus = await checkCoursePurchaseStatusRequest(currentCourseDetailsId);
                
                if (coursePurchaseStatus?.isEnrolled) {
                    setLoadingState(false);
                    navigate(`/course/progress/${currentCourseDetailsId}`);
                    return;
                }
            }
            
            setLoadingState(true);
            const data = await fetchStudentViewCourseDetailsRequest(currentCourseDetailsId);
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
        }
    }, [params?.courseId]);

    useEffect(() => {
        if (currentCourseDetailsId) fetchStudentViewCourseDetails();
    }, [currentCourseDetailsId]);

    useEffect(() => {
        if (displayCurrentVideoFreePreview) setShowFreePreviewDialog(true);
    }, [displayCurrentVideoFreePreview]);

    if (loadingState) return <CourseDetailsSkeleton />;

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
            <div className="flex flex-col-reverse md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Course Description</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ScrollArea className="h-[400px] rounded-md pr-2">
                                <MarkdownViewer content={studentViewCourseDetails?.description!!} />
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader >
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
                <aside className="w-full md:w-[30%] flex-shrink-0">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                <img
                                    src={studentViewCourseDetails?.imageUrl}
                                    className="w-full h-full object-cover rounded-md"
                                    alt={studentViewCourseDetails?.title}
                                />
                            </div>
                            <div className="flex items-center gap-1 mb-4">
                                <IndianRupee className="text-3xl mt-1 font-bold" />
                                <span className="text-3xl font-bold">
                                    {studentViewCourseDetails?.price}
                                </span>
                            </div>
                            {user ? (
                                <RazorpayButton
                                    courseId={currentCourseDetailsId}
                                    onSuccess={() => {
                                        toast({
                                            title: "Success",
                                            description: "Course purchased successfully",
                                            variant: "success"
                                        })
                                        location.reload();
                                    }}
                                    onError={(error) => {
                                        toast({
                                            title: "Error",
                                            description: error.message,
                                            variant: "destructive"
                                        })
                                    }}
                                />
                            ) : (
                                <Button 
                                    className="w-full" 
                                    onClick={() => navigate('/login')}
                                >
                                    Log in to Purchase
                                </Button>
                            )}
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