import { Router, Request, Response } from "express";
import db from "../db";
// import {coursePurchaseSchema} from '../@types/zod.types';
import { AuthMiddleware } from "../middleware/auth";
import { razorpay } from "../utils/payment";
import crypto from "crypto";
import { GetFileUrls } from "../utils/aws-config";

const purchaseRouter = Router();

purchaseRouter.post("/checkout", AuthMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const {courseId} = req.body;

        if(!courseId) {
            res.status(401).json({
                message: "Course Id is required",
            });

            return;
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                // isPublished: true
            }
        })

        if(!course) {
            res.status(401).json({
                message: "Course not found",
            });

            return;
        }

        // Check if user has already purchased the course
        const existingPurchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: userId || '',
                    courseId: course.id
                }
            }
        });

        if(existingPurchase?.status === 'COMPLETED') {
            res.status(400).json({
                message: "Course already purchased",
            });
            return;
        }

        if(existingPurchase) {
            await db.purchase.delete({
                where:{
                    userId_courseId: {
                        userId: userId || '',
                        courseId: course.id
                    }
                }
            });
        }

        const options = {
            amount: Number((course.price || 0) * 100), // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        const coursePurchase = await db.purchase.create({
            data: {
                transactionId: order.id,
                userId: userId || '',
                courseId: course.id,
                amount: (course.price || 0)  * 100,
                status: 'PENDING',
            }
        })

        res.status(201).json({
            order,
            course,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            //@ts-ignore
            message: error?.description || "Internal Server Error",
        });
    }
});

purchaseRouter.post("/verify", AuthMiddleware, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            res.status(400).json({
                message: "Missing payment verification details",
            });
            return;
        }
        
        // Verify payment signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
            .update(body)
            .digest("hex");
        
        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            res.status(400).json({
                message: "Invalid payment signature",
            });
            return;
        }

        // Update purchase status
        const purchase = await db.purchase.findFirst({
            where: {
                transactionId: razorpay_order_id,
            },
            include: {
                course: {
                    include: {
                        lectures: true
                    }
                },
            }
        });

        if (!purchase) {
            res.status(404).json({
                message: "Purchase not found",
            });
            return;
        }

        try {
            // Update purchase status
            await db.purchase.update({
                where: {
                    id: purchase.id,
                },
                data: {
                    status: 'COMPLETED',
                }
            });
    
            // Create course progress for the user
            await db.courseProgress.create({
                data: {
                    userId: purchase.userId,
                    courseId: purchase.courseId,
                    lectureProgress: {
                        create: purchase.course.lectures.map((lecture) => ({
                            lectureId: lecture.id,
                            viewed: false,
                        }))
                    }
                }
            });
    
            // Create enrollment
            await db.enrollment.create({
                data: {
                    userId: purchase.userId,
                    courseId: purchase.courseId,
                }
            });
    
            res.status(200).json({
                message: "Payment verified successfully",
            });
        } catch (error) {
            
            await db.purchase.update({
                where: {
                    id: purchase.id,
                },
                data: {
                    status: 'FAILED',
                }
            });
            res.status(500).json({
                message: "Transaction Failed",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});

purchaseRouter.get("/courses", AuthMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        
        const enrolledCourses = await db.enrollment.findMany({
            where: {
                userId: userId,
            },
            include: {
                course: true,
            }
        });

        const courses = enrolledCourses.map((purchase) => purchase.course);

        const imageKeysToFetch: string[] = [];
        const courseIdMap: Record<string, string> = {};
        const now = new Date();
        
        for(const course of courses) {
            if(!course.imageUrl || !course.imageUrlExpiresAt || course.imageUrlExpiresAt < now) {
                if(course.imagePublicId) {
                    imageKeysToFetch.push(course.imagePublicId);
                    courseIdMap[course.imagePublicId] = course.id;
                }
            }
        }

        const imageUrls = await GetFileUrls(imageKeysToFetch);

        await Promise.all(
            Object.entries(imageUrls).map(async ([publicId, url]) => {
                await db.course.update({
                    where: {
                        id: courseIdMap[publicId]
                    },
                    data: {
                        imageUrl: url,
                        imageUrlExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    }
                })
            })
        );

        courses.forEach(course => {
            if(imageUrls[course.imagePublicId || ""]) {
                course.imageUrl = imageUrls[course.imagePublicId || ""];
            }
        });

        res.status(200).json({
            message: "Purchased Courses",
            courses: courses,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error? error.message : "Internal Server Error",
        });
    }
});

purchaseRouter.get("/courses/:courseId", AuthMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const courseId = req.params.courseId;

        const enrolledCourse = await db.enrollment.findFirst({
            where: {
                userId: userId,
                courseId: courseId,
            }
        });

        res.status(200).json({
            message: "Course Enrollment Status",
            isEnrolled: enrolledCourse ? true : false,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
});


export default purchaseRouter;
