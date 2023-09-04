import {blogsCollection} from "../../db/db";
import {BlogViewPaginatedModel, findBlogsPaginateModel} from "../../models/repository/blogs-models";
import {ObjectId} from "mongodb";
import {mapperDbRepository} from "../mapper-db-repository";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";

export const blogsQueryRepository = {
    async findBlogsQuery(query: findBlogsPaginateModel): Promise<BlogViewPaginatedModel> {
        const term = new RegExp(query.searchNameTerm, "i")
        const totalCount = await blogsCollection.countDocuments({"name": term})
        const foundedBlogs = await blogsCollection
            .find({"name": term})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .toArray()
        const mappedFoundedBlogs = foundedBlogs.map(
            b => mapperDbRepository.blogOutputMongoDBToBlogViewModel(b))
        return mapperQueryRepository.blogViewModelToBlogViewModelPaginated(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)
    },
    async isBlogExisting(id: string): Promise<boolean> {
        const result = await blogsCollection
            .findOne({_id: new ObjectId(id)})
        return !!result;
    },

}