import mongoose, { Schema, Document } from 'mongoose';


export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'transfer';
    status: 'pending' | 'completed' | 'failed';
    date: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
    {
    user: { type: mongoose.Schema.Types.ObjectId, required: true},
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
    }, 
    { timestamps: true } 
);
export default mongoose.model<ITransaction>('Transaction', TransactionSchema);