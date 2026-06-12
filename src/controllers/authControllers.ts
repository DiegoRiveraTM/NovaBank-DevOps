import { Request, Response } from 'express';
import User from '../models/users';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { failedLoginAttempts, users_logged_in} from '../metrics';

dotenv.config();

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const generateClabe = (): string => {
    const clabe = Array.from ({ length: 18 }, () => Math.floor(Math.random() * 10)).join('');
    return clabe;
};

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, username} = req.body;
    if (!email || !password || !username) {
        res.status(400).json({ message: "Email, username and password are required" });
        return;
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, email, password: hashedPassword, clabe: generateClabe(), accountNumber: crypto.randomUUID() });
        await newUser.save();
        res.status(201).json({ 
            message: "User registered successfully",
            accountNumber: newUser.accountNumber,
            clabe: newUser.clabe
        });
    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user){
            res.status(400).json({ message: "Invalid Credentials "})
            return;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            //si el inicio de sesión falla, incremento la métrica
            failedLoginAttempts.labels({ reason: 'invalid_credentials' }).inc();
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret){
            console.error("JWT secret is not defined");
            res.status(500).json({ message: "Internal server error" });
            return;
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            secret,
            { expiresIn: '1h' } as SignOptions
        );
        //incrementamos la métrica de usuarios activos solo si las credenciales son correctas
        users_logged_in.inc();
        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
            },
        });
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Internal server error", error: errorMessage });
    }
};

