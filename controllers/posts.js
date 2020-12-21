const postsRouter = require('express').Router()
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware/middlewares')
const getTokenFrom = require('../utils/getTokenFrom')


postsRouter.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find({}).populate('replies', { author: 1 , message: 1 })
    res.status(200).send(posts.map(post => post.toJSON()))
  } catch (error) {
    console.log(error)
    res.status(404).send({error: 'something went wrong'})
  }
})

postsRouter.get('/api/posts/:id', async (req, res) => {
  try {
    const singlePost = await Post.findById(req.params.id).populate('replies', { author: 1 , message: 1 })
    res.status(200).json(singlePost).end()
  } catch (error) {
    console.log(error)
    res.status(404).send({error: 'something went wrong'})
  }
})

postsRouter.post('/api/posts', auth, async (req, res) => {
  if (req.file === undefined || req.file === '' || req.file === null) {
    req.file = ''
  }

  const newPost = new Post({
    ...req.body,
    author: req.user.username,
    owner: req.user._id
  })

  try {
    await newPost.save()
    res.status(201).send(newPost)
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'something went wrong' })
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

    const updatedPost = await Post.findByIdAndUpdate(id, { content: content, title: title })
    return res.status(201).send(updatedPost).json().end()
  } catch (error) {
    console.log(error)
    return res.status(404).send({error: 'something went wrong'}).end()
  }
})



postsRouter.delete('/api/posts/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findById(req.params.id)
    delete req.body.__v;
    
    if(deletedPost.postImage === null || deletedPost.postImage === undefined){
      await Post.findByIdAndRemove(req.params.id)
      return res.status(204).end()
    }

    await Post.findByIdAndRemove(req.params.id)
    return res.status(204).send({success: 'Post succesfully deleted'}).end()
  } catch (error) {
    console.log(error)
    return res.status(404).send({error: 'something went wrong'}).end()
  }
})

postsRouter.put('/api/posts/likes/:id', async (req, res) => {
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