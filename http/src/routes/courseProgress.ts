import { Router, Request, Response } from "express";
import db from "../db";
import { AuthMiddleware } from "../middleware/auth";
import { GetFileUrls } from "../utils/aws-config";

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
                lectures: true,
                enrollments: true,
            }
        });

        if(!course) {
            res.status(404).json({
                message: 'Course Not Found',
            });
            return;
        }

        const now = new Date();
        const lectureKeysToFetch: string[] = [];
        const courseIdMap: Record<string, string> = {};

        for(const lecture of course?.lectures!) {
            if(!lecture.videoUrl || !lecture.videoUrlExpiresAt || lecture.videoUrlExpiresAt < now) {
                if(lecture.publicId) {
                    lectureKeysToFetch.push(lecture.publicId);
                    courseIdMap[lecture.publicId] = lecture.id;
                }
            }
        }

        const lectureUrls = await GetFileUrls(lectureKeysToFetch);

        await Promise.all(
            Object.entries(lectureUrls).map(async ([publicId, url]) => {
                await db.lecture.update({
                    where: {
                        id: courseIdMap[publicId]
                    },
                    data: {
                        videoUrl: url,
                        videoUrlExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    }
                })
            })
        );

        for(const lecture of course?.lectures!) {
            if(lectureUrls[lecture.publicId || ""]) {
                lecture.videoUrl = lectureUrls[lecture.publicId || ""]; 
            }
        }

        const courseProgress = await db.courseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId: userId || '',
                    courseId
                }
            },
            include: {
                lectureProgress: true,
            }
        });

        res.json({
            course,
            courseProgress,
            isEnrolled: course.enrollments.find(enrollment => enrollment.userId === userId) ? true : false,
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
                // lectureProgress: {
                //     updateMany: {
                //         where: {
                //         },
                //         data: {
                //             viewed: true
                //         }
                //     }
                // }
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
        const courseProgressId = req.params.id;
        const lectureId = req.params.lectureId;

        const lectureProgress = await db.lectureProgress.update({
            where: {
                lectureId_courseProgressId: {
                    lectureId,
                    courseProgressId
                }
            },
            data: {
                viewed: true
            }
        });

        res.json({
            message: 'Lecture Marked as Viewed',
            lectureProgress
        });

    } catch (error) {
        res.status(500).json({
            message: 'Cannot Mark Lecture as Viewed'
        })   
    }
});


export default courseProgressRouter;