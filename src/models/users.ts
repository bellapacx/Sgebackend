import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    phone_number: string;
    role: 'admin' | 'cashier' | 'shopkeeper';
    store_id: string; // Changed to string
    created_at: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'cashier', 'shopkeeper'] },
    store_id: { type: String, required: true }, // Changed to string
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
