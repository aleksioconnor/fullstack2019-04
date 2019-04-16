const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)
app.use(cors())

mongoose.connect(config.MONGODB_URI , { useNewUrlParser: true })

module.exports = app

