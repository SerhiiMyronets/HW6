import {Request, Response, Router} from "express";
import {
    ErrorsFormatMiddleware,

} from "../midlewares/errors-format-middleware";
import {PostInputModel} from "../models/posts-models";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {postsRepository} from "../repositories/post-repository-db";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {postBodyValidation} from "../midlewares/posts-body-validation";


export const postsRoute = Router({})

postsRoute.get('/', async (req: Request, res: Response) => {
    const posts = await postsRepository.getAllPosts();
    res.send(posts)
})
postsRoute.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const post = await postsRepository.getPostById(req.params.id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})
postsRoute.delete('/:id',
    authenticationMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const isPostDeleted = await postsRepository.deletePost(req.params.id)
    if (isPostDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
postsRoute.post('/',
    authenticationMiddleware,
    postBodyValidation,
    ErrorsFormatMiddleware,
    async (req: RequestWithBody<PostInputModel>, res: Response) => {
        const newPost = await postsRepository.creatPost(req.body)
        res.status(201).send(newPost)
    })
postsRoute.put('/:id',
    authenticationMiddleware,
    postBodyValidation,
    ErrorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, PostInputModel>, res: Response) => {
        const isPostUpdated = await postsRepository.updatePost(req.params.id, req.body)
        if (isPostUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })