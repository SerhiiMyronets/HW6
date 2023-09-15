import { postsCollection} from "../../db/db";
import {findPostsPaginateModel, PostViewModel, PostViewModelPaginated} from "../../models/repository/posts-models";
import {mapperDbRepository} from "../mapper-db-repository";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";
import {ObjectId} from "mongodb";

type Pagination<T> = {
    page: number
    pageSize: number
    items: T[]
}

export const postsQueryRepository = {
     async findPostsQuery(query: findPostsPaginateModel): Promise<Pagination<PostViewModel>> {
        const totalCount = await postsCollection.countDocuments()
        const foundedPosts = await postsCollection
            .find()
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedPosts = foundedPosts.map(
            b => mapperDbRepository.postOutputMongoDBToPostViewModel(b))

        return mapperQueryRepository.postViewModelToPostViewModelPaginated(mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    },
    async isPostExisting(id: string): Promise<boolean> {
        const result = await postsCollection
            .findOne({_id: new ObjectId(id)})
        return !!result;
    },
    async findPostsByBlogIdQuery(query: findPostsPaginateModel, blogId: string): Promise<PostViewModelPaginated> {
        const totalCount = await postsCollection.countDocuments({"blogId": blogId})
        const foundedPosts = await postsCollection
            .find({"blogId": blogId})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        const mappedFoundedPosts = foundedPosts.map(
            b => mapperDbRepository.postOutputMongoDBToPostViewModel(b))
        return mapperQueryRepository.postViewModelToPostViewModelPaginated(
            mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }
}