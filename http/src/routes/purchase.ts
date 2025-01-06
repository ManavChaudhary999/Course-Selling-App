import { Router, Request, Response } from "express";
import db from "../db";
// import {coursePurchaseSchema} from '../@types/zod.types';
import { AuthMiddleware } from "../middleware/auth";

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
                isPublished: true
            }
        })

        if(!course) {
            res.status(401).json({
                message: "Course not found",
            });

            return;
        }


        const coursePurchase = await db.purchase.create({
            data: {
                transactionId: 'Unkown',
                userId: userId || '',
                courseId: course.id,
                amount: (course.price || 0)  * 100
            }
        })

        const options = {
            amount: Number((course.price || 0)  * 100),
            currency: "INR",
        };
    } catch (error) {
        
    }
});

// purchaseRouter.post("/verify", AuthMiddleware, async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//         req.body;
    
//         const body = razorpay_order_id + "|" + razorpay_payment_id;
        
//         const expectedSignature = crypto
//             .createHmac("sha256", process.env.Razorpay_Secret)
//             .update(body)
//             .digest("hex");
        
//         const isAuthentic = expectedSignature === razorpay_signature;
        
//         if (isAuthentic) {
//             await Payment.create({
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//             });
        
//             const user = await User.findById(req.user._id);
        
//             const course = await Courses.findById(req.params.id);
        
//             user.subscription.push(course._id);
        
//             await Progress.create({
//             course: course._id,
//             completedLectures: [],
//             user: req.user._id,
//             });
        
//             await user.save();
        
//             res.status(200).json({
//             message: "Course Purchased Successfully",
//             });
//         } else {
//             return res.status(400).json({
//             message: "Payment Failed",
//             });
//         }
//     } catch (error) {
        
//     }
// });


export default purchaseRouter;
