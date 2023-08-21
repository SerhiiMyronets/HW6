import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {usersAuthService} from "../domain/users-auth-service";





export const deleteAllRoute = Router({})

deleteAllRoute.delete('/', async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    await usersAuthService.deleteAllUsers()
    res.sendStatus(204)
})