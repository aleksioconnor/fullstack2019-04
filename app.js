const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

app.use(bodyParser.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(cors())

app.use((error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    }

    if (error.name === 'MongoError') {
        return response.status(400).json({
            error: error.message
        })
    }
    next(error);
});

mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true
})

module.exports = app