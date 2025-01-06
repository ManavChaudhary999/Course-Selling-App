import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db";
import {userSchema} from '../@types/zod.types';
import { AuthMiddleware } from "../middleware/auth";

const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const {  success, error, data} = userSchema.safeParse(req.body);
    
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
            });
    
            return;
        }

        const {name, email, password, role} = data;

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

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            },
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
            expiresIn: "1d",
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 *1000,
            sameSite: true,
        }).status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(404).json({
            message: "User can not be created"
        });
    }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
    
    try {
        const {  success, error, data} = userSchema.safeParse(req.body);
  
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
            });
    
            return;
        }

        const {email, password} = data;

        const user = await db.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            res.status(401).json({ message: "Invalid User Credentials" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid User Credentials" });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
            expiresIn: "1d",
        });
        
        res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 1000,
            sameSite: true
        }).json({
            message: 'User logged in successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "User Can not be logged in" });
  }
});

userRouter.get("/logout", async (req: Request, res: Response) => {
    try {
        res.clearCookie("token").json({
            message: "User logged out successfully"
        });
    } catch (error) {
        res.status(500).json({ message: "User Can not be logged out" });
    }
})

userRouter.get("/profile", AuthMiddleware, async (req, res) => {
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
                role: true
            },
        });

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        res.json({user});
    }
    catch (error) {
        res.status(403).json({
            message: "User can not be fetched"
        })
    }
});

export default userRouter;
