import { Router, Request, Response } from "express";
import db from "../db";
import {courseCreateSchema, courseUpdateSchema, lectureCreateSchema} from '../@types/zod.types';
import { AuthMiddleware } from "../middleware/auth";

const courseRouter = Router();

courseRouter.get('/preview', async (req: Request, res: Response) => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true
            },
            include: {
                Instructor: {
                    select: {
                        name: true,
                        profileUrl: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            }
        });
    
        res.json({courses});
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
});

courseRouter.get('/preview/:id', async (req: Request, res: Response) => {
    try {
        const courseId = req.params.id;
        
        const course = await db.course.findUnique({
            where: {
                id: courseId
            },
            include: {
                Instructor: {
                    select: {
                        name: true,
                        profileUrl: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
                enrollments: {
                    select: {
                        userId: true
                    }
                },
                lectures: {
                    orderBy: {
                        createdAt: "asc"
                    }
                }
            }
        });

        if(!course) {
            res.status(404).json({
                message: "Course not found"
            });
            return;
        }
    
        res.json({course});
    } catch (error) {
        res.status(500).json({
            message: "Cannot Fetch course"
        })
    }
})

courseRouter.get('/preview/search', async (req: Request, res: Response) => {
    try {
        const { query = "", categories = [], sortByPrice = "" } = req.query;
        const q: string = query as string;
        const c: string[] = categories as string[];
        
        // const whereClause = {
        //     isPublished: true,
        //     OR: [
        //         { title: { contains: q, mode: "insensitive" } },
        //         { description: { contains: q, mode: "insensitive" } },
        //         { category: { name: { contains: q, mode: "insensitive" } } },
        //     ],
        // };

        // // Add category filtering if provided
        // if (categories?.length > 0) {
        //     whereClause.category = { name: { in: c } };
        // }

        // // Define sorting order
        // const orderByClause = [];
        // if (sp === "low") {
        //     orderByClause.push({ price: "asc" }); // Sort by price in ascending order
        // } else if (sp === "high") {
        //     orderByClause.push({ price: "desc" }); // Sort by price in descending order
        // }

        // Fetch courses with Prisma
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                    { category: { name: { contains: q, mode: "insensitive", in: c } } },
                ]
            },
            orderBy: [
                {
                    price: sortByPrice === "low" ? "asc" : "desc",
                }
            ],
            include: {
                Instructor: {
                    select: {
                        name: true,
                        profileUrl: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            }
        });

        res.status(200).json({
            courses: courses || [],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while searching for courses.",
        });
    }
})

courseRouter.get('/', AuthMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!user || user.role !== 'INSTRUCTOR') {
            res.status(401).json({
                message: "User is not an instructor",
            });
            return;
        }

        const courses = await db.course.findMany({
            where: {
                instructorId: userId
            }
        });
    
        res.json({courses});
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

courseRouter.post('/', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.userId;
    
        const {  success, error, data} = courseCreateSchema.safeParse({...req.body, instructorId: userId});
    
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid Course Details"
            });
    
            return;
        }

        const {title, description, price, imageUrl, level, categoryId, instructorId} = data;

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!user || user.role !== 'INSTRUCTOR') {
            res.status(401).json({
                message: "User is not an instructor",
            });
            return;
        }
        
        const course = await db.course.create({
            data: {
                title,
                description,
                price,
                imageUrl,
                level,
                categoryId,
                instructorId,
            },
        });

        res.json({
            message: 'Course Created Succesfully',
            course,
        });
    }
    catch (err) {
        res.status(403).json({
            message: 'Course can not be created',
        })
    }
});

courseRouter.get('/:id', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.userId;
        const courseId = req.params.id;
    
        const {  success, error, data} = courseUpdateSchema.safeParse({...req.body, instructorId: userId});
    
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid Course Details"
            });
    
            return;
        }
        const {title, description, price, imageUrl, level, categoryId, instructorId} = data;

        const course = await db.course.update({
            where: {
                id: courseId,
                instructorId
            },
            data: {
                title,
                description,
                price,
                imageUrl,
                level,
                categoryId,
                instructorId,
            },
        });

        res.json({
            message: 'Course Updated Succesfully',
            course,
        });
    }
    catch (err) {
        res.status(403).json({
            message: 'Course can not be Updated',
        })
    }
});

