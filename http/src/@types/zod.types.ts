import z from 'zod';

export const userSchema = z.object({
    name: z.string().min(3, {message: 'Name must be at least 3 characters long'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string(),
    role: z.enum(['INSTRUCTOR', 'STUDENT'], {required_error: 'Role is required'}),
});

// export type UserType = z.infer<typeof userSchema>;

export const courseCreateSchema = z.object({
    title: z.string({message: 'Title is required'}),
    description: z.string().optional(),
    price: z.number().nonnegative({message: 'Price should be greater than or equal to 0'}).optional(),
    imageUrl: z.string().optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], {required_error: 'Level is required'}),
    categoryId: z.string(),
    instructorId: z.string(),
});

export const courseUpdateSchema = courseCreateSchema.partial({
    title: true,
    price: true,
}).extend({
    courseId: z.string(),
    isPublished: z.boolean().optional(),
})

export const lectureCreateSchema = z.object({
    title: z.string({message: 'Title is required'}),
    description: z.string().optional(),
    publicId: z.string().optional(),
    videoUrl: z.string({message: 'Video URL is required'}).optional(),
    preview: z.boolean().optional(),
    courseId: z.string(),
});

export const lectureUpdateSchema = lectureCreateSchema.partial({
    title: true,
}).extend({
    lectureId: z.string(),
})

export const coursePurchaseSchema = z.object({
    courseId: z.number(),
    userId: z.number(),
})