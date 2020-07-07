const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs')
const multerConfig = require('../utils/multerConfig')
const jwt = require('jsonwebtoken')
const getTokenFrom = require('../utils/getTokenFrom')


postsRouter.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).populate('replies', { author: 1 })
    res.status(200).json(posts.map(post => post.toJSON())).end()
  } catch (error) {
    console.log(error)
  }
})

postsRouter.get('/api/posts/:id', async (req, res) => {
  try {
    const singlePost = await Post.findById(req.params.id)
    res.status(200).json(singlePost).end()
  } catch (error) {
    console.log(error)
  }
})

postsRouter.post('/api/posts', multerConfig.single('postImage') , async (req, res) => {
  try {
  const body = req.body
  const title = body.title.trim()
  const content = body.content.trim()

  const token = getTokenFrom(req)
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'You have to be logged in to do this' }).end()
  }

  const user = await User.findById(decodedToken.id)

  if(content === ''){
    return res.status(401).json({ error: 'Please add some content to the post '}).end()
  }

  if (req.file === undefined || req.file === '' || req.file === null) {
    req.file = ''
  }

  const post = new Post({
    title: title,
    author: user.username,
    content: content,
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
    const body = req.body
    const title = body.title.trim()
    const content = body.content.trim()
    const id = req.params.id

    if(content === ''){
      return res.status(401).json({ error: 'Please add some content to the post '}).end()
    }

    await Post.findByIdAndUpdate(id, { content: content, title: title })
    res.status(201).json().end()
  } catch (error) {
    console.log(error)
  }
})


postsRouter.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findById(req.params.id)
    if(deletedPost.postImage === null || deletedPost.postImage === undefined){
      await Post.findByIdAndRemove(req.params.id)
      return res.status(204).end()
    }
    fs.unlink(`./${deletedPost.postImage}`, (err) => {
      if (err) throw err;
      console.log('successfully deleted post');
    });
    await Post.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    console.log(error)
  }
})

module.exports = postsRouter