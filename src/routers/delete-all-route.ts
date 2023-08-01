import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/post-repository";

export const deleteAllRoute = Router({})

deleteAllRoute.delete('/', (req: Request, res: Response) => {
    blogsRepository.deleteAllBlogs()
    postsRepository.deleteAllPosts()
    res.sendStatus(204)
})