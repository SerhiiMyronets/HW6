import express from "express";
import {blogsRoute} from "./routers/blogs-route";
import {postsRoute} from "./routers/posts-route";
import {deleteAllRoute} from "./routers/delete-all-route";



export const app = express()

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data'
}


app.use(express.json())
app.use(RouterPaths.blogs, blogsRoute)
app.use(RouterPaths.posts, postsRoute)
app.use(RouterPaths.__test__, deleteAllRoute)

