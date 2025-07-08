import mongoose, { Document, Schema, Model } from 'mongoose';

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
}

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        maxLength: 100,
        match: /^[a-zA-Z]+$/
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 100,
        match: /^[a-zA-Z]+$/
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
},{ timestamps: true });

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;