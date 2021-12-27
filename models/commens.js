import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    comment: {
        type: String,
    },
    creator: String,
    creatorId: String,
    createdAt: {
        type: Date,
        default: new Date()
    }

});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
