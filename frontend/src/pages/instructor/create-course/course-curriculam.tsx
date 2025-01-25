import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/VideoPlayer";
import { courseCurriculumInitialFormData } from "@/config";
import { useInstructor } from "@/contexts/InstructorContext";
import { useToast } from "@/hooks/use-toast";
import { deleteLectureRequest } from "@/services";

function CourseCurriculum({courseId}: {courseId: string}) {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
  } = useInstructor();

  const { toast } = useToast();

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event: React.ChangeEvent<HTMLInputElement>, currentIndex: number) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleCourseDescriptionChange(event: React.ChangeEvent<HTMLInputElement>, currentIndex: number) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      description: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue: boolean, currentIndex: number) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      preview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event: React.ChangeEvent<HTMLInputElement>, currentIndex: number) {
    const selectedFile = event.target.files?.[0] || null;

    if (selectedFile) {
      // Creating a Preview Url
      const videoUrl = URL.createObjectURL(selectedFile);
      const cpyCourseCurriculumFormData = [...courseCurriculumFormData];

      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl,
        video: selectedFile,
      }

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  // async function handleReplaceVideo(currentIndex: number) {
  //   let cpyCourseCurriculumFormData = [...courseCurriculumFormData];

  //   const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex].publicId;

  //   // const deleteCurrentMediaResponse = await mediaDeleteService(
  //   //   getCurrentVideoPublicId
  //   // );
    
  //   cpyCourseCurriculumFormData[currentIndex] = {
  //     ...cpyCourseCurriculumFormData[currentIndex],
  //     videoUrl: "",
  //     video: null,
  //   };

  //   setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  // }
  
  async function handleDeleteLecture(currentIndex: number) {
    try {
      let cpyCourseCurriculumFormData = [...courseCurriculumFormData];

      if(cpyCourseCurriculumFormData[currentIndex].id) {
        await deleteLectureRequest(courseId, cpyCourseCurriculumFormData[currentIndex].id);
      }

      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );
  
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    } catch (err) {
      toast({
        title: 'Could Not Delete Course',
        description: (err as Error).message,
        variant: "destructive"
      })
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item: any) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid()}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem: any, index: any) => (
            <div className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Label htmlFor={`title-${index + 1}`}>
                  Title
                </Label>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={curriculumItem?.title}
                />
                <Label htmlFor={`description-${index + 1}`}>
                  Description
                </Label>
                <Input
                  name={`description-${index + 1}`}
                  placeholder="Enter lecture Description"
                  className="max-w-96"
                  onChange={(event) => handleCourseDescriptionChange(event, index)}
                  value={courseCurriculumFormData[index]?.description}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.preview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      width="450px"
                      height="200px"
                      url={courseCurriculumFormData[index]?.videoUrl}
                    />
                    {/* <Button
                      onClick={() => handleReplaceVideo(index)}
                    >
                      Replace Video
                    </Button> */}
                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      className="bg-red-900"
                    >
                      Delete Lecture
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;