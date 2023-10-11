import {
    CommentsViewModelPaginated,
    CommentViewModel,
    findCommentsPaginateModel
} from "../../models/repository/comments-models";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";
import {CommentModel} from "../../db/db";
import {LikesStatusQueryModel} from "../../db/db-models";

export class CommentsQueryRepository {
    async isCommentExist(_id: string) {
        return CommentModel.findOne({_id}, {_id: 1})
    }

    async findCommentsByPostId(query: findCommentsPaginateModel, postId: string, likesStatus: LikesStatusQueryModel): Promise<CommentsViewModelPaginated> {
        const totalCount = await CommentModel.countDocuments({"postId": postId})
        const foundedComments: Array<CommentViewModel> = await CommentModel
            .find({postId}, {
                _id: 0,
                id: {$toString: '$_id'},
                content: 1,
                commentatorInfo: 1,
                createdAt: 1,
                "likesInfo.likesCount": 1,
                "likesInfo.dislikesCount": 1,
                "likesInfo.myStatus": 'None',
            })
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize).lean()
        if (foundedComments)
            foundedComments.map((el) => {
                for (let i = 0; i < likesStatus.length; i++) {
                    if (likesStatus[i].id === el.id) {
                        el.likesInfo.myStatus = likesStatus[i].likeStatus
                    }
                }
            })
        return mapperQueryRepository.commentViewModelToCommentsViewModelPaginated(
            foundedComments, +query.pageNumber, +query.pageSize, totalCount)
    }

    async findCommentById(_id: string, likeStatus: string = 'None'): Promise<CommentViewModel | null> {
        return CommentModel.findById({_id},
            {
                _id: 0,
                id: '$_id',
                content: 1,
                commentatorInfo: 1,
                createdAt: 1,
                "likesInfo.likesCount": 1,
                "likesInfo.dislikesCount": 1,
                "likesInfo.myStatus": likeStatus,
            }).lean()
    }
}
