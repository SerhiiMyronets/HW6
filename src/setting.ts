import express from "express";
import {blogsRoute} from "./routers/blogs-route";
import {postsRoute} from "./routers/posts-route";
import {testing} from "./routers/testing";
import {authRoute, usersRoute} from "./routers/users-auth-route";



export const app = express()
app.use(express.json())


export const RouterPaths = {
    blogs: '/blogs',
    posts: '/posts',
    __test__: '/testing/all-data',
    auth:'/auth',
    users:'/users'
}


export const auth = {login: 'admin', password: 'qwerty'}


app.use(RouterPaths.blogs, blogsRoute)
app.use(RouterPaths.posts, postsRoute)
app.use(RouterPaths.__test__, testing)
app.use(RouterPaths.users, usersRoute)
app.use(RouterPaths.auth, authRoute)

