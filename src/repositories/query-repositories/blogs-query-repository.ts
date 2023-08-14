import {blogsCollection, postsCollection} from "../../db/db";
import {BlogViewPaginatedModel, findBlogsPaginateModel} from "../../models/repository/blogs-models";
import {ObjectId} from "mongodb";
import {findPostsByBlogPaginateModel, PostViewModelPaginated} from "../../models/repository/posts-models";
import {mapperRepository} from "../mapper-repository";
import {mapperQuery, sortDirectionList} from "./mapper-query";

export const blogsQueryRepository = {
    async findBlogsQuery(query: findBlogsPaginateModel): Promise<BlogViewPaginatedModel> {
        const term = new RegExp(".*" + query.searchNameTerm + ".*", "i")
        const totalCount = await blogsCollection.countDocuments({"name": term})
        const foundedBlogs = await blogsCollection
            .find({"name": term})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        const mappedFoundedBlogs = foundedBlogs.map(
            b => mapperRepository.blogOutputMongoDBToBlogViewModel(b))

        return mapperQuery.blogViewModelToBlogViewModelPaginated(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)
    },
    async findPostsByBlogIdQuery(query: findPostsByBlogPaginateModel, blogId: string): Promise<PostViewModelPaginated> {
        const totalCount = await postsCollection.countDocuments({"blogId": blogId})
        const foundedPosts = await postsCollection
            .find({"blogId": blogId})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()

        const mappedFoundedPosts = foundedPosts.map(
            b => mapperRepository.postOutputMongoDBToPostViewModel(b))
        return mapperQuery.postViewModelToPostViewModelPaginated(
            mappedFoundedPosts, +query.pageNumber, +query.pageSize, totalCount)
    },
    async isBlogExisting(id: string): Promise<boolean> {
        const result = await blogsCollection
            .findOne({_id: new ObjectId(id)})
        return !!result;

    }
}