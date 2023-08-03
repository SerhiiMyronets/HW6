import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository-db";
import {postsRepository} from "../repositories/post-repository-db";





export const deleteAllRoute = Router({})

deleteAllRoute.delete('/', async (req: Request, res: Response) => {
    await blogsRepository.deleteAllBlogs()
    await postsRepository.deleteAllPosts()
    res.sendStatus(204)
})