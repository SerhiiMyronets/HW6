import {CommentsViewModelPaginated, findCommentsPaginateModel} from "../../models/repository/comments-models";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";
import {mapperDbRepository} from "../mapper-db-repository";
import {CommentModel} from "../../db/db";

export const commentsQueryRepository = {
    async findCommentsByPostIdQuery (query:findCommentsPaginateModel, postId: string): Promise<CommentsViewModelPaginated> {
        const totalCount = await CommentModel.countDocuments({"postId": postId})
        const foundedComments = await CommentModel
            .find({"postId": postId})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
        const mappedFoundedComments = foundedComments.map(
            b => mapperDbRepository.commentViewMongoDBtoCommentViewModel(b))
        return mapperQueryRepository.commentViewModelToCommentsViewModelPaginated(
            mappedFoundedComments, +query.pageNumber, +query.pageSize, totalCount)
    },

}