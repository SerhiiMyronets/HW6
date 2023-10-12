import {RequestWithParams, RequestWithParamsBody} from "../types/request-types";
import {CommentInputModel, LikeInputModel, ParamInputModel} from "../models/repository/comments-models";
import {Response} from "express";
import {CommentsService} from "../domain/comments-service";
import {CommentsQueryRepository} from "../repositories/query-repositories/comments-query-repository";
import {LikesInfoQueryRepository} from "../repositories/query-repositories/likes-info-query-repository";

export class CommentsController {
    constructor(
        protected commentsService: CommentsService,
        protected commentsQueryRepository: CommentsQueryRepository,
        protected likesInfoQueryRepository: LikesInfoQueryRepository
    ) {
    }
    async getComment(req: RequestWithParams<ParamInputModel>, res: Response) {
        let likeStatus = 'None'
        if (req.user)
            likeStatus = await this.likesInfoQueryRepository.getLikeStatus(req.user?._id.toString(),
                'comment', req.params.id)
        const comment = await this.commentsQueryRepository.findCommentById(req.params.id, likeStatus)
        comment ? res.status(200).send(comment) : res.sendStatus(404)
    }

    async updateComment(req: RequestWithParamsBody<ParamInputModel, CommentInputModel>, res: Response) {
        const commentId = req.params.id
        const comment = await this.commentsQueryRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) return res.sendStatus(401)
        await this.commentsService.updateComment(commentId, req.body.content)
        return res.sendStatus(204)
    }

    async commentLikeStatusUpdate(req: RequestWithParamsBody<ParamInputModel, LikeInputModel>, res: Response) {
        const commentId = req.params.id
        const comment = await this.commentsQueryRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        await this.commentsService.commentLikeStatusUpdate(req.user!._id.toString(),
            commentId, req.body.likeStatus.toString())
        return res.sendStatus(204)
    }

    async deleteComment(req: RequestWithParams<ParamInputModel>, res: Response) {
        const commentId = req.params.id
        const comment = await this.commentsQueryRepository.findCommentById(commentId)
        if (!comment) return res.sendStatus(404)
        if (comment.commentatorInfo.userId !== req.user!._id.toString()) return res.sendStatus(401)
        await this.commentsService.deleteComment(commentId)
        return res.sendStatus(204)
    }
}