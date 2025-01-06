import { Router, Request, Response } from "express";
import db from "../db";
import { AuthMiddleware } from "../middleware/auth";

const courseProgressRouter = Router();

courseProgressRouter.get('/:id', AuthMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const courseId = req.params.id;
        
        const course = await db.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                progress: {
                    where: {
                        userId: userId
                    },
                    select: {
                        completed: true,
                        lectureProgress: true
                    }
                }
            }
        });

        if(!course) {
            res.status(404).json({
                message: 'Course Not Found',
            });
            return;
        }

        if(!course.progress) {
            // Create Course Progress
            const courseProgress = await db.courseProgress.create({
                data: {
                    userId: userId || '',
                    courseId,
                }
            });
        }

        res.json({
            course,
        });

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong'
        })
    }
});

courseProgressRouter.post('/:id/complete', AuthMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const courseId = req.params.id;

        const courseProgress = await db.courseProgress.update({
            where: {
                userId_courseId: {
                    userId: userId || '',
                    courseId
                }
            },
            data: {
                completed: true,
                lectureProgress: {
                    updateMany: {
                        where: {
                        },
                        data: {
                            viewed: true
                        }
                    }
                }
            }
        });

        if(!courseProgress) {
            res.status(404).json({
                message: 'Course Not Found',
            });
            return;
        }

        res.json({
            message: 'Course Completed'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Course Not Found'
        })
    }
});

courseProgressRouter.post('/:id/incomplete', AuthMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const courseId = req.params.id;

        const courseProgress = await db.courseProgress.update({
            where: {
                userId_courseId: {
                    userId: userId || '',
                    courseId
                }
            },
            data: {
                completed: false,
                lectureProgress: {
                    updateMany: {
                        where: {
                        },
                        data: {
                            viewed: false
                        }
                    }
                }
            }
        });

        if(!courseProgress) {
            res.status(404).json({
                message: 'Course Not Found',
            });
            return;
        }

        res.json({
            message: 'Course Marked as Incomplete'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Course Not Found'
        })
    }
});

courseProgressRouter.post('/:id/lecture/:lectureId/view', AuthMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const courseId = req.params.id;
        const lectureId = req.params.lectureId;

        const courseProgress = await db.courseProgress.update({
            where: {
                userId_courseId: {
                    userId: userId || '',
                    courseId
                }
            },
            data: {
                lectureProgress: {
                    updateMany: {
                        where: {
                            lectureId
                        },
                        data: {
                            viewed: true
                        }
                    }
                }
            }
        });

        res.json({
            message: 'Lecture Marked as Viewed'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Cannot Mark Lecture as Viewed'
        })   
    }
});


export default courseProgressRouter;