import {Response, Router} from "express";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {PostInputModel} from "../models/posts-models";
import {RequestWithBody, RequestWithParams, RequestWithParamsBody, RequestWithQuery} from "../types/request-types";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {postBodyValidation} from "../midlewares/posts-body-validation";
import {paramValidation} from "../midlewares/param-validation";
import {postsService} from "../domain/posts-service";
import {findBlogsQueryModel} from "../models/find-blogs-query-model";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";



export const postsRoute = Router({})
/*
postsRoute.get('/', async (req: Request, res: Response) => {
    const posts = await postsService.findPosts();
    res.send(posts)
})
 */
postsRoute.get('/', async (req: RequestWithQuery<findBlogsQueryModel>, res: Response) => {
    const result = await postsQueryRepository.findPostsQuery(req.query);
    res.send(result)
})

postsRoute.get('/:id',
    paramValidation,
    errorsFormatMiddleware,
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
    paramValidation,
    errorsFormatMiddleware,
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
    errorsFormatMiddleware,
    async (req: RequestWithBody<PostInputModel>, res: Response) => {
        const newPost = await postsService.creatPost(req.body)
        res.status(201).send(newPost)
    })
postsRoute.put('/:id',
    authenticationMiddleware,
    paramValidation,
    postBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, PostInputModel>, res: Response) => {
        const isPostUpdated = await postsService.updatePost(req.params.id, req.body)
        if (isPostUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })