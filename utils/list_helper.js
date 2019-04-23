const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = blogs => blogs.reduce((acc, cur) => acc + cur.likes, 0)

const favouriteBlog = blogs => blogs.reduce((acc, cur) => acc.likes > cur.likes ? acc : cur)

const mostLikes = blogs => _(blogs)
    .groupBy('author')
    .map((item, author) => {
        const likes = Object
            .keys(_.countBy(item, 'likes'))
            .reduce((acc, curr) => acc + Number(curr), 0)
        return {
            author,
            likes
        }
    })
    .maxBy('likes')

const mostBlogs = blogs => _(blogs)
    .groupBy('author')
    .map((item, author) => {
        return { author, blogs: item.length}
    })
    .maxBy('blogs')

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}
