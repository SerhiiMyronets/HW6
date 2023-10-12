import {PostModel} from "../../db/db";
import {FindPostsPaginateModel, PostViewModel} from "../../models/repository/posts-models";
import {mapperDbRepository} from "../mapper-db-repository";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";

type Pagination<T> = {
    page: number
    pageSize: number
    items: T[]
}

export class PostsQueryRepository {
     async findPostsQuery(query: FindPostsPaginateModel): Promise<Pagination<PostViewModel>> {
        const totalCount = await PostModel.countDocuments()
        const foundedPosts = await PostModel
            .find()
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
        const mappedFoundedPosts = foundedPosts.map(
            b => mapperDbRepository.postOutputMongoDBToPostViewModel(b))
        return mapperQueryRepository.postViewModelToPostViewModelPaginated(mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }
    async isPostExisting(_id: string): Promise<boolean> {
        const result = await PostModel
            .findOne({_id})
        return !!result;
    }
    async findPostsByBlogIdQuery(query: FindPostsPaginateModel, blogId: string): Promise<Pagination<PostViewModel>> {
        const totalCount = await PostModel.countDocuments({"blogId": blogId})
        const foundedPosts = await PostModel
            .find({"blogId": blogId})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
        const mappedFoundedPosts = foundedPosts.map(
            b => mapperDbRepository.postOutputMongoDBToPostViewModel(b))
        return mapperQueryRepository.postViewModelToPostViewModelPaginated(
            mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }
}