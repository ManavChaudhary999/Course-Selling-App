export interface CreateCourseFormData {
    title: string,
    description?: string,
    price?: number,
    image: File,
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    category: string,
}

// Add isEdited flag to track changes
export interface UpdateCourseFormData {
    title?: string,
    description?: string,
    price?: number,
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    category?: string,
}

export interface CreateLectureFormData {
    title: string,
    description?: string,
    video: File,
    preview: boolean,
    id?: string,
    publicId?: string,
    isEdited?: boolean
}

export interface UpdateLectureFormData {
    title?: string;
    description?: string;
    publicId?: string
    videoUrl?: string;
    preview?: boolean;
    isEdited: boolean
}