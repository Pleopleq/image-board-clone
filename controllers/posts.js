const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs')
const multerConfig = require('../utils/multerConfig')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')


postsRouter.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).populate('replies', { author: 1})
    res.json(posts.map(post => post.toJSON()))
  } catch (error) {
    console.log(error)
  }
})

postsRouter.post('/api/posts', multerConfig.single('postImage') , async (req, res) => {
  try {
  const body = req.body

  const token = getTokenFrom(req)
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const post = new Post({
      title: body.title,
      author: body.author,
      content: body.content,
      likes: 0,
      postImage: req.file.path,
      user: user._id
  })
  
    const savedPost = await post.save()
    user.posts = user.posts.concat(savedPost._id)
    await user.save()
    res.status(201).json(savedPost).end()
  } catch (error) {
    console.error(error);
  }
})


postsRouter.put('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id
    await Post.findByIdAndUpdate(id, req.body)
    res.status(20).end()
  } catch (error) {
    console.log(error)
  }
})


postsRouter.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findById(req.params.id)
    fs.unlink(`./${deletedPost.postImage}`, (err) => {
      if (err) throw err;
      console.log('successfully deleted post');
    });

    await Post.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.log(eror)
  }
})

module.exports = postsRouter