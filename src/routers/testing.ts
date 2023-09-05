import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {usersService} from "../domain/users-service";
import {commentsService} from "../domain/comments-service";

export const testing = Router({})

testing.delete('/', async (req: Request, res: Response) => {
    await usersService.deleteAllUsers()
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    await commentsService.deleteAllComments()
    res.sendStatus(204)
})