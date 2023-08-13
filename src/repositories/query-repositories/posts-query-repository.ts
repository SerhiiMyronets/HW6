import {postsCollection} from "../../db/db";
import {findPostsPaginateModel, PostViewModelPaginated} from "../../models/repository/posts-models";
import {mapperRepository} from "../mapper-repository";
import {mapperQuery, sortDirectionList} from "./mapper-query";


export const postsQueryRepository = {
     async findPostsQuery(query: findPostsPaginateModel): Promise<PostViewModelPaginated> {
        const totalCount = await postsCollection.countDocuments()
        const foundedPosts = await postsCollection
            .find()
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedPosts = foundedPosts.map(
            b => mapperRepository.postOutputMongoDBToPostViewModel(b))

        return mapperQuery.postViewModelToPostViewModelPaginated(mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    }
}