courseRouter.put('/:id', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.userId;
        const courseId = req.params.id;
    
        const {  success, error, data} = courseUpdateSchema.safeParse({...req.body, instructorId: userId});
    
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid Course Details"
            });
    
            return;
        }
        const {title, description, price, imageUrl, level, isPublished, categoryId, instructorId} = data;
        
        const course = await db.course.update({
            where: {
                id: courseId,
                instructorId
            },
            data: {
                title,
                description,
                price,
                imageUrl,
                level,
                isPublished,
                categoryId,
                instructorId,
            },
        });

        res.json({
            message: 'Course Updated Succesfully',
            course,
        });
    }
    catch (err) {
        res.status(403).json({
            message: 'Course can not be Updated',
        })
    }
});

courseRouter.delete('/:id', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.userId;
        const courseId = req.params.id;
        
        const course = await db.course.delete({
            where: {
                id: courseId,
                instructorId: userId
            }
        });

        res.json({
            message: 'Course Deleted Succesfully',
            course,
        });
    }
    catch (err) {
        res.status(403).json({
            message: 'Course can not be Deleted',
        })
    }
})

courseRouter.get('/:id/lectures', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const courseId = req.params.id;
        
        const lectures = await db.lecture.findMany({
            where: {
                courseId
            }
        });
        
        res.json({
            message: 'Lectures Found',
            lectures,
        });
    } catch (err) {
        res.status(403).json({
            message: 'Lectures can not be found',
        })
    }
});

courseRouter.post('/:id/lectures', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.userId;
        const courseId = req.params.id;
        
        const {  success, error, data} = lectureCreateSchema.safeParse({...req.body, courseId});
    
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid Lecture Details"
            });
    
            return;
        }

        const {title, description, preview, videoUrl, publicId} = data;

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if(!user || user.role !== 'INSTRUCTOR') {
            res.status(401).json({
                message: "User is not an instructor",
            });
            return;
        }
        
        const lecture = await db.lecture.create({
            data: {
                title,
                description,
                videoUrl,
                publicId,
                preview,
                courseId
            }
        });
        
        res.json({
            message: 'Lecture Created Succesfully',
            lecture,
        });
    } catch (err) {
        res.status(403).json({
            message: 'Lecture can not be created',
        })
    }
})

courseRouter.get('/:id/lectures/:lectureId', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const courseId = req.params.id;
        const lectureId = req.params.lectureId;
        
        const lecture = await db.lecture.findUnique({
            where: {
                id: lectureId,
                courseId
            }
        });
        
        res.json({
            lecture,
        });
    } catch (err) {
        res.status(403).json({
            message: 'Lecture can not be Fetched',
        })
    }
})

courseRouter.post('/:id/lectures/:lectureId', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.userId;
        const courseId = req.params.id;
        const lectureId = req.params.lectureId;
        
        const {  success, error, data} = lectureCreateSchema.safeParse({...req.body, courseId, lectureId});
    
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid Lecture Details"
            });
    
            return;
        }

        const {title, description, preview, videoUrl, publicId} = data;
        
        const lecture = await db.lecture.update({
            where: {
                id: lectureId,
                course: {
                    id: courseId,
                    instructorId: userId
                },
            },
            data: {
                title,
                description,
                preview,
                videoUrl,
                publicId,
                courseId
            }
        });
        
        res.json({
            message: 'Lecture Updated Succesfully',
            lecture,
        });
    } catch (err) {
        res.status(403).json({
            message: 'Lecture can not be Updated',
        })
    }
})

courseRouter.delete('/:id/lectures/:lectureId', AuthMiddleware, async (req: Request, res: Response) => {
    try{
        const userId = req.userId;
        const courseId = req.params.id;
        const lectureId = req.params.lectureId;
        
        const lecture = await db.lecture.delete({
            where: {
                id: lectureId,
                course: {
                    id: courseId,
                    instructorId: userId
                },
            }
        });
        
        res.json({
            message: 'Lecture Deleted Succesfully',
            lecture,
        });
    } catch (err) {
        res.status(403).json({
            message: 'Lecture can not be Deleted',
        })
    }
})

export default courseRouter;
