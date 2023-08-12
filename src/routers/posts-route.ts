import {Request, Response, Router} from "express";
import {ErrorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {PostInputModel} from "../models/posts-models";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {postBodyValidation} from "../midlewares/posts-body-validation";
import {ParamValidation} from "../midlewares/param-validation";
import {postsService} from "../domain/posts-service";


export const postsRoute = Router({})

postsRoute.get('/', async (req: Request, res: Response) => {
    const posts = await postsService.findPosts();
    res.send(posts)
})
postsRoute.get('/:id',
    ParamValidation,
    ErrorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const post = await postsService.findById(req.params.id)
        if (post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
        }
    })
postsRoute.delete('/:id',
    authenticationMiddleware,
    ParamValidation,
    ErrorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const isPostDeleted = await postsService.deletePost(req.params.id)
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
        const newPost = await postsService.creatPost(req.body)
        res.status(201).send(newPost)
    })
postsRoute.put('/:id',
    authenticationMiddleware,
    ParamValidation,
    postBodyValidation,
    ErrorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, PostInputModel>, res: Response) => {
        const isPostUpdated = await postsService.updatePost(req.params.id, req.body)
        if (isPostUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })