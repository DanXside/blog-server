import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        roles: {
            type: String,
            required: true,
            default: 'USER'
        },
        avatar: String
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema);