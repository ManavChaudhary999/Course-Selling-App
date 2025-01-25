import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstructor } from "@/contexts/InstructorContext";

function CourseThumbnail() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
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
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="flex items-center justify-center p-4">
        <img
          src={courseLandingFormData?.imageUrl}
          alt="Selected"
          className="width-full max-w-80 max-h-80 object-cover rounded-md"
        />
      </div>
      <CardContent> 
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
          </div>
      </CardContent>
    </Card>
  );
}

export default CourseThumbnail;