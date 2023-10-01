import {Response, Router} from "express";
import {paramValidation} from "../midlewares/param/param-validation";
import {RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {commentsService} from "../domain/comments-service";
import {accessTokenMiddlewareProtected} from "../midlewares/access-token-middleware-protected";
import {commentsBodyValidation} from "../midlewares/body/comments-body-validation";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {CommentInputModel, LikeInputModel} from "../models/repository/comments-models";
import {commentsDbRepository} from "../repositories/db-repositories/comments-db-repository";
import {accessTokenNonProtectedMiddleware} from "../midlewares/access-token-non-protected-middleware";
import {commentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {likeInputValidation} from "../midlewares/body/like-input-validation";

export const commentsRoute = Router({})

commentsRoute.get('/:id',
    accessTokenNonProtectedMiddleware,
    paramValidation,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const comment = await commentsQueryRepository.findCommentById(req.params.id, req.user?._id.toString())
        comment ? res.status(200).send(comment) : res.sendStatus(404)
    })
commentsRoute.put('/:id',
    accessTokenMiddlewareProtected,
    paramValidation,
    commentsBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, CommentInputModel>, res: Response) => {
        const commentId = req.params.id
        const comment = await commentsDbRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) return res.sendStatus(403)
        await commentsService.updateComment(commentId, req.body.content)
        return res.sendStatus(204)
    })
commentsRoute.put('/:id/like-status',
    accessTokenMiddlewareProtected,
    // paramValidation,
    likeInputValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, LikeInputModel>, res: Response) => {
        const commentId = req.params.id
        const comment = await commentsDbRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) return res.sendStatus(401)
        await commentsService.updateLikeStatus(commentId, req.body.likeStatus.toString(), req.user!._id.toString())
        return res.sendStatus(204)
    })
commentsRoute.delete('/:id',
    accessTokenMiddlewareProtected,
    paramValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const commentId = req.params.id
        const comment = await commentsDbRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) return res.sendStatus(401)
        await commentsService.deleteComment(commentId)
        return res.sendStatus(204)
    })