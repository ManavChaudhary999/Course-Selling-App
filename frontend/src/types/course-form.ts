export interface CreateCourseFormData {
    title: string,
    description?: string,
    price?: number,
    image: File,
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    category: string,
    instructorId: string,
    lectures?: LectureFormData[]
}

export interface UpdateCourseFormData {
    title?: string,
    description?: string,
    price?: number,
    imageUrl?: string,
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    categoryId?: string,
    isPublished?: boolean,
}

export interface LectureFormData {
    title: string,
    description?: string,
    video: File,
    preview: boolean
}