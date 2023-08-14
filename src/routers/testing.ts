import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";





export const testing = Router({})

testing.delete('/', async (req: Request, res: Response) => {
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    res.sendStatus(204)
})