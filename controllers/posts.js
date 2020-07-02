const postsRouter = require('express').Router()
const Post = require('../models/post')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null,new Date().toISOString() + file.originalname)
  }

})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    //accept file
    cb(null,true)
  } else {
  //reject a file
  cb(null,false)
  }
}

const upload = multer({
  storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 3
  },
  fileFilter: fileFilter
})

postsRouter.get('/api/posts', async (req, res) => {
    const posts = await Post.find({})

    res.json(posts.map(post => post.toJSON()))
})

postsRouter.post('/api/posts', upload.single('postImage') ,async (req, res) => {
  console.log(req.file)
    try {
        const body = req.body

        const post = new Post({
            title: body.title,
            author: body.author,
            postImage: req.file.path,
            replies: []
        })
        
        const savedPost = await post.save()
        res.status(201).json(savedPost).end()
      } catch (error) {
        console.error(error);
      }
})

module.exports = postsRouter