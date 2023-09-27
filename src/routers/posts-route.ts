import {Response, Router} from "express";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {findPostsPaginateModel, PostInputModel, PostUpdateInputModel} from "../models/repository/posts-models";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsBody,
    RequestWithParamsQuery,
    RequestWithQuery
} from "../types/request-types";
import {authenticationMiddleware} from "../midlewares/authentication-middleware";
import {postBodyValidation} from "../midlewares/body/posts-body-validation";
import {paramValidation} from "../midlewares/param/param-validation";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../repositories/query-repositories/posts-query-repository";
import {postsQueryValidation} from "../midlewares/query/posts-query-validation";
import {accessTokenMiddleware} from "../midlewares/access-token-middleware";
import {commentsBodyValidation} from "../midlewares/body/comments-body-validation";
import {CommentInputModel, findCommentsPaginateModel} from "../models/repository/comments-models";
import {postsRepository} from "../repositories/db-repositories/post-db-repository";
import {commentsService} from "../domain/comments-service";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {commentsQueryValidation} from "../midlewares/query/comments-query-validation";


export const postsRoute = Router({})

postsRoute.get('/',
    postsQueryValidation,
    async (req: RequestWithQuery<findPostsPaginateModel>, res: Response) => {
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
        const postInputBody: PostInputModel = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        const newPost = await postsService.creatPost(postInputBody)
        res.status(201).send(newPost)
    })
postsRoute.put('/:id',
    authenticationMiddleware,
    paramValidation,
    postBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, PostInputModel>, res: Response) => {
        const postUpdateInputBody: PostUpdateInputModel = {
            postId:req.params.id,
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        const isPostUpdated = await postsService.updatePost(postUpdateInputBody)
        if (isPostUpdated) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
postsRoute.post('/:id/comments',
    accessTokenMiddleware,
    paramValidation,
    commentsBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, CommentInputModel>, res: Response) => {
        if (await postsRepository.findById(req.params.id)) {
            const newComment = await commentsService
                .createComment(req.params.id, req.body.content,
                    req.user!._id, req.user!.accountData.login)
            res.status(201).send(newComment)
        } else {
            res.sendStatus(404)
        }
    })
postsRoute.get('/:id/comments',
    paramValidation,
    commentsQueryValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsQuery<{ id: string }, findCommentsPaginateModel>, res: Response) => {
        const isPostExisting = await postsQueryRepository.isPostExisting(req.params.id)
        if (isPostExisting) {
            const result = await commentsQueryRepository.findCommentsByPostIdQuery(req.query, req.params.id)
            res.status(200).send(result)
        } else {
            res.sendStatus(404)
        }
    })