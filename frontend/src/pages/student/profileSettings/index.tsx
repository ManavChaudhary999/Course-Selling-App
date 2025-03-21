"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil } from "lucide-react";
import { ProfileUpdateRequest } from "@/services";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  name: z.string().min(3, {
    message: "First name must be at least 3 characters.",
  }),
  newPassword: z.string(),
  oldPassword: z.string(),
  profileImage: z.instanceof(File).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();

  const [profileUrl, setProfileUrl] = useState(user?.profileUrl);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name,
      newPassword: '',
      oldPassword: '',
      profileImage: undefined,
    },
  });

  function validateFormData() {
    if(form.getValues('name') !== user?.name) return true;

    if(form.getValues('newPassword').length > 0) return true;
    
    if(form.getValues('profileImage')) return true;

    return false;
  }

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);

      if(!validateFormData()) {
        toast({
          title: "No changes detected",
          variant: "default"
        });
      } else {
        await ProfileUpdateRequest(data, (progress) => {
          setUploadProgress(progress);
        });
  
        setIsEditing(false);
        form.reset();
        await refreshUser();
        toast({
          title: "Profile updated successfully",
          variant: "success"
        });
      }

    } catch (error: any) {
      toast({
        title: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Personal information</h1>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field: { value } }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          onChange={(e) => form.setValue('name', e.target.value)}
                          value={value}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="font-bold">Email</Label>
              <Input 
                value={user?.email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Password Fields */}
            {!isEditing ? (
              <div className="space-y-2">
                <Label className="font-bold">Password</Label>
                <Input
                  type="password"
                  defaultValue={'12345678'}
                  disabled
                  className="cursor-not-allowed"
                  />
              </div>
            ) : (
              <div className="space-y-4">
                <Label className="font-bold">Change Password</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Old Password</Label>
                    <Input
                      className="mt-2"  
                      type="password"
                      placeholder="Current Password"
                      autoComplete="new-password"
                      {...form.register('oldPassword')}
                    />
                  </div>
                  <div>
                    <Label>New Password</Label>
                    <Input
                      className="mt-2"  
                      type="password"
                      placeholder="New Password"
                      autoComplete="new-password"
                      {...form.register('newPassword')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Profile Image */}
            <div className="space-y-4">
              <Label className="font-bold">Profile Picture</Label>
              <div className="flex items-center gap-4">
                <Avatar className={`h-${profileUrl ? '40' : '10'} w-${profileUrl ? '40' : '10'}`}>
                  <AvatarImage src={profileUrl} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                </Avatar>
                { isEditing && (
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setValue('profileImage', file);
                          // Create preview URL for immediate feedback
                          const previewUrl = URL.createObjectURL(file);
                          setProfileUrl(previewUrl);
                        }
                      }}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Uploading: {uploadProgress}%
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileUrl(user?.profileUrl);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}