import z from 'zod';

export const personSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string().optional(),
});

export const courseCreateSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    price: z.number().positive(),
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