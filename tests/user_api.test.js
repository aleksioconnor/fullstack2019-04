const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

})

describe('Users with faulty data are not created', () => {
    test('password is too short', async () => {
        const user = {
            "username": "Sammy",
            "name": "Sam",
            "password": "s"
        }
        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    })
    test('name is not unique', async () => {
        const user = {
            "username": "Johnny",
            "name": "John",
            "password": "secret123"
        }

        await api
            .post('/api/users')
            .send(user)
            .expect(200)

        const anotherUser = {
            "username": "Johnny",
            "name": "Johnson",
            "password": "secret123"
        }

        await api
            .post('/api/users')
            .send(anotherUser)
            .expect(400)
    })
    test('username is non existant', async () => {
        const user = {
            "name": "John",
            "password": "secret123"
        }

        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    })
    test('username is too short', async () => {
        const user = {
            "username": "ma",
            "name": "John",
            "password": "secret123"
        }

        await api
            .post('/api/users')
            .send(user)
            .expect(400)
    })
})


afterAll(() => {
    mongoose.connection.close()
})