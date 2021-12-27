import mongoose from "mongoose"
import Comment from "../models/commens.js"

import PostMessage from "../models/postMessage.js"

export const getPost = async (req, res) => {
    const { id } = req.params
    try {
        const post = await PostMessage.findById(id).populate("comments")
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({ message: error.message })

    }

}

export const getPosts = async (req, res) => {
    const { page } = req.query

    const LIMIT = 8

    try {
        const totalPosts = await PostMessage.countDocuments({})

        const numberOfPages = Math.ceil(totalPosts / LIMIT)
        const startIndex = (Number(page) - 1) * LIMIT


        const posts = await PostMessage.find().sort({ _id: -1 }).skip(startIndex).limit(LIMIT)

        res.status(200).json({ posts, numberOfPages, currentPage: Number(page) })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }

}

export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query

    const title = new RegExp(searchQuery, "i")

    try {
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] })

        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error })
    }

}

export const getPostsByCreator = async (req, res) => {

    let { name: creator } = req.query

    creator = new RegExp(creator, "i")

    try {
        const posts = await PostMessage.find({ creator })

        res.status(200).json(posts)
    } catch (error) {
        res.status(404).json({ message: error })
    }

}

export const createPosts = async (req, res) => {
    const post = req.body

    if (!req.userId) return res.json({ message: "Unauthenticated" })

    let newPost = new PostMessage({ ...post, createdAt: new Date().toISOString(), creatorId: req.userId })

    try {
        await newPost.save()
        res.status(201).json(newPost)

    } catch (error) {
        res.status(409).json({ error: error.message })
    }

}

export const updatePosts = async (req, res) => {
    const { id: _id } = req.params
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')

    try {
        let updatePost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })
        res.status(201).json(updatePost)
    } catch (error) {
        res.status(409).json({ error: error.message })

    }

}

export const updateComment = async (req, res) => {
    const { id: _id } = req.params
    const comment = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Comment with that id')

    try {
        let updateComment = await Comment.findByIdAndUpdate(_id, comment, { new: true })
        res.status(201).json(updateComment)
    } catch (error) {
        res.status(409).json({ error: error.message })

    }

}

export const likePost = async (req, res) => {

    const { id: _id } = req.params

    if (!req.userId) return res.json({ message: "Unauthenticated" })

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')

    try {

        let post = await PostMessage.findById(_id)

        let likeIndex = post.likes.findIndex(postId => postId === req.userId)

        if (likeIndex >= 0) {

            post.likes = post.likes.filter(likeId => likeId !== req.userId)
        } else {
            post.likes = [...post.likes, req.userId]
        }
        let updatePost = await PostMessage.findByIdAndUpdate(_id, { likes: post.likes }, { new: true })
        res.status(201).json(updatePost)
    } catch (error) {
        res.status(409).json({ error: error.message })

    }

}

export const commentPost = async (req, res) => {
    const { id } = req.params
    const comment = req.body




    if (!req.userId) return res.json({ message: "Unauthenticated" })

    let newComment = new Comment({ ...comment, createdAt: new Date().toISOString(), creatorId: req.userId })

    try {
        newComment = await newComment.save()
        let post = await PostMessage.findById(id)
        post.comments.push(newComment._id)
        //  post = { ...post, comments: [...post.comments, newComment._id] }


        const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true }).populate('comments')
        res.status(201).json(updatedPost)
    } catch (error) {
        res.status(404).json({ message: error.message })

    }
}

export const deletePost = async (req, res) => {
    console.log('deletePost')
    const { id: _id } = req.params
    // const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')

    try {
        const { comments } = await PostMessage.findById(_id)

        if (comments.length) {
            const deletedComments = Promise.all(
                comments.map(async (commentId) => {
                    let deleteComment = await Comment.findByIdAndRemove(commentId)
                    return deleteComment._id
                })
            )

            const deletedCommentsResolved = await deletedComments

        }

        let deletePost = await PostMessage.findByIdAndRemove(_id)

        !deletePost
            ? res
                .status(400)
                .json({ err: "Tthe post cannot delet" })
            : res.status(201).json(deletePost);
    } catch (error) {
        res.status(400).json({ error })

    }

}

export const deleteComment = async (req, res) => {
    const { id: _id } = req.params
    // const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Comment with that id')

    try {
        let deleteComment = await Comment.findByIdAndRemove(_id)

        !deleteComment
            ? res
                .status(400)
                .json({ err: "Tthe Comment cannot delet" })
            : res.status(201).json(deleteComment);
    } catch (error) {
        res.status(400).json({ error })

    }

}