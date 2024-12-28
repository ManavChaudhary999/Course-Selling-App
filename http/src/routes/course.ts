import { Router, Request, Response } from "express";
import db from "../db";
import {coursePurchaseSchema} from '../@types/zod.types';
import { UserMiddleware } from "../middleware/user";

const courseRouter = Router();

courseRouter.post("/purchase", UserMiddleware, async (req, res) => {
    const userId = req.userId;
    const courseId = req.body.courseId;

    const {success, error, data} = coursePurchaseSchema.safeParse({userId, courseId});

    if(!success) {
        res.status(401).json({
            message: error
        });

        return;
    }

    try {
        const course = await db.purchase.create({
            data
        });

        res.json({
            msg: "Course Purchased successfully",
            course
        });
    }
    catch (error) {
        res.status(403).json({
            msg: "Course can not be purchased",
            error
        })
    }
});

courseRouter.get('/preview', async (req: Request, res: Response) => {
    const courses = await db.course.findMany();
    res.json(courses);
})

export default courseRouter;
