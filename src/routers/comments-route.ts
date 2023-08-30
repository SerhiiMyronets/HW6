import {Response, Router} from "express";
import {paramValidation} from "../midlewares/param/param-validation";
import {RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {commentsService} from "../domain/comments-service";
import {authorizationMiddleware} from "../midlewares/authorization-middleware";
import {commentsBodyValidation} from "../midlewares/body/comments-body-validation";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {CommentInputModel} from "../models/repository/comments-models";
import {commentsDbRepository} from "../repositories/db-repositories/comments-db-repository";

export const commentsRoute = Router({})

commentsRoute.get('/:id',
    paramValidation,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const comment = await commentsService.findCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(404)
        } else {
            res.status(200).send(comment)
        }
    })
commentsRoute.put('/:id',
    authorizationMiddleware,
    paramValidation,
    commentsBodyValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParamsBody<{ id: string }, CommentInputModel>, res: Response) => {
        const comment = await commentsDbRepository.findCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(404)
        } else if (comment!.userId !== req.user!.id)
            res.sendStatus(403)
        const isCommentUpdated = await commentsService
            .updateComment(req.params.id, req.body.content)
        if (isCommentUpdated)
            res.sendStatus(204)
    })
commentsRoute.delete('/:id',
    authorizationMiddleware,
    paramValidation,
    errorsFormatMiddleware,
    async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const commentId = req.params.id
        const comment = await commentsDbRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.userId !== req.user!.id) return res.sendStatus(403)
        await commentsService.deleteComment(commentId)
        return res.sendStatus(204)
        // else if (comment!.userId !== req.user!.id) {
        //     res.sendStatus(403)
        // } else {
        //     const isDeleted = await commentsService.deleteComment(commentId)
        //     if (isDeleted) res.sendStatus(204)
        // }
    })