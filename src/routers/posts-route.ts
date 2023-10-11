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
import {accessTokenMiddlewareProtected} from "../midlewares/access-token-middleware-protected";
import {commentsBodyValidation} from "../midlewares/body/comments-body-validation";
import {CommentInputModel, findCommentsPaginateModel} from "../models/repository/comments-models";
import {postsRepository} from "../repositories/db-repositories/post-db-repository";

import {commentsQueryValidation} from "../midlewares/query/comments-query-validation";
import {accessTokenNonProtectedMiddleware} from "../midlewares/access-token-non-protected-middleware";
import {commentsQueryRepository, commentsService, likesInfoQueryRepository} from "../composition-root";
import {LikesStatusQueryModel} from "../db/db-models";


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
            postId: req.params.id,
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
    accessTokenMiddlewareProtected,
    paramValidation,
    commentsBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, CommentInputModel>, res: Response) => {
        if (await postsRepository.findById(req.params.id)) {
            const [postId, content, userId, userLogin] =
                [req.params.id, req.body.content, req.user!._id.toString(), req.user!.accountData.login]
            const newCommentId = await commentsService
                .createComment(postId, content, userId, userLogin)
            const comment = await commentsQueryRepository.findCommentById(newCommentId)
            res.status(201).send(comment)
        } else {
            res.sendStatus(404)
        }
    })
postsRoute.get('/:id/comments',
    accessTokenNonProtectedMiddleware,
    paramValidation,
    commentsQueryValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsQuery<{ id: string }, findCommentsPaginateModel>, res: Response) => {
        const postId = req.params.id
        const userId = req.user?._id.toString()
        const isPostExisting = await postsQueryRepository.isPostExisting(postId)
        if (!isPostExisting)
            res.sendStatus(404)
        let likesStatus: LikesStatusQueryModel = []
        if (userId) {
            likesStatus = await likesInfoQueryRepository.getCommentsLikeStatusByPost(postId, userId)
        }
        const result = await commentsQueryRepository.findCommentsByPostId(req.query, postId, likesStatus)
        res.status(200).send(result)


    })