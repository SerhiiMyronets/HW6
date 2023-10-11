import {CommentDBType, LikeInfoType} from "../db/db-models";
import {likesInfoDbRepository} from "../repositories/db-repositories/likes-info-db-repository";
import {commentsDbRepository} from "../composition-root";


export class CommentsService {
    // constructor(protected commentsDbRepository: CommentsDbRepository,
    //             protected likesInfoDbRepository: LikesInfoDbRepository) {
    // }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<string> {
        const comment = new CommentDBType(postId, content, {userId, userLogin})
        return await commentsDbRepository.creatComment(comment)
    }

    async deleteAllComments(): Promise<boolean> {
        return commentsDbRepository.deleteAllComments()
    }

    async updateComment(commentId: string, commentContent: string) {
        return commentsDbRepository.updateComment(commentId, commentContent)
    }

    async deleteComment(id: string) {
        return commentsDbRepository.deleteComment(id)
    }

    async commentLikeStatusUpdate(userId: string, likeObjectId: string, parentObjectId: string,
                                  likeStatus: string): Promise<boolean> {
        const likeInfo = await likesInfoDbRepository.findLikeInfo(
            userId, 'comment', likeObjectId)
        if (!likeInfo) {
            const newLikeInfo = new LikeInfoType(userId, 'comment',
                likeObjectId, 'post',parentObjectId, likeStatus)
            await likesInfoDbRepository.addLikeInfo(newLikeInfo)
            if (likeStatus === 'Like')
                await commentsDbRepository.increaseLikesCount(likeObjectId)
            if (likeStatus === 'Dislike')
                await commentsDbRepository.increaseDislikeCount(likeObjectId)
            return true
        } else {
            if (likeInfo.likeStatus === 'None' && likeStatus === 'Like') {
                await likesInfoDbRepository.setLikeStatus(likeInfo._id)
                await commentsDbRepository.increaseLikesCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Dislike' && likeStatus === 'Like') {
                await likesInfoDbRepository.setLikeStatus(likeInfo._id)
                await commentsDbRepository.increaseLikesAndDecreaseDislikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'None' && likeStatus === 'Dislike') {
                await likesInfoDbRepository.setDislikeStatus(likeInfo._id)
                await commentsDbRepository.increaseDislikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Like' && likeStatus === 'Dislike') {
                await likesInfoDbRepository.setDislikeStatus(likeInfo._id)
                await commentsDbRepository.increaseDislikeAndDecreaseLikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Like' && likeStatus === 'None') {
                await likesInfoDbRepository.setNoneStatus(likeInfo._id)
                await commentsDbRepository.decreaseLikeCount(likeObjectId)
            }
            if (likeInfo.likeStatus === 'Dislike' && likeStatus === 'None') {
                await likesInfoDbRepository.setNoneStatus(likeInfo._id)
                await commentsDbRepository.decreaseDislikeCount(likeObjectId)
            }
            return true
        }
    }
}
