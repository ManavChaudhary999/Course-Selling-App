import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const AdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;
    const token = bearerToken?.split(' ')[1];
    
    if(!token) {
        res.json({ message: 'Unauthorized User Access' });
        return;
    }

    try {
        const decodedAdmin = jwt.verify(token, process.env.JWT_SECRET || '') as { id: number };
        req.adminId = decodedAdmin.id;
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized User Access' });
        return;
    }

    next();
};
