import {BlogModel} from "../../db/db";
import {BlogInputModel, BlogViewModel} from "../../models/repository/blogs-models";
import {BlogDBType} from "../../db/db-models";
import {injectable} from "inversify";

@injectable()
export class BlogsDBRepository {
    async findBlogById(id: string): Promise<BlogViewModel | null> {
        return BlogModel
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

    async creatBlog(newBlogBody: BlogDBType): Promise<BlogViewModel | null> {
        const res = await BlogModel
            .create(newBlogBody)
        return this.findBlogById(res.id);
    }

    async updateBlog(_id: string, newUpdatedBlogBody: BlogInputModel): Promise<Boolean> {
        const result = await BlogModel
            .updateOne({_id}, {
                $set: newUpdatedBlogBody
            })
        return result.matchedCount === 1
    }

    async deleteBlog(_id: string): Promise<Boolean> {
        const result = await BlogModel
            .deleteOne({_id})
        return result.deletedCount === 1
    }

    async deleteAllBlogs(): Promise<Boolean> {
        await BlogModel
            .deleteMany({})
        return true
    }
}