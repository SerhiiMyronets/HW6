import {Request, Response, Router} from "express";

import {apiRequestDbRepository} from "../repositories/db-repositories/api-request-db-repository";
import {
    blogsService,
    commentsService,
    deviceAuthSessionsDbRepository,
    postsService,
    usersService
} from "../composition-root";

export const testing = Router({})

testing.delete('/', async (req: Request, res: Response) => {
    // await jwtService.deleteAllTokens()
    await usersService.deleteAllUsers()
    await blogsService.deleteAllBlogs()
    await postsService.deleteAllPosts()
    await commentsService.deleteAllComments()
    await deviceAuthSessionsDbRepository.deleteAllSessions()
    await apiRequestDbRepository.deleteAllRequest()
    res.sendStatus(204)
})