import {Response, Router} from "express";
import {paramValidation} from "../midlewares/param/param-validation";
import {RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {accessTokenMiddlewareProtected} from "../midlewares/access-token-middleware-protected";
import {commentsBodyValidation} from "../midlewares/body/comments-body-validation";
import {errorsFormatMiddleware} from "../midlewares/errors-format-middleware";
import {CommentInputModel, LikeInputModel, ParamInputModel} from "../models/repository/comments-models";
import {accessTokenNonProtectedMiddleware} from "../midlewares/access-token-non-protected-middleware";
import {likeInputValidation} from "../midlewares/body/like-input-validation";
import {
    commentsDbRepository,
    commentsQueryRepository,
    commentsService,
    likesInfoQueryRepository
} from "../composition-root";


export const commentsRoute = Router({})


export class CommentsController {
    constructor(
        // protected commentsService: CommentsService,
        // protected commentsQueryRepository: CommentsQueryRepository
    ) {
    }

    async getComment(req: RequestWithParams<ParamInputModel>, res: Response) {
        let likeStatus = 'None'
        if (req.user)
            likeStatus = await likesInfoQueryRepository.getLikeStatus(req.user?._id.toString(),
                'comment', req.params.id)
        const comment = await commentsQueryRepository.findCommentById(req.params.id, likeStatus)
        comment ? res.status(200).send(comment) : res.sendStatus(404)
    }

    async updateComment(req: RequestWithParamsBody<ParamInputModel, CommentInputModel>, res: Response) {
        const commentId = req.params.id
        const comment = await commentsQueryRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) return res.sendStatus(401)
        await commentsService.updateComment(commentId, req.body.content)
        return res.sendStatus(204)
    }

    async commentLikeStatusUpdate(req: RequestWithParamsBody<ParamInputModel, LikeInputModel>, res: Response) {
        const commentId = req.params.id
        const comment = await commentsDbRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        await commentsService.commentLikeStatusUpdate(req.user!._id.toString(), commentId,
            comment.postId,req.body.likeStatus.toString())
        return res.sendStatus(204)
    }

    async deleteComment(req: RequestWithParams<ParamInputModel>, res: Response) {
        const commentId = req.params.id
        const comment = await commentsQueryRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) return res.sendStatus(401)
        await commentsService.deleteComment(commentId)
        return res.sendStatus(204)
    }
}

const commentsController = new CommentsController()

commentsRoute.get('/:id',
    accessTokenNonProtectedMiddleware,
    paramValidation,
    commentsController.getComment.bind(commentsController))

commentsRoute.put('/:id',
    accessTokenMiddlewareProtected,
    paramValidation,
    commentsBodyValidation,
    errorsFormatMiddleware,
    commentsController.updateComment.bind(commentsController))

commentsRoute.put('/:id/like-status',
    accessTokenMiddlewareProtected,
    // paramValidation,
    likeInputValidation,
    errorsFormatMiddleware,
    commentsController.commentLikeStatusUpdate.bind(commentsController))

commentsRoute.delete('/:id',
    accessTokenMiddlewareProtected,
    paramValidation,
    errorsFormatMiddleware,
    commentsController.deleteComment.bind(commentsController))
