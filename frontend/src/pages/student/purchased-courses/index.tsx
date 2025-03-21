import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CoursesPurchasedSkeleton } from "@/components/LoadingSkeleton";
import { useToast } from "@/hooks/use-toast";

import { useStudent } from "@/contexts/StudentContext";
import { fetchStudentBoughtCoursesRequest } from "@/services";


export default function PurchasedCourses() {
    const navigate = useNavigate();
    const { toast } = useToast();

    const { loadingState, setLoadingState, studentBoughtCoursesList, setStudentBoughtCoursesList } = useStudent();

    async function fetchStudentBoughtCourses() {
        try {
            setLoadingState(true);
            const data = await fetchStudentBoughtCoursesRequest();
            setStudentBoughtCoursesList(data?.courses);
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

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = '/placeholder.svg';
    };

    useEffect(() => {
        fetchStudentBoughtCourses();
    }, []);

    if (loadingState) return <CoursesPurchasedSkeleton />;

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-8">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
                studentBoughtCoursesList.map((course) => (
                    <Card key={course.id} className="flex flex-col">
                    <CardContent className="p-4 flex-grow">
                        <img
                            src={course?.imageUrl}
                            alt={course?.title}
                            className="h-52 w-full object-cover rounded-md mb-4"
                            onError={handleImageError}
                        />
                        <h3 className="font-bold mb-1">{course?.title}</h3>
                        <p className="text-sm text-gray-700 mb-2">
                        {course?.Instructor?.name}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button
                        onClick={() =>
                            navigate(`/course/progress/${course?.id}`)
                        }
                        className="flex-1"
                        >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        Start Watching
                        </Button>
                    </CardFooter>
                    </Card>
                ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Purchased Yet</h2>
                        <p className="text-gray-600 text-center mb-6 max-w-md">
                            Explore our course catalog and start your learning journey today!
                        </p>
                        <Button 
                            onClick={() => navigate('/courses')}
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            Browse Courses
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}