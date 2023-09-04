import express from "express";
import {blogsRoute} from "./routers/blogs-route";
import {postsRoute} from "./routers/posts-route";
import {testing} from "./routers/testing";
import {authRoute, usersRoute} from "./routers/users-auth-route";
import {commentsRoute} from "./routers/comments-route";

export const app = express()
app.use(express.json())

export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    auth:'/auth',
    users:'/users',
    comments:'/comments',
    __test__: '/testing/all-data'
}

export const superAdminAuth = {login: 'admin', password: 'qwerty'}

export const settings = {
    MONGO_URI: process.env.MONGO_URI || "mongodb+srv://hardmail88:3846MrN1@cluster0.0goknaf.mongodb.net/?retryWrites=true&w=majority",
    PORT: process.env.PORT || 3000,
    SECRET_JWT: "qwerty"
}

app.use(RouterPaths.blogs, blogsRoute)
app.use(RouterPaths.posts, postsRoute)
app.use(RouterPaths.__test__, testing)
app.use(RouterPaths.users, usersRoute)
app.use(RouterPaths.auth, authRoute)
app.use(RouterPaths.comments, commentsRoute)