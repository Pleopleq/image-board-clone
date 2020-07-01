const postsRouter = require('express').Router()
const Post = require('../models/post')

postsRouter.get('/api/posts', async (req, res) => {
    const posts = await Post.find({})

    res.json(posts.map(post => post.toJSON()))
})

postsRouter.post('/api/posts', async (req, res) => {
    try {
        const body = req.body

        const post = new Post({
            title: body.title,
            author: body.author,
            replies: []
        })
        
        const savedPost = await post.save()
        res.status(201).json(savedPost).end()
      } catch (error) {
        console.error(error);
      }
})

module.exports = postsRouter