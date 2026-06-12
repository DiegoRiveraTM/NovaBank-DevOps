import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/users';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId).select('-password');
        if (!user){
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            username: user.username,
            email: user.email,
            clabe: user.clabe,
            accountNumber: user.accountNumber,
            balance: user.balance,
        });
    } catch (error) {
        console.error("Error in getProfile controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}