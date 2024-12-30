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
            message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
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
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
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
            message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
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
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
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

userRouter.get("/profile", UserMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        console.log(user);

        res.json({user});
    }
    catch (error) {
        res.status(403).json({
            msg: "User can not be fetched"
        })
    }
});

export default userRouter;
