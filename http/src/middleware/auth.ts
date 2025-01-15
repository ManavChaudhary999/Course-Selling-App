import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // const token = req.cookies.token;

        const authHeader = req.headers.authorization;
        const token = authHeader?.slice(7, authHeader.length);
    
        if(!token) {
            res.json({ message: 'Unauthorized User Access' });
            return;
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET || '') as { id: string };
        req.userId = decodedUser.id;
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized User Access' });
        return;
    }

    next();
};