import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/users";

export interface AuthRequest extends Request {
    user?: { id: string; email: string; username: string };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string};
        const user = await User.findById(decoded.id).select("-password") as { id: string, email: string, username: string };

        if (!user) {
            res.status(401).json({ message: "User not found"});
            return;
        }
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username
        }
        next();
    } catch(error) {
        console.error("Error in authentication middleware:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};
