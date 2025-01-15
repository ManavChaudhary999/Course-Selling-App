// import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstructor } from "@/contexts/InstructorContext";
import React from "react";
// import { mediaUploadService } from "@/services";

function CourseThumbnail() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
//     mediaUploadProgress,
//     setMediaUploadProgress,
//     mediaUploadProgressPercentage,
//     setMediaUploadProgressPercentage,
  } = useInstructor();

  async function handleImageUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedImage = event.target.files?.[0] || null;

    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);

      setCourseLandingFormData({
        ...courseLandingFormData,
        image: selectedImage,
        imageUrl
      });

      // try {
      //   setMediaUploadProgress(true);
      //   const response = await mediaUploadService(
      //     imageFormData,
      //     setMediaUploadProgressPercentage
      //   );
      //   if (response.success) {
      //     setCourseLandingFormData({
      //       ...courseLandingFormData,
      //       image: response.data.url,
      //     });
      //     setMediaUploadProgress(false);
      //   }
      // } catch (e) {
      //   console.log(e);
      // }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="flex items-center justify-center p-4">
        {/* {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null} */}
        <img
          src={courseLandingFormData?.imageUrl}
          alt="Selected"
          className="width-full max-w-80 max-h-80 object-cover rounded-md"
        />
      </div>
      <CardContent> 
        {/* {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : ( */}
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
        {/* )} */}
      </CardContent>
    </Card>
  );
}

export default CourseThumbnail;