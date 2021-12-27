import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        // required: true,
    }],
    creator: String,
    creatorId: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})

const PostMessage = mongoose.model('PostMessage', postSchema)

export default PostMessage