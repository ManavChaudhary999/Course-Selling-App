import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db";
import {userLoginSchema, userProfileSchema, userSignupSchema} from '../@types/zod.types';
import { AuthMiddleware } from "../middleware/auth";
import { DeleteFile, GetFileUrl, GetProfileUploadUrl } from "../utils/aws-config";

const userRouter = Router();

userRouter.post("/signup", async (req: Request, res: Response) => {
    try {
        const {  success, error, data} = userSignupSchema.safeParse(req.body);
    
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

        res
        .status(201)
        // .cookie("token", token, {
        //     httpOnly: true,
        //     maxAge: 60 * 60 * 24 *1000,
        //     sameSite: true,
        // })
        .json({
            message: "User created successfully",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: "User can not be created"
        });
    }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
    
    try {
        const {  success, error, data} = userLoginSchema.safeParse(req.body);
  
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
            });
    
            return;
        }

        const {email, password, role} = data;

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

        if(user.role !== role) {
            res.status(401).json({ message: "Role is not matching with the credentials provided"});
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
            expiresIn: "1d",
        });
        
        res
        .status(200)
        // .cookie("token", token, {
        //     httpOnly: true,
        //     maxAge: 60 * 60 * 24 * 1000,
        //     sameSite: true
        // })
        .json({
            message: 'User logged in successfully',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "User Can not be logged in" });
        console.log(error);
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
                role: true,
                profileUrl: true,
                profilePublicId: true,
                profileUrlExpiresAt: true,
            },
        });

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        const now = new Date();
        if(!user.profileUrl || !user.profileUrlExpiresAt || user.profileUrlExpiresAt < now) {
            if(user.profilePublicId) {
                const url = await GetFileUrl(user.profilePublicId);

                await db.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        profileUrl: url,
                        profileUrlExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    }
                })
                user.profileUrl = url;
            }
        }

        res.json({user});
    }
    catch (error) {
        res.status(403).json({
            message: "User can not be fetched"
        })
    }
});

userRouter.post("/profile", AuthMiddleware, async (req, res) => {
    
    try {
        const userId = req.userId;
        const {  success, error, data} = userProfileSchema.safeParse(req.body);
  
        if(!success) {
            res.status(401).json({
                message: error?.issues[0].message || error?.errors[0].message || "Invalid User Credentials"
            });
    
            return;
        }

        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            res.status(404).json({
                message: "User not found"
            });
            return;
        }

        const {name, oldPassword, newPassword, profileImage} = data;

        // If new password is set
        if(newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword!!, user.password);

            if (!isPasswordValid) {
                res.status(401).json({ message: "Current Password is wrong" });
                return;
            }
            await db.user.update({
                where: {
                    id: userId
                },
                data: {
                    password: await bcrypt.hash(newPassword, 10),
                }
            });
        }

        // If new name is set
        if(name && name !== user.name) {
            await db.user.update({
                where: {
                    id: userId
                },
                data: {
                    name,
                }
            });
        }

        // If new profile image is set
        if(profileImage?.name && profileImage.type) {
            // Deleting Profile from S3 if already exists
            if(user.profileUrl) await DeleteFile(user.profilePublicId!!);

            const {publicId, url} = await GetProfileUploadUrl(user.id, profileImage.name, profileImage.type);

            await db.user.update({
                where: {
                    id: userId
                },
                data: {
                    profileUrl: url,
                    profilePublicId: publicId
                }
            });

            res.json({
                message: 'Profile Updated Succesfully',
                presignedUrl: url,
            });

            return;
        }

        res.json({
            message: 'Profile Updated Succesfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(403).json({
            message: "Profile Can not be Updated"
        })
    }
});

export default userRouter;
