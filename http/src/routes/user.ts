import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../db";
import {personSchema} from '../@types/zod.types';
import { UserMiddleware } from "../middleware/user";

const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {

    const {  success, error, data} = personSchema.safeParse(req.body);

    if(!success) {
        res.status(401).json({
            message: error
        });

        return;
    }

    try {
        const {name, email, password} = data;

        const exisitingUser = await db.user.findFirst({
            where: {
                email,
            },
        })
        
        if (exisitingUser) {
            res.status(401).json({
                message: "User already exists"
            });

            return;
        }

        const user = await db.user.create({
            data: {
                name,
                email,
                password,
            },
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "");

        res.json({
            message: "User created successfully",
            token,
        });

    } catch (error) {
        res.status(404).json({
            message: "User can not be created"
        });
    }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
    const {  success, error, data} = personSchema.safeParse(req.body);

    if(!success) {
        res.status(401).json({
            message: error
        });

        return;
    }

  try {
    const {email, password} = data;

    const user = await db.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid User Credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "");
    res.json({
        message: 'User logged in successfully',
        token
    });

  } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.get("/courses", UserMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const courses = await db.purchase.findMany({
            where: {
                userId,
            },
            select: {
                Course: true,
            },
        });

        res.json({courses});
    }
    catch (error) {
        res.status(403).json({
            msg: "Courses can not be fetched"
        })
    }
});

// userRouter.post("/courses/:courseId", UserMiddleware, async (req, res) => {
//   const { username } = req;
//   const { courseId } = req.params;

//   try {
//     await User.update({
//       where: {
//         username,
//       },
//       data: {
//         purchasedCourses: {
//           push: courseId,
//         },
//       },
//     });

//     res.json({
//       msg: "Course purchased successfully",
//       courseId,
//     });
//   } catch (error) {
//     res.status(403).send("Course purchase failed");
//   }
// });

// userRouter.get("/purchasedCourses", UserMiddleware, async (req, res) => {
//   const { username } = req;

//   try {
//     const user = await User.findFirst({
//       where: {
//         username,
//       },
//       select: {
//         purchasedCourses: true,
//       },
//     });

//     const purchasedCourses = user?.purchasedCourses || [];

//     if (!purchasedCourses.length) return res.send("No Course Purchased yet");

//     const courses = await Course.findMany({
//       where: {
//         id: {
//           in: purchasedCourses,
//         },
//       },
//     });

//     res.json(courses);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

export default userRouter;
