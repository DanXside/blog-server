import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        text: String,
        postImage: String,
        sections: {
            type: Array(),
            default: []
        },
        viewsCount: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Post', PostSchema);