import {CommentDBType, LikeInfoType} from "../db/db-models";
import {LikesInfoDbRepository} from "../repositories/db-repositories/likes-info-db-repository";
import {CommentsDbRepository} from "../repositories/db-repositories/comments-db-repository";


export class CommentsService {
    constructor(protected commentsDbRepository: CommentsDbRepository,
                protected likesInfoDbRepository: LikesInfoDbRepository) {
    }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<string> {
        const comment = new CommentDBType(postId, content, {userId, userLogin})
        return await this.commentsDbRepository.creatComment(comment)
    }

    async deleteAllComments(): Promise<boolean> {
        return this.commentsDbRepository.deleteAllComments()
    }

    async updateComment(commentId: string, commentContent: string) {
        return this.commentsDbRepository.updateComment(commentId, commentContent)
    }

    async deleteComment(id: string) {
        return this.commentsDbRepository.deleteComment(id)
    }

    async commentLikeStatusUpdate(userId: string, userLogin: string, likeObjectId: string,
                                  likeStatus: string): Promise<boolean> {
        const likeInfo = await this.likesInfoDbRepository.findLikeInfo(
            userId, 'comment', likeObjectId)
        const comment = await this.commentsDbRepository.findCommentById(likeObjectId)
        if (!likeInfo) {
            const newLikeInfo = new LikeInfoType(userId, userLogin, 'comment',
                likeObjectId, 'post', comment!.postId, likeStatus)
            await this.likesInfoDbRepository.addLikeInfo(newLikeInfo)
            if (likeStatus === 'Like')
                await this.commentsDbRepository.increaseLikesCount(likeObjectId)
            if (likeStatus === 'Dislike')
                await this.commentsDbRepository.increaseDislikeCount(likeObjectId)
            return true
        } else {
            if (likeInfo.likeStatus === 'None' && likeStatus === 'Like') {
                await this.likesInfoDbRepository.setLikeStatus(likeInfo._id)
                await this.commentsDbRepository.increaseLikesCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Dislike' && likeStatus === 'Like') {
                await this.likesInfoDbRepository.setLikeStatus(likeInfo._id)
                await this.commentsDbRepository.increaseLikesAndDecreaseDislikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'None' && likeStatus === 'Dislike') {
                await this.likesInfoDbRepository.setDislikeStatus(likeInfo._id)
                await this.commentsDbRepository.increaseDislikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Like' && likeStatus === 'Dislike') {
                await this.likesInfoDbRepository.setDislikeStatus(likeInfo._id)
                await this.commentsDbRepository.increaseDislikeAndDecreaseLikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Like' && likeStatus === 'None') {
                await this.likesInfoDbRepository.setNoneStatus(likeInfo._id)
                await this.commentsDbRepository.decreaseLikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Dislike' && likeStatus === 'None') {
                await this.likesInfoDbRepository.setNoneStatus(likeInfo._id)
                await this.commentsDbRepository.decreaseDislikeCount(likeObjectId)
            }
            return true
        }
    }
}
