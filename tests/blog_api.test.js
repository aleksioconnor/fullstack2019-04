const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [{
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

const extraBlog = {
    _id: "5a422bc66b54b673234d12fc",
    title: "Type wars c",
    author: "Robert H. Martin",
    url: "http://blog.cleancoder.com/unclebob/2016/05/01/TypeWars.html",
    likes: 10,
    __v: 0
}

const blogWithoutLikes = {
    _id: "5a462bc88b58b678234d12fc",
    title: "Blog without likes",
    author: "Robert H. Martin",
    url: "http://blog.cleancoder.com/unclebob/2016/05/01/TypeWars.html",
    __v: 0
}

const missingTitle = {
    _id: "2a364bc85b57b688213d12fc",
    author: "Robert H. Martin",
    likes: 10,
    __v: 0
}

beforeEach(async () => {
    await Blog.deleteMany({})

    for (i = 0; i < initialBlogs.length; i++) {
        let blogObject = new Blog(initialBlogs[i])
        await blogObject.save()
    }

})

describe('blogs are returned', () => {
    test('as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('in correct amount', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.length)
    })
})

describe('post method', () => {
    test('increments blog length by one', async () => {
        const blog = new Blog(extraBlog)
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(201)
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.length + 1)
    })

    test('sets likes to zero when adding object without likes', async () => {
        const blog = new Blog(blogWithoutLikes)
        await api
            .post('/api/blogs')
            .send(blog)
            .expect(201)
        const result = await api.get('/api/blogs')
        const addedBlog = result.body.find(obj => obj._id == blog._id)
        expect(addedBlog.likes).toBe(0)

    })

    test('returns 400 bad request if title and url are not set', async () => {
        const blog = new Blog(missingTitle)
        const res = await api
            .post('/api/blogs')
            .send(blog)
            .expect(400)
    })
})

describe('delete', () => {
    test('a single blog', async () => {
        const blogToDelete = initialBlogs[0]
        await api
            .delete(`/api/blogs/${blogToDelete._id}`)
            .expect(204)
        const getBlogs = await api.get('/api/blogs')
        expect(getBlogs.body.length).toBe(initialBlogs.length - 1)
    })
})

afterAll(() => {
    mongoose.connection.close()
})