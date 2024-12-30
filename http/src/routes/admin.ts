import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../db";
import {personSchema, courseCreateSchema, courseUpdateSchema} from '../@types/zod.types';
import {AdminMiddleware} from "../middleware/admin";

const adminRouter = Router();

// Admin Routes
adminRouter.post('/signup', async (req: Request, res: Response) => {
    const {  success, error, data} = personSchema.safeParse(req.body);

    if(!success) {
        res.status(401).json({
            message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
        });

        return;
    }

    try {
        const {name, email, password} = data;

        const exisitingAdmin = await db.admin.findFirst({
            where: {
                email,
            },
        })
        
        if (exisitingAdmin) {
            res.status(401).json({
                message: "Admin already exists"
            });

            return;
        }

        const admin = await db.admin.create({
            data: {
                name,
                email,
                password,
            },
        });

        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || "");

        res.json({
            message: "Admin created successfully",
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
            },
        });

    } catch (error) {
        res.status(404).json({
            message: "Admin can not be created"
        });
    }
});

adminRouter.post('/signin', async (req: Request, res: Response) => {
    const {  success, error, data} = personSchema.safeParse(req.body);

    if(!success) {
        res.status(401).json({
            message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
        });

        return;
    }

  try {
    const {email, password} = data;

    const admin = await db.admin.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!admin) {
      res.status(401).json({ message: "Invalid Admin Credentials" });
      return;
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET || "");
    res.json({
        message: 'Admin logged in successfully',
        token,
        user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
        },
    });

  } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
  }
});

adminRouter.get("/profile", AdminMiddleware, async (req, res) => {
    const adminId = req.adminId;

    try {
        const admin = await db.user.findUnique({
            where: {
                id: adminId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        res.json({user: admin});
    }
    catch (error) {
        res.status(403).json({
            msg: "User can not be fetched"
        })
    }
});


adminRouter.post('/course', AdminMiddleware, async (req: Request, res: Response) => {
    const adminId = req.adminId;
    const {  success, error, data} = courseCreateSchema.safeParse({...req.body, creatorId: adminId});

    if(!success) {    
        res.status(401).json({
            message: error
        });

        return;
    }

    try{
        const {title, description, price, imageUrl, creatorId} = data;
        
        const course = await db.course.create({
            data: {
                title,
                description,
                price,
                imageUrl,
                creatorId,
            },
        });

        res.json({
            msg: 'Course Created Succesfully',
            course,
        });
    }
    catch (err) {
        res.status(403).json({
            msg: 'Course can not be created',
        })
    }
});

adminRouter.put('/course', AdminMiddleware, async (req: Request, res: Response) => {
    const adminId = req.adminId;
    const {  success, error, data} = courseUpdateSchema.safeParse({...req.body, creatorId: adminId});

    if(!success) {    
        res.status(401).json({
            message: error
        });

        return;
    }

    try{
        const {courseId, title, description, price, imageUrl, creatorId} = data;
        
        const course = await db.course.update({
            where: {
                id: courseId,
                creatorId
            },
            data: {
                title,
                description,
                price,
                imageUrl,
                creatorId,
            },
        });

        res.json({
            msg: 'Course Updated Succesfully',
            course,
        });
    }
    catch (err) {
        res.status(403).json({
            msg: 'Course can not be Updated',
        })
    }
});

adminRouter.post('/course/:id', AdminMiddleware, async (req: Request, res: Response) => {
    const adminId = req.adminId;
    const id = Number(req.params.id);

    try {
        const course = await db.course.delete({
            where: {
                id,
                creatorId: adminId
            }
        });

        res.json({
            msg: 'Course Deleted Successfully',
            course,
        });
    } catch (error) {
        res.status(403).json({
            msg: 'Course can not be deleted',
        })
    }
});

adminRouter.get('/courses', AdminMiddleware, async (req: Request, res: Response) => {
    const adminId = req.adminId;
    try {
        const courses = await db.course.findMany({
            where: {
                creatorId: adminId
            }
        });
        res.json(courses);
    }
    catch (error) {
        res.status(403).json({
            msg: 'Courses can not be fetched',
        })
    }
});


export default adminRouter;
