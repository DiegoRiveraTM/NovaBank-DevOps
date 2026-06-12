import User from '../models/users';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import Transaction from '../models/transactions';
import { totalTransactions } from '../metrics';

export const deposits = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { amount } = req.body;
        const user = await User.findById(userId);
        
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (amount === undefined || isNaN(amount)) {
            res.status(400).json({ message: "Amount is required and must be a number" });
            return;
        }
        const depositAmount = Number(amount);
        user.balance += depositAmount;
        const newTransaction = new Transaction({
            message: `Deposit of ${depositAmount} succesfully completed`,
            user: userId,
            amount,
            newBalance: user.balance,
            type: 'deposit',
            status: 'completed',
            date: new Date(),
        });
        await user.save();
        await newTransaction.save();
        await User.updateOne(
            { _id: user._id },
            { $push: { deposits: newTransaction._id } }
        );
        //incrementamos la métrica de transacciones totales para depositos
        totalTransactions.inc({ type: 'deposits', status: 'success' });
        //voucher of the transaction
        res.status(200).json({
            bank: "Nova Bank",
            name: user.username,
            clabe: user.clabe,
            amount: depositAmount,
            newBalance: user.balance,
        });
    } catch(error) {
        console.error("Error in deposits controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const transfers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { amount, clabe, saveUser} = req.body;
        const sender = await User.findById(req.user?.id);
        
        if (!amount || !clabe ){
            res.status(400).json ({ message: "Amount and CLABE are required"});
            return;
        }

        if (!sender) {
            res.status(404).json({ message: "Sender not found" });
            return;
        }

        if( amount <= 0){
            res.status(400).json({ message: "Amount must be greater than 0" });
            return;
        }

        if (sender.balance < amount) {
            res.status(400).json({ message: "Insufficient balance for this transfer" });
            return;
        }
        
        const receiver = await User.findOne({ clabe });
        if (!receiver) {
            res.status(404).json({ message: "Receiver not found" });
            return;
        }
        if (receiver._id === sender._id) {
            res.status(400).json({ message: "You cannot transfer to yourself" });
            return;
        }

        //complete the transfer 
        sender.balance -= amount;
        receiver.balance += amount;

        //save the contact for future transactions 
        if (saveUser && !sender.savedUsers?.some(user => user.clabe === receiver.clabe)) {
            sender.savedUsers?.push({
                name: receiver.username,
                clabe: receiver.clabe,
                alias: receiver.username, 
            });
        }

        //create the voucher with the details of the transaction
        const newTransaction = new Transaction({
            user: sender._id,
            amount,
            type: 'transfer',
            status: 'completed',
            date: new Date(),
            details: {
                to: receiver.username,
                toClabe: receiver.accountNumber,
            }
        });

        await sender.save();
        await receiver.save();
        await newTransaction.save();
        await User.updateOne(
            { _id: sender._id },
            { $push: { transactions: newTransaction._id } }
        );
        await User.updateOne(
            { _id: receiver._id },
            { $push: { transactions: newTransaction._id } }
        );        

        totalTransactions.inc({ type: 'transfers', status: 'success' });
        //respond with the voucher 
        res.status(200).json({
            message: "Transfer Succesful",
            transaction: {
                from: sender.username,
                to: receiver.username,
                toClabe: receiver.accountNumber,
                amount,
                date: newTransaction.date,
                transactionId: newTransaction._id,
                status: newTransaction.status,
            }
        })

    }catch (error: unknown) {
            console.error("Error in transfers controller:", error);
            res.status(500).json({ message: "Internal server error" });
    }}

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
        
        totalTransactions.inc({ type: 'get_transactions', status: 'success' });
        res.status(200).json({ 
            message: "Transactions history retrieved successfully",
            count: transactions.length,
            transactions
        })
    } catch (error) {
        console.error("Error in getTransactions controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getBalance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            message: "Balance retrieved successfully",
            balance: user.balance,
        });
    } catch (error) {
        console.error("Error in getBalance controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}