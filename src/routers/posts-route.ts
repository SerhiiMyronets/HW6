import {Request, Response, Router} from "express";
import {
    authentication,
    inputValidationMiddleware,
    postBodyValidation
} from "../midlewares/input-validation-middleware";
import {postsRepository} from "../repositories/post-repository";
import {PostInputModel} from "../models/posts-models";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/request-types";

export const postsRoute = Router({})

postsRoute.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts();
    res.send(posts)
})
postsRoute.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const post = postsRepository.getPostById(req.params.id)
    if (post) {
        res.status(200).send(post)
    } else {
        res.sendStatus(404)
    }
})
postsRoute.delete('/:id', authentication, (req: RequestWithParams<{ id: string }>, res: Response) => {
    const isPostDeleted = postsRepository.deletePost(req.params.id)
    if (isPostDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
postsRoute.post('/', authentication,
    postBodyValidation,
    inputValidationMiddleware, (req: RequestWithBody<PostInputModel>, res: Response) => {
        const newPost = postsRepository.creatPost(req.body)
        res.status(201).send(newPost)
    })
postsRoute.put('/:id', authentication,
    postBodyValidation,
    inputValidationMiddleware, (req: RequestWithParamsBody<{ id: string }, PostInputModel>, res: Response) => {
        const isPostUpdated = postsRepository.updatePost(req.params.id, req.body)
        if (isPostUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })