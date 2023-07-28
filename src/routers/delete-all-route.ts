import {blogs} from "./blogs-route";
import {posts} from "./posts-route";
import {Request, Response, Router} from "express";

export const deleteAllRoute = Router({})

deleteAllRoute.delete('/', (req: Request, res: Response) => {
    blogs.length = 0;
    posts.length = 0;
    res.sendStatus(204)
})