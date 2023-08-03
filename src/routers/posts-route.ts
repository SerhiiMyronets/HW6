import {Request, Response, Router} from "express";
import {
    authentication,
    inputValidationMiddleware,
    postBodyValidation
} from "../midlewares/input-validation-middleware";
import {PostInputModel} from "../models/posts-models";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {postsRepository} from "../repositories/post-repository-db";


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
postsRoute.delete('/:id', authentication, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const isPostDeleted = await postsRepository.deletePost(req.params.id)
    if (isPostDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
postsRoute.post('/', authentication,
    postBodyValidation,
    inputValidationMiddleware, async (req: RequestWithBody<PostInputModel>, res: Response) => {
        const newPost = await postsRepository.creatPost(req.body)
        res.status(201).send(newPost)
    })
postsRoute.put('/:id', authentication,
    postBodyValidation,
    inputValidationMiddleware, async (req: RequestWithParamsBody<{ id: string }, PostInputModel>, res: Response) => {
        const isPostUpdated = await postsRepository.updatePost(req.params.id, req.body)
        if (isPostUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })