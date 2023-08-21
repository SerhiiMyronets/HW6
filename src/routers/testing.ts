import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {usersAuthService} from "../domain/users-auth-service";

export const testing = Router({})

testing.delete('/', async (req: Request, res: Response) => {
    await usersAuthService.deleteAllUsers()
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    res.sendStatus(204)
})