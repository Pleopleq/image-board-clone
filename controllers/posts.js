const postsRouter = require('express').Router()
const Post = require('../models/post')
const { auth } = require('../middleware/middlewares')

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
    const singlePost = await Post.findOne(req.params.id).populate('replies', { author: 1 , message: 1 })
    res.status(200).send(singlePost)
  } catch (error) {
    console.log(error)
    res.status(404).send({ error: 'something went wrong' })
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



postsRouter.patch('/api/posts/:id', auth, async (req, res) => {
  const postId = req.params.id
  const fieldsToUpdate = req.body
  const updates = Object.keys(fieldsToUpdate)
  const allowedUpdates = ["title", "content"]

  const isUpdateValid = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if(!isUpdateValid){
    return res.status(400).send({ error: "Invalid updates" })
  }  

  try {
    const updatedPost = await Post.findOne({ _id: postId, owner:req.user._id })
    
    if(!updatedPost){
      res.status(404).send().end()
    }

    updates.forEach((update) => updatedPost[update] = fieldsToUpdate[update])
    await updatedPost.save()

    res.status(201).send(updatedPost)
  } catch (error) {
    console.log(error)
    res.status(404).send({error: 'something went wrong'})
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