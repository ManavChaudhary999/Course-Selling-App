import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";

import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/VideoPlayer";
import { CourseProgressSkeleton } from "@/components/LoadingSkeleton";

import { useToast } from "@/hooks/use-toast";
import {
    getCurrentCourseProgressRequest,
    markCourseAsCompletedRequest,
    markLectureAsViewedRequest,
    resetCourseProgressRequest,
} from "@/services";
import { useStudent } from "@/contexts/StudentContext";
import { LectureType } from "@/types";
import MarkdownViewer from "@/components/MarkdownViewer";

interface CurrentLecture extends LectureType {
    progressValue?: number;
}

export default function CourseProgressPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState<CurrentLecture | null>(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    const { loadingState, setLoadingState, studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useStudent();

    async function fetchCurrentCourseProgress() {
        try {
            setLoadingState(true);
            const data = await getCurrentCourseProgressRequest(courseId!!);
            setLoadingState(false);
                
            if (!data?.isEnrolled) {
                setLockCourse(true);
                return;
            }
            
            setStudentCurrentCourseProgress({
                courseDetails: data?.course,
                courseProgress: data?.courseProgress,
            });

            setCurrentLecture(data?.course?.lectures[0]);

            if (data?.courseProgress?.completed) {
                setShowCourseCompleteDialog(true);
                setShowConfetti(true);

                return;
            }

            if (data?.courseProgress?.lectureProgress?.[0].viewed === false) {
                setCurrentLecture(data?.course?.lectures[0]);
            }
            else {
                const lastIndexOfViewedAsTrue = data?.courseProgress?.lectureProgress?.reduceRight(
                    (acc: number, obj: { viewed: boolean }, index: number) => {
                    return acc === -1 && obj.viewed ? index : acc;
                    },
                    -1
                );

                setCurrentLecture(data?.course?.lectures[lastIndexOfViewedAsTrue + 1]);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive"
            })
            setLoadingState(false);
        }
    }

    async function updateLectureProgress() {
        try {
            if (!currentLecture || !studentCurrentCourseProgress?.courseProgress) {
                return;
            }
            // Updating Lecture Progress in DB
            await markLectureAsViewedRequest(studentCurrentCourseProgress.courseProgress.id, currentLecture.id);

            const nextData = {...studentCurrentCourseProgress};
            
            if (!nextData.courseProgress?.lectureProgress) {
                return;
            }

            // Updating Lecture Progress in State
            const idx = nextData.courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === currentLecture.id);
            nextData.courseProgress.lectureProgress[idx].viewed = true;

            const isEveryLectureViewed = nextData.courseProgress.lectureProgress.every((lecture) => lecture.viewed === true);

            if(isEveryLectureViewed) {
                await markCourseAsCompletedRequest(studentCurrentCourseProgress.courseDetails.id);
                nextData.courseProgress.completed = true;
                setShowCourseCompleteDialog(true);
                setShowConfetti(true);
            } else {
                const nextLectureIdx = idx >= nextData.courseDetails.lectures.length - 1 ? 0 : idx + 1;
                setCurrentLecture(nextData.courseDetails.lectures[nextLectureIdx] as CurrentLecture);
            }

            setStudentCurrentCourseProgress(nextData);
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive"
            })
        }
    }

    async function handleRewatchCourse() {
        try {
            await resetCourseProgressRequest(studentCurrentCourseProgress?.courseDetails?.id!!);
    
            setCurrentLecture(null);
            setShowConfetti(false);
            setShowCourseCompleteDialog(false);
            fetchCurrentCourseProgress();
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        if(courseId) fetchCurrentCourseProgress();
    }, [courseId]);

      useEffect(() => {
        if (currentLecture?.progressValue === 1) updateLectureProgress();
      }, [currentLecture]);

    useEffect(() => {
        if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
    }, [showConfetti]);


    if (loadingState) return <CourseProgressSkeleton />;

    return (
        <div className="relative flex flex-col h-full w-full bg-background text-foreground">
            {showConfetti && <Confetti />}
            <header className={`flex items-center justify-between p-4 bg-card border-b ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}>
                <div className="flex items-center space-x-4">
                    <Button
                        onClick={() => navigate("/courses/purchased")}
                        variant="outline"
                        size="sm"
                        className="-ml-4 hover:bg-accent"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Courses Page
                    </Button>
                </div>
                <h1 className="text-xl font-semibold hidden md:block">
                    {studentCurrentCourseProgress?.courseDetails?.title}
                </h1>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsSideBarOpen(!isSideBarOpen)}
                >
                    {isSideBarOpen ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </Button>
            </header>

            <main className="flex flex-1 overflow-hidden">
                <div className={`flex-1 flex flex-col ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}>
                    <div className="relative aspect-video">
                        <VideoPlayer
                            width="100%"
                            height="100%"
                            url={currentLecture?.videoUrl}
                            progressData={currentLecture}
                            onProgressUpdate={setCurrentLecture}
                        />
                    </div>
                    <div className="p-6 bg-card flex-1">
                        <h2 className="text-2xl font-bold mb-4">{currentLecture?.title}</h2>
                        <p className="text-muted-foreground">
                            {currentLecture?.description}
                        </p>
                    </div>
                </div>

                <aside className={`fixed right-0 top-[64px] bottom-0 w-[400px] bg-card border-l border-t shadow-lg transition-all duration-300 ${
                    isSideBarOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="w-full grid grid-cols-2 p-2 h-14 bg-background">
                            <TabsTrigger value="content">Course Content</TabsTrigger>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-15rem)]">
                                <div className="p-4 space-y-2">
                                    {studentCurrentCourseProgress?.courseDetails?.lectures.map((lecture) => (
                                        <button
                                            key={lecture.id}
                                            onClick={() => setCurrentLecture(lecture)}
                                            className={`w-full flex items-center p-3 rounded-lg hover:bg-accent transition-colors ${
                                                currentLecture?.id === lecture.id ? 'bg-accent' : ''
                                            }`}
                                        >
                                            {studentCurrentCourseProgress?.courseProgress?.lectureProgress?.find(
                                                (progressItem) => progressItem.lectureId === lecture.id
                                            )?.viewed ? (
                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <Play className="h-4 w-4 flex-shrink-0" />
                                            )}
                                            <span className="ml-3 text-sm font-medium text-left">
                                                {lecture?.title}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="overview" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-15rem)]">
                                <div className="p-6">
                                    <h2 className="text-xl font-bold mb-4">About this course</h2>
                                    <ScrollArea className="h-full rounded-md pr-2">
                                        <MarkdownViewer content={studentCurrentCourseProgress?.courseDetails?.description!!} />
                                        <ScrollBar orientation="vertical" />
                                    </ScrollArea>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </aside>
            </main>

            <Dialog open={lockCourse}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Course Access Restricted</DialogTitle>
                        <DialogDescription>
                            Please purchase this course to access its content.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <Button onClick={() => navigate(-1)}>Go Back</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showCourseCompleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>🎉 Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-4 pt-4">
                            <p>You have successfully completed this course!</p>
                            <div className="flex gap-3">
                                <Button onClick={() => navigate("/courses/purchased")} variant="outline">
                                    My Courses
                                </Button>
                                <Button onClick={handleRewatchCourse}>
                                    Rewatch Course
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}