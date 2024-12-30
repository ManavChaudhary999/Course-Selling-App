import z from 'zod';

export const personSchema = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string(),
    name: z.string().min(3, {message: 'Name must be at least 3 characters long'}).optional(),
});

export const courseCreateSchema = z.object({
    title: z.string({message: 'Title is required'}),
    description: z.string().optional(),
    price: z.number({message: 'Price should be greater than or equal to 0'}).positive(),
    imageUrl: z.string().optional(),
    creatorId: z.number(),
});

export const courseUpdateSchema = courseCreateSchema.partial({
    title: true,
    price: true,
}).extend({
    courseId: z.number(),
})

export const coursePurchaseSchema = z.object({
    courseId: z.number(),
    userId: z.number(),
})