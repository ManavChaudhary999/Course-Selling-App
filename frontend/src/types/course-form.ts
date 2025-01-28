export interface CreateCourseFormData {
    title: string,
    description?: string,
    price?: number,
    image: File,
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    category: string,
}

export interface UpdateCourseFormData {
    title?: string,
    description?: string,
    price?: number,
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    category?: string,
    // isPublished?: boolean,
}

export interface LectureFormData {
    title: string,
    description?: string,
    video: File,
    preview: boolean
}