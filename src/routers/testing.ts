import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";
import {usersService} from "../domain/users-service";
import {jwtService} from "../appliacation/jwt-service";
import {authService} from "../domain/auth-service";
import {apiRequestDbRepository} from "../repositories/db-repositories/api-request-db-repository";
import {commentsService} from "../composition-root";

export const testing = Router({})

testing.delete('/', async (req: Request, res: Response) => {
    await jwtService.deleteAllTokens()
    await usersService.deleteAllUsers()
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    await commentsService.deleteAllComments()
    await authService.deleteAllSessions()
    await apiRequestDbRepository.deleteAllRequest()
    res.sendStatus(204)
})