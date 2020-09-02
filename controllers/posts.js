const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs')
const multerConfig = require('../utils/multerConfig')
const jwt = require('jsonwebtoken')
const middleware = require('../middleware/middlewares')
const getTokenFrom = require('../utils/getTokenFrom')


postsRouter.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).populate('replies', { author: 1 , message: 1 })
    return res.status(200).json(posts.map(post => post.toJSON())).end()
  } catch (error) {
    console.log(error)
    return res.status(404).send({error: 'something went wrong'}).end()
  }
})

postsRouter.get('/api/posts/:id', async (req, res) => {
  try {
    const singlePost = await Post.findById(req.params.id).populate('replies', { author: 1 , message: 1 })
    return res.status(200).json(singlePost).end()
  } catch (error) {
    console.log(error)
    return res.status(404).send({error: 'something went wrong'}).end()
  }
})

postsRouter.post('/api/posts', middleware.isLoggedIn, multerConfig.single('postImage'), async (req, res) => {
  try {
  const body = req.body
  const title = body.title.trim()
  const content = body.content.trim()
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)

  if(content === ''){
    return res.send({ error: 'Please add some content to the post '}).json().end()
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
  return res.send(savedPost)
  } catch (error) {
    console.error(error);
    return res.send({error: 'something went wrong'}).next()
  }
})



postsRouter.put('/api/posts/:id', middleware.isLoggedIn, middleware.checkPostOwnership , async (req, res) => {
  try {
    const body = req.body
    const title = body.title.trim()
    const content = body.content.trim()
    const id = req.params.id

    if(content === ''){
      return res.status(401).json({ error: 'Please add some content to the post '}).end()
    }

    const updatedPost = await Post.findByIdAndUpdate(id, { content: content, title: title })
    return res.status(201).send(updatedPost).json().end()
  } catch (error) {
    console.log(error)
    return res.status(404).send({error: 'something went wrong'}).end()
  }
})



postsRouter.delete('/api/posts/:id', middleware.isLoggedIn, middleware.checkPostOwnership , async (req, res) => {
  try {
    const deletedPost = await Post.findById(req.params.id)
    delete req.body.__v;
    
    if(deletedPost.postImage === null || deletedPost.postImage === undefined){
      await Post.findByIdAndRemove(req.params.id)
      return res.status(204).end()
    }
    fs.unlink(`./${deletedPost.postImage}`, (err) => {
      if (err) throw err;
      console.log('successfully deleted post');
    });
    await Post.findByIdAndRemove(req.params.id)
    return res.status(204).send({success: 'Post succesfully deleted'}).end()
  } catch (error) {
    console.log(error)
    return res.status(404).send({error: 'something went wrong'}).end()
  }
})

postsRouter.put('/api/posts/likes/:id', middleware.isLoggedIn, async (req, res) => {
  try {
      const id = req.params.id
      const likedPost = await Post.findById(id)
      delete likedPost.user
      const copyLikedPost = {...likedPost._doc}
      ++copyLikedPost.likes
      await Post.findByIdAndUpdate(id, copyLikedPost)
      return res.status(200).end()
  } catch (error) {
      console.log(error)
  }
})


module.exports = postsRouter