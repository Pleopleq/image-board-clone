const postsRouter = require('express').Router()
const Post = require('../models/post')
const { auth } = require('../middleware/middlewares')
const upload = require('../utils/multerConfig')
const allowedUpdates = require('../utils/allowedUpdates')

postsRouter.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 })
    res.status(200).send(posts)
  } catch (error) {
    console.log(error)
    res.status(500).send({error: 'something went wrong'})
  }
})

postsRouter.get('/api/posts/:id', async (req, res) => {
  try {
    const singlePost = await Post.findOne({ _id: req.params.id }).populate('replies', { author: 1 , message: 1 })
    res.status(200).send(singlePost)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'something went wrong' })
  }
})

postsRouter.get('/api/posts/:id/image', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if(!post || !post.image){
      throw new Error()
    }

    res.set("Content-Type", "image/jpg")
    res.send(post.image)
  } catch (error) {
    res.status(404).send().end()
  }
})

postsRouter.post('/api/posts', auth, upload.single("postImage"), async (req, res) => {
  if (req.file === undefined || req.file === '' || req.file === null) {
    req.file = ''
  }

  const image = req.file.buffer
  const newPost = new Post({
    ...req.body,
    image,
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
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})



postsRouter.patch('/api/posts/:id', auth, async (req, res) => {
  const postId = req.params.id
  const updates = ["title", "content", "likes"]
  const isAllowed = allowedUpdates(req.body, updates)

  if(!isAllowed){
    return res.status(400).send({ error: "Invalid updates" })
  }  

  try {
    const updatedPost = await Post.findOne({ _id: postId, owner: req.user._id })
    
    if(!updatedPost){
      res.status(404).send().end()
    }

    updates.forEach((update) => updatedPost[update] = req.body[update])
    await updatedPost.save()

    return res.send(updatedPost)
  } catch (error) {
    console.log(error)
    res.status(500).send({error: 'something went wrong'})
  }
})

postsRouter.delete('/api/posts/:id', auth, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ _id:req.params.id, owner:req.user._id })
    if(!deletedPost){
      return res.status(404).end()
    }

    res.send(deletedPost)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'something went wrong' })
  }
})

module.exports = postsRouter