import {BlogModel} from "../../db/db";
import {BlogViewModel, BlogViewPaginatedModel, findBlogsPaginateModel} from "../../models/repository/blogs-models";
import {mapperDbRepository} from "../mapper-db-repository";
import {mapperQueryRepository, sortDirectionList} from "../mapper-query-repository";

export class BlogsQueryRepository {
    async findBlogsQuery(query: findBlogsPaginateModel): Promise<BlogViewPaginatedModel> {
        const term = new RegExp(query.searchNameTerm, "i")
        const totalCount = await BlogModel.countDocuments({"name": term})
        const foundedBlogs = await BlogModel
            .find({"name": term})
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
        const mappedFoundedBlogs = foundedBlogs.map(
            b => mapperDbRepository.blogOutputMongoDBToBlogViewModel(b))
        return mapperQueryRepository.blogViewModelToBlogViewModelPaginated(mappedFoundedBlogs, +query.pageNumber, +query.pageSize, totalCount)
    }

    async isBlogExisting(_id: string): Promise<boolean> {
        const result = await BlogModel
            .findOne({_id})
        return !!result;
    }
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        const result = await BlogModel
            .findOne({_id: id})
        if (result) {
            return mapperDbRepository.blogOutputMongoDBToBlogViewModel(result)
        } else {
            return null
        }
    }
}