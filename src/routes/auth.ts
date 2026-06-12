import dotenv from 'dotenv';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { /*forgotPassword, */ login, register } from '../controllers/authControllers';
import { Request, Response, NextFunction, Router } from 'express';
import { failedLoginAttempts } from '../metrics';

dotenv.config();

if(!process.env.JWT_SECRET){
    console.error("Error: JWT_SECRET is not defined in .env file");
    process.exit(1);
}
interface DecodedUser extends JwtPayload {
    id: string;
    email: string;
    name: string;
}

export interface AuthRequest extends Request {
    user?: DecodedUser;
}

//Middleware for verify JWT 
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided or malformed"});
        return;
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET as string;
    
    try{
        const decoded = jwt.verify(token, secret) as DecodedUser;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            failedLoginAttempts.labels({reason: "token_expired"}).inc();
            console.error("Token Expired");
            res.status(401).json({ message: "Token expired" });
        } else {
            console.error("Invalid token", error);
            failedLoginAttempts.labels({reason: "invalid_token"}).inc();
            res.status(401).json({ message: "Invalid token" });
        }
    }
};

    const router = Router();

    router.post('/login', login);
    router.post('/register', register);
    

    router.get('/profile', verifyToken, async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            res.status(200).json({ user: req.user });
        } catch {
            res.status(500).json({ message: "Error retrieving user profile" });
        }
    })
    export default router;