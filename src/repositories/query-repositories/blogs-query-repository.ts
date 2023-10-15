import {BlogModel} from "../../db/db";
import {BlogViewModel, BlogViewPaginatedModel, findBlogsPaginateModel} from "../../models/repository/blogs-models";
import {sortDirectionList} from "../../setting";
import {injectable} from "inversify";

@injectable()
export class BlogsQueryRepository {
    async findBlogsQuery(query: findBlogsPaginateModel): Promise<BlogViewPaginatedModel> {
        const term = new RegExp(query.searchNameTerm, "i")
        const totalCount = await BlogModel.countDocuments({"name": term})
        const foundedBlogs: BlogViewModel[] = await BlogModel
            .find({"name": term}, {
                _id: 0,
                id: {$toString: '$_id'},
                name: 1,
                description: 1,
                websiteUrl: 1,
                createdAt: 1,
                isMembership: 1
            })
            .sort({[query.sortBy]: sortDirectionList[query.sortDirection]})
            .skip(query.pageSize * (query.pageNumber - 1))
            .limit(+query.pageSize)
            .lean()

        return this.getPaginated(foundedBlogs, +query.pageNumber, +query.pageSize, totalCount)
    }

    async isBlogExisting(_id: string): Promise<boolean> {
        const result = await BlogModel
            .findOne({_id})
        return !!result;
    }
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return  BlogModel
            .findOne({_id: id}, {
                _id: 0,
                id: {$toString: '$_id'},
                name: 1,
                description: 1,
                websiteUrl: 1,
                createdAt: 1,
                isMembership: 1
            }).lean()
    }
    getPaginated<Type>(items: Array<Type>, page: number, pageSize: number, totalCount: number) {
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page,
            pageSize,
            totalCount,
            items
        }
    }
